import { loadJSON, STORAGE_KEYS, formatDate } from './common.js';

/* Phase 4: Results Page Logic
   Responsibilities:
   - Load CURRENT_SESSION (detailed) & HISTORY (summary list)
   - Render criteria, session attempts, score summary
   - Aggregate and render history stats
   - Graceful handling if no current session (show last session from history or message)
*/

const criteriaDisplayEl = document.getElementById('criteria-display');
const resultsTableBody = document.querySelector('#results-table tbody');
const scoreSummaryEl = document.getElementById('score-summary');
const historyStatsEl = document.getElementById('history-stats');
const historyTableBody = document.querySelector('#history-table tbody');
const historySection = document.getElementById('history-section');

init();

function init() {
  const session = loadJSON(STORAGE_KEYS.CURRENT_SESSION);
  const history = loadJSON(STORAGE_KEYS.HISTORY, []);

  if (!session) {
    // Fallback: maybe show last history item if exists
    if (history.length === 0) {
      criteriaDisplayEl.innerHTML = '<span class="text-red-600">No recent session found.</span> <a href="home.html" class="underline text-primary-600">Start a new practice</a>';
      scoreSummaryEl.textContent = '';
      resultsTableBody.innerHTML = '';
      historySection.classList.toggle('hidden', history.length === 0);
      return;
    } else {
      criteriaDisplayEl.innerHTML = '<span class="text-amber-700">Showing your last completed session.</span>';
      // Attempt to load full attempts is impossible if CURRENT_SESSION missing; so only show summary line
  resultsTableBody.innerHTML = '<tr><td colspan="4" class="p-3 text-sm text-gray-600">Detailed attempts unavailable (session not active). Finish a new practice session to see detailed word breakdown.</td></tr>';
      scoreSummaryEl.textContent = '';
    }
  } else {
    renderSession(session);
  }

  renderHistory(history);
  renderHistoryStats(history);
}

function renderSession(session) {
  const c = session.criteria || {};
  const cats = (c.categories || []).join(', ') || '—';
  criteriaDisplayEl.innerHTML = `
    <div class="flex flex-wrap gap-x-6 gap-y-1">
      <div><span class="font-semibold">Age Group:</span> ${c.ageGroup || '—'}</div>
      <div><span class="font-semibold">Difficulty:</span> ${c.difficulty || '—'}</div>
      <div><span class="font-semibold">Categories:</span> ${cats}</div>
      <div><span class="font-semibold">Completed:</span> ${formatDate(session.completedAt)}</div>
    </div>`;

  const attempts = session.attempts || [];
  if (!attempts.length) {
  resultsTableBody.innerHTML = '<tr><td colspan="4" class="p-3 text-sm text-gray-600">No attempt data available.</td></tr>';
  } else {
    resultsTableBody.innerHTML = attempts.map((a, idx) => attemptRow(idx, a)).join('');
  }
  const correct = attempts.filter(a => a.correct).length;
  scoreSummaryEl.textContent = `Score: ${correct}/${attempts.length} (${Math.round((correct/Math.max(attempts.length,1))*100)}%)`;
}

function attemptRow(idx, a) {
  return `<tr class="border-b last:border-0 ${a.correct ? 'bg-green-50' : 'bg-red-50'}">
    <td class="p-2">${idx + 1}</td>
    <td class="p-2 font-medium">${escapeHTML(a.word)}</td>
    <td class="p-2 ${a.correct ? 'text-green-700' : 'text-red-700'}">${escapeHTML(a.userSpelling)}</td>
    <td class="p-2">${a.correct ? '✔' : '❌'}</td>
  </tr>`;
}

function renderHistory(history) {
  if (!history.length) {
    historyTableBody.innerHTML = '<tr><td colspan="5" class="p-3 text-sm text-gray-600">No past sessions yet.</td></tr>';
    return;
  }
  // Sort newest first
  const sorted = [...history].sort((a,b) => b.completedAt - a.completedAt);
  historyTableBody.innerHTML = sorted.map(h => historyRow(h)).join('');
}

function historyRow(h) {
  const c = h.criteria || {};
  return `<tr class="border-b last:border-0 hover:bg-primary-50">
    <td class="p-2 whitespace-nowrap">${formatDate(h.completedAt)}</td>
    <td class="p-2">${h.score}/${h.total}</td>
    <td class="p-2">${c.ageGroup || '—'}</td>
    <td class="p-2">${c.difficulty || '—'}</td>
    <td class="p-2">${(c.categories || []).join(', ')}</td>
  </tr>`;
}

function renderHistoryStats(history) {
  if (!history.length) {
    historyStatsEl.textContent = '';
    return;
  }
  const totalSessions = history.length;
  const totalWords = history.reduce((sum,h) => sum + (h.total || 0), 0);
  const totalCorrect = history.reduce((sum,h) => sum + (h.score || 0), 0);
  const avgPercent = totalWords ? Math.round((totalCorrect/totalWords)*100) : 0;
  const bestSession = history.reduce((best,h) => h.score/h.total > best.ratio ? { ratio: h.score/h.total, h } : best, { ratio: -1, h: null });

  // Top categories (count appearances)
  const catCount = {};
  history.forEach(h => {
    (h.criteria?.categories || []).forEach(cat => {
      catCount[cat] = (catCount[cat] || 0) + 1;
    });
  });
  const topCategories = Object.entries(catCount)
    .sort((a,b) => b[1]-a[1])
    .slice(0,3)
    .map(([c,count]) => `${c} (${count})`)
    .join(', ') || '—';

  historyStatsEl.innerHTML = `
    <div class="flex flex-wrap gap-x-6 gap-y-1">
      <div><span class="font-semibold">Total Sessions:</span> ${totalSessions}</div>
      <div><span class="font-semibold">Avg Accuracy:</span> ${avgPercent}%</div>
      <div><span class="font-semibold">Best Session:</span> ${bestSession.h ? `${bestSession.h.score}/${bestSession.h.total}` : '—'}</div>
      <div><span class="font-semibold">Top Categories:</span> ${topCategories}</div>
    </div>`;
}

// Simple escape to avoid table injection from word strings
function escapeHTML(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
