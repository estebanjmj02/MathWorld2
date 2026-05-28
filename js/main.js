import { characters, getCharacter } from "./characters.js";
import { worlds, getWorld } from "./worlds.js";
import { createChallenges } from "./levels.js";
import { createInitialState, awardWorld } from "./progress.js";
import { loadSave, saveGame, clearSave } from "./storage.js";
import { setupAudio, startMusic, toggleMusic, playClick, playSuccess, playTryAgain } from "./audio.js";
import { initThreeScene } from "./three-scene.js";
import { launchConfetti } from "./rewards.js";

const screens = {
  home: document.querySelector("#screen-home"),
  character: document.querySelector("#screen-character"),
  map: document.querySelector("#screen-map"),
  game: document.querySelector("#screen-game"),
  reward: document.querySelector("#screen-reward")
};

let state = loadSave() || createInitialState();
let currentWorld = worlds[0];
let challenges = [];
let challengeIndex = 0;
let roundScore = 0;

setupAudio();
initParticles();
initThreeScene(document.querySelector("#three-canvas"));
renderCharacters();
bindGlobalEvents();

if (state.player.firstName) {
  showScreen("map");
  renderMap();
}

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("screen-active"));
  screens[name].classList.add("screen-active");
  if (window.gsap) gsap.from(screens[name], { opacity: 0, y: 16, duration: .45, ease: "power2.out" });
}

function bindGlobalEvents() {
  document.querySelector("#player-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    state.player = {
      firstName: form.get("firstName").trim(),
      lastName: form.get("lastName").trim(),
      age: Number(form.get("age"))
    };
    saveGame(state);
    startMusic();
    playClick();
    showScreen("character");
  });

  document.querySelector("#music-toggle").addEventListener("click", () => {
    const on = toggleMusic();
    document.querySelector("#music-toggle").textContent = on ? "♪" : "×";
  });

  document.querySelector("#reset-progress").addEventListener("click", () => {
    clearSave();
    state = createInitialState();
    location.reload();
  });

  document.querySelector("#back-map").addEventListener("click", () => {
    playClick();
    showScreen("map");
    renderMap();
  });

  document.querySelector("#continue-map").addEventListener("click", () => {
    playClick();
    showScreen("map");
    renderMap();
  });
}

function renderCharacters() {
  const grid = document.querySelector("#characters-grid");
  grid.innerHTML = characters.map((character) => `
    <button class="character-card" type="button" data-character="${character.id}">
      <div class="avatar" style="background:${character.color}">${character.emoji}</div>
      <h3>${character.name}</h3>
      <p>${character.role}</p>
      <p>${character.personality}</p>
      <span class="quote">"${character.phrase}"</span>
    </button>
  `).join("");

  grid.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.characterId = button.dataset.character;
      saveGame(state);
      playSuccess();
      showScreen("map");
      renderMap();
    });
  });
}

function renderMap() {
  const guide = getCharacter(state.characterId);
  document.querySelector("#welcome-line").textContent = `Hola, ${state.player.firstName} ${state.player.lastName}`;
  document.querySelector("#active-guide").textContent = `Guía: ${guide.name} ${guide.emoji}`;
  document.querySelector("#points-pill").textContent = `${state.points} puntos`;
  document.querySelector("#stars-pill").textContent = `${state.stars} estrellas`;
  document.querySelector("#level-pill").textContent = `Nivel ${state.level}`;
  document.querySelector("#xp-label").textContent = `${state.xp} / ${state.level * 100}`;
  document.querySelector("#xp-bar").style.width = `${Math.min(100, (state.xp / (state.level * 100)) * 100)}%`;

  const grid = document.querySelector("#worlds-grid");
  grid.innerHTML = worlds.map((world) => {
    const locked = !state.unlockedWorlds.includes(world.id);
    const done = state.completedWorlds.includes(world.id);
    return `
      <button class="world-card ${locked ? "locked" : ""}" type="button" data-world="${world.id}" ${locked ? "disabled" : ""} style="background:linear-gradient(135deg, ${world.color}33, rgba(255,255,255,.86))">
        <div class="world-icon">${world.icon}</div>
        <h3>${world.title}</h3>
        <p>${world.objective}</p>
        <span class="tag">${done ? "Completado" : locked ? "Bloqueado" : "Disponible"}</span>
      </button>
    `;
  }).join("");

  grid.querySelectorAll("button:not(:disabled)").forEach((button) => {
    button.addEventListener("click", () => startWorld(button.dataset.world));
  });
}

function startWorld(worldId) {
  currentWorld = getWorld(worldId);
  challenges = createChallenges(worldId, state.player.age);
  challengeIndex = 0;
  roundScore = 0;
  showScreen("game");
  renderChallenge();
}

function renderChallenge() {
  const challenge = challenges[challengeIndex];
  const guide = getCharacter(state.characterId);
  document.querySelector("#game-world").textContent = currentWorld.title;
  document.querySelector("#game-title").textContent = challenge.title;
  document.querySelector("#challenge-count").textContent = `${challengeIndex + 1} / ${challenges.length}`;
  document.querySelector("#game-score").textContent = `${roundScore} pts`;
  document.querySelector("#coach-avatar").textContent = guide.emoji;
  document.querySelector("#instruction-text").textContent = `${challenge.instruction} ${guide.phrase}`;
  document.querySelector("#hint-list").innerHTML = `
    <li>Mira los objetos con calma antes de responder.</li>
    <li>Puedes intentar de nuevo sin perder puntos.</li>
    <li>Busca patrones: repetir, sumar o juntar.</li>
  `;
  document.querySelector("#medal-slot").textContent = currentWorld.icon;

  const area = document.querySelector("#activity-area");
  area.innerHTML = `<article class="activity-card"></article>`;
  const card = area.querySelector(".activity-card");

  if (challenge.type === "give-items") {
    renderGiveItemsChallenge(card, challenge);
  } else {
    renderChoiceChallenge(card, challenge);
  }
}

function renderGiveItemsChallenge(card, challenge) {
  card.innerHTML = `
    <div class="give-game">
      <div class="request-character" aria-label="Personaje que pide objetos">
        <div class="big-helper">${challenge.helper}</div>
        <strong>Dame ${challenge.answer}</strong>
      </div>
      <div class="drop-basket" data-count="0">
        <span class="basket-count">0 / ${challenge.answer}</span>
        <div class="basket-items"></div>
      </div>
    </div>
    <div class="item-bank">
      ${Array.from({ length: challenge.available }, (_, index) => `<button class="object-token" draggable="true" type="button" data-id="${index}">${challenge.object}</button>`).join("")}
    </div>
    <p class="feedback" role="status">Arrastra o toca los objetos para entregarlos.</p>
  `;

  const basket = card.querySelector(".drop-basket");
  const basketItems = card.querySelector(".basket-items");
  const countLabel = card.querySelector(".basket-count");
  const feedback = card.querySelector(".feedback");
  let count = 0;

  card.querySelectorAll(".object-token").forEach((token) => {
    token.addEventListener("dragstart", (event) => event.dataTransfer.setData("text/plain", token.dataset.id));
    token.addEventListener("click", () => addToken(token));
  });

  basket.addEventListener("dragover", (event) => event.preventDefault());
  basket.addEventListener("drop", (event) => {
    event.preventDefault();
    const token = card.querySelector(`.object-token[data-id="${event.dataTransfer.getData("text/plain")}"]`);
    if (token) addToken(token);
  });

  function addToken(token) {
    if (token.disabled || count >= challenge.answer) return;
    token.disabled = true;
    token.style.opacity = ".35";
    count += 1;
    basketItems.insertAdjacentHTML("beforeend", `<span>${challenge.object}</span>`);
    countLabel.textContent = `${count} / ${challenge.answer}`;

    if (count === challenge.answer) {
      basket.classList.add("complete");
      feedback.textContent = "¡Cantidad exacta!";
      nextChallenge();
    } else {
      playClick();
    }
  }
}

function renderChoiceChallenge(card, challenge) {
  if (challenge.type === "number-sequence") {
    card.innerHTML += `
      <div class="sequence-board">
        ${challenge.sequence.map((value, index) => `<span>${index === challenge.missingIndex ? "__" : value}</span>`).join("")}
      </div>
    `;
  } else if (challenge.type === "store-sum") {
    card.innerHTML += `
      <div class="store-shelf">
        ${challenge.products.map((product) => `
          <div class="product-card">
            <div class="product-emoji">${product.emoji}</div>
            <strong>${product.name}</strong>
            <span>${product.price} monedas</span>
          </div>
        `).join("")}
      </div>
    `;
  } else if (challenge.type === "word-problem") {
    card.innerHTML += `
      <div class="story-problem">
        <div class="story-visual">${challenge.visual}</div>
        <div class="story-visual secondary">${challenge.secondVisual}</div>
      </div>
    `;
  } else if (challenge.type === "visual-sequence") {
    card.innerHTML += `
      <div class="sequence-board visual">
        ${challenge.sequence.map((value) => `<span>${value}</span>`).join("")}
        <span>__</span>
      </div>
    `;
  }

  card.innerHTML += `<div class="option-grid"></div><p class="feedback" role="status"></p>`;
  const grid = card.querySelector(".option-grid");
  grid.innerHTML = challenge.options.map((option) => `
    <button class="answer-option" type="button" data-value="${option}">${option}</button>
  `).join("");

  grid.querySelectorAll("button").forEach((button) => {
    const value = Number.isNaN(Number(button.dataset.value)) ? button.dataset.value : Number(button.dataset.value);
    button.addEventListener("click", () => checkAnswer(value, challenge.answer, button));
  });
}

function checkAnswer(value, answer, button) {
  if (value === answer) {
    button.classList.add("good");
    nextChallenge();
  } else {
    button.classList.add("try");
    button.closest(".activity-card").querySelector(".feedback").textContent = "Buen intento. Mira otra vez con calma.";
    playTryAgain();
  }
}

function nextChallenge() {
  playSuccess();
  roundScore += 25;
  challengeIndex += 1;
  if (challengeIndex >= challenges.length) {
    completeWorld();
    return;
  }
  setTimeout(renderChallenge, 650);
}

function completeWorld() {
  awardWorld(state, currentWorld);
  document.querySelector("#reward-title").textContent = `${currentWorld.title} completado`;
  document.querySelector("#reward-message").textContent = `Ganaste 3 estrellas, 120 puntos y la ${currentWorld.medal}.`;
  document.querySelector("#reward-badges").innerHTML = `
    <span>⭐ +3</span>
    <span>🏆 +120 puntos</span>
    <span>🏅 ${currentWorld.medal}</span>
  `;
  showScreen("reward");
  launchConfetti(document.querySelector("#confetti-canvas"));
}

function initParticles() {
  if (!window.particlesJS) return;
  particlesJS("particles-js", {
    particles: {
      number: { value: 52 },
      color: { value: ["#55c7ff", "#b69cff", "#ffd84d", "#62e6b2", "#ffad68"] },
      shape: { type: "circle" },
      opacity: { value: .45 },
      size: { value: 5 },
      move: { enable: true, speed: 1.2 }
    }
  });
}
