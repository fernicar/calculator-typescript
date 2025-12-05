import { GoogleGenAI, Type } from "@google/genai";
import { AiMathResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const solveMathWithGemini = async (prompt: string): Promise<AiMathResponse> => {
  try {
    const modelId = 'gemini-2.5-flash'; 
    
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: `You are an advanced mathematical assistant. 
        Your goal is to solve math problems provided in natural language or mathematical notation.
        
        Rules:
        1. Parse the user's input to understand the mathematical intent.
        2. Perform the calculation accurately.
        3. Provide the final numerical or algebraic result.
        4. Provide a list of concise steps explaining how you arrived at the solution.
        5. Categorize the problem (e.g., Arithmetic, Algebra, Calculus, Physics, Finance).
        6. If the input is not a math problem, set the result to "Error" and steps to ["I can only help with math problems."].
        `,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            result: { type: Type.STRING, description: "The final answer." },
            steps: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Step-by-step explanation." 
            },
            category: { type: Type.STRING, description: "The branch of mathematics." }
          },
          required: ["result", "steps", "category"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as AiMathResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      result: "Error",
      steps: ["Failed to connect to AI service.", "Please check your API key or try again."],
      category: "System"
    };
  }
};
