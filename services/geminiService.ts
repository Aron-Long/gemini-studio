import { GeneratedCodeResponse } from "../types";

// Mulerun API Configuration
// API key should be set in Vercel environment variables as VITE_MULERUN_API_KEY
// Note: In Vite, only environment variables prefixed with VITE_ are exposed to client code
const apiKey = import.meta.env.VITE_MULERUN_API_KEY;

if (!apiKey) {
  console.warn('[GeminiService] VITE_MULERUN_API_KEY not found in environment variables');
}

// Mulerun API endpoint
const baseUrl = 'https://api.mulerun.com';

// Gemini 3 Pro model ID
const modelId = 'gemini-3-pro-preview'; 

export const generateFrontendCode = async (
  prompt: string, 
  onChunk?: (text: string) => void
): Promise<GeneratedCodeResponse> => {
  try {
    const systemInstruction = `
      You are an expert Senior Frontend Engineer and UI/UX Designer specializing in Tailwind CSS and modern web design.
      
      Your task is to generate production-ready, self-contained HTML code based on the user's prompt.
      
      Requirements:
      1. The output MUST be a single, valid HTML string.
      2. Use Tailwind CSS via CDN for styling: <script src="https://cdn.tailwindcss.com"></script>.
      3. Use FontAwesome for icons if needed: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      4. Use Google Fonts (Inter or Roboto) for typography.
      5. The design should be modern, responsive, and visually appealing (clean, good whitespace, subtle shadows).
      6. If JavaScript is needed for interactivity, include it within a <script> tag at the end of the body.
      7. Ensure high contrast and accessibility.
      8. Do not use external CSS files or local imports. Everything must be in the HTML.

      CRITICAL FOR GAMES (Snake, Tetris, etc.) AND INTERACTIVE APPS:
      1. The code runs inside an IFRAME.
      2. **MANDATORY START SCREEN:** Do NOT start the game loop immediately. Create a full-screen absolute overlay with a "Start Game" button. This is required to capture window focus.
      3. **FOCUS MANAGEMENT:** When the "Start" button is clicked, explicitly call window.focus() and canvas.focus().
      4. **PREVENT SCROLL:** Listen for keydown events on 'window'. If the key is ArrowUp, ArrowDown, ArrowLeft, ArrowRight, or Space, use e.preventDefault() to stop the browser page from scrolling.
      5. **EXPLICIT SIZING:** For Canvas games, explicitly set width and height attributes on the <canvas> tag (e.g., <canvas id="game" width="400" height="400"></canvas>) to prevent 0-pixel rendering issues.
      6. **ROBUST LOOP:** Ensure variables (score, snake position) are reset inside the 'startGame()' function, not just globally. This prevents "Game Over" immediately upon restart.
      7. **RESTART UI:** When the game ends, show an overlay with a "Restart" button that re-initializes the game state.
      
      OUTPUT FORMAT:
      You MUST respond with a raw JSON object (no markdown code blocks) with the following structure:
      {
        "code": "...", // The complete HTML string
        "explanation": "...", // Brief explanation
        "language": "html"
      }
    `;

    const messages = [
      { role: "system", content: systemInstruction },
      { role: "user", content: prompt }
    ];

    // For non-streaming requests, we should increase timeout or handle long polling if needed, 
    // but standard fetch awaits response.
    
    // Validate API key
    if (!apiKey) {
      throw new Error('VITE_MULERUN_API_KEY is not configured. Please set it in Vercel environment variables.');
    }

    // Log for debugging (will show in browser console)
    console.log(`[GeminiService] Sending request to ${baseUrl}/v1/chat/completions...`);

    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelId,
        messages: messages,
        stream: false, // Disable streaming for stability
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[GeminiService] API Error Body:", errorText);
      
      // Handle specific Vercel timeout (504 Gateway Timeout)
      if (response.status === 504) {
        throw new Error("The request timed out. Generating complex code might take longer than Vercel's limit (10s-60s). Try a simpler prompt or try again.");
      }
      
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("[GeminiService] Response received:", data);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
       console.error("[GeminiService] Unexpected response structure:", data);
       throw new Error("Invalid response format from API.");
    }

    const fullText = data.choices[0].message.content || "";
    
    if (!fullText) {
        throw new Error("Model returned empty content.");
    }
    
    // Simulate streaming for UI feedback if needed, or just call onChunk once
    if (onChunk) {
      onChunk(fullText);
    }

    // Final cleanup and parsing
    let jsonString = fullText.trim();
    // Remove markdown blocks if they still appear despite instructions
    jsonString = jsonString.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
    
    try {
      const parsed: GeneratedCodeResponse = JSON.parse(jsonString);
      return parsed;
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.log("Raw Text:", fullText);
      
      // Fallback: try to construct a valid response if parsing fails but we have text
      // Sometimes the model might return just the HTML code if it ignored the JSON instruction
      if (fullText.trim().startsWith("<html") || fullText.trim().startsWith("<!DOCTYPE")) {
         return {
            code: fullText,
            explanation: "Generated code (raw output)",
            language: "html"
         };
      }

      return {
        code: fullText,
        explanation: "Generated code (parsing failed)",
        language: "html"
      };
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
