const BASE_URL = "http://localhost:8080";

/**
 * API Client for PageRank Visualizer Backend
 */
export const apiClient = {
  /**
   * Calculate PageRank and save to database
   * @param {Object} graphData - { vertices: string[], edges: {from, to}[] }
   * @param {number} dampingFactor - Default 0.85
   * @param {number} maxIterations - Default 100
   * @returns {Promise<string>} - ObjectId of saved calculation
   */
  async calculatePageRank(
    graphData,
    dampingFactor = 0.85,
    maxIterations = 100
  ) {
    try {
      console.log(graphData);
      const response = await fetch(
        `${BASE_URL}/pagerank/calculate?dampingFactor=${dampingFactor}&maxIterations=${maxIterations}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(graphData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const id = await response.text();
      return id;
    } catch (error) {
      console.error("Error calculating PageRank:", error);
      throw error;
    }
  },

  /**
   * Get all saved PageRank calculations
   * @returns {Promise<Array>} - Array of PageRankVisualizerEntity
   */
  async getHistory() {
    try {
      const response = await fetch(`${BASE_URL}/pagerank/history`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching history:", error);
      throw error;
    }
  },

  /**
   * Get a specific saved calculation by ID
   * @param {string} id - ObjectId string
   * @returns {Promise<Object>} - PageRankVisualizerEntity with ranks
   */
  async getHistoryById(id) {
    try {
      const response = await fetch(`${BASE_URL}/pagerank/history/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching history item:", error);
      throw error;
    }
  },

  /**
   * Health check endpoint
   * @returns {Promise<string>} - "Ok" if backend is running
   */
  async healthCheck() {
    try {
      const response = await fetch(`${BASE_URL}/health-check`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      return data;
    } catch (error) {
      console.error("Error in health check:", error);
      throw error;
    }
  },
};
