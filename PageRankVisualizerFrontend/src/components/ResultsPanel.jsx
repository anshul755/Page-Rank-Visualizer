const ResultsPanel = ({ state, calculationId, onClose }) => {
  if (!calculationId) return null;

  // Sort nodes by rank (descending)
  const sortedNodes = [...state.nodes]
    .filter((n) => n.rank !== null && n.rank !== undefined)
    .sort((a, b) => b.rank - a.rank);

  const totalRank = sortedNodes.reduce((sum, node) => sum + node.rank, 0);

  return (
    <div className="bg-white border-t border-gray-200 p-4 max-h-64 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            PageRank Calculation Results
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Calculation ID: <span className="font-mono">{calculationId}</span>
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          title="Close results"
        >
          ✕
        </button>
      </div>

      {sortedNodes.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No rank data available</p>
      ) : (
        <div className="space-y-4">
          {/* Color Legend */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h3 className="text-xs font-semibold text-gray-700 mb-2">
              Color Scale
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Low</span>
              <div
                className="flex-1 h-4 rounded"
                style={{
                  background:
                    "linear-gradient(to right, rgb(255,0,0), rgb(255,255,0), rgb(0,255,0))",
                }}
              ></div>
              <span className="text-xs text-gray-600">High</span>
            </div>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-2 font-semibold text-gray-700">
                    Rank
                  </th>
                  <th className="text-left py-2 px-2 font-semibold text-gray-700">
                    Node
                  </th>
                  <th className="text-right py-2 px-2 font-semibold text-gray-700">
                    PageRank
                  </th>
                  <th className="text-right py-2 px-2 font-semibold text-gray-700">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedNodes.map((node, index) => (
                  <tr
                    key={node.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-2 px-2 text-gray-600">#{index + 1}</td>
                    <td className="py-2 px-2 font-medium text-gray-800">
                      {node.label}
                    </td>
                    <td className="py-2 px-2 text-right font-mono text-gray-700">
                      {node.rank.toFixed(6)}
                    </td>
                    <td className="py-2 px-2 text-right text-gray-600">
                      {((node.rank / totalRank) * 100).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-300 font-semibold">
                  <td colSpan="2" className="py-2 px-2 text-gray-700">
                    Total
                  </td>
                  <td className="py-2 px-2 text-right font-mono text-gray-800">
                    {totalRank.toFixed(6)}
                  </td>
                  <td className="py-2 px-2 text-right text-gray-700">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="bg-blue-50 rounded-lg p-2 text-center">
              <div className="text-xs text-blue-600 font-medium">Nodes</div>
              <div className="text-lg font-bold text-blue-900">
                {sortedNodes.length}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-2 text-center">
              <div className="text-xs text-green-600 font-medium">Highest</div>
              <div className="text-lg font-bold text-green-900">
                {sortedNodes[0]?.label || "N/A"}
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-2 text-center">
              <div className="text-xs text-purple-600 font-medium">
                Avg Rank
              </div>
              <div className="text-lg font-bold text-purple-900">
                {(totalRank / sortedNodes.length).toFixed(4)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;
