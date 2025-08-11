import React from "react";
import { TimestampedFeedback } from "../types";

interface FeedbackAnnotationProps {
  feedback: TimestampedFeedback;
  videoWidth: number;
  videoHeight: number;
}

const getAnnotationForCategory = (
  category: string,
  width: number,
  height: number
) => {
  const color = "#F97316";
  const strokeWidth = 2;

  switch (category.toLowerCase()) {
    case "stance and balance":
      return (
        <g>
          <rect
            x={width * 0.3}
            y={height * 0.85}
            width={width * 0.4}
            height={height * 0.05}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray="5,5"
            fill="none"
          />
          <path
            d={`M ${width * 0.3} ${height * 0.88} L ${width * 0.25} ${height * 0.88}
                M ${width * 0.25} ${height * 0.86} L ${width * 0.25} ${height * 0.9}
                M ${width * 0.7} ${height * 0.88} L ${width * 0.75} ${height * 0.88}
                M ${width * 0.75} ${height * 0.86} L ${width * 0.75} ${height * 0.9}`}
            stroke={color}
            strokeWidth={strokeWidth}
          />
          <text
            x={width * 0.5}
            y={height * 0.95}
            fontSize="12"
            fill={color}
            textAnchor="middle"
          >
            Shoulder Width
          </text>
        </g>
      );
    case "elbow alignment":
      return (
        <g>
          <line
            x1={width * 0.4}
            y1={height * 0.4}
            x2={width * 0.4}
            y2={height * 0.7}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray="5,5"
          />
          <circle
            cx={width * 0.4}
            cy={height * 0.4}
            r={10}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <text
            x={width * 0.42}
            y={height * 0.38}
            fontSize="12"
            fill={color}
            textAnchor="start"
          >
            Keep elbow in
          </text>
        </g>
      );
    case "shot pocket":
      return (
        <g>
          <circle
            cx={width * 0.4}
            cy={height * 0.5}
            r={20}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <text
            x={width * 0.4}
            y={height * 0.45}
            fontSize="12"
            fill={color}
            textAnchor="middle"
          >
            Shot pocket
          </text>
        </g>
      );
    case "release point":
      return (
        <g>
          <path
            d={`M ${width * 0.4} ${height * 0.3} C ${width * 0.5} ${height * 0.1}, ${width * 0.6} ${height * 0.1}, ${width * 0.7} ${height * 0.3}`}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray="5,5"
          />
          <circle
            cx={width * 0.4}
            cy={height * 0.3}
            r={10}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <text
            x={width * 0.5}
            y={height * 0.15}
            fontSize="12"
            fill={color}
            textAnchor="middle"
          >
            Release at peak
          </text>
        </g>
      );
    case "follow-through":
      return (
        <g>
          <path
            d={`M ${width * 0.4} ${height * 0.4} C ${width * 0.42} ${height * 0.3}, ${width * 0.44} ${height * 0.25}, ${width * 0.45} ${height * 0.2}`}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray="5,5"
          />
          <path
            d={`M ${width * 0.45} ${height * 0.2} L ${width * 0.43} ${height * 0.22}
                M ${width * 0.45} ${height * 0.2} L ${width * 0.47} ${height * 0.22}`}
            stroke={color}
            strokeWidth={strokeWidth}
          />
          <text
            x={width * 0.48}
            y={height * 0.25}
            fontSize="12"
            fill={color}
            textAnchor="start"
          >
            Full extension
          </text>
        </g>
      );
    default:
      return (
        <g>
          <circle
            cx={width * 0.5}
            cy={height * 0.5}
            r={40}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray="5,5"
          />
        </g>
      );
  }
};

const FeedbackAnnotation: React.FC<FeedbackAnnotationProps> = ({
  feedback,
  videoWidth,
  videoHeight,
}) => (
  <svg
    className="absolute top-0 left-0 w-full h-full pointer-events-none"
    viewBox={`0 0 ${videoWidth} ${videoHeight}`}
    preserveAspectRatio="xMidYMid slice"
  >
    {getAnnotationForCategory(feedback.category, videoWidth, videoHeight)}
  </svg>
);

export default FeedbackAnnotation; 