// Phase 6 Data Management Helpers
import { loadJSON, saveJSON, STORAGE_KEYS, QUIZ_WORD_COUNT } from './common.js';

// Normalize word objects from JSON (typo tolerant)
export function normalizeWord(raw) {
  return {
    word: raw.word,
    meaning: raw.meaning || '',
    partOfSpeech: raw.part_of_speech || raw.part_of_speech || raw.partOfSpeech || '',
    level: raw.level || 'easy'
  };
}

export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Load words for each category slug and flatten
export async function loadWordsByCategory(categorySlugs = []) {
  if (!Array.isArray(categorySlugs) || !categorySlugs.length) return [];
  const lists = await Promise.all(
    categorySlugs.map(async slug => {
      const res = await fetch(`../data/words/${slug}.json`);
      if (!res.ok) throw new Error('Failed to load words for ' + slug);
      const json = await res.json();
      return json.map(normalizeWord);
    })
  );
  return lists.flat();
}

// From a pool (already normalized) pick up to QUIZ_WORD_COUNT applying difficulty filter & fallback
export function getRandomWordsFromSelection(allWords, criteria) {
  let pool = allWords;
  if (criteria?.difficulty && criteria.difficulty !== 'any') {
    pool = pool.filter(w => w.level === criteria.difficulty);
  }
  if (pool.length < QUIZ_WORD_COUNT) pool = allWords; // fallback if too few after filter
  shuffle(pool);
  return pool.slice(0, QUIZ_WORD_COUNT);
}

// Persist a completed session and update history (returns saved session)
export function storeResultToLocalStorage({ criteria, attempts }) {
  const score = attempts.filter(a => a.correct).length;
  const session = {
    id: 'sess-' + Date.now(),
    criteria,
    attempts,
    score,
    total: attempts.length,
    completedAt: Date.now()
  };
  saveJSON(STORAGE_KEYS.CURRENT_SESSION, session);
  const history = loadJSON(STORAGE_KEYS.HISTORY, []);
  history.push({
    id: session.id,
    score: session.score,
    total: session.total,
    criteria: session.criteria,
    completedAt: session.completedAt
  });
  saveJSON(STORAGE_KEYS.HISTORY, history);
  return session;
}

// Aggregate statistics from history entries (no attempts detail needed)
export function getHistoricalStats(history = []) {
  if (!history.length) {
    return {
      totalSessions: 0,
      totalWords: 0,
      totalCorrect: 0,
      avgPercent: 0,
      bestSession: null,
      topCategories: []
    };
  }
  const totalSessions = history.length;
  const totalWords = history.reduce((sum,h) => sum + (h.total || 0), 0);
  const totalCorrect = history.reduce((sum,h) => sum + (h.score || 0), 0);
  const avgPercent = totalWords ? Math.round((totalCorrect/totalWords)*100) : 0;
  const best = history.reduce((best,h) => h.score/h.total > best.ratio ? { ratio: h.score/h.total, h } : best, { ratio: -1, h: null }).h;
  const catCount = {};
  history.forEach(h => (h.criteria?.categories || []).forEach(cat => { catCount[cat] = (catCount[cat] || 0) + 1; }));
  const topCategories = Object.entries(catCount)
    .sort((a,b) => b[1]-a[1])
    .slice(0,3)
    .map(([c,count]) => ({ category: c, count }));
  return { totalSessions, totalWords, totalCorrect, avgPercent, bestSession: best, topCategories };
}
