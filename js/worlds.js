export const worlds = [
  {
    id: "world1",
    title: "Nivel 1: Exploración de números",
    icon: "👾",
    objective: "Arrastrar cantidades exactas hacia un personaje",
    color: "#62e6b2",
    medal: "Medalla Explorador Numérico",
    folder: "worlds/world1",
    games: ["Dame la cantidad correcta"]
  },
  {
    id: "world2",
    title: "Nivel 2: Siguiendo la secuencia",
    icon: "🔢",
    objective: "Completar secuencias numéricas",
    color: "#55c7ff",
    medal: "Medalla Patrón Numérico",
    folder: "worlds/world2",
    games: ["Encuentra el número que falta"]
  },
  {
    id: "world3",
    title: "Nivel 3: Tienda matemática",
    icon: "🛒",
    objective: "Sumar valores de productos",
    color: "#ffd84d",
    medal: "Medalla Comprador Brillante",
    folder: "worlds/world3",
    games: ["Compra dos productos"]
  },
  {
    id: "world4",
    title: "Nivel 4: Problemas matemáticos",
    icon: "🧩",
    objective: "Resolver problemas sencillos y visuales",
    color: "#b69cff",
    medal: "Medalla Pensador Alegre",
    folder: "worlds/world4",
    games: ["Historias matemáticas"]
  },
  {
    id: "world5",
    title: "Nivel 5: Sigue la secuencia",
    icon: "🍎",
    objective: "Identificar patrones visuales",
    color: "#ffad68",
    medal: "Medalla Patrón Visual",
    folder: "worlds/world5",
    games: ["Elige el dibujo que sigue"]
  }
];

export function getWorld(id) {
  return worlds.find((world) => world.id === id) || worlds[0];
}
