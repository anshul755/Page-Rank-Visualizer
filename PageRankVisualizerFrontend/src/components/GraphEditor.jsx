import { useRef, useState } from "react";
import Node from "./Node";
import Edge from "./Edge";
import { ACTIONS, MODES } from "../state/graphReducer";

const GraphEditor = ({ state, dispatch }) => {
  const svgRef = useRef(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const [edgeStart, setEdgeStart] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Get SVG coordinates from mouse event
  const getSVGCoordinates = (event) => {
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  // Handle canvas click (for adding nodes)
  const handleCanvasClick = (event) => {
    // Only handle clicks on SVG or background rect (not on nodes/edges)
    const targetTag = event.target.tagName.toLowerCase();
    if (targetTag !== "svg" && targetTag !== "rect") return;

    const coords = getSVGCoordinates(event);

    if (state.mode === MODES.ADD_NODE) {
      dispatch({
        type: ACTIONS.ADD_NODE,
        payload: coords,
      });
    } else if (state.mode === MODES.SELECT) {
      dispatch({ type: ACTIONS.CLEAR_SELECTION });
    }
  };

  // Handle node mouse down (for dragging or edge creation)
  const handleNodeMouseDown = (event, nodeId) => {
    event.stopPropagation();

    if (state.mode === MODES.SELECT) {
      setDraggedNode(nodeId);
      dispatch({ type: ACTIONS.SELECT_NODE, payload: nodeId });
    } else if (state.mode === MODES.ADD_EDGE) {
      if (!edgeStart) {
        setEdgeStart(nodeId);
        dispatch({ type: ACTIONS.SELECT_NODE, payload: nodeId });
      } else {
        // Create edge from edgeStart to nodeId
        dispatch({
          type: ACTIONS.ADD_EDGE,
          payload: { from: edgeStart, to: nodeId },
        });
        setEdgeStart(null);
        dispatch({ type: ACTIONS.CLEAR_SELECTION });
      }
    } else if (state.mode === MODES.DELETE) {
      dispatch({ type: ACTIONS.DELETE_NODE, payload: nodeId });
    }
  };

  // Handle node click
  const handleNodeClick = (event, nodeId) => {
    event.stopPropagation();
    if (state.mode === MODES.SELECT) {
      dispatch({ type: ACTIONS.SELECT_NODE, payload: nodeId });
    }
  };

  // Handle edge click
  const handleEdgeClick = (event, edgeId) => {
    event.stopPropagation();

    if (state.mode === MODES.DELETE) {
      dispatch({ type: ACTIONS.DELETE_EDGE, payload: edgeId });
    } else if (state.mode === MODES.SELECT) {
      dispatch({ type: ACTIONS.SELECT_EDGE, payload: edgeId });
    }
  };

  // Handle mouse move (for dragging)
  const handleMouseMove = (event) => {
    const coords = getSVGCoordinates(event);
    setMousePos(coords);

    if (draggedNode) {
      dispatch({
        type: ACTIONS.UPDATE_NODE_POSITION,
        payload: { id: draggedNode, x: coords.x, y: coords.y },
      });
    }
  };

  // Handle mouse up (stop dragging)
  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  // Calculate min/max ranks for color scaling
  const ranks = state.nodes.map((n) => n.rank).filter((r) => r !== null);
  const minRank = ranks.length > 0 ? Math.min(...ranks) : 0;
  const maxRank = ranks.length > 0 ? Math.max(...ranks) : 1;

  return (
    <div className="flex-1 bg-gray-50 relative overflow-hidden">
      <svg
        ref={svgRef}
        className="w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
      >
        {/* Arrow marker definitions */}
        <defs>
          <marker
            id="arrowhead-normal"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="#6b7280" />
          </marker>
          <marker
            id="arrowhead-selected"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Grid pattern (optional) */}
        <defs>
          <pattern
            id="grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Render edges */}
        {state.edges.map((edge) => (
          <Edge
            key={edge.id}
            id={edge.id}
            from={edge.from}
            to={edge.to}
            nodes={state.nodes}
            isSelected={state.selectedEdge === edge.id}
            onClick={(e) => handleEdgeClick(e, edge.id)}
          />
        ))}

        {/* Temporary edge while creating */}
        {edgeStart && state.mode === MODES.ADD_EDGE && (
          <line
            x1={state.nodes.find((n) => n.id === edgeStart)?.x || 0}
            y1={state.nodes.find((n) => n.id === edgeStart)?.y || 0}
            x2={mousePos.x}
            y2={mousePos.y}
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="5,5"
            pointerEvents="none"
          />
        )}

        {/* Render nodes */}
        {state.nodes.map((node) => (
          <Node
            key={node.id}
            id={node.id}
            x={node.x}
            y={node.y}
            label={node.label}
            rank={node.rank}
            isSelected={state.selectedNode === node.id}
            minRank={minRank}
            maxRank={maxRank}
            onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
            onClick={(e) => handleNodeClick(e, node.id)}
          />
        ))}
      </svg>

      {/* Mode indicator */}
      <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md">
        <p className="text-sm font-medium text-gray-700">
          Mode: <span className="text-blue-600 capitalize">{state.mode}</span>
        </p>
        {state.mode === MODES.ADD_EDGE && edgeStart && (
          <p className="text-xs text-gray-500 mt-1">
            Click target node to create edge from <strong>{edgeStart}</strong>
          </p>
        )}
      </div>

      {/* Instructions */}
      {state.nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white px-6 py-4 rounded-lg shadow-lg">
            <p className="text-gray-600 text-center">
              Click "Add Node" mode and click on the canvas to add nodes
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphEditor;
