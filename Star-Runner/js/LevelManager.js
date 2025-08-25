export async function loadLevels() {
  try {
    const res = await fetch('../data/levels.json');
    const data = await res.json();
    return data;
  } catch(err) {
    throw new Error('Failed to load levels');
  }
}

