import { GeneratedCodeResponse } from "../types";

// Updated Configuration for OpenAI-compatible endpoint
const apiKey = 'sk-ai-v1-aa27ff4f7bc6d11573b41d3d51888aaa1a945a1a154b47699e594e087540c31f';

// Check if we are in production (running on Vercel)
// If so, use the relative proxy path to avoid CORS
// If local, use the direct URL (since we don't have a local proxy set up in vite config yet, 
// but for local dev usually we can just use the direct URL if the server allows CORS, or set up a vite proxy)
const isProduction = import.meta.env.PROD;
const baseUrl = isProduction ? '/api/proxy' : 'https://zenmux.ai/api'; 

const modelId = 'google/gemini-3-pro-preview-free'; 

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
      console.error("API Error Body:", errorText);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const fullText = data.choices[0]?.message?.content || "";
    
    // Simulate streaming for UI feedback if needed, or just call onChunk once
    if (onChunk) {
      onChunk(fullText);
    }

    // Final cleanup and parsing
    let jsonString = fullText.trim();
    // Remove markdown blocks if they still appear despite instructions
    jsonString = jsonString.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
    
    // If the model returns just the code or incomplete JSON, we might need fallback logic,
    // but for now we assume it follows the system prompt's JSON requirement.
    try {
      const parsed: GeneratedCodeResponse = JSON.parse(jsonString);
      return parsed;
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.log("Raw Text:", fullText);
      // Fallback: try to construct a valid response if parsing fails but we have text
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
