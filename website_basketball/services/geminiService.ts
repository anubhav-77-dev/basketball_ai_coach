import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { FrameData, AnalysisResult } from '../types';

const PROMPT_TEMPLATE = (duration: number) => `
You are an expert basketball shooting coach AI named 'Shot Doctor'. You are a world-class analyst, known for your hyper-specific, data-driven feedback. You will be given a sequence of data objects from a video of a user's jump shot. Each object contains a 'vitals' JSON object and a corresponding 'frame' as a base64 image. The total duration of the video clip is ${duration.toFixed(1)} seconds.

Your goal is to provide a detailed, constructive critique by identifying specific moments in time where the user can improve. You MUST use the provided 'vitals' data to make your feedback precise and quantitative.

**Analysis & Feedback Guidelines:**
*   **BE HYPER-SPECIFIC:** Do not give generic advice. Your feedback must be tied to specific data points.
    *   **BAD:** "Your elbow is out."
    *   **GOOD:** "At 1.3s, your right elbow angle is 125°, which is too wide for a stable shot. Aim for closer to 95° at this point before your upward motion."
*   **USE TIMESTAMPS:** Every feedback event must have an accurate timestamp corresponding to the moment it occurred.
*   **REFERENCE VITALS DATA:** Directly mention the angle or speed from the vitals data in your feedback to justify your analysis.
*   **PROVIDE ACTIONABLE DRILLS:** For each point of criticism, suggest a simple, actionable drill the user can do to improve.

**Analyze the following key aspects of the shot, using both the visual frames and the numerical vitals:**
1.  **Stance and Balance:** (Visual) Feet shoulder-width apart, balanced, slight knee bend.
2.  **Shot Pocket:** (Visual) Is the ball in a ready position before the upward motion?
3.  **Elbow Alignment:** (Vitals & Visual) Use 'leftElbowAngle' and 'rightElbowAngle'. Is the shooting elbow tucked in (typically 90-110 degrees at set point)?
4.  **Release Point:** (Vitals & Visual) Is the ball released at the peak of the jump? Use 'ballSpeed' to understand the shot's power.
5.  **Follow-Through:** (Visual) Does the shooting arm extend fully, with the wrist snapped?

Based on your analysis, you MUST respond with a JSON object. Do not include any text, notes or markdown fences before or after the JSON object. The JSON object must strictly follow this TypeScript interface:

interface TimestampedFeedback {
  timestamp: number; // The time in seconds (e.g., 1.2) in the video where the feedback applies. This is the most important field. Be as accurate as possible.
  category: string; // The category of feedback, e.g., "Elbow Alignment".
  feedback: string; // Detailed, actionable, data-driven feedback for this specific moment. Include a suggested drill.
}

interface AnalysisResult {
  summary: string; // A 2-3 sentence summary identifying the single most impactful area for improvement and one thing the user did well.
  events: TimestampedFeedback[]; // An array of at least 3-5 feedback events, sorted by timestamp from earliest to latest.
}

Now, analyze the provided data. Identify key moments (good or bad) and provide timestamped, data-driven feedback for each. Return the JSON.
`;

export const geminiService = {
  analyzeShootingForm: async (frameData: FrameData[], duration: number): Promise<AnalysisResult> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("VITE_GEMINI_API_KEY environment variable not set. Please create a .env.local file and add your API key.");
    }

    const ai = new GoogleGenAI({ apiKey });

    const imageParts = frameData.map(fd => ({
      inlineData: {
        mimeType: 'image/jpeg',
        data: fd.frame.split(',')[1] // remove the "data:image/jpeg;base64," prefix
      }
    }));

    const vitalsText = frameData.map(fd => JSON.stringify(fd.vitals)).join('\n');
    const textPart = { text: PROMPT_TEMPLATE(duration) + "\n\nHere are the vitals for each frame:\n" + vitalsText };

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-1.5-flash-latest',
        contents: { parts: [textPart, ...imageParts] },
        config: {
          responseMimeType: "application/json"
        }
    });

    try {
      let jsonStr = response.text?.trim() ?? '';
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) {
        jsonStr = match[2].trim();
      }
      
      const parsedData = JSON.parse(jsonStr);
      // Basic validation to ensure the response shape is correct
      if (parsedData.summary && Array.isArray(parsedData.events)) {
          return parsedData as AnalysisResult;
      } else {
          throw new Error("Invalid JSON structure received from API.");
      }
    } catch (e) {
      console.error("Failed to parse JSON response:", e);
      console.error("Raw response text:", response.text);
      throw new Error("The AI returned an unexpected response. Please try again.");
    }
  },

  isVideoRelevant: async (frameData: FrameData[]): Promise<boolean> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("VITE_GEMINI_API_KEY environment variable not set.");
    }

    const ai = new GoogleGenAI({ apiKey });

    const imageParts = frameData.map(fd => ({
      inlineData: {
        mimeType: 'image/jpeg',
        data: fd.frame.split(',')[1]
      }
    }));

    const relevancePrompt = `
      You are a video content moderator for a basketball coaching app.
      You will be given a series of frames from a video.
      Your task is to determine if the video shows a person attempting a basketball shot.
      Look for a person, a basketball, and a shooting motion.
      Respond with a single word: "Yes" if a shot is being attempted, or "No" if it is not.
    `;

    const textPart = { text: relevancePrompt };

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-1.5-flash-latest',
        contents: { parts: [textPart, ...imageParts] }
    });

    const resultText = response.text?.trim().toLowerCase() ?? '';
    return resultText.includes("yes");
  }
};
