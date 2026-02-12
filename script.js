// Simple UNO game logic (single player vs deck)
const colors = ["red", "green", "blue", "yellow"];
const values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "Skip"];

let deck = [];
let playerHand = [];
let discardPile = [];

function createDeck() {
    let d = [];
    for (let color of colors) {
        for (let value of values) {
            d.push({ color, value });
            d.push({ color, value }); // 2 of each card
        }
    }
    return shuffle(d);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function drawCard(hand, n = 1) {
    for (let i = 0; i < n; i++) {
        if (deck.length === 0) deck = createDeck();
        hand.push(deck.pop());
    }
}

function canPlay(card, topCard) {
    return card.color === topCard.color || card.value === topCard.value;
}

function renderHand() {
    const handDiv = document.getElementById("player-hand");
    handDiv.innerHTML = "";
    playerHand.forEach((card, idx) => {
        const cardDiv = document.createElement("div");
        cardDiv.className = `card ${card.color}`;
        cardDiv.textContent = card.value;
        cardDiv.onclick = () => playCard(idx);
        handDiv.appendChild(cardDiv);
    });
}

function renderDiscard() {
    const discardDiv = document.getElementById("discard-pile");
    const top = discardPile[discardPile.length - 1];
    if (top) {
        discardDiv.innerHTML = `<div class='card ${top.color}'>${top.value}</div>`;
    } else {
        discardDiv.innerHTML = "";
    }
}

function setMessage(msg) {
    document.getElementById("game-message").textContent = msg;
}

function playCard(idx) {
    const card = playerHand[idx];
    const top = discardPile[discardPile.length - 1];
    if (canPlay(card, top)) {
        discardPile.push(card);
        playerHand.splice(idx, 1);
        renderHand();
        renderDiscard();
        setMessage("Card played!");
        if (playerHand.length === 0) {
            setMessage("You win! 🎉");
            document.getElementById("draw-btn").disabled = true;
        }
    } else {
        setMessage("You can't play that card.");
    }
}

function drawCardHandler() {
    drawCard(playerHand, 1);
    renderHand();
    setMessage("Card drawn.");
}

function startGame() {
    deck = createDeck();
    playerHand = [];
    discardPile = [];
    drawCard(playerHand, 7);
    discardPile.push(deck.pop());
    renderHand();
    renderDiscard();
    setMessage("Game started. Play a card!");
    document.getElementById("draw-btn").disabled = false;
}

document.getElementById("draw-btn").onclick = drawCardHandler;
window.onload = startGame;
