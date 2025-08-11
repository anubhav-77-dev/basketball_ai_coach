
export interface TimestampedFeedback {
  timestamp: number; // The time in seconds in the video where the feedback applies.
  category: string; // The category of feedback, e.g., "Elbow Alignment", "Stance".
  feedback: string; // The specific, actionable advice for that moment.
}

export interface AnalysisResult {
  summary: string; // An overall summary of the player's strengths and main area for improvement.
  events: TimestampedFeedback[]; // An array of feedback events, sorted by timestamp.
}

