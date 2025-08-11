import { GoogleGenAI } from "@google/genai";
import { 
  FrameAnalysis, 
  FrameBatch, 
  StoredAdvice, 
  BatchAnalysisResult,
  FormAnalysisRequest,
  FormAnalysisResponse
} from '../types';

// Use a consistent temperature to reduce variability in feedback
const MODEL_TEMPERATURE = 0.3;

/**
 * Prompt template for real-time coaching feedback based on joint angles
 */
const REAL_TIME_PROMPT_TEMPLATE = (frameData: FrameAnalysis) => `
You are an expert basketball shooting coach AI named 'Shot Doctor'. You're analyzing a player's basketball shooting form in real-time.

You're currently viewing frame #${frameData.frameNumber} at timestamp ${frameData.timestamp.toFixed(2)} seconds.

The player's joint angles are as follows:
- Right Elbow Angle: ${frameData.angles.rightElbowAngle.toFixed(1)}°
- Right Shoulder Angle: ${frameData.angles.rightShoulderAngle.toFixed(1)}°
- Right Wrist Angle: ${frameData.angles.rightWristAngle.toFixed(1)}°
- Left Elbow Angle: ${frameData.angles.leftElbowAngle.toFixed(1)}°
- Left Shoulder Angle: ${frameData.angles.leftShoulderAngle.toFixed(1)}°
- Left Wrist Angle: ${frameData.angles.leftWristAngle.toFixed(1)}°
- Knee Angle: ${frameData.angles.kneeAngle.toFixed(1)}°
- Hip Angle: ${frameData.angles.hipAngle.toFixed(1)}°
- Ankle Angle: ${frameData.angles.ankleAngle.toFixed(1)}°
- Trunk Angle: ${frameData.angles.trunkAngle.toFixed(1)}°

${frameData.ballPosition ? 
  `The basketball is detected at position: X: ${frameData.ballPosition[0].toFixed(2)}, Y: ${frameData.ballPosition[1].toFixed(2)}, Z: ${frameData.ballPosition[2].toFixed(2)}` : 
  'The basketball is not visible in this frame.'}

Based on this data, provide concise, professional feedback on the player's shooting form at this exact moment. Focus on proper basketball shooting mechanics and give actionable advice.

Keep your response concise (1-2 sentences max) and focused on the most important issue to correct at this moment.

Your feedback should be like what a professional NBA shooting coach would say during practice.
`;

// Template for batch analysis
const BATCH_ANALYSIS_TEMPLATE = (request: FormAnalysisRequest) => {
  const { frames, requestSummary, context } = request;
  
  return `
You are an expert basketball shooting coach AI named 'Shot Doctor'. You're analyzing a sequence of frames from a player's basketball shot.

${context ? `
Context:
- Analyzing frames ${context.startFrame} to ${context.endFrame}
- Total frames in this batch: ${context.batchSize}
${context.isSummaryRequest ? '- This is a request for an overall summary of the shot' : ''}
` : ''}

The following data represents key frames from the shot sequence with the player's joint angles:

${frames.slice(0, Math.min(frames.length, 10)).map((frame: any, index: number) => `
Frame #${frame.frameNumber} (${frame.timestamp.toFixed(2)}s):
- Right Elbow Angle: ${frame.angles.rightElbowAngle.toFixed(1)}°
- Right Shoulder Angle: ${frame.angles.rightShoulderAngle.toFixed(1)}°
- Right Wrist Angle: ${frame.angles.rightWristAngle.toFixed(1)}°
- Left Elbow Angle: ${frame.angles.leftElbowAngle.toFixed(1)}°
- Left Shoulder Angle: ${frame.angles.leftShoulderAngle.toFixed(1)}°
- Left Wrist Angle: ${frame.angles.leftWristAngle.toFixed(1)}°
- Knee Angle: ${frame.angles.kneeAngle.toFixed(1)}°
- Hip Angle: ${frame.angles.hipAngle.toFixed(1)}°
- Ankle Angle: ${frame.angles.ankleAngle.toFixed(1)}°
- Trunk Angle: ${frame.angles.trunkAngle.toFixed(1)}°
${frame.ballPosition ? `- Ball Position: X: ${frame.ballPosition[0].toFixed(2)}, Y: ${frame.ballPosition[1].toFixed(2)}, Z: ${frame.ballPosition[2].toFixed(2)}` : '- Ball not visible'}
`).join('\n')}

${frames.length > 10 ? `... and ${frames.length - 10} more frames` : ''}

Analyze the player's shooting form and provide:
1. Specific feedback for 2-3 key moments in the sequence
2. ${requestSummary ? 'A summary of the overall shot form and main improvement areas' : ''}

Respond in the following JSON format:
{
  "feedback": "Overall feedback on the shot sequence (1-2 sentences)",
  "confidence": 0.85, // confidence level between 0-1
  "keyPoints": ["Key point 1", "Key point 2"], // 2-3 main points to focus on
  ${requestSummary ? '"summary": "A 2-3 sentence summary of the overall shot form",' : ''}
  "frameAnalysis": [
    {
      "frameNumber": 123, // must match one of the provided frame numbers
      "feedback": "Specific feedback for this frame",
      "confidence": 0.9,
      "keyPoints": ["Specific point 1", "Specific point 2"]
    },
    // 2-3 more frame analyses
  ]
}

Focus on the most important aspects of shooting mechanics that need improvement. Be specific, actionable, and concise.
`;
};

/**
 * Get real-time coaching feedback for a specific frame
 */
export const getRealTimeCoachingFeedback = async (frameData: FrameAnalysis): Promise<string> => {
  // Skip API call if no Gemini API key is available
  if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using mock feedback.");
    return getMockFeedback(frameData);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: REAL_TIME_PROMPT_TEMPLATE(frameData) }] }],
      config: {
        temperature: MODEL_TEMPERATURE,
        maxOutputTokens: 100,
      }
    });

    if (!response.text) {
      return "No feedback available at this time.";
    }
    
    const result = response.text.trim();
    return result;
  } catch (error) {
    console.error("Error getting real-time coaching feedback:", error);
    return "Unable to generate feedback. Please try again.";
  }
};

/**
 * Provide mock feedback when API is not available
 */
function getMockFeedback(frameData: FrameAnalysis): string {
  // Simple rule-based feedback based on joint angles
  const { angles } = frameData;
  
  // Check elbow angle - ideal shooting elbow angle is around 90 degrees
  if (angles.rightElbowAngle < 70) {
    return "Your shooting elbow is too bent. Try to form closer to a 90-degree angle with your elbow.";
  } 
  else if (angles.rightElbowAngle > 110) {
    return "Your shooting elbow is too straight. Bend it closer to a 90-degree angle for better control.";
  }
  
  // Check knee bend - should have some bend for power
  if (angles.kneeAngle > 160) {
    return "Bend your knees more to generate proper shooting power from your legs.";
  }
  
  // Check trunk angle - should be relatively vertical
  if (angles.trunkAngle > 20) {
    return "Keep your upper body more upright. You're leaning too far forward.";
  }
  
  // Default feedback
  return "Good form. Maintain your balance and follow through completely.";
}

/**
 * Get comprehensive shot analysis based on multiple frames
 */
export const getComprehensiveShotAnalysis = async (
  frameDataSequence: FrameAnalysis[]
): Promise<string> => {
  if (!process.env.API_KEY || frameDataSequence.length === 0) {
    console.warn("API_KEY environment variable not set or no frame data provided. Using mock comprehensive analysis.");
    return "Great shooting form overall. Focus on maintaining balance through your follow-through.";
  }
  
  // This would be a more complex implementation that analyzes the entire shot sequence
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Create a simplified prompt with key frame data
    const keyFrames = selectKeyFrames(frameDataSequence, 5); // Select up to 5 key frames
    
    const prompt = `
    You are an expert basketball shooting coach AI named 'Shot Doctor'. 
    You're analyzing a complete basketball shot from ${frameDataSequence.length} frames.
    
    Here are key moments from the shot with joint angle data:
    ${keyFrames.map(frame => `
      Frame #${frame.frameNumber} (${frame.timestamp.toFixed(2)}s):
      - Right Elbow: ${frame.angles.rightElbowAngle.toFixed(1)}°
      - Knee Angle: ${frame.angles.kneeAngle.toFixed(1)}°
      - Trunk Angle: ${frame.angles.trunkAngle.toFixed(1)}°
    `).join('\n')}
    
    Provide a concise but thorough analysis of the shooting form, focusing on:
    1. Shot preparation (stance, balance)
    2. Power generation (leg bend, timing)
    3. Upper body mechanics (elbow alignment, release)
    4. Overall shooting efficiency
    
    Limit your response to 3-4 sentences with the most important advice.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: MODEL_TEMPERATURE,
        maxOutputTokens: 200,
      }
    });
    
    if (!response.text) {
      return "No comprehensive analysis available at this time.";
    }
    return response.text.trim();
  } catch (error) {
    console.error("Error getting comprehensive shot analysis:", error);
    return "Unable to generate comprehensive analysis. Please try again.";
  }
};

/**
 * Select key frames from a sequence for analysis
 * This focuses on the most important moments of a shot
 */
function selectKeyFrames(frames: FrameAnalysis[], maxFrames: number): FrameAnalysis[] {
  if (frames.length <= maxFrames) return frames;
  
  // A more sophisticated implementation would identify key moments in the shooting motion
  // For now, we'll just take evenly spaced frames
  const step = Math.floor(frames.length / maxFrames);
  
  const keyFrames: FrameAnalysis[] = [];
  for (let i = 0; i < frames.length && keyFrames.length < maxFrames; i += step) {
    keyFrames.push(frames[i]);
  }
  
  return keyFrames;
}

// Prepare frame data for analysis by converting it to a more LLM-friendly format
const prepareFrameDataForAnalysis = (frames: FrameAnalysis[]) => {
  return frames.map(frame => ({
    frameNumber: frame.frameNumber,
    timestamp: frame.timestamp,
    angles: frame.angles,
    ballPosition: frame.ballPosition,
    // Include only essential data to keep the payload smaller
  }));
};

/**
 * Call the Gemini API for batch analysis
 */
export const analyzeBasketballForm = async (request: FormAnalysisRequest): Promise<FormAnalysisResponse> => {
  // Skip API call if no Gemini API key is available
  if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using mock analysis.");
    return getMockBatchAnalysis(request);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: BATCH_ANALYSIS_TEMPLATE(request) }] }],
      config: {
        temperature: MODEL_TEMPERATURE,
        maxOutputTokens: 1000,
        responseMimeType: "application/json"
      }
    });

    if (!response.text) {
      throw new Error("No response from Gemini API");
    }
    
    // Parse JSON response
    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    try {
      const result = JSON.parse(jsonStr) as FormAnalysisResponse;
      return result;
    } catch (e) {
      console.error("Failed to parse JSON response:", e);
      console.error("Raw response:", jsonStr);
      throw new Error("Invalid JSON response from API");
    }
  } catch (error) {
    console.error("Error analyzing basketball form:", error);
    // Fall back to mock response
    return getMockBatchAnalysis(request);
  }
};

/**
 * Mock batch analysis for development or when API is unavailable
 */
function getMockBatchAnalysis(request: FormAnalysisRequest): FormAnalysisResponse {
  const { frames, requestSummary } = request;
  
  // Select a few frames for analysis
  const frameCount = Math.min(frames.length, 3);
  const selectedFrames = [
    frames[0], 
    frames[Math.floor(frames.length / 2)],
    frames[frames.length - 1]
  ].slice(0, frameCount);
  
  return {
    feedback: "Your shooting form shows good potential. Focus on maintaining proper elbow alignment and follow-through.",
    confidence: 0.85,
    keyPoints: ["Elbow alignment", "Follow-through", "Balance"],
    summary: requestSummary ? "Overall, your shot mechanics are solid but need refinement in arm positioning and power generation. Keep your elbow aligned and focus on a smooth, continuous motion from start to finish." : undefined,
    frameAnalysis: selectedFrames.map((frame: any, index: number) => ({
      frameNumber: frame.frameNumber,
      feedback: index === 0 
        ? "Good starting position with balanced stance."
        : index === 1
        ? "Keep your shooting elbow more aligned with your shoulder for better accuracy."
        : "Extend fully through your follow-through to add more power and accuracy.",
      confidence: 0.8 + (index * 0.05),
      keyPoints: index === 0 
        ? ["Balanced stance", "Good knee bend"] 
        : index === 1
        ? ["Elbow alignment needs adjustment"]
        : ["Complete your follow-through"]
    }))
  };
}

/**
 * Process a single frame for analysis
 */
export const analyzeFrame = async (frame: FrameAnalysis): Promise<StoredAdvice | null> => {
  try {
    // Convert frame data to a format suitable for the LLM
    const frameData = {
      frameNumber: frame.frameNumber,
      timestamp: frame.timestamp,
      angles: frame.angles,
      ballPosition: frame.ballPosition
    };

    // Call the Gemini API
    const result = await analyzeBasketballForm({
      frames: [frameData],
      // No need for context here since it's just one frame
    });

    if (!result || !result.feedback) {
      return null;
    }

    // Create stored advice format
    return {
      frameNumber: frame.frameNumber,
      timestamp: frame.timestamp,
      advice: result.feedback,
      confidence: result.confidence || 0.7, // Default confidence if not provided
      keyPoints: result.keyPoints,
    };
  } catch (error) {
    console.error('Error analyzing frame:', error);
    return null;
  }
};

/**
 * Analyze a batch of frames
 */
export const analyzeBatch = async (batch: FrameBatch): Promise<BatchAnalysisResult> => {
  try {
    // Skip if already processed or no frames
    if (batch.processed || batch.frames.length === 0) {
      return { advice: [], summary: null };
    }

    // Prepare frame data for analysis (simplify and reduce size)
    const preparedFrames = prepareFrameDataForAnalysis(batch.frames);

    // Call the Gemini API with the batch
    const result = await analyzeBasketballForm({
      frames: preparedFrames,
      requestSummary: true,
      context: {
        batchSize: batch.frames.length,
        startFrame: batch.startFrame,
        endFrame: batch.endFrame,
      },
    });

    if (!result) {
      throw new Error('No result returned from analysis');
    }

    // Process the results into StoredAdvice format
    const frameAdvice: StoredAdvice[] = [];

    // Create advice for key frames identified by the model
    if (result.frameAnalysis && result.frameAnalysis.length > 0) {
      result.frameAnalysis.forEach(analysis => {
        // Find the corresponding frame
        const frame = batch.frames.find(f => f.frameNumber === analysis.frameNumber);
        if (!frame) return;

        frameAdvice.push({
          frameNumber: frame.frameNumber,
          timestamp: frame.timestamp,
          advice: analysis.feedback || '',
          confidence: analysis.confidence || 0.7,
          keyPoints: analysis.keyPoints,
        });
      });
    } else if (result.feedback) {
      // If no specific frame analysis, create advice for the middle frame
      const middleFrameIndex = Math.floor(batch.frames.length / 2);
      const middleFrame = batch.frames[middleFrameIndex];
      
      frameAdvice.push({
        frameNumber: middleFrame.frameNumber,
        timestamp: middleFrame.timestamp,
        advice: result.feedback,
        confidence: result.confidence || 0.7,
        keyPoints: result.keyPoints,
      });
    }

    return {
      advice: frameAdvice,
      summary: result.summary || null,
    };
  } catch (error) {
    console.error('Error analyzing batch:', error);
    throw error;
  }
};

/**
 * Generate a summary of the entire session
 */
export const generateSessionSummary = async (frames: FrameAnalysis[]): Promise<string | null> => {
  try {
    // Select key frames for analysis (e.g., every 10th frame)
    const keyFrames = frames.filter((_, index) => index % 10 === 0);
    
    // Prepare frame data
    const preparedFrames = prepareFrameDataForAnalysis(keyFrames);
    
    // Request analysis with summary focus
    const result = await analyzeBasketballForm({
      frames: preparedFrames,
      requestSummary: true,
      context: {
        isSummaryRequest: true,
        totalFrames: frames.length,
        selectedFrames: keyFrames.length,
      },
    });
    
    return result?.summary || null;
  } catch (error) {
    console.error('Error generating session summary:', error);
    return null;
  }
};
