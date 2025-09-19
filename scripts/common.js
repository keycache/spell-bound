// Shared helpers & constants for Spell Bound
export const STORAGE_KEYS = {
  CRITERIA: 'spellbound.criteria',
  CURRENT_SESSION: 'spellbound.currentSession',
  HISTORY: 'spellbound.history',
  GEMINI_SESSION: 'spellbound.geminiSession'
};

export function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadJSON(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn('Failed to parse localStorage item', key, e);
    return fallback;
  }
}

export function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleString();
}

// Configurable quiz size (default 10). Change here to adjust number of words per session.
export const QUIZ_WORD_COUNT = 10;

// Placeholder: more utilities will be added in future phases.
