// src/api.js
export const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080/user";

export async function apiFetch(path = "", options = {}) {
  const url = `${API_BASE}${path}`;
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      // Try to parse JSON error body, fallback to text
      const text = await res.text().catch(() => "");
      try {
        const json = text ? JSON.parse(text) : null;
        const msg = json && (json.message || json.error || json.detail) ? (json.message || json.error || json.detail) : text;
        throw new Error(`API error ${res.status}: ${String(msg).slice(0, 800)}`);
      } catch (e) {
        throw new Error(`API error ${res.status}: ${text || "Unknown error"}`);
      }
    }
    if (res.status === 204) return null;
    const text = await res.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch (e) {
      throw new Error(`Invalid API response format: ${e.message}`);
    }
  } catch (err) {
    throw err;
  }
}
