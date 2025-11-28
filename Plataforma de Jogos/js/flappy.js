document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 600;

    const scoreDisplay = document.getElementById('score');
    const startBtn = document.getElementById('start');

    let player, pipes, score, gameSpeed, isGameOver, animationId, frames;
    
    function initGameVariables() {
        player = {
            x: 50,
            y: canvas.height / 2,
            radius: 15,
            velocity: 0,
            gravity: 0.5,
            jump: -10,
            color: '#00ff9d'
        };
        
        pipes = [];
        score = 0;
        gameSpeed = 3;
        isGameOver = false;
        frames = 0;
    }

    function createCodeEffect() {
        const container = document.querySelector('.game-container');
        const symbols = ['{}', '();', '=>', '</>', '=', '[]', '/*', '*/', '==', '!=='];
        
        document.querySelectorAll('.code-particle').forEach(el => el.remove());
        
        for (let i = 0; i < 30; i++) {
            const code = document.createElement('div');
            code.className = 'code-particle';
            code.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            code.style.left = `${Math.random() * 100}%`;
            code.style.top = `-${Math.random() * 100}px`;
            code.style.animationDuration = `${Math.random() * 10 + 5}s`;
            code.style.animationDelay = `${Math.random() * 2}s`;
            container.appendChild(code);
        }
    }

    function init() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        
        initGameVariables();
        scoreDisplay.textContent = `SCORE: ${score}`;
        startBtn.textContent = 'RESTART';
        startBtn.style.display = 'none';
        createCodeEffect();
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawInitialScreen();
        
        isGameOver = false;
    }

    function createPipe() {
        const gap = 150;
        const minHeight = 50;
        const maxHeight = canvas.height - gap - minHeight;
        const height = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
        
        pipes.push({
            x: canvas.width,
            width: 60,
            topHeight: height,
            bottomHeight: canvas.height - height - gap,
            gap,
            passed: false
        });
    }

    function drawPlayer() {
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
        ctx.fillStyle = player.color;
        ctx.fill();
        ctx.shadowBlur = 15;
        ctx.shadowColor = player.color;
        
        ctx.fillStyle = '#121212';
        ctx.font = 'bold 16px Courier New';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('<>', player.x, player.y);
    }

    function drawPipes() {
        pipes.forEach(pipe => {
            const gradientTop = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipe.width, 0);
            gradientTop.addColorStop(0, '#1a2a6c');
            gradientTop.addColorStop(0.5, '#b21f1f');
            gradientTop.addColorStop(1, '#fdbb2d');
            
            ctx.fillStyle = gradientTop;
            ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
            
            const gradientBottom = ctx.createLinearGradient(pipe.x, canvas.height - pipe.bottomHeight, pipe.x + pipe.width, canvas.height);
            gradientBottom.addColorStop(0, '#1a2a6c');
            gradientBottom.addColorStop(0.5, '#b21f1f');
            gradientBottom.addColorStop(1, '#fdbb2d');
            
            ctx.fillStyle = gradientBottom;
            ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, pipe.width, pipe.bottomHeight);
            
            ctx.strokeStyle = '#00a8ff';
            ctx.lineWidth = 2;
            ctx.strokeRect(pipe.x, 0, pipe.width, pipe.topHeight);
            ctx.strokeRect(pipe.x, canvas.height - pipe.bottomHeight, pipe.width, pipe.bottomHeight);
        });
    }

    function update() {
        player.velocity += player.gravity;
        player.y += player.velocity;
        
        if (frames % 100 === 0) {
            createPipe();
        }
        
        pipes.forEach(pipe => {
            pipe.x -= gameSpeed;
            
            if (
                player.x + player.radius > pipe.x && 
                player.x - player.radius < pipe.x + pipe.width && 
                (player.y - player.radius < pipe.topHeight || 
                 player.y + player.radius > canvas.height - pipe.bottomHeight)
            ) {
                gameOver();
            }
            
            if (!pipe.passed && player.x > pipe.x + pipe.width) {
                pipe.passed = true;
                score++;
                scoreDisplay.textContent = `SCORE: ${score}`;
                if (score % 5 === 0) gameSpeed += 0.5;
            }
        });
        
        while (pipes.length > 0 && pipes[0].x + pipes[0].width < 0) {
            pipes.shift();
        }
        
        if (player.y + player.radius > canvas.height || player.y - player.radius < 0) {
            gameOver();
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = 'rgba(0, 168, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        drawPipes();
        drawPlayer();
    }

    function drawInitialScreen() {
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00a8ff';
        ctx.font = 'bold 30px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('FLAPPY DEV', canvas.width / 2, canvas.height / 2 - 30);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Courier New';
        ctx.fillText('Clique ou pressione SPACE para jogar', canvas.width / 2, canvas.height / 2 + 20);
    }

    function gameLoop() {
        if (isGameOver) return;
        
        update();
        draw();
        frames++;
        
        animationId = requestAnimationFrame(gameLoop);
    }

    function gameOver() {
        isGameOver = true;
        cancelAnimationFrame(animationId);
        animationId = null;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ff5555';
        ctx.font = 'bold 30px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 30);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Courier New';
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
        
        startBtn.style.display = 'block';
    }

    function handleJump() {
        if (isGameOver) return;
        
        if (frames === 0 && pipes.length === 0) {
            gameLoop();
        }
        
        player.velocity = player.jump;
    }

    createCodeEffect();
    initGameVariables();
    drawInitialScreen();

    canvas.addEventListener('click', () => {
        handleJump();
        startBtn.style.display = 'none';
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            handleJump();
            startBtn.style.display = 'none';
            e.preventDefault();
        }
    });

    startBtn.addEventListener('click', () => {
        init();
        startBtn.style.display = 'none';
    });

    startBtn.style.display = 'none';
});