// Castle Defense Game (HTML5 Canvas)
// Uses online assets for monsters and base

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const infoDiv = document.getElementById('info');

// Asset URLs
const monsterImgUrl = 'https://opengameart.org/sites/default/files/ogre_idle.png';
const baseImgUrl = 'https://opengameart.org/sites/default/files/castle_0.png';

const monsterImg = new Image();
monsterImg.src = monsterImgUrl;
const baseImg = new Image();
baseImg.src = baseImgUrl;

let monsters = [];
let base = { x: 20, y: 120, width: 64, height: 64, hp: 10 };
let gameActive = false;
let spawnTimer = 0;
let score = 0;

function drawBase() {
    ctx.drawImage(baseImg, base.x, base.y, base.width, base.height);
}

function drawMonsters() {
    monsters.forEach(m => {
        ctx.drawImage(monsterImg, m.x, m.y, m.width, m.height);
    });
}

function spawnMonster() {
    monsters.push({
        x: canvas.width - 64,
        y: 40 + Math.random() * (canvas.height - 80 - 64),
        width: 48,
        height: 48,
        speed: 1 + Math.random() * 1.5,
        hp: 2
    });
}

function updateMonsters() {
    monsters.forEach(m => {
        m.x -= m.speed;
    });
    // Check collision with base
    monsters = monsters.filter(m => {
        if (m.x < base.x + base.width - 10) {
            base.hp--;
            return false;
        }
        return m.hp > 0;
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBase();
    drawMonsters();
}

function gameLoop() {
    if (!gameActive) return;
    updateMonsters();
    draw();
    spawnTimer--;
    if (spawnTimer <= 0) {
        spawnMonster();
        spawnTimer = 80 + Math.floor(Math.random() * 40);
    }
    infoDiv.textContent = `Base HP: ${base.hp} | Score: ${score}`;
    if (base.hp <= 0) {
        infoDiv.textContent = `Game Over! Score: ${score}`;
        gameActive = false;
        startBtn.disabled = false;
        return;
    }
    requestAnimationFrame(gameLoop);
}

canvas.addEventListener('click', function (e) {
    if (!gameActive) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    monsters.forEach(m => {
        if (
            mx >= m.x && mx <= m.x + m.width &&
            my >= m.y && my <= m.y + m.height
        ) {
            m.hp = 0;
            score++;
        }
    });
});

startBtn.onclick = function () {
    monsters = [];
    base.hp = 10;
    score = 0;
    spawnTimer = 40;
    gameActive = true;
    startBtn.disabled = true;
    infoDiv.textContent = 'Base HP: 10 | Score: 0';
    gameLoop();
};

// Draw initial state
baseImg.onload = monsterImg.onload = draw;
