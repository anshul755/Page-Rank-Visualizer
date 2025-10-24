import { generateNodeId } from "../utils/serialize";

// Action Types
export const ACTIONS = {
  ADD_NODE: "ADD_NODE",
  DELETE_NODE: "DELETE_NODE",
  UPDATE_NODE_POSITION: "UPDATE_NODE_POSITION",
  UPDATE_NODE_LABEL: "UPDATE_NODE_LABEL",
  ADD_EDGE: "ADD_EDGE",
  DELETE_EDGE: "DELETE_EDGE",
  SELECT_NODE: "SELECT_NODE",
  SELECT_EDGE: "SELECT_EDGE",
  CLEAR_SELECTION: "CLEAR_SELECTION",
  SET_MODE: "SET_MODE",
  SET_DAMPING_FACTOR: "SET_DAMPING_FACTOR",
  SET_MAX_ITERATIONS: "SET_MAX_ITERATIONS",
  SET_CALCULATION_RESULT: "SET_CALCULATION_RESULT",
  UPDATE_NODE_RANKS: "UPDATE_NODE_RANKS",
  LOAD_GRAPH: "LOAD_GRAPH",
  CLEAR_GRAPH: "CLEAR_GRAPH",
  SET_TEMP_EDGE: "SET_TEMP_EDGE",
};

// Modes
export const MODES = {
  SELECT: "select",
  ADD_NODE: "addNode",
  ADD_EDGE: "addEdge",
  DELETE: "delete",
};

// Initial State
export const initialState = {
  nodes: [],
  edges: [],
  selectedNode: null,
  selectedEdge: null,
  mode: MODES.SELECT,
  dampingFactor: 0.85,
  maxIterations: 100,
  calculationResult: {
    id: null,
    ranks: {},
  },
  tempEdge: null, // For visual feedback when creating edge
};

// Reducer
export const graphReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_NODE: {
      const newNode = {
        id: action.payload.id || generateNodeId(state.nodes),
        label:
          action.payload.label ||
          action.payload.id ||
          generateNodeId(state.nodes),
        x: action.payload.x,
        y: action.payload.y,
        rank: null,
      };
      return {
        ...state,
        nodes: [...state.nodes, newNode],
      };
    }

    case ACTIONS.DELETE_NODE: {
      const nodeId = action.payload;
      return {
        ...state,
        nodes: state.nodes.filter((n) => n.id !== nodeId),
        edges: state.edges.filter((e) => e.from !== nodeId && e.to !== nodeId),
        selectedNode: state.selectedNode === nodeId ? null : state.selectedNode,
      };
    }

    case ACTIONS.UPDATE_NODE_POSITION: {
      const { id, x, y } = action.payload;
      return {
        ...state,
        nodes: state.nodes.map((node) =>
          node.id === id ? { ...node, x, y } : node
        ),
      };
    }

    case ACTIONS.UPDATE_NODE_LABEL: {
      const { id, label } = action.payload;
      return {
        ...state,
        nodes: state.nodes.map((node) =>
          node.id === id ? { ...node, id: label, label } : node
        ),
        edges: state.edges.map((edge) => ({
          ...edge,
          from: edge.from === id ? label : edge.from,
          to: edge.to === id ? label : edge.to,
        })),
      };
    }

    case ACTIONS.ADD_EDGE: {
      const { from, to } = action.payload;

      // Prevent duplicate edges
      const isDuplicate = state.edges.some(
        (e) => e.from === from && e.to === to
      );

      if (isDuplicate || from === to) {
        return state;
      }

      const newEdge = {
        id: `edge-${Date.now()}`,
        from,
        to,
      };

      return {
        ...state,
        edges: [...state.edges, newEdge],
        tempEdge: null,
      };
    }

    case ACTIONS.DELETE_EDGE: {
      const edgeId = action.payload;
      return {
        ...state,
        edges: state.edges.filter((e) => e.id !== edgeId),
        selectedEdge: state.selectedEdge === edgeId ? null : state.selectedEdge,
      };
    }

    case ACTIONS.SELECT_NODE: {
      return {
        ...state,
        selectedNode: action.payload,
        selectedEdge: null,
      };
    }

    case ACTIONS.SELECT_EDGE: {
      return {
        ...state,
        selectedEdge: action.payload,
        selectedNode: null,
      };
    }

    case ACTIONS.CLEAR_SELECTION: {
      return {
        ...state,
        selectedNode: null,
        selectedEdge: null,
      };
    }

    case ACTIONS.SET_MODE: {
      return {
        ...state,
        mode: action.payload,
        selectedNode: null,
        selectedEdge: null,
        tempEdge: null,
      };
    }

    case ACTIONS.SET_DAMPING_FACTOR: {
      return {
        ...state,
        dampingFactor: action.payload,
      };
    }

    case ACTIONS.SET_MAX_ITERATIONS: {
      return {
        ...state,
        maxIterations: action.payload,
      };
    }

    case ACTIONS.SET_CALCULATION_RESULT: {
      return {
        ...state,
        calculationResult: action.payload,
      };
    }

    case ACTIONS.UPDATE_NODE_RANKS: {
      const ranks = action.payload;
      return {
        ...state,
        nodes: state.nodes.map((node) => ({
          ...node,
          rank: ranks[node.id] || null,
        })),
      };
    }

    case ACTIONS.LOAD_GRAPH: {
      const { nodes, edges } = action.payload;
      return {
        ...state,
        nodes,
        edges,
        selectedNode: null,
        selectedEdge: null,
        tempEdge: null,
      };
    }

    case ACTIONS.CLEAR_GRAPH: {
      return {
        ...initialState,
        dampingFactor: state.dampingFactor,
        maxIterations: state.maxIterations,
      };
    }

    case ACTIONS.SET_TEMP_EDGE: {
      return {
        ...state,
        tempEdge: action.payload,
      };
    }

    default:
      return state;
  }
};
