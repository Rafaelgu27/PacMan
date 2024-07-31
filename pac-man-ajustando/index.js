// Criando o campo de tela do jogo
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let vidas = 5; // Número inicial de vidas
let pontuacao = 0;


function desenharVidas() {
    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Vidas: ' + vidas, 2000, 500); // Exibe o número de vidas no canto superior esquerdo
}



class Fantasma {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.image = new Image();
        this.image.src = "images/ghost.png"; // Caminho para a imagem do fantasma verde
        this.normalImage = this.image.src;
        this.blueImage = "images/fantasmaAzul.png"; // Caminho para a imagem do fantasma azul
        this.whiteImage = "images/fantasmaBranco.png"; // Caminho para a imagem do fantasma branco
        this.isFrightened = false;
        this.frightenedStartTime = 0;
        this.frightenedDuration = 10000; // Duração total do estado assustado em milissegundos
        this.blinkDuration = 2000; // Duração do piscamento em milissegundos
        this.piscarImediato = false; // Nova variável para controle de piscar imediato
        this.directions = [
            { x: 1, y: 0 },  // direita
            { x: -1, y: 0 }, // esquerda
            { x: 0, y: 1 },  // baixo
            { x: 0, y: -1 }  // cima
        ];
        this.currentDirection = this.directions[Math.floor(Math.random() * this.directions.length)];
        this.moveSpeed = 0; // Velocidade de movimento
    }

    move() {
        if (this.movendo) {
            const passo = this.velocidade * 30;
            const novoX = this.x + this.direcao.x * passo;
            const novoY = this.y + this.direcao.y * passo;
    
            if (this.isMovimentoValido(novoX, novoY)) {
                this.x = novoX;
                this.y = novoY;
                pacmanPosition.linha = Math.floor(this.y / 30);
                pacmanPosition.coluna = Math.floor(this.x / 30);
            } else {
                // Se encontrar uma barreira, parar o movimento
                this.movendo = false;
            }
        }
    }
    
    

    chooseNewDirection() {
        const possibleDirections = [
            this.currentDirection,
            { x: this.currentDirection.y, y: -this.currentDirection.x },  // direita
            { x: -this.currentDirection.y, y: this.currentDirection.x },  // esquerda
            { x: -this.currentDirection.x, y: -this.currentDirection.y }  // oposta
        ];

        for (let dir of possibleDirections) {
            const newX = this.x + dir.x * 30;
            const newY = this.y + dir.y * 30;
            const mapCol = Math.floor(newX / 30);
            const mapRow = Math.floor(newY / 30);

            if (map[mapRow] && map[mapRow][mapCol] != '-' && map[mapRow] && map[mapRow][mapCol] != '0') {
                this.currentDirection = dir;
                this.targetX = newX;
                this.targetY = newY;
                return;
            }
        }
    }

    draw() {
        const elapsedFrightenedTime = Date.now() - this.frightenedStartTime;
        const blinkInterval = 100; // Intervalo de piscar em milissegundos

        if (this.isFrightened) {
            if (elapsedFrightenedTime < this.blinkDuration && this.piscarImediato) {
                // Piscar imediatamente após ser assustado
                if (Math.floor(elapsedFrightenedTime / blinkInterval) % 2 === 0) {
                    this.image.src = this.whiteImage;
                } else {
                    this.image.src = this.blueImage;
                }
            } else if (elapsedFrightenedTime < this.frightenedDuration - this.blinkDuration) {
                // Após o piscar imediato, fica azul
                this.image.src = this.blueImage;
            } else {
                // Continuar piscando até o final da duração do estado assustado
                if (Math.floor(elapsedFrightenedTime / blinkInterval) % 2 === 0) {
                    this.image.src = this.whiteImage;
                } else {
                    this.image.src = this.blueImage;
                }
            }

            if (elapsedFrightenedTime > this.frightenedDuration) {
                this.isFrightened = false;
                this.image.src = this.normalImage;
            }
        } else {
            this.image.src = this.normalImage;
        }

        ctx.drawImage(this.image, this.x, this.y, 30, 30);
    }

    frightened() {
        this.isFrightened = true;
        this.piscarImediato = true; // Ativa o piscar imediato
        this.frightenedStartTime = Date.now();

        // Defina um temporizador para desativar o piscar imediato após a duração do piscar
        setTimeout(() => {
            this.piscarImediato = false;
        }, this.blinkDuration);
    }
}





// Classe Pacman
class Pacman {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.currentImageIndex = 0;
        this.pacmanImages = [];
        this.velocidade = 0.05; // Ajuste a velocidade
        this.movendo = false; // Para controlar se o Pac-Man está se movendo
        this.direcao = { x: 0, y: 0 }; // Direção de movimentação
        this.largura = 30; // Largura do Pac-Man
        this.altura = 30; // Altura do Pac-Man
        this.loadPacmanImages();
    }

    loadPacmanImages() {
        const pacmanImage1 = new Image();
        pacmanImage1.src = "images/pac0.png";

        const pacmanImage2 = new Image();
        pacmanImage2.src = "images/pac1.png";

        const pacmanImage3 = new Image();
        pacmanImage3.src = "images/pac2.png";

        const pacmanImage4 = new Image();
        pacmanImage4.src = "images/pac1.png";

        this.pacmanImages = [
            pacmanImage1,
            pacmanImage2,
            pacmanImage3,
            pacmanImage4
        ];
    }

    draw() {
        ctx.drawImage(this.pacmanImages[this.currentImageIndex], this.x, this.y, this.largura, this.altura);
    }

    updateImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.pacmanImages.length;
    }

    move() {
        if (this.movendo) {
            // Calcule a nova posição com base na direção e velocidade
            const passo = this.velocidade * 30;
            const novoX = this.x + this.direcao.x * passo;
            const novoY = this.y + this.direcao.y * passo;

            // Verifique se a nova posição é válida (não colide com barreiras)
            if (this.isMovimentoValido(novoX, novoY)) {
                this.x = novoX;
                this.y = novoY;
                pacmanPosition.linha = Math.floor(this.y / 30);
                pacmanPosition.coluna = Math.floor(this.x / 30);
            } else {
                // Se encontra uma barreira, parar o movimento
                this.movendo = false;
            }
        }
    }

    isMovimentoValido(novoX, novoY) {
        const largura = 30;
        const altura = 30;
        
        // Calcular a nova posição em termos de linha e coluna do mapa
        const novaColuna = Math.floor(novoX / largura);
        const novaLinha = Math.floor(novoY / altura);
        
        // Verificar se a nova posição está dentro dos limites do mapa
        if (map[novaLinha] && map[novaLinha][novaColuna]) {
            // Verificar se a nova posição é uma barreira
            if (map[novaLinha][novaColuna] === '-') {
                return false; // Não é um movimento válido
            }
        }
        
        return true; // É um movimento válido
    }
    
    
    
}





// Movimentação do Pac-Man
let pacmanPosition = { linha: 8, coluna: 10 }; // posição inicial do Pac-Man no mapa
let pacman = new Pacman(pacmanPosition.coluna * 30, pacmanPosition.linha * 30); // Instancia o Pac-Man na posição inicial


let currentDirection = null; // Direção atual do Pac-Man
let isMoving = false; // Controle de movimentação

window.addEventListener("keydown", function(event) {
    const tecla = event.keyCode;
    let novaDirecao = { x: 0, y: 0 };

    if (tecla === 39) { // movimentar direita
        novaDirecao = { x: 1, y: 0 };
    } else if (tecla === 37) { // movimentar esquerda
        novaDirecao = { x: -1, y: 0 };
    } else if (tecla === 38) { // movimentar cima
        novaDirecao = { x: 0, y: -1 };
    } else if (tecla === 40) { // movimentar baixo
        novaDirecao = { x: 0, y: 1 };
    }

    if (novaDirecao.x !== 0 || novaDirecao.y !== 0) {
        pacman.direcao = novaDirecao;
        pacman.movendo = true;
    }
});


// Função de atualização do Pac-Man
function atualizarPacman() {
    if (isMoving && pacman.direcao) {
        const passo = pacman.velocidade * 30;
        const novoX = pacman.x + pacman.direcao.x * passo;
        const novoY = pacman.y + pacman.direcao.y * passo;

        if (pacman.isMovimentoValido(novoX, novoY)) {
            pacman.x = novoX;
            pacman.y = novoY;
            pacmanPosition.linha = Math.floor(pacman.y / 30);
            pacmanPosition.coluna = Math.floor(pacman.x / 30);
        } else {
            // Se encontrar uma barreira, parar o movimento
            isMoving = false;
        }
    }
}






// Criando os limites
class Limite {
    static width = 30;
    static height = 30;

    constructor({ position }) {
        this.position = position;
        this.width = 30;
        this.height = 30;
    }

    draw() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

// Criando a classe Ponto
class Ponto {
    static normalRadius = 5;
    static largeRadius = 10;

    constructor({ position, isLarge = false }) {
        this.position = position;
        this.isLarge = isLarge;
        this.radius = isLarge ? Ponto.largeRadius : Ponto.normalRadius;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.position.x + 15, this.position.y + 15, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }
}

const map = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', ' ', ' ', '1', ' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', ' ', ' ', ' ', ' ', ' ', '1', ' ', ' ', '-'],
    ['-', '2', '-', '-', '-', ' ', '-', '-', '-', ' ', '-', ' ', '-', '-', '-', ' ', '-', '-', '-', ' ', '-'],
    ['-', ' ', '-', '-', '-', ' ', '-', '-', '-', ' ', '-', ' ', '-', '-', '-', ' ', '-', '-', '-', '2', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
    ['-', ' ', '-', '-', '-', ' ', '-', ' ', '-', '-', '-', '-', '-', ' ', '-', ' ', '-', '-', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', '-', ' ', ' ', ' ', '-', ' ', ' ', ' ', '-', ' ', ' ', ' ', ' ', ' ', '-'],
    ['-', '-', '-', '-', '-', ' ', '-', '-', '-', ' ', '-', ' ', '-', '-', '-', ' ', '-', '-', '-', '-', '-'],
    ['0', '0', '0', '0', '-', ' ', '-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', '-', '0', '0', '0', '0'],
    ['-', '-', '-', '-', '-', ' ', '-', ' ', '-', '-', '0', '-', '-', ' ', '-', ' ', '-', '-', '-', '-', '-'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-', '0', '0', '0', '-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['-', '-', '-', '-', '-', ' ', '-', ' ', '-', '0', '0', '0', '-', ' ', '-', ' ', '-', '-', '-', '-', '-'],
    ['0', '0', '0', '0', '-', ' ', '-', ' ', '-', '-', '-', '-', '-', ' ', '-', ' ', '-', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '-', ' ', '-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', '-', '0', '0', '0', '0'],
    ['-', '-', '-', '-', '-', ' ', ' ', ' ', '-', '-', '-', '-', '-', ' ', ' ', ' ', '-', '-', '-', '-', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
    ['-', ' ', '-', '-', '-', ' ', '-', '-', '-', ' ', '-', ' ', '-', '-', '-', ' ', '-', '-', '-', ' ', '-'],
    ['-', ' ', ' ', '2', '-', ' ', ' ', ' ', ' ', ' ', '-', ' ', ' ', ' ', ' ', ' ', '-', ' ', ' ', ' ', '-'],
    ['-', '-', ' ', ' ', '-', ' ', '-', ' ', '-', '-', '-', '-', '-', ' ', '-', ' ', '-', ' ', ' ', '-', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', '-', ' ', ' ', ' ', '-', ' ', ' ', ' ', '-', ' ', ' ', ' ', ' ', ' ', '-'],
    ['-', ' ', '-', '-', '-', '-', '-', '-', '-', ' ', '-', ' ', '-', '-', '-', '-', '-', '-', '-', '2', '-'],
    ['-', ' ', ' ', '1', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '1', ' ', ' ', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
];

const pacmanInitialPosition = { linha: 8, coluna: 10 };


// Criando a matriz de limites, pontos e fantasmas
let limites = [];
let pontos = [];
let fantasmas = [];

function desenharLimites() {
    for (let linha = 0; linha < map.length; linha++) {
        for (let coluna = 0; coluna < map[linha].length; coluna++) {
            if (map[linha][coluna] === '-') {
                const position = { x: coluna * 30, y: linha * 30 };
                const limite = new Limite({ position });
                limites.push(limite);
                limite.draw();
            }
        }
    }
}

function desenharPontos() {
    for (let ponto of pontos) {
        ponto.draw();
    }
}

function desenharFantasmas() {
    for (let fantasma of fantasmas) {
        fantasma.draw();
    }
}

// Função para verificar colisão entre o Pac-Man e os pontos
function verificarColisaoPacManPonto() {
    pontos = pontos.filter(ponto => {
        const raioPacMan = 15; // Raio do Pac-Man como círculo
        const raioPonto = ponto.radius; // Raio do ponto
        const centroPacMan = {
            x: pacman.x + raioPacMan,
            y: pacman.y + raioPacMan
        };
        const centroPonto = {
            x: ponto.position.x + ponto.radius,
            y: ponto.position.y + ponto.radius
        };

        // Calcula a distância entre os centros
        const distX = centroPacMan.x - centroPonto.x;
        const distY = centroPacMan.y - centroPonto.y;
        const distancia = Math.sqrt(distX * distX + distY * distY);

        // Verifica colisão com o ponto
        if (distancia <= raioPacMan + raioPonto) {
            if (ponto.isLarge) {
                pontuacao += 10; // Pontos grandes
                fantasmas.forEach(fantasma => fantasma.frightened());
            } else {
                pontuacao += 5; // Pontos pequenos
            }
            return false; // Remove o ponto comido
        }
        return true;
    });
}



function desenharPontuacao() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Pontuação: ' + pontuacao, 2000, 250); // Posiciona o texto no canto superior esquerdo
}


//função para animar o pac man e os fantasmas
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharLimites();
    desenharPontos();
    pacman.move();
    pacman.updateImage();
    pacman.draw();
    verificarColisaoPacManPonto();
    verificarColisaoPacManFantasma();
    fantasmas.forEach(fantasma => {
        fantasma.move();
        fantasma.draw();
    });
    desenharPontuacao(); // Desenha a pontuação na tela
    requestAnimationFrame(animate);
}



function verificarColisaoPacManFantasma() {
    fantasmas = fantasmas.filter(fantasma => {
        const distX = pacman.x - fantasma.x;
        const distY = pacman.y - fantasma.y;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance <= 15 + 15) { // Tamanho do Pac-Man + Fantasma
            if (fantasma.isFrightened) {
                pontuacao += 20; // Fantasmas comidos quando assustados
                return false; // Remove o fantasma comido
            } else {
                // Caso de perda de vida
                vidas--;
                if (vidas <= 0) {
                    alert("Game Over! Pontuação final: " + pontuacao);
                    window.location.reload(); // Reinicia a página
                } else {
                    pacmanPosition = { linha: 8, coluna: 10 };
                    pacman.x = pacmanPosition.coluna * 30;
                    pacman.y = pacmanPosition.linha * 30;
                }
            }
        }
        return true;
    });
}



// Inicialização do jogo
function iniciarJogo() {
    limites.length = 0;
    pontos.length = 0;
    fantasmas.length = 0;
    vidas = 5; // Reinicia as vidas

    map.forEach((row, linha) => {
        row.forEach((symbol, coluna) => {
            const position = { x: Limite.width * coluna, y: Limite.height * linha };
            if (symbol === '-') {
                const limite = new Limite({ position });
                limites.push(limite);
            } else if (symbol != '-' && symbol != '0') {
                const isLarge = symbol === '2';
                const ponto = new Ponto({ position, isLarge });
                pontos.push(ponto);
            }
            if (symbol === '1') {
                const fantasma = new Fantasma(position.x, position.y);
                fantasmas.push(fantasma);
            }
        });
    });

    desenharLimites();
    desenharPontos();
    desenharFantasmas();
    pacman.draw();
    desenharVidas(); // Adiciona a exibição das vidas
}




iniciarJogo();
animate();
