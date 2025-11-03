# Page Replacement Simulator (Operating Systems)

Interactive web app to visualize page replacement algorithms used in operating systems. Simulate and compare FIFO, LRU, Optimal, and Clock algorithms with step-by-step animations, statistics, and charts.

## Features

- Interactive simulation with play, pause, next, previous, and reset controls
- Supports algorithms: FIFO, LRU, Optimal, Clock
- Configurable memory frame count and reference string input
- Live visualization of memory frames and (for Clock) the pointer bit
- Step-by-step descriptions for each reference
- Statistics: total references, page faults, hits, hit ratio, fault ratio
- Comparison chart to evaluate algorithms on the same input

## Tech Stack

- Vite
- React + TypeScript
- Tailwind CSS + shadcn/ui
- Chart components and Canvas-based visualizations

## Getting Started

Prerequisites: Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

## How to Use

1. Choose an algorithm (FIFO, LRU, Optimal, Clock).
2. Enter a reference string (comma-separated integers, e.g., `7,0,1,2,0,3,0,4,...`).
3. Set the number of memory frames.
4. Click "Start Simulation".
5. Use controls to step through or autoplay the simulation and adjust speed.
6. Review statistics and the comparison chart to analyze performance.

## Project Structure (key files)

- `src/pages/Index.tsx`: Main page and simulation orchestration
- `src/utils/pageReplacementAlgorithms.ts`: FIFO, LRU, Optimal, Clock implementations
- `src/components/ControlPanel.tsx`: Inputs and simulation controls
- `src/components/MemoryFrame.tsx`: Memory frame visualization
- `src/components/StatisticsPanel.tsx`: Metrics display
- `src/components/SimulationChart.tsx` and `src/components/ComparisonChart.tsx`: Charts
- `src/types/pageReplacement.ts`: Types for steps and statistics

## Deployment

This is a static site built with Vite. Deploy the `dist` folder to any static host (e.g., GitHub Pages, Netlify, Vercel, or your own server).

```sh
npm run build
# then deploy the generated dist/ directory
```
