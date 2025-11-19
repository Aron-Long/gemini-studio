import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedCodeResponse } from "../types";

// Configuration provided by user
const apiKey = 'sk-ai-v1-a5eae3afba7165f628bb182c78b3ade4ab300f0f7860df8d06be6bb9b1d8aab3';
const baseUrl = 'https://zenmux.ai/api/vertex-ai';

const ai = new GoogleGenAI({ 
  apiKey: apiKey,
  baseUrl: baseUrl
});

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    code: {
      type: Type.STRING,
      description: "The complete, functional HTML/CSS/JS code. It must be a single HTML file string including scripts and styles.",
    },
    explanation: {
      type: Type.STRING,
      description: "A brief, friendly explanation of what the code does and design choices made.",
    },
    language: {
      type: Type.STRING,
      description: "The primary language of the code, usually 'html'.",
    }
  },
  required: ["code", "explanation", "language"],
};

export const generateFrontendCode = async (
  prompt: string, 
  onChunk?: (text: string) => void
): Promise<GeneratedCodeResponse> => {
  try {
    // Using the standard model ID for Gemini 3 Pro Preview
    const modelId = "gemini-3-pro-preview"; 

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
    `;

    const result = await ai.models.generateContentStream({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    let fullText = "";
    // Corrected loop: iterate over result directly
    for await (const chunk of result) {
      const chunkText = chunk.text;
      if (chunkText) {
        fullText += chunkText;
        if (onChunk) {
          onChunk(fullText);
        }
      }
    }

    if (!fullText) {
      throw new Error("No response from Gemini.");
    }

    // Sanitize the output before parsing
    // Sometimes models include markdown code blocks (```json ... ```) even when responseMimeType is set.
    let jsonString = fullText.trim();
    jsonString = jsonString.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");

    // Parse the final accumulated text as JSON
    const parsed: GeneratedCodeResponse = JSON.parse(jsonString);
    return parsed;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};