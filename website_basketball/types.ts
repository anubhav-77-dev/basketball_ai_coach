export interface TimestampedFeedback {
  timestamp: number;
  category: string;
  feedback: string;
}

export interface AnalysisResult {
  summary: string;
  events: TimestampedFeedback[];
}

export interface FrameVitals {
  timestamp: number;
  leftElbowAngle: number | null;
  rightElbowAngle: number | null;
  ballSpeed: number | null;
}

export interface FrameData {
  vitals: FrameVitals;
  frame: string; // base64 encoded image
}

