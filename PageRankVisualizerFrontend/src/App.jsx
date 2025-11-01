import { useReducer, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    const validation = validateGraph(state);
    if (!validation.valid) {
      alert("Cannot calculate PageRank:\n\n" + validation.errors.join("\n"));
      return;
    }

    setCalculating(true);

    try {
      const graphData = serializeForBackend(state);
      const id = await apiClient.calculatePageRank(
        graphData,
        state.dampingFactor,
        state.maxIterations
      );

      const result = await apiClient.getHistoryById(id);

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

  const handleToggleHistory = () => setShowHistory((prev) => !prev);
  const handleCloseResults = () => setCalculationId(null);

  return (
    <div className="h-screen flex flex-col bg-gray-100 relative overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">PageRank Visualizer</h1>
          <p className="text-sm text-blue-100 mt-1">
            Interactive Graph Editor & PageRank Algorithm Visualization
          </p>
        </div>

        {/* History Toggle Button */}
        <button
          onClick={handleToggleHistory}
          className="bg-white/20 hover:bg-white/30 text-white rounded-lg px-4 py-2 transition"
        >
          {showHistory ? "Hide History" : "Show History"}
        </button>
      </header>

      {/* Toolbar */}
      <Toolbar
        state={state}
        dispatch={dispatch}
        onCalculate={handleCalculate}
        onViewHistory={handleToggleHistory}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Graph Editor */}
        <GraphEditor state={state} dispatch={dispatch} />

        {/* Properties Panel */}
        <PropertiesPanel state={state} dispatch={dispatch} />

        {/* Animated History Sidebar */}
        <AnimatePresence>
          {showHistory && (
              <HistoryView
                isOpen={true}
                onClose={handleToggleHistory}
                dispatch={dispatch}
                onSelectHistoryItem={async (item) => {
                  try {
                    const id = item?.id;
                    if (!id) return;
                    const result = await apiClient.getHistoryById(id);
                    if (result.ranks) {
                      dispatch({
                        type: ACTIONS.UPDATE_NODE_RANKS,
                        payload: result.ranks,
                      });
                      setCalculationId(id);
                    }
                    setShowHistory(false);
                  } catch (err) {
                    console.error("Error loading history item:", err);
                  }
                }}
              />
          )}
        </AnimatePresence>
      </div>

      {/* Results Panel */}
      <AnimatePresence>
        {calculationId && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="absolute bottom-0 left-0 right-0 z-30"
          >
            <ResultsPanel
              state={state}
              calculationId={calculationId}
              onClose={handleCloseResults}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      {calculating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 shadow-xl flex items-center gap-4"
          >
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
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default App;
