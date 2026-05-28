const ageConfig = {
  7: { max: 8, sequenceMax: 12, stepOptions: [1, 2], products: [1, 2, 3, 4], choices: 3, visualPatternLength: 4 },
  8: { max: 12, sequenceMax: 20, stepOptions: [1, 2, 3], products: [2, 3, 4, 5, 6], choices: 3, visualPatternLength: 5 },
  9: { max: 20, sequenceMax: 40, stepOptions: [2, 3, 4, 5], products: [3, 4, 5, 6, 7, 8], choices: 4, visualPatternLength: 6 },
  10: { max: 30, sequenceMax: 60, stepOptions: [2, 3, 4, 5, 10], products: [4, 5, 6, 7, 8, 9, 10], choices: 4, visualPatternLength: 6 }
};

const objects = ["🍎", "🍌", "🍓", "🥕", "⭐", "🧁"];
const helpers = ["👾", "🤖", "🦊", "🐼", "🧸", "🐲"];
const products = [
  { name: "Manzana", emoji: "🍎" },
  { name: "Lápiz", emoji: "✏️" },
  { name: "Cuaderno", emoji: "📘" },
  { name: "Banano", emoji: "🍌" },
  { name: "Galleta", emoji: "🍪" },
  { name: "Regla", emoji: "📏" }
];
const visualPatterns = [
  ["🍎", "🍌"],
  ["⬜", "⚪"],
  ["⭐", "🌙"],
  ["🟣", "🟡", "🟢"],
  ["🍓", "🍍", "🍇"]
];

export function difficultyFor(age) {
  return ageConfig[Number(age)] || ageConfig[7];
}

export function createChallenges(worldId, age) {
  const config = difficultyFor(age);
  const builders = {
    world1: explorationNumbers,
    world2: numericSequences,
    world3: mathStore,
    world4: wordProblems,
    world5: visualSequences
  };
  return builders[worldId](config);
}

function explorationNumbers(config) {
  return Array.from({ length: 5 }, (_, index) => {
    const amount = rand(2, config.max);
    const object = pick(objects);
    const helper = helpers[index % helpers.length];
    return {
      type: "give-items",
      title: "Exploración de números",
      instruction: `${helper} dice: Dame ${amount} ${object}. Arrastra exactamente esa cantidad.`,
      helper,
      object,
      answer: amount,
      available: Math.min(amount + 4, config.max + 3)
    };
  });
}

function numericSequences(config) {
  return Array.from({ length: 5 }, (_, index) => {
    const step = config.stepOptions[Math.min(index, config.stepOptions.length - 1)];
    const start = rand(1, Math.max(2, config.sequenceMax - step * 5));
    const sequence = Array.from({ length: 5 }, (_, itemIndex) => start + itemIndex * step);
    const missingIndex = index < 2 ? 2 : rand(1, 3);
    const answer = sequence[missingIndex];
    return {
      type: "number-sequence",
      title: "Siguiendo la secuencia",
      instruction: "Observa el patrón numérico y elige el número que falta.",
      sequence,
      missingIndex,
      answer,
      options: uniqueChoices(answer, config.sequenceMax, config.choices, step)
    };
  });
}

function mathStore(config) {
  return Array.from({ length: 5 }, (_, index) => {
    const pair = shuffle(products).slice(0, 2);
    const priceA = pick(config.products);
    const priceB = pick(config.products);
    const answer = priceA + priceB;
    return {
      type: "store-sum",
      title: "Tienda matemática",
      instruction: `Selecciona cuánto cuestan juntos ${pair[0].name} y ${pair[1].name}.`,
      products: [
        { ...pair[0], price: priceA },
        { ...pair[1], price: priceB }
      ],
      answer,
      options: uniqueChoices(answer, Math.max(10, answer + 8 + index), config.choices)
    };
  });
}

function wordProblems(config) {
  const names = ["María", "Tomás", "Luna", "Sofía", "Mateo"];
  const things = [
    { singular: "perro", plural: "perros", emoji: "🐶" },
    { singular: "flor", plural: "flores", emoji: "🌸" },
    { singular: "carro", plural: "carros", emoji: "🚗" },
    { singular: "libro", plural: "libros", emoji: "📚" },
    { singular: "globo", plural: "globos", emoji: "🎈" }
  ];
  return Array.from({ length: 5 }, (_, index) => {
    const item = things[index % things.length];
    const name = names[index % names.length];
    const first = rand(1, Math.min(8, config.max));
    const second = rand(1, Math.min(6 + index, config.max));
    const subtract = Number(config.max) > 12 && index % 2 === 1;
    const total = subtract ? Math.max(first, second) : first + second;
    const removed = subtract ? Math.min(first, second) : second;
    const answer = subtract ? total - removed : total;
    const instruction = subtract
      ? `${name} tiene ${total} ${item.plural} y regala ${removed}. ¿Cuántos ${item.plural} tiene ahora?`
      : `${name} tiene ${first} ${item.plural} y recibe ${second} más. ¿Cuántos ${item.plural} tiene ahora?`;
    return {
      type: "word-problem",
      title: "Problemas matemáticos",
      instruction,
      visual: item.emoji.repeat(subtract ? total : first),
      secondVisual: subtract ? "👋".repeat(removed) : item.emoji.repeat(second),
      answer,
      options: uniqueChoices(answer, Math.max(10, answer + 6), config.choices)
    };
  });
}

function visualSequences(config) {
  return Array.from({ length: 5 }, (_, index) => {
    const base = visualPatterns[index % visualPatterns.length];
    const length = config.visualPatternLength;
    const sequence = Array.from({ length }, (_, itemIndex) => base[itemIndex % base.length]);
    const answer = sequence[length - 1];
    const shown = sequence.slice(0, -1);
    return {
      type: "visual-sequence",
      title: "Sigue la secuencia",
      instruction: "Mira los dibujos y elige cuál sigue.",
      sequence: shown,
      answer,
      options: makeVisualOptions(answer, base, config.choices)
    };
  });
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - .5);
}

function uniqueChoices(answer, max, total, step = 1) {
  const set = new Set([answer]);
  const nearby = [answer - step, answer + step, answer - step * 2, answer + step * 2].filter((value) => value > 0 && value <= max);
  shuffle(nearby).forEach((value) => {
    if (set.size < total) set.add(value);
  });
  while (set.size < total) set.add(rand(1, max));
  return shuffle([...set]);
}

function pickDistractors(base) {
  return ["🍎", "🍌", "🍓", "⬜", "⚪", "⭐", "🌙", "🟣", "🟡", "🟢"].filter((item) => !base.includes(item));
}

function makeVisualOptions(answer, base, total) {
  const options = new Set([answer]);
  shuffle([...base, ...pickDistractors(base)]).forEach((item) => {
    if (options.size < total) options.add(item);
  });
  return shuffle([...options]);
}
