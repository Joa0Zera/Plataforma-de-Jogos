document.addEventListener('DOMContentLoaded', () => {
    const palavras = [
        { palavra: 'VETOR', dica: 'Estrutura de dados similar a uma lista' },
        { palavra: 'PYTHON', dica: 'Linguagem conhecida por sua simplicidade e legibilidade' },
        { palavra: 'FUNCAO', dica: 'Bloco de código que executa uma tarefa específica' },
        { palavra: 'LOOP', dica: 'Estrutura que repete ações enquanto uma condição for verdadeira' },
        { palavra: 'REACT', dica: 'Biblioteca JavaScript para construir interfaces de usuário' },
        { palavra: 'GIT', dica: 'Sistema de controle de versão amplamente utilizado' },
        { palavra: 'JAVA', dica: 'Linguagem orientada a objetos com o lema "Write Once, Run Anywhere"' },
        { palavra: 'SQL', dica: 'Linguagem para gerenciar bancos de dados relacionais' },
        { palavra: 'DEBUG', dica: 'Processo de encontrar e corrigir erros no código' },
        { palavra: 'CLASSE', dica: 'Molde para criação de objetos na programação orientada a objetos' },
        { palavra: 'OBJETO', dica: 'Estrutura que contém propriedades e métodos na programação orientada a objetos' },
        { palavra: 'API', dica: 'Conjunto de protocolos para construção de aplicativos de software' },
        { palavra: 'JSON', dica: 'Formato leve de troca de dados baseado em texto e fácil de ler' },
        { palavra: 'NODE', dica: 'Ambiente de execução JavaScript que permite rodar código no servidor' },
        { palavra: 'HOOK', dica: 'Função especial que permite "conectar-se" a recursos do React' },
        { palavra: 'STACK', dica: 'Conjunto de tecnologias usadas no desenvolvimento de um projeto' },
        { palavra: 'ROBOT', dica: 'Framework de teste automatizado para aplicações web' },
        { palavra: 'CLOUD', dica: 'Computação em nuvem, onde dados são armazenados remotamente' },
        { palavra: 'MERGE', dica: 'Ação de combinar alterações de diferentes branches no Git' },
        { palavra: 'QUERY', dica: 'Solicitação de dados a um banco de dados ou API' }
        ];
    

    const forca = document.getElementById('hangman');
    const displayPalavra = document.getElementById('word-display');
    const teclado = document.getElementById('keyboard');
    const mensagem = document.getElementById('message');
    const botaoReset = document.getElementById('reset');
    
    // Criando elemento de dica
    const dicaElement = document.createElement('p');
    dicaElement.id = 'dica';
    document.querySelector('.game-container').insertBefore(dicaElement, forca);
    
    let palavraSelecionada = '';
    let dicaAtual = '';
    let letrasAdivinhadas = [];
    let erros = 0;
    const maxErros = 6;
    
    const estagiosForca = [
        `
          +---+
          |   |
              |
              |
              |
              |
        =========
        `,
        `
          +---+
          |   |
          O   |
              |
              |
              |
        =========
        `,
        `
          +---+
          |   |
          O   |
          |   |
              |
              |
        =========
        `,
        `
          +---+
          |   |
          O   |
         /|   |
              |
              |
        =========
        `,
        `
          +---+
          |   |
          O   |
         /|\\  |
              |
              |
        =========
        `,
        `
          +---+
          |   |
          O   |
         /|\\  |
         /    |
              |
        =========
        `,
        `
          +---+
          |   |
          O   |
         /|\\  |
         / \\  |
              |
        =========
        `
    ];
    
    function iniciarJogo() {
        const palavraObj = palavras[Math.floor(Math.random() * palavras.length)];
        palavraSelecionada = palavraObj.palavra;
        dicaAtual = palavraObj.dica;
        letrasAdivinhadas = [];
        erros = 0;
        
        atualizarForca();
        atualizarDisplayPalavra();
        criarTeclado();
        mensagem.textContent = '';
        dicaElement.textContent = `Dica: ${dicaAtual}`;
    }
    
    function atualizarForca() {
        forca.textContent = estagiosForca[erros];
    }
    
    function atualizarDisplayPalavra() {
        displayPalavra.textContent = palavraSelecionada
            .split('')
            .map(letra => letrasAdivinhadas.includes(letra) ? letra : '_')
            .join(' ');
        
        if (!displayPalavra.textContent.includes('_')) {
            mensagem.textContent = 'Você ganhou! Parabéns!';
            desativarTeclado();
        }
    }
    
    function criarTeclado() {
        teclado.innerHTML = '';
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letra => {
            const tecla = document.createElement('button');
            tecla.textContent = letra;
            tecla.classList.add('tecla');
            tecla.addEventListener('click', () => tratarPalpite(letra));
            teclado.appendChild(tecla);
        });
    }
    
    function tratarPalpite(letra) {
        if (letrasAdivinhadas.includes(letra)) return;
        
        letrasAdivinhadas.push(letra);
        document.querySelectorAll('.tecla').forEach(tecla => {
            if (tecla.textContent === letra) {
                tecla.classList.add('usada');
                tecla.disabled = true;
            }
        });
        
        if (!palavraSelecionada.includes(letra)) {
            erros++;
            atualizarForca();
            
            if (erros >= maxErros) {
                mensagem.textContent = `Fim de jogo! A palavra era: ${palavraSelecionada}`;
                desativarTeclado();
            }
        }
        
        atualizarDisplayPalavra();
    }
    
    function desativarTeclado() {
        document.querySelectorAll('.tecla').forEach(tecla => {
            tecla.classList.add('usada');
            tecla.disabled = true;
        });
    }
    
    botaoReset.addEventListener('click', iniciarJogo);
    
    iniciarJogo();
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