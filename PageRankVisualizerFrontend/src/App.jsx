import { useReducer, useState } from "react";
import { graphReducer, initialState, ACTIONS } from "./state/graphReducer";
import { serializeForBackend, validateGraph } from "./utils/serialize";
import { apiClient } from "./api/apiClient";
import Toolbar from "./components/Toolbar";
import GraphEditor from "./components/GraphEditor";
import PropertiesPanel from "./components/PropertiesPanel";
import ResultsPanel from "./components/ResultsPanel";
import HistoryView from "./components/HistoryView";

function App() {
  const [state, dispatch] = useReducer(graphReducer, initialState);
  const [calculationId, setCalculationId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [calculating, setCalculating] = useState(false);

  const handleCalculate = async () => {
    // Validate graph
    const validation = validateGraph(state);
    if (!validation.valid) {
      alert("Cannot calculate PageRank:\n\n" + validation.errors.join("\n"));
      return;
    }

    setCalculating(true);

    try {
      // Serialize graph for backend
      const graphData = serializeForBackend(state);

      // Call backend to calculate PageRank
      const id = await apiClient.calculatePageRank(
        graphData,
        state.dampingFactor,
        state.maxIterations
      );

      // Fetch the result with ranks
      const result = await apiClient.getHistoryById(id);

      // Update nodes with ranks
      if (result.ranks) {
        dispatch({
          type: ACTIONS.UPDATE_NODE_RANKS,
          payload: result.ranks,
        });
        dispatch({
          type: ACTIONS.SET_CALCULATION_RESULT,
          payload: { id, ranks: result.ranks },
        });
        setCalculationId(id);
      }

      alert("✅ PageRank calculated successfully!\nCalculation ID: " + id);
    } catch (error) {
      console.error("Error calculating PageRank:", error);
      alert("❌ Failed to calculate PageRank:\n\n" + error.message);
    } finally {
      setCalculating(false);
    }
  };

  const handleViewHistory = () => {
    setShowHistory(true);
  };

  const handleCloseHistory = () => {
    setShowHistory(false);
  };

  const handleCloseResults = () => {
    setCalculationId(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 shadow-lg">
        <h1 className="text-2xl font-bold">PageRank Visualizer</h1>
        <p className="text-sm text-blue-100 mt-1">
          Interactive Graph Editor & PageRank Algorithm Visualization
        </p>
      </header>

      {/* Toolbar */}
      <Toolbar
        state={state}
        dispatch={dispatch}
        onCalculate={handleCalculate}
        onViewHistory={handleViewHistory}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Graph Editor */}
        <GraphEditor state={state} dispatch={dispatch} />

        {/* Properties Panel */}
        <PropertiesPanel state={state} dispatch={dispatch} />
      </div>

      {/* Results Panel */}
      {calculationId && (
        <ResultsPanel
          state={state}
          calculationId={calculationId}
          onClose={handleCloseResults}
        />
      )}

      {/* History Modal */}
      <HistoryView
        isOpen={showHistory}
        onClose={handleCloseHistory}
        dispatch={dispatch}
      />

      {/* Loading Overlay */}
      {calculating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <div>
                <p className="font-semibold text-gray-800">
                  Calculating PageRank...
                </p>
                <p className="text-sm text-gray-500">
                  Damping: {state.dampingFactor}, Iterations:{" "}
                  {state.maxIterations}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
