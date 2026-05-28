let music;
let enabled = true;
let musicTimer;
let noteIndex = 0;

const synth = typeof AudioContext !== "undefined" ? new AudioContext() : null;

function tone(freq = 440, duration = .18, type = "sine", gain = .06) {
  if (!enabled || !synth) return;
  if (synth.state === "suspended") synth.resume();
  const osc = synth.createOscillator();
  const vol = synth.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  vol.gain.value = gain;
  osc.connect(vol);
  vol.connect(synth.destination);
  osc.start();
  vol.gain.exponentialRampToValueAtTime(.001, synth.currentTime + duration);
  osc.stop(synth.currentTime + duration);
}

export function setupAudio() {
  if (typeof Howl === "function") {
    music = new Howl({ src: ["data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA="], loop: true, volume: .01, html5: true });
  }
}

export function toggleMusic() {
  enabled = !enabled;
  if (music) {
    if (enabled) music.play();
    else music.pause();
  }
  if (enabled) startMelody();
  else stopMelody();
  return enabled;
}

export function startMusic() {
  enabled = true;
  if (music) music.play();
  startMelody();
}

export function playClick() {
  tone(520, .08, "triangle", .04);
}

export function playSuccess() {
  tone(660, .12, "sine", .06);
  setTimeout(() => tone(880, .14, "sine", .06), 90);
}

export function playTryAgain() {
  tone(220, .16, "triangle", .05);
}

function startMelody() {
  if (musicTimer || !enabled) return;
  const notes = [392, 440, 523, 587, 523, 440];
  musicTimer = setInterval(() => {
    tone(notes[noteIndex % notes.length], .16, "sine", .025);
    noteIndex += 1;
  }, 720);
}

function stopMelody() {
  clearInterval(musicTimer);
  musicTimer = null;
}
