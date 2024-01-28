export function createSlug(data) {
  return data.trim().replace(/\s+/g, '-').toLowerCase();
}
