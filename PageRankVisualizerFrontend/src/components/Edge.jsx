const Edge = ({ from, to, nodes, isSelected, onClick }) => {
  // Find source and target nodes
  const sourceNode = nodes.find((n) => n.id === from);
  const targetNode = nodes.find((n) => n.id === to);

  if (!sourceNode || !targetNode) {
    return null;
  }

  // Calculate angle and offset for arrow positioning
  const dx = targetNode.x - sourceNode.x;
  const dy = targetNode.y - sourceNode.y;
  const angle = Math.atan2(dy, dx);

  // Offset from node centers to edge of circles
  const sourceRadius = 30; // Default radius, adjust if needed
  const targetRadius = 30;

  const startX = sourceNode.x + sourceRadius * Math.cos(angle);
  const startY = sourceNode.y + sourceRadius * Math.sin(angle);
  const endX = targetNode.x - targetRadius * Math.cos(angle);
  const endY = targetNode.y - targetRadius * Math.sin(angle);

  // Arrow marker ID
  const markerId = `arrowhead-${isSelected ? "selected" : "normal"}`;

  return (
    <g onClick={onClick} style={{ cursor: "pointer" }} className="edge-group">
      {/* Invisible thicker line for easier clicking */}
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke="transparent"
        strokeWidth="12"
      />

      {/* Visible edge line */}
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={isSelected ? "#3b82f6" : "#6b7280"}
        strokeWidth={isSelected ? 3 : 2}
        markerEnd={`url(#${markerId})`}
        className="transition-all duration-200"
      />
    </g>
  );
};

export default Edge;
