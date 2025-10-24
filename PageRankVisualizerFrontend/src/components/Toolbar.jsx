import { ACTIONS, MODES } from "../state/graphReducer";

const Toolbar = ({ state, dispatch, onCalculate, onViewHistory }) => {
  const handleModeChange = (mode) => {
    dispatch({ type: ACTIONS.SET_MODE, payload: mode });
  };

  const handleDampingFactorChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 1) {
      dispatch({ type: ACTIONS.SET_DAMPING_FACTOR, payload: value });
    }
  };

  const handleMaxIterationsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      dispatch({ type: ACTIONS.SET_MAX_ITERATIONS, payload: value });
    }
  };

  const handleClearGraph = () => {
    if (window.confirm("Are you sure you want to clear the graph?")) {
      dispatch({ type: ACTIONS.CLEAR_GRAPH });
    }
  };

  return (
    <div className="bg-gray-800 text-white px-4 py-3 flex items-center gap-4 flex-wrap shadow-lg">
      {/* Mode Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => handleModeChange(MODES.SELECT)}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            state.mode === MODES.SELECT
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          ✋ Select
        </button>
        <button
          onClick={() => handleModeChange(MODES.ADD_NODE)}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            state.mode === MODES.ADD_NODE
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          ➕ Add Node
        </button>
        <button
          onClick={() => handleModeChange(MODES.ADD_EDGE)}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            state.mode === MODES.ADD_EDGE
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          🔗 Add Edge
        </button>
        <button
          onClick={() => handleModeChange(MODES.DELETE)}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            state.mode === MODES.DELETE
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          🗑️ Delete
        </button>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-gray-600"></div>

      {/* Parameters */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <label htmlFor="dampingFactor" className="text-sm font-medium">
            Damping Factor:
          </label>
          <input
            id="dampingFactor"
            type="number"
            min="0"
            max="1"
            step="0.05"
            value={state.dampingFactor}
            onChange={handleDampingFactorChange}
            className="w-20 px-2 py-1 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="maxIterations" className="text-sm font-medium">
            Max Iterations:
          </label>
          <input
            id="maxIterations"
            type="number"
            min="1"
            step="10"
            value={state.maxIterations}
            onChange={handleMaxIterationsChange}
            className="w-20 px-2 py-1 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-gray-600"></div>

      {/* Action Buttons */}
      <div className="flex gap-2 ml-auto">
        <button
          onClick={onCalculate}
          disabled={state.nodes.length === 0}
          className="px-4 py-2 rounded-md font-medium bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          🚀 Calculate PageRank
        </button>
        {/* <button
          onClick={onViewHistory}
          className="px-4 py-2 rounded-md font-medium bg-purple-600 hover:bg-purple-700 transition-colors"
        >
          📜 History
        </button> */}
        <button
          onClick={handleClearGraph}
          className="px-4 py-2 rounded-md font-medium bg-red-600 hover:bg-red-700 transition-colors"
        >
          🗑️ Clear
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
