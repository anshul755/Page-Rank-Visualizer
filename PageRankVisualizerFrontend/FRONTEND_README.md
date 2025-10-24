# PageRank Visualizer - Frontend

Interactive graph editor and PageRank algorithm visualization tool built with React, Vite, and Tailwind CSS.

## Features

- 🎨 **Interactive Graph Editor**: Create nodes and edges with an intuitive GUI
- 🔄 **PageRank Calculation**: Visualize PageRank algorithm results in real-time
- 📊 **Visual Feedback**: Node size and color based on PageRank scores
- 📜 **History**: Save and load previous calculations
- 🎯 **Multiple Modes**: Select, Add Node, Add Edge, Delete
- 📱 **Responsive Design**: Clean, modern UI with Tailwind CSS

## Prerequisites

- Node.js (v16 or higher)
- Backend server running on `http://localhost:8080`

## Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Install Tailwind CSS:**

   ```bash
   npm install -D tailwindcss postcss autoprefixer
   ```

3. **Verify Tailwind configuration:**
   - Files `tailwind.config.js` and `postcss.config.js` should already exist
   - Check that `src/index.css` contains Tailwind directives

## Running the Application

```bash
npm run dev
```

The application will start on `http://localhost:5173` (or another port if 5173 is busy).

## Usage Guide

### Creating a Graph

1. **Add Nodes:**

   - Click "Add Node" mode button
   - Click anywhere on the canvas to create nodes
   - Nodes are auto-labeled (A, B, C, ...)

2. **Add Edges:**

   - Click "Add Edge" mode button
   - Click on source node, then click on target node
   - Directed edges will be created

3. **Edit Graph:**
   - **Select Mode**: Click and drag nodes to reposition
   - **Properties Panel**: Click a node to edit its label/ID
   - **Delete Mode**: Click nodes or edges to remove them

### Calculating PageRank

1. Configure parameters:

   - **Damping Factor** (default 0.85): Probability of following links
   - **Max Iterations** (default 100): Number of iterations to run

2. Click **"Calculate PageRank"** button

3. Results will display:
   - Nodes resize based on rank (larger = higher rank)
   - Color gradient: Red (low) → Yellow (medium) → Green (high)
   - Results panel shows detailed rankings

### History

- Click **"History"** to view all saved calculations
- Load previous graphs to visualize or modify them
- Each calculation is saved with timestamp and metadata

## Project Structure

```
src/
├── api/
│   └── apiClient.js          # Backend API integration
├── components/
│   ├── Edge.jsx              # SVG edge component
│   ├── GraphEditor.jsx       # Main canvas with interactions
│   ├── HistoryView.jsx       # History modal
│   ├── Node.jsx              # SVG node component
│   ├── PropertiesPanel.jsx   # Right sidebar for properties
│   ├── ResultsPanel.jsx      # Results display
│   └── Toolbar.jsx           # Top toolbar with controls
├── state/
│   └── graphReducer.js       # State management reducer
├── utils/
│   └── serialize.js          # Graph serialization utilities
├── App.jsx                   # Main application component
├── index.css                 # Global styles + Tailwind
└── main.jsx                  # Application entry point
```

## Backend API

The frontend expects a backend server with these endpoints:

### POST `/pagerank/calculate`

- **Query Params**: `dampingFactor`, `maxIterations`
- **Request Body**:
  ```json
  {
    "vertices": ["A", "B", "C"],
    "edges": [
      { "from": "A", "to": "B" },
      { "from": "B", "to": "C" }
    ]
  }
  ```
- **Response**: ObjectId string

### GET `/pagerank/history`

- **Response**: Array of saved calculations

### GET `/pagerank/history/{id}`

- **Response**: Single calculation with ranks

## Keyboard Shortcuts

- **Delete**: Remove selected node/edge (when in Select mode)
- **Escape**: Clear selection
- **Enter**: Save node label edit

## Customization

### Changing Colors

Edit `src/utils/serialize.js` → `getColorFromRank()` function

### Adjusting Node Sizes

Edit `src/utils/serialize.js` → `getRadiusFromRank()` function

### Backend URL

Edit `src/api/apiClient.js` → `BASE_URL` constant

## Troubleshooting

### CORS Errors

Ensure your backend has CORS enabled for `http://localhost:5173`

### Tailwind Styles Not Working

1. Verify Tailwind is installed: `npm list tailwindcss`
2. Check `tailwind.config.js` exists
3. Restart dev server: `npm run dev`

### Backend Connection Failed

1. Verify backend is running on `http://localhost:8080`
2. Test with: Open browser → `http://localhost:8080/health-check`
3. Check browser console for error details

## Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## Technologies Used

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **SVG** - Graph rendering
- **Fetch API** - Backend communication

## License

MIT

## Contributing

Feel free to submit issues and pull requests!
