document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('jogo');
    const currentPlayerDisplay = document.getElementById('currentPlayer');
    const resultDisplay = document.getElementById('resposta');
    const xScoreDisplay = document.getElementById('xis');
    const oScoreDisplay = document.getElementById('bola');
    const tieScoreDisplay = document.getElementById('velha');
    const newGameBtn = document.getElementById('btnNovo');
    
    let board = Array(9).fill(null);
    let currentPlayer = 'X';
    let gameActive = true;
    let scores = { X: 0, O: 0, ties: 0 };
    
    const playerColors = {
        X: { primary: '#4cc9f0', secondary: '#1e88e5' },
        O: { primary: '#f72585', secondary: '#d81b60' }
    };
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    function playSound(frequency, type = 'sine', duration = 0.2) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        gainNode.gain.exponentialRampToValueAtTime(
            0.0001, 
            audioContext.currentTime + duration
        );
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
    }
    
    function initGame() {
        createBoard();
        updateCurrentPlayerDisplay();
        resultDisplay.textContent = 'ESCOLHA UMA CASA PARA COMEÇAR';
        resultDisplay.style.color = '#e6e6e6';
    }
    
    function createBoard() {
        gameBoard.innerHTML = '';
        
        board.forEach((cell, index) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('casa');
            cellElement.dataset.index = index;
            
            if (cell) {
                const img = document.createElement('img');
                img.src = cell === 'X' ? 'images/codigo.png' : 'images/bug.png';
                img.alt = cell;
                cellElement.appendChild(img);
                
                cellElement.classList.add('filled');
            }
            
            cellElement.addEventListener('click', () => handleCellClick(index));
            gameBoard.appendChild(cellElement);
        });
    }
    
    function updateCurrentPlayerDisplay() {
        const playerText = currentPlayer === 'X' ? 'PROGRAMADOR' : 'BUG';
        currentPlayerDisplay.textContent = `VEZ DO: ${playerText}`;
        currentPlayerDisplay.style.color = playerColors[currentPlayer].primary;
        currentPlayerDisplay.style.borderColor = playerColors[currentPlayer].primary;
        currentPlayerDisplay.style.boxShadow = `0 0 15px ${playerColors[currentPlayer].primary}40`;
    }
    
    function handleCellClick(index) {
        if (!gameActive || board[index] !== null) return;
        
        board[index] = currentPlayer;
        
        playSound(currentPlayer === 'X' ? 440 : 523.25);
        
        createBoard();
        
        const result = checkResult();
        
        if (result) {
            handleGameResult(result);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateCurrentPlayerDisplay();
        }
    }
    
    function checkResult() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], 
            [0, 3, 6], [1, 4, 7], [2, 5, 8], 
            [0, 4, 8], [2, 4, 6]             
        ];
        
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                highlightWinningCells(pattern);
                return board[a]; 
            }
        }
        
        if (!board.includes(null)) {
            return 'tie';
        }
        
        return null;
    }
    
    function highlightWinningCells(cells) {
        cells.forEach(index => {
            const cell = document.querySelector(`.casa[data-index="${index}"]`);
            cell.classList.add('winning-cell');
            cell.style.boxShadow = `0 0 20px ${playerColors[currentPlayer].primary}`;
        });
    }
    
    function handleGameResult(result) {
        gameActive = false;
        
        if (result === 'tie') {
            resultDisplay.textContent = 'EMPATE! NINGUÉM GANHOU';
            resultDisplay.style.color = '#e6e6e6';
            scores.ties++;
            tieScoreDisplay.textContent = scores.ties;
            playSound(329.63, 'square');
        } else {
            const winner = result === 'X' ? 'PROGRAMADOR' : 'BUG';
            resultDisplay.textContent = `${winner} VENCEU!`;
            resultDisplay.style.color = playerColors[result].primary;
            
            scores[result]++;
            if (result === 'X') {
                xScoreDisplay.textContent = scores.X;
            } else {
                oScoreDisplay.textContent = scores.O;
            }
            
            playSound(783.99, 'sine', 0.5);
            createConfettiEffect(result);
        }
    }
    
    function createConfettiEffect(winner) {
        const color = winner === 'X' ? playerColors.X.primary : playerColors.O.primary;
        const container = document.querySelector('.game-container');
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '8px';
            confetti.style.height = '8px';
            confetti.style.backgroundColor = color;
            confetti.style.borderRadius = '50%';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.bottom = '0';
            confetti.style.opacity = '0.8';
            confetti.style.zIndex = '10';
            confetti.style.animation = `confetti ${Math.random() * 2 + 1}s linear forwards`;
            
            container.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 1000 * (Math.random() * 2 + 1));
        }
    }
    
    function resetGame() {
        board = Array(9).fill(null);
        currentPlayer = 'X';
        gameActive = true;
        
        document.querySelectorAll('.casa').forEach(cell => {
            cell.classList.remove('winning-cell');
            cell.style.boxShadow = '';
        });
        
        document.querySelectorAll('.game-container div[style*="confetti"]').forEach(el => el.remove());
        
        createBoard();
        updateCurrentPlayerDisplay();
        resultDisplay.textContent = 'ESCOLHA UMA CASA PARA COMEÇAR';
        resultDisplay.style.color = '#e6e6e6';
        
        playSound(587.33, 'triangle');
    }
    
    newGameBtn.addEventListener('click', resetGame);
    
    initGame();
});

const avatarMap = {
    frontend: 'images/dev_frontend.png',
    backend: 'images/dev_backend.png',
    fullstack: 'images/dev_fullstack.png',
    cyber: 'images/dev_cyber.png'
};

const savedCharacter = localStorage.getItem('selectedCharacter');
const avatarImg = document.getElementById('avatarDisplay');

if (savedCharacter && avatarMap[savedCharacter] && avatarImg) {
    avatarImg.src = avatarMap[savedCharacter];
    avatarImg.alt = savedCharacter + ' Dev';
}