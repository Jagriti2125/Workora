// Format dates for display
export function formatDate(date, options) {
  return new Date(date).toLocaleDateString("en-IN", options);
}