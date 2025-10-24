/**
 * Serialize frontend graph state to backend schema
 * @param {Object} state - Graph state with nodes and edges
 * @returns {Object} - { vertices: string[], edges: {from, to}[] }
 */
export const serializeForBackend = (state) => {
  const vertices = state.nodes.map((node) => node.id);
  const edges = state.edges.map((edge) => ({
    from: edge.from,
    to: edge.to,
  }));

  return { vertices, edges };
};

/**
 * Deserialize backend data to frontend state
 * @param {Object} backendData - { vertices, edges, ranks }
 * @param {number} canvasWidth - Width of canvas for auto-positioning
 * @param {number} canvasHeight - Height of canvas for auto-positioning
 * @returns {Object} - { nodes, edges }
 */
export const deserializeFromBackend = (
  backendData,
  canvasWidth = 800,
  canvasHeight = 600
) => {
  const { vertices, edges, ranks } = backendData;

  // Auto-position nodes in a circle
  const nodes = vertices.map((vertexId, index) => {
    const angle = (2 * Math.PI * index) / vertices.length;
    const radius = Math.min(canvasWidth, canvasHeight) * 0.35;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    return {
      id: vertexId,
      label: vertexId,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      rank: ranks ? ranks[vertexId] : null,
    };
  });

  // Create edges with unique IDs
  const edgesWithIds = edges.map((edge, index) => ({
    id: `edge-${index}`,
    from: edge.from,
    to: edge.to,
  }));

  return { nodes, edges: edgesWithIds };
};

/**
 * Generate a unique node ID
 * @param {Array} existingNodes - Current nodes
 * @returns {string} - New unique ID (A, B, C, ... Z, AA, AB, ...)
 */
export const generateNodeId = (existingNodes) => {
  const existingIds = new Set(existingNodes.map((n) => n.id));
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  // Single letters first
  for (let i = 0; i < alphabet.length; i++) {
    const id = alphabet[i];
    if (!existingIds.has(id)) return id;
  }

  // Double letters
  for (let i = 0; i < alphabet.length; i++) {
    for (let j = 0; j < alphabet.length; j++) {
      const id = alphabet[i] + alphabet[j];
      if (!existingIds.has(id)) return id;
    }
  }

  // Fallback to number-based
  let counter = 1;
  while (existingIds.has(`Node${counter}`)) {
    counter++;
  }
  return `Node${counter}`;
};

/**
 * Validate graph before sending to backend
 * @param {Object} state - Graph state
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
export const validateGraph = (state) => {
  const errors = [];

  // Check for at least one node
  if (state.nodes.length === 0) {
    errors.push("Graph must have at least one node");
  }

  // Check for duplicate IDs
  const ids = state.nodes.map((n) => n.id);
  const uniqueIds = new Set(ids);
  if (ids.length !== uniqueIds.size) {
    errors.push("Duplicate node IDs detected");
  }

  // Check for empty IDs
  if (state.nodes.some((n) => !n.id || n.id.trim() === "")) {
    errors.push("All nodes must have an ID");
  }

  // Check for invalid edges (referencing non-existent nodes)
  const validIds = new Set(ids);
  const invalidEdges = state.edges.filter(
    (e) => !validIds.has(e.from) || !validIds.has(e.to)
  );
  if (invalidEdges.length > 0) {
    errors.push("Some edges reference non-existent nodes");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Calculate node color based on rank
 * @param {number} rank - PageRank value
 * @param {number} minRank - Minimum rank in graph
 * @param {number} maxRank - Maximum rank in graph
 * @returns {string} - RGB color string
 */
export const getColorFromRank = (rank, minRank, maxRank) => {
  if (rank === null || rank === undefined) {
    return "rgb(156, 163, 175)"; // Gray for unranked
  }

  // Normalize rank to 0-1
  const normalized =
    maxRank > minRank ? (rank - minRank) / (maxRank - minRank) : 0.5;

  // Color gradient: low (red) -> medium (yellow) -> high (green)
  let r, g, b;

  if (normalized < 0.5) {
    // Red to Yellow
    const t = normalized * 2;
    r = 255;
    g = Math.floor(255 * t);
    b = 0;
  } else {
    // Yellow to Green
    const t = (normalized - 0.5) * 2;
    r = Math.floor(255 * (1 - t));
    g = 255;
    b = 0;
  }

  return `rgb(${r}, ${g}, ${b})`;
};

/**
 * Calculate node radius based on rank
 * @param {number} rank - PageRank value
 * @param {number} minRank - Minimum rank in graph
 * @param {number} maxRank - Maximum rank in graph
 * @returns {number} - Radius in pixels
 */
export const getRadiusFromRank = (rank, minRank, maxRank) => {
  const MIN_RADIUS = 25;
  const MAX_RADIUS = 50;

  if (rank === null || rank === undefined) {
    return 30; // Default radius
  }

  const normalized =
    maxRank > minRank ? (rank - minRank) / (maxRank - minRank) : 0.5;
  return MIN_RADIUS + normalized * (MAX_RADIUS - MIN_RADIUS);
};
