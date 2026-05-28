export const characters = [
  {
    id: "numi",
    name: "Numi",
    emoji: "🤖",
    role: "Robot inteligente experto en números.",
    personality: "Ordenado, curioso y paciente.",
    phrase: "Un número a la vez también es avanzar.",
    color: "#55c7ff"
  },
  {
    id: "luna",
    name: "Luna",
    emoji: "✨",
    role: "Exploradora espacial matemática.",
    personality: "Imaginativa, serena y aventurera.",
    phrase: "Las estrellas brillan cuando intentas de nuevo.",
    color: "#b69cff"
  },
  {
    id: "max",
    name: "Max",
    emoji: "🦁",
    role: "León valiente y motivador.",
    personality: "Valiente, cálido y protector.",
    phrase: "Tu valentía cuenta tanto como tu respuesta.",
    color: "#ffd84d"
  },
  {
    id: "pixel",
    name: "Pixel",
    emoji: "👾",
    role: "Personaje digital experto en patrones.",
    personality: "Juguetón, veloz y observador.",
    phrase: "Busca el patrón y el camino aparece.",
    color: "#62e6b2"
  },
  {
    id: "tina",
    name: "Tina",
    emoji: "🐢",
    role: "Tortuga tranquila que enseña paso a paso.",
    personality: "Calmada, amable y clara.",
    phrase: "Despacio también se llega muy lejos.",
    color: "#8fd7ff"
  },
  {
    id: "rayo",
    name: "Rayo",
    emoji: "⚡",
    role: "Personaje energético para retos rápidos.",
    personality: "Dinámico, alegre y decidido.",
    phrase: "Respira, mira y responde con energía.",
    color: "#ffad68"
  }
];

export function getCharacter(id) {
  return characters.find((character) => character.id === id) || characters[0];
}
