const KEY = "mathworld.save.v1";

export function loadSave() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY));
    return data && typeof data === "object" ? data : null;
  } catch {
    return null;
  }
}

export function saveGame(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function clearSave() {
  localStorage.removeItem(KEY);
}
