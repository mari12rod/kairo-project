const STORAGE_KEY = "emotions";

export function getEmotions() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function addEmotion(emotion) {
  const emotions = getEmotions();
  emotions.push({ id: Date.now(), ...emotion });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(emotions));
}

export function deleteEmotion(id) {
  const emotions = getEmotions().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(emotions));
}