const cells = Array.from(document.querySelectorAll('.cell'));
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('reset');

let board = Array(9).fill(null);
let currentPlayer = 'X';
let running = true;

const wins = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function updateStatus(text){
  statusEl.textContent = text;
}

function handleMove(index){
  if(!running || board[index]) return;
  board[index] = currentPlayer;
  const el = cells[index];
  el.textContent = currentPlayer;
  el.setAttribute('aria-disabled','true');
  checkGameState();
  if(running){
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus(`Player ${currentPlayer}'s turn`);
  }
}

function checkGameState(){
  for(const [a,b,c] of wins){
    if(board[a] && board[a] === board[b] && board[a] === board[c]){
      // winner
      highlightWinner([a,b,c]);
      updateStatus(`Player ${board[a]} wins!`);
      running = false;
      return;
    }
  }
  if(board.every(Boolean)){
    updateStatus("It's a draw!");
    running = false;
  }
}

function highlightWinner(indices){
  indices.forEach(i => cells[i].classList.add('winner'));
}

function resetGame(){
  board.fill(null);
  cells.forEach(c => { c.textContent = ''; c.classList.remove('winner'); c.removeAttribute('aria-disabled'); });
  currentPlayer = 'X';
  running = true;
  updateStatus(`Player ${currentPlayer}'s turn`);
}

// Attach event listeners
cells.forEach((cell, idx) => {
  cell.addEventListener('click', () => handleMove(idx));
  cell.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      handleMove(idx);
    }
  });
});

resetBtn.addEventListener('click', resetGame);

// Expose reset to global for debugging (optional)
window.__ticTacToe = { reset: resetGame };
