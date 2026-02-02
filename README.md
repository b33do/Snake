# Snake (with AI Solver)

This is a classic Snake game implemented using **HTML, CSS, and JavaScript**, with an optional AI solver that can play the game automatically.

The project focuses on grid-based movement, game state updates, and deterministic pathfinding rather than visual effects or external libraries.

---

## Features

- **Playable Snake Game**  
  Manual control using the keyboard.

- **Toggleable AI Mode**  
  The AI can be enabled or disabled at runtime.

- **Pathfinding-Based Solver**  
  The AI uses graph search on the grid to decide safe movement paths.

- **Persistent High Score**  
  The highest score is stored in `localStorage`.

- **Simple Retro UI**  
  Minimal terminal-style interface built with CSS.

- **Vanilla Web Stack**  
  No frameworks or external dependencies.

---

## AI Overview

The AI is deterministic and rule-based. It does **not** learn or use machine learning.

On every game tick, the AI evaluates the board and chooses the next move based on safety and reachability.

### Core Logic

1. **Path to Food (BFS)**  
   The grid is treated as a graph.  
   Breadth-First Search (BFS) is used to find the shortest path from the snake’s head to the food while treating the snake’s body as obstacles.

2. **Safety Check**  
   Before following the path, the AI simulates the move to ensure the snake will still have a valid escape route afterward.  
   This prevents the snake from entering dead ends.

3. **Fallback Strategy**  
   If no safe path to the food exists, the AI follows its own tail instead.  
   This keeps the snake alive while waiting for the board to open up.

This approach allows the snake to survive for long periods, though it can still fail in rare edge cases on very crowded boards.

---

## Controls

- **Arrow Keys** – Move the snake (Player Mode)
- **AI Toggle Button** – Switch between Player Mode and AI Mode
- **P** – Pause / resume the game

---

## Running the Project

No setup or build step is required.

1. Clone or download the repository
2. Open `index.html` in a modern browser
3. Play manually or enable the AI solver

---

## Notes

This project was built to practice:
- Grid-based collision handling
- Game loop timing
- Pathfinding on constrained graphs
- Safe-move simulation in real-time games
