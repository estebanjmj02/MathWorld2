export const characters = [
  {
    id: "numi",
    name: "Numi",
    emoji: "🤖",
    role: "Robot inteligente experto en números.",
    personality: "Ordenado, curioso y paciente.",
    phrase: "Numi te apoya 🤖",
    color: "#55c7ff"
  },
  {
    id: "luna",
    name: "Luna",
    emoji: "✨",
    role: "Exploradora espacial matemática.",
    personality: "Imaginativa, serena y aventurera.",
    phrase: "Luna te apoya ✨",
    color: "#b69cff"
  },
  {
    id: "max",
    name: "Max",
    emoji: "🦁",
    role: "León valiente y motivador.",
    personality: "Valiente, cálido y protector.",
    phrase: "Max te apoya 🦁",
    color: "#ffd84d"
  },
  {
    id: "pixel",
    name: "Pixel",
    emoji: "👾",
    role: "Personaje digital experto en patrones.",
    personality: "Juguetón, veloz y observador.",
    phrase: "Pixel te ayuda 👾",
    color: "#62e6b2"
  },
  {
    id: "tina",
    name: "Tina",
    emoji: "🐢",
    role: "Tortuga tranquila que enseña paso a paso.",
    personality: "Calmada, amable y clara.",
    phrase: "Tina te ayuda 🐢",
    color: "#8fd7ff"
  },
  {
    id: "rayo",
    name: "Rayo",
    emoji: "⚡",
    role: "Personaje energético para retos rápidos.",
    personality: "Dinámico, alegre y decidido.",
    phrase: "Rayo te ayuda⚡",
    color: "#ffad68"
  }
];

export function getCharacter(id) {
  return characters.find((character) => character.id === id) || characters[0];
}
