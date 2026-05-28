import { saveGame } from "./storage.js";

export function createInitialState() {
  return {
    player: { firstName: "", lastName: "", age: 7 },
    characterId: "numi",
    points: 0,
    xp: 0,
    level: 1,
    stars: 0,
    unlockedWorlds: ["world1"],
    medals: [],
    completedWorlds: []
  };
}

export function awardWorld(state, world) {
  state.points += 120;
  state.xp += 65;
  state.stars += 3;

  while (state.xp >= state.level * 100) {
    state.xp -= state.level * 100;
    state.level += 1;
  }

  if (!state.medals.includes(world.medal)) state.medals.push(world.medal);
  if (!state.completedWorlds.includes(world.id)) state.completedWorlds.push(world.id);

  const worldNumber = Number(world.id.replace("world", ""));
  const nextWorld = `world${worldNumber + 1}`;
  if (worldNumber < 5 && !state.unlockedWorlds.includes(nextWorld)) {
    state.unlockedWorlds.push(nextWorld);
  }

  saveGame(state);
}
