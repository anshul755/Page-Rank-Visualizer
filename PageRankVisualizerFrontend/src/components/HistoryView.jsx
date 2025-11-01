import { useState, useEffect } from "react";
import { apiClient } from "../api/apiClient";
import { deserializeFromBackend } from "../utils/serialize";
import { ACTIONS } from "../state/graphReducer";

const HistoryView = ({ isOpen, onClose, dispatch }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) fetchHistory();
  }, [isOpen]);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getHistory();
      const list = Array.isArray(data) ? data : data.history || [];
      // Sorting is correct for ISO date strings
      const sorted = list.sort((a, b) => new Date(b.date) - new Date(a.date));
      setHistory(sorted);
    } catch (err) {
      setError("Failed to load history: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadGraph = async (id) => {
    try {
      const data = await apiClient.getHistoryById(id);
      const { nodes, edges } = deserializeFromBackend(data, 800, 600);

      dispatch({
        type: ACTIONS.LOAD_GRAPH,
        payload: { nodes, edges },
      });

      if (data.ranks) {
        dispatch({
          type: ACTIONS.UPDATE_NODE_RANKS,
          payload: data.ranks,
        });
        dispatch({
          type: ACTIONS.SET_CALCULATION_RESULT,
          payload: { id: data.id, ranks: data.ranks },
        });
      }

      onClose();
    } catch (err) {
      alert("Failed to load graph: " + err.message);
    }
  };

  // Simplified formatDate to correctly handle the ISO date string from the database.
  const formatDate = (dateValue) => {
    if (!dateValue) return "Unknown";
    const date = new Date(dateValue); // dateValue is now expected to be an ISO string
    return isNaN(date.getTime())
      ? "Invalid date"
      : date.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  // Helper to get a display-friendly ID string
  const getDisplayId = (entry) => {
    return entry._id || (entry.id && entry.id.date ? entry.id.date : "N/A");
  };

  // Helper to get a unique key (prefer _id, then id.timestamp as string, fallback to index)
  const getUniqueKey = (entry, idx) => {
    if (entry._id) return entry._id;
    if (entry.id && typeof entry.id.timestamp === "number") {
      return entry.id.timestamp.toString();
    }
    if (entry.id && entry.id.date) {
      return entry.id.date;
    }
    return `fallback-${idx}`;
  };

  // Helper to get the ID for loading the graph (prefer _id, then id.date as it's the ISO string likely expected by API)
  const getLoadId = (entry) => {
    return entry._id || (entry.id && entry.id.date ? entry.id.date : null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Calculation History</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Loading history...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && history.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No history found</p>
              <p className="text-gray-400 text-sm mt-2">
                Calculate a PageRank to save your first entry
              </p>
            </div>
          )}

          {!loading && !error && history.length > 0 && (
            <div className="space-y-4">
              {history.map((entry, idx) => {
                const displayId = getDisplayId(entry);
                const loadId = getLoadId(entry);
                const uniqueKey = getUniqueKey(entry, idx);

                return (
                  <div
                    key={uniqueKey}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-800">
                            Graph Calculation
                          </h3>
                          <span className="text-xs text-gray-500 font-mono">
                            ID: {displayId}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Date:</span>{" "}
                            {formatDate(entry.date)}
                          </div>
                          <div>
                            <span className="font-medium">Nodes:</span>{" "}
                            {entry.vertices?.length || 0}
                          </div>
                          <div>
                            <span className="font-medium">Edges:</span>{" "}
                            {entry.edges?.length || 0}
                          </div>
                          <div>
                            <span className="font-medium">Ranks:</span>{" "}
                            {entry.ranks ? Object.keys(entry.ranks).length : 0}
                          </div>
                        </div>

                        {/* Top 3 nodes preview */}
                        {entry.ranks && typeof entry.ranks === "object" && (
                          <div className="bg-gray-50 rounded p-2 text-xs">
                            <span className="font-medium text-gray-700">
                              Top nodes:{" "}
                            </span>
                            {Object.entries(entry.ranks)
                              .sort(([, a], [, b]) => Number(b) - Number(a))
                              .slice(0, 3)
                              .map(([node, rank], idx) => (
                                <span key={node} className="text-gray-600">
                                  {idx > 0 && ", "}
                                  {node} ({Number(rank).toFixed(4)})
                                </span>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={fetchHistory}
            disabled={loading}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium disabled:bg-gray-400"
          >
            🔄 Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryView;