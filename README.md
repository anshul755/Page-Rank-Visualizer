# PageRank Visualizer

An interactive web app that visualizes Google’s PageRank algorithm in action.
Create graphs, connect nodes, and see how link importance evolves in real time — a hands-on way to explore graph theory and web ranking.

## What It Does

Ever wondered how Google decides which pages rank highest? PageRank treats the web as a graph, where each link is a vote of confidence.
This visualizer lets you see that process in action:

🎨 Build Your Graph – Add nodes and connect them with directed edges to form your own network.

⚡ Run PageRank – Adjust parameters like the damping factor and iterations, then watch the algorithm compute importance.

📊 Visualize Evolution – See rank scores update live as the algorithm converges.

🏆 Discover Influence – Identify which nodes become the true “hubs” of your network.

Perfect for students, developers, or curious minds exploring how information and influence flow through connected systems.

---

## Tech Stack

<p align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" width="35" height="35" alt="Java" /> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" width="35" height="35" alt="Spring Boot" /> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/maven/maven-original.svg" width="35" height="35" alt="Maven" /> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" width="35" height="35" alt="Docker" /> 
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="35" height="35" alt="React" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="35" height="35" alt="JavaScript" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="35" height="35" alt="CSS3" />
</p>

### Frontend
- **React** - UI framework
- **JavaScript/JSX** - Core logic and components
- **CSS** - Styling

### Backend
- **Java** - Core language
- **Spring Boot** - REST API framework
- **Maven** - Dependency management
- **Docker** - Containerization

---

## Project Structure

```
Page-Rank-Visualizer/
├─ PageRankVisualizerFrontend/    # React frontend
│  ├─ package.json                 # Node dependencies
│  ├─ src/                         # React components and logic
│  └─ public/                      # Static assets
│
├─ PageRankVisualizerBackend/      # Spring Boot backend
│  ├─ pom.xml                      # Maven dependencies
│  ├─ src/main/java/               # Java source code
│  │  ├─ controller/               # REST endpoints
│  │  └─ service/                  # PageRank algorithm logic
│  ├─ src/main/resources/          # Application config
│  └─ Dockerfile                   # Docker image definition
│
└─ README.md                       # You're here!
```

---

## How PageRank Works

### The Idea (Plain English)
Imagine the web as a giant graph where web pages are nodes and hyperlinks are edges. PageRank says: **a page is important if other important pages link to it**.

It's like voting, but votes from popular people count more. If CNN links to your blog, that matters more than if your friend's site does.

### The Math
PageRank is computed iteratively. For each node `v`, its rank at iteration `t+1` is:

```
PR(v) = (1 - d) / N  +  d * Σ [ PR(u) / L(u) ]
```

Where:
- `PR(v)` = PageRank score of node v
- `d` = damping factor (usually 0.85) — simulates a "random surfer" who sometimes jumps to a random page
- `N` = total number of nodes
- `Σ` = sum over all nodes `u` that link to `v`
- `L(u)` = number of outgoing links from node `u`

**Translation:** Your rank = (small random chance) + (sum of rank contributions from nodes pointing to you)

### Pseudocode
```
function PageRank(graph, damping=0.85, maxIter=100, tolerance=1e-6):
    N = number of nodes
    ranks = initialize all nodes to 1/N
    
    for iteration = 1 to maxIter:
        newRanks = {}
        
        for each node v:
            incomingSum = 0
            for each node u that links to v:
                incomingSum += ranks[u] / outDegree(u)
            
            newRanks[v] = (1 - damping) / N + damping * incomingSum
        
        if convergence(ranks, newRanks) < tolerance:
            break
        
        ranks = newRanks
    
    return ranks
```

### Implementation in This Project
The backend (`PageRankVisualizerBackend/src/main/java/.../service/`) implements this algorithm:
1. Accepts a graph structure (nodes and edges) via REST API
2. Initializes all node ranks to `1/N`
3. Iterates until convergence or max iterations reached
4. Returns final ranks and intermediate states for visualization
5. Frontend displays the graph and animates rank changes over iterations

The damping factor prevents "rank sinks" (nodes with no outlinks), and the random jump term ensures all nodes get at least some baseline rank.

---

## Getting Started

### Prerequisites
- **Node.js** (v14 or higher) and npm
- **Java** (JDK 11 or higher)
- **Maven** (v3.6+)
- **Docker** (optional, for containerized deployment)

### Clone the Repository
```bash
git clone https://github.com/anshul755/Page-Rank-Visualizer.git
cd Page-Rank-Visualizer
```

---

## Installation & Setup

### Backend Setup

1. Navigate to the backend folder:
```bash
cd PageRankVisualizerBackend
```

2. Install dependencies and build:
```bash
mvn clean install
```

3. Run the backend (development mode):
```bash
mvn spring-boot:run
```

The backend will start on **http://localhost:8080**

### Frontend Setup

1. Navigate to the frontend folder:
```bash
cd PageRankVisualizerFrontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the frontend (development mode):
```bash
npm run dev
```

The frontend will start on **http://localhost:3000** and automatically open in your browser.

---

## Environment Variables

### Backend (.env or application.properties)
Create `PageRankVisualizerBackend/src/main/resources/application.properties`:

```properties
# For Local
spring.data.mongodb.host=localhost
spring.data.mongodb.port=27017

# For MongoDB Atlas
spring.data.mongodb.uri={YOUR_MONGO_DB_ATLAS_URL}
spring.data.mongodb.database={YOUR_DATABASE_NAME}
spring.data.mongodb.auto-index-creation=true
```

### Frontend (.env)
Create `PageRankVisualizerFrontend/.env`:

```env
# For Hosted Backend API endpoint
VITE_PRODUCTION_URL={YOUR_API_URL}
```

---

## API Endpoints

### POST `/api/pagerank`
Compute PageRank for a given graph.

**Request Body:**
```json
{
  "nodes": ["A", "B", "C"],
  "edges": [["A", "B"], ["B", "C"], ["C", "A"]],
  "damping": 0.85,
  "maxIter": 100
}
```

**Response:**
```json
{
  "ranks": {
    "A": 0.333,
    "B": 0.333,
    "C": 0.333
  },
  "date": "2025-10-2T19:14:36.095"
}
```

## Running in Production
### Run Frontend in Production (Vercel - Deploy via Vercel GUI)
 
- Go to https://vercel.com → "Add New Project"
- Import your GitHub repo
- Set Root Directory to PageRankVisualizerFrontend
- Add env var:

- VITE_PRODUCTION_URL=https://<your-backend-domain>

### App will be live at:
- https://<YOUR_REPO_NAME>.vercel.app


### Docker Deployment (Backend)
```bash
cd PageRankVisualizerBackend
docker build -t pagerank-backend .
docker run -p 8080:8080 pagerank-backend
```

## Usage

1. Start both backend and frontend
2. Open http://localhost:3000 in your browser
3. Add nodes and edges to create your graph
4. Set damping factor and max iterations (or use defaults)
5. Click "Calculate PageRank"
6. Watch the visualization show rank propagation across iterations
7. Inspect final PageRank scores for each node

---

## Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/awesome-feature`)
3. Commit your changes (`git commit -m 'Add awesome feature'`)
4. Push to the branch (`git push origin feature/awesome-feature`)
5. Open a Pull Request

**Areas for improvement:**
- Enhance the user interface (UI) for a more intuitive and visually appealing user experience.
- Additional graph algorithms (HITS, betweenness centrality)
- Graph import/export (JSON, GraphML)
- Better visualization options (force-directed layout, animations)
- Performance optimizations for large graphs
- Unit and integration tests

---
## Acknowledgments

- PageRank algorithm by Larry Page and Sergey Brin (1998)
- Inspired by the need to understand how search engines rank pages
- Built for educational purposes and algorithm visualization

---

## Troubleshooting

**Backend won't start:**
- Check if port 8080 is already in use
- Verify Java version: `java -version` (should be 11+)
- Check Maven installation: `mvn -version`

**Frontend can't connect to backend:**
- Ensure backend is running on port 8080
- Check CORS settings in `application.properties`
- Verify `VITE_PRODUCTION_URL` in frontend `.env`

**PageRank results seem wrong:**
- Verify graph structure (no isolated nodes, edges are directed correctly)
- Check damping factor (should be between 0 and 1, typically 0.85)
- Increase max iterations if not converging

---