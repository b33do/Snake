# Snake
A retro-style snake game in JavaScript featuring a powerful pathfinding AI that rarely loses.

JavaScript AI Snake Game 🐍
This isn't your average Snake game. Built with pure HTML, CSS, and JavaScript, this project features a highly effective AI opponent that uses a pathfinding algorithm to navigate the board. You can play yourself or toggle the AI on to watch it chase a high score.

✨ Features
Advanced Pathfinding AI: The AI uses a Breadth-First Search (BFS) algorithm to find the shortest, safest path to the food, making it extremely difficult to beat.

Dual Mode Gameplay: Seamlessly switch between manual player control and the automated AI mode with the click of a button.

Persistent High Score: Your highest score is saved in the browser's local storage, so you can always come back and try to beat it.

Retro Aesthetics: A clean, retro-inspired UI designed with a classic terminal feel.

Pure JavaScript: No frameworks or libraries needed—just vanilla JS, HTML, and CSS.

🧠 A Note on the AI
The AI's logic is the core of this project. It doesn't just move toward the food. On every tick, it:

Calculates the shortest path to the food using Breadth-First Search (BFS).

Before committing to a path, it runs a simulation to ensure that path won't trap the snake later on (the isPathTrulySafe check).

If no safe path to the food exists, it follows its tail (findSafePath) to buy time and avoid crashing.

This makes the AI very resilient, though it can still be trapped in rare, complex scenarios.

🚀 How to Run
No installation is needed! Since this is a pure web project, you can run it by following these simple steps:

Clone this repository to your computer:

Bash

git clone https://github.com/b33do/Snake
Navigate into the new folder.

Open the index.html file in your favorite web browser.

That's it! The game will be running locally in your browser.

🎮 Controls
AI Toggle Button: Switch between Player Mode and AI Mode.

Arrow Keys: Control the snake's direction (only in Player Mode).

'P' Key: Pause and unpause the game.
