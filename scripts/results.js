import { loadJSON, STORAGE_KEYS, formatDate } from './common.js';
import { getHistoricalStats } from './data.js';

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
const clearBtn = document.getElementById('clear-data-btn');
const clearFeedback = document.getElementById('clear-feedback');

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

  if (clearBtn) {
    clearBtn.addEventListener('click', onClearData);
  }
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
  if (!history.length) { historyStatsEl.textContent = ''; return; }
  const { totalSessions, avgPercent, bestSession, topCategories } = mapStats(getHistoricalStats(history));
  historyStatsEl.innerHTML = `
    <div class="flex flex-wrap gap-x-6 gap-y-1">
      <div><span class="font-semibold">Total Sessions:</span> ${totalSessions}</div>
      <div><span class="font-semibold">Avg Accuracy:</span> ${avgPercent}%</div>
      <div><span class="font-semibold">Best Session:</span> ${bestSession}</div>
      <div><span class="font-semibold">Top Categories:</span> ${topCategories}</div>
    </div>`;
}

function mapStats(stats) {
  const bestSession = stats.bestSession ? `${stats.bestSession.score}/${stats.bestSession.total}` : '—';
  const topCategories = stats.topCategories.length
    ? stats.topCategories.map(c => `${c.category} (${c.count})`).join(', ')
    : '—';
  return { totalSessions: stats.totalSessions, avgPercent: stats.avgPercent, bestSession, topCategories };
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

function onClearData() {
  const confirmClear = confirm('This will erase all Spell Bound saved data (criteria, current session, history). Continue?');
  if (!confirmClear) return;
  try {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    // Provide lightweight feedback and reset UI
    if (clearFeedback) {
      clearFeedback.textContent = 'All data cleared. Reload or start a new practice.';
      clearFeedback.classList.remove('hidden');
    }
    criteriaDisplayEl.innerHTML = '<span class="text-red-600">Data cleared.</span> <a href="home.html" class="underline text-primary-600">Start fresh</a>';
    resultsTableBody.innerHTML = '';
    scoreSummaryEl.textContent = '';
    historyTableBody.innerHTML = '<tr><td colspan="5" class="p-3 text-sm text-gray-600">No past sessions.</td></tr>';
    historyStatsEl.textContent = '';
  } catch (e) {
    if (clearFeedback) {
      clearFeedback.textContent = 'Failed to clear data: ' + e.message;
      clearFeedback.classList.remove('hidden');
      clearFeedback.classList.add('text-red-600');
    }
  }
}
