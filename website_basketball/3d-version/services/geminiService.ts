import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AnalysisResult } from '../types';

const PROMPT_TEMPLATE = (duration: number) => `
You are an expert basketball shooting coach AI named 'Shot Doctor'. You will be given a sequence of frames from a video of a user's jump shot. The total duration of the video clip is ${duration.toFixed(1)} seconds.

Your goal is to provide a detailed, constructive critique by identifying specific moments in time where the user can improve.

Analyze the following key aspects of the shot:
1.  **Stance and Balance:** Feet shoulder-width apart, balanced, slight knee bend.
2.  **Shot Pocket:** Is the ball in a ready position before the upward motion?
3.  **Elbow Alignment:** Is the shooting elbow tucked in, aligned with the knee and under the ball?
4.  **Release Point:** Is the ball released at the peak of the jump, with a smooth upward motion?
5.  **Follow-Through:** Does the shooting arm extend fully, with the wrist snapped?

Based on your analysis, you MUST respond with a JSON object. Do not include any text, notes or markdown fences before or after the JSON object. The JSON object must strictly follow this TypeScript interface:

interface TimestampedFeedback {
  timestamp: number; // The time in seconds (e.g., 1.2) in the video where the feedback applies. This is the most important field. Be as accurate as possible.
  category: string; // The category of feedback, e.g., "Elbow Alignment".
  feedback: string; // Detailed, actionable feedback for this specific moment.
}

interface AnalysisResult {
  summary: string; // A 2-3 sentence summary of the player's strengths and main area for improvement.
  events: TimestampedFeedback[]; // An array of at least 3-5 feedback events, sorted by timestamp from earliest to latest.
}

Now, analyze the provided frames. Identify key moments (good or bad) and provide timestamped feedback for each. Return the JSON.
`;

export const analyzeShootingForm = async (frames: string[], duration: number): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const imageParts = frames.map(frame => ({
    inlineData: {
      mimeType: 'image/jpeg',
      data: frame.split(',')[1] // remove the "data:image/jpeg;base64," prefix
    }
  }));

  const textPart = { text: PROMPT_TEMPLATE(duration) };

  const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart, ...imageParts] },
      config: {
        responseMimeType: "application/json"
      }
  });

  try {
    let jsonStr = response.text.trim();
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

};
