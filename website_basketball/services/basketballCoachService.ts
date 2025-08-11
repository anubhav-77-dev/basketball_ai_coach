import { FrameData } from "../utils/poseMath";

// Define the tip interface
export interface Tip {
  timestamp: number;
  message: string;
}

// Define the analysis result interface
export interface CoachingAnalysis {
  shotType: string;
  formScore: number;
  strengths: string[];
  weaknesses: string[];
  tips: Tip[];
}

/**
 * Analyzes the frame data to generate basketball coaching feedback
 * In a real implementation, this would call an LLM API with the frame data
 */
export async function analyzeBasketballShot(
  frameData: FrameData[],
  apiKey: string
): Promise<CoachingAnalysis> {
  // This is a mock implementation
  // In a real app, this would make API calls to an LLM service like Gemini
  
  // For demo purposes, return mock data
  return {
    shotType: "Jump Shot",
    formScore: 7.5,
    strengths: [
      "Good shooting arc",
      "Balanced stance",
      "Proper knee bend"
    ],
    weaknesses: [
      "Elbow not aligned with basket",
      "Insufficient follow-through",
      "Releasing too early"
    ],
    tips: [
      {
        timestamp: 0.5,
        message: "Keep your elbow in line with the basket for better accuracy"
      },
      {
        timestamp: 1.2,
        message: "Follow through completely after release, hold your pose longer"
      },
      {
        timestamp: 2.0,
        message: "Maintain balanced stance throughout the entire shot process"
      },
      {
        timestamp: 2.8,
        message: "Use your legs more to generate power instead of your arms"
      }
    ]
  };
}

/**
 * Processes frame data in real-time to provide immediate feedback
 */
export async function getRealTimeFeedback(
  currentFrame: FrameData,
  apiKey: string
): Promise<string> {
  // Mock implementation
  // Would normally send the current frame data to an LLM API
  
  // Simple rule-based feedback for demo
  if (currentFrame.rightElbowAngle < 90) {
    return "Keep your elbow at a 90-degree angle for optimal shooting form";
  } else if (currentFrame.rightShoulderAngle > 100) {
    return "Lower your shooting shoulder slightly for better alignment";
  } else if (currentFrame.trunkAngle < 80) {
    return "Stand more upright to improve balance and shot consistency";
  }
  
  return "Good form! Maintain this position through your release";
}
