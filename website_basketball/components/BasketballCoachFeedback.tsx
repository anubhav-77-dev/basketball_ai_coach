

interface Tip {
  timestamp: number;
  message: string;
}

interface CoachingAnalysis {
  shotType: string;
  formScore: number;
  strengths: string[];
  weaknesses: string[];
  tips: Tip[];
}

interface BasketballCoachFeedbackProps {
  analysis: CoachingAnalysis | null;
  currentTime: number;
  onFeedbackClick: (timestamp: number) => void;
}

export default function BasketballCoachFeedback({
  analysis,
  currentTime,
  onFeedbackClick,
}: BasketballCoachFeedbackProps) {
  if (!analysis) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p>Waiting for analysis to complete...</p>
        <p style={{ fontSize: "0.875rem", color: "#9CA3AF" }}>
          Shot analysis will appear here once processing is complete.
        </p>
      </div>
    );
  }

  // Find the current tip based on video time
  const currentTip = analysis.tips.find(
    (tip) => Math.abs(tip.timestamp - currentTime) < 0.5
  );

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
          Shot Analysis
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span>Shot Type: {analysis.shotType}</span>
          <span>|</span>
          <span>
            Form Score:{" "}
            <span
              style={{
                color:
                  analysis.formScore >= 8
                    ? "#10B981"
                    : analysis.formScore >= 6
                    ? "#F59E0B"
                    : "#EF4444",
              }}
            >
              {analysis.formScore}/10
            </span>
          </span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: "1rem", color: "#10B981", marginBottom: "0.5rem" }}>
            Strengths
          </h3>
          <ul style={{ paddingLeft: "1.5rem" }}>
            {analysis.strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: "1rem", color: "#EF4444", marginBottom: "0.5rem" }}>
            Areas to Improve
          </h3>
          <ul style={{ paddingLeft: "1.5rem" }}>
            {analysis.weaknesses.map((weakness, index) => (
              <li key={index}>{weakness}</li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
          Coaching Tips
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {analysis.tips.map((tip, index) => (
            <div
              key={index}
              style={{
                padding: "0.75rem",
                borderRadius: "0.375rem",
                backgroundColor:
                  currentTip && currentTip.timestamp === tip.timestamp
                    ? "#374151"
                    : "#1F2937",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
              onClick={() => onFeedbackClick(tip.timestamp)}
            >
              <span
                style={{
                  backgroundColor: "#F97316",
                  color: "white",
                  borderRadius: "9999px",
                  width: "1.5rem",
                  height: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {index + 1}
              </span>
              <span>{tip.message}</span>
              <span style={{ marginLeft: "auto", color: "#9CA3AF" }}>
                {formatTimestamp(tip.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper function to format seconds to MM:SS format
function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
