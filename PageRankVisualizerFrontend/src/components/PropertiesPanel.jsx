import { useState, useEffect } from "react";
import { ACTIONS } from "../state/graphReducer";

const PropertiesPanel = ({ state, dispatch }) => {
  const [editingLabel, setEditingLabel] = useState("");

  const selectedNode = state.nodes.find((n) => n.id === state.selectedNode);
  const selectedEdge = state.edges.find((e) => e.id === state.selectedEdge);

  useEffect(() => {
    if (selectedNode) {
      setEditingLabel(selectedNode.label);
    }
  }, [selectedNode]);

  const handleLabelChange = (e) => {
    setEditingLabel(e.target.value);
  };

  const handleLabelSave = () => {
    if (editingLabel.trim() && selectedNode) {
      dispatch({
        type: ACTIONS.UPDATE_NODE_LABEL,
        payload: { id: selectedNode.id, label: editingLabel.trim() },
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLabelSave();
    }
  };

  const handleDeleteSelected = () => {
    if (selectedNode) {
      dispatch({ type: ACTIONS.DELETE_NODE, payload: selectedNode.id });
    } else if (selectedEdge) {
      dispatch({ type: ACTIONS.DELETE_EDGE, payload: selectedEdge.id });
    }
  };

  return (
    <div className="w-64 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Properties</h2>

      {selectedNode && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Node</h3>
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  ID / Label
                </label>
                <input
                  type="text"
                  value={editingLabel}
                  onChange={handleLabelChange}
                  onBlur={handleLabelSave}
                  onKeyPress={handleKeyPress}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Position
                </label>
                <div className="text-sm text-gray-700">
                  X: {selectedNode.x.toFixed(0)}, Y: {selectedNode.y.toFixed(0)}
                </div>
              </div>

              {selectedNode.rank !== null &&
                selectedNode.rank !== undefined && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      PageRank
                    </label>
                    <div className="text-lg font-bold text-green-600">
                      {selectedNode.rank.toFixed(6)}
                    </div>
                  </div>
                )}
            </div>
          </div>

          <button
            onClick={handleDeleteSelected}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
          >
            Delete Node
          </button>
        </div>
      )}

      {selectedEdge && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Edge</h3>
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  From
                </label>
                <div className="text-sm text-gray-700 font-medium">
                  {selectedEdge.from}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  To
                </label>
                <div className="text-sm text-gray-700 font-medium">
                  {selectedEdge.to}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleDeleteSelected}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
          >
            Delete Edge
          </button>
        </div>
      )}

      {!selectedNode && !selectedEdge && (
        <div className="text-gray-500 text-sm">
          <p className="mb-3">Select a node or edge to view its properties.</p>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4">
            <h4 className="font-semibold text-blue-900 text-xs mb-2">
              Quick Guide:
            </h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Click nodes to select them</li>
              <li>• Drag nodes to reposition</li>
              <li>• Edit node labels here</li>
              <li>• Click edges to select them</li>
            </ul>
          </div>

          {state.nodes.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-700 text-xs mb-2">
                Graph Stats:
              </h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Nodes: {state.nodes.length}</div>
                <div>Edges: {state.edges.length}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertiesPanel;
