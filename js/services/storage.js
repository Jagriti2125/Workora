// Load data from localStorage
export function loadData(key) {
  const savedData = localStorage.getItem(key);

  return savedData ? JSON.parse(savedData) : [];
}
// Save data to localStorage
export function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
