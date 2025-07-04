const symbols = ['♥', '♦', '♠', '♣', '🌳', '⚽'];
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matches = 0;
let score = 0;
let time = 0;
let timerInterval;

const gameBoard = document.getElementById('game-board');
const timeEl = document.getElementById('time');
const movesEl = document.getElementById('moves');
const scoreEl = document.getElementById('score');
const restartBtn = document.getElementById('restart');

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function createBoard() {
  const doubledSymbols = [...symbols, ...symbols];
  const shuffledSymbols = shuffle(doubledSymbols);
  gameBoard.innerHTML = '';
  shuffledSymbols.forEach(symbol => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back">${symbol}</div>
      </div>
    `;
    card.dataset.symbol = symbol;
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
  });
  cards = document.querySelectorAll('.card');
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flipped');

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;
  moves++;
  movesEl.textContent = moves;

  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;
  if (isMatch) {
    disableCards();
    matches++;
    score += 10;
    scoreEl.textContent = score;
    if (matches === symbols.length) {
      clearInterval(timerInterval);
      showWinMessage();
    }
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function startTimer() {
  time = 0;
  timeEl.textContent = time;
  timerInterval = setInterval(() => {
    time++;
    timeEl.textContent = time;
  }, 1000);
}

function resetGame() {
  clearInterval(timerInterval);
  [moves, matches, score] = [0, 0, 0];
  movesEl.textContent = moves;
  scoreEl.textContent = score;
  document.querySelectorAll('.win-message, .confetti').forEach(el => el.remove());
  createBoard();
  startTimer();
}

restartBtn.addEventListener('click', resetGame);

window.addEventListener('DOMContentLoaded', () => {
  createBoard();
  startTimer();
});

// 🎉 You Won + Confetti
function showWinMessage() {
  const message = document.createElement('div');
  message.className = 'win-message';
  message.textContent = "🎉 You Won! 🎉";
  document.body.appendChild(message);

  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.background = `hsl(${Math.random() * 360}, 100%, 60%)`;
    confetti.style.animationDuration = `${2 + Math.random()}s`;
    document.body.appendChild(confetti);
  }

  setTimeout(() => {
    document.querySelectorAll('.confetti').forEach(c => c.remove());
  }, 4000);
}













