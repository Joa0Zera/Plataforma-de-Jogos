document.addEventListener('DOMContentLoaded', () => {
    const words = [
        { word: 'COMPUTADOR', hint: 'Máquina que processa informações' },
        { word: 'PROGRAMA', hint: 'Conjunto de instruções para computador' },
        { word: 'ALGORITMO', hint: 'Sequência lógica para resolver problemas' },
        { word: 'INTERNET', hint: 'Rede mundial de computadores' },
        { word: 'BANCO', hint: 'Instituição financeira' }
    ];
    
    const scrambledWord = document.getElementById('scrambled-word');
    const selectedLetters = document.getElementById('selected-letters');
    const hint = document.getElementById('hint');
    const message = document.getElementById('message');
    const checkBtn = document.getElementById('check');
    const newWordBtn = document.getElementById('new-word');
    const lettersContainer = document.createElement('div');
    lettersContainer.className = 'letter-buttons';
    document.querySelector('.game-container').insertBefore(lettersContainer, hint);
    
    let currentWord = '';
    let scrambledLetters = [];
    let selectedIndices = [];
    
    function initGame() {
        // Select random word
        const randomWord = words[Math.floor(Math.random() * words.length)];
        currentWord = randomWord.word;
        hint.textContent = `Dica: ${randomWord.hint}`;
        message.textContent = '';
        
        // Scramble letters
        scrambledLetters = currentWord.split('').sort(() => Math.random() - 0.5);
        selectedIndices = [];
        selectedLetters.textContent = '';
        
        // Create letter buttons
        lettersContainer.innerHTML = '';
        scrambledLetters.forEach((letter, index) => {
            const btn = document.createElement('div');
            btn.textContent = letter;
            btn.className = 'letter-btn';
            btn.dataset.index = index;
            btn.addEventListener('click', () => selectLetter(index));
            lettersContainer.appendChild(btn);
        });
    }
    
    function selectLetter(index) {
        if (selectedIndices.includes(index)) return;
        
        selectedIndices.push(index);
        updateSelectedLetters();
    }
    
    function updateSelectedLetters() {
        selectedLetters.textContent = selectedIndices
            .map(i => scrambledLetters[i])
            .join(' ');
    }
    
    function checkAnswer() {
        const answer = selectedIndices.map(i => scrambledLetters[i]).join('');
        
        if (answer === currentWord) {
            message.textContent = 'Correto! Parabéns!';
            message.style.color = 'green';
        } else {
            message.textContent = 'Incorreto. Tente novamente!';
            message.style.color = 'red';
        }
    }
    
    checkBtn.addEventListener('click', checkAnswer);
    newWordBtn.addEventListener('click', initGame);
    
    initGame();
});