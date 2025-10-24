import { getColorFromRank, getRadiusFromRank } from "../utils/serialize";

const Node = ({
  x,
  y,
  label,
  rank,
  isSelected,
  minRank,
  maxRank,
  onMouseDown,
  onClick,
}) => {
  const radius = getRadiusFromRank(rank, minRank, maxRank);
  const fillColor = getColorFromRank(rank, minRank, maxRank);

  return (
    <g
      onMouseDown={onMouseDown}
      onClick={onClick}
      style={{ cursor: "pointer" }}
      className="node-group"
    >
      {/* Node circle */}
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={fillColor}
        stroke={isSelected ? "#3b82f6" : "#1f2937"}
        strokeWidth={isSelected ? 3 : 2}
        className="transition-all duration-200"
      />

      {/* Node label */}
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#000"
        fontSize="14"
        fontWeight="bold"
        pointerEvents="none"
        className="select-none"
      >
        {label}
      </text>

      {/* Rank display (if calculated) */}
      {rank !== null && rank !== undefined && (
        <text
          x={x}
          y={y + radius + 15}
          textAnchor="middle"
          fill="#6b7280"
          fontSize="11"
          pointerEvents="none"
          className="select-none"
        >
          {rank.toFixed(4)}
        </text>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <circle
          cx={x}
          cy={y}
          r={radius + 5}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={2}
          strokeDasharray="5,5"
          className="animate-pulse"
        />
      )}
    </g>
  );
};

export default Node;
