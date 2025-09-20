import { saveJSON, STORAGE_KEYS } from './common.js';

const ageSelect = document.getElementById('age');
const difficultySelect = document.getElementById('difficulty');
const categoriesSelect = document.getElementById('categories');
const form = document.getElementById('criteria-form');
const ageError = document.getElementById('age-error');

let categoriesData = [];
let ageGroups = [];

async function loadCategories() {
  try {
    const res = await fetch('../data/categories.json');
    if (!res.ok) throw new Error('Failed to load categories.json');
    categoriesData = await res.json();
    deriveAgeGroups();
    populateAgeGroups();
    refreshCategories();
  } catch (e) {
    console.error(e);
    ageSelect.innerHTML = '<option value="" disabled selected>Error loading ages</option>';
  }
}

function deriveAgeGroups() {
  const set = new Set(categoriesData.map(c => c.age_group));
  ageGroups = Array.from(set).sort((a,b) => a.localeCompare(b));
}

function populateAgeGroups() {
  ageSelect.innerHTML = '<option value="" disabled selected>Select age group</option>' +
    ageGroups.map(g => `<option value="${g}">${g}</option>`).join('');
}

function refreshCategories() {
  const selectedAge = ageSelect.value;
  const filtered = categoriesData.filter(c => !selectedAge || c.age_group === selectedAge);
  categoriesSelect.innerHTML = filtered.map(c => `<option value="${c.category_slug}" title="${c.description}">${c.category}</option>`).join('');
}

ageSelect?.addEventListener('change', () => {
  refreshCategories();
  if (ageSelect.value) {
    // Clear error state if previously shown
    ageSelect.removeAttribute('aria-invalid');
    ageSelect.removeAttribute('aria-describedby');
    ageError?.classList.add('hidden');
  }
});

// Difficulty labels capitalization handled in UI by rewriting options
function ensureDifficultyLabels() {
  Array.from(difficultySelect.options).forEach(opt => {
    if (opt.value && opt.value !== 'any') {
      opt.textContent = opt.value.charAt(0).toUpperCase() + opt.value.slice(1);
    }
  });
}

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const ageGroup = ageSelect.value;
  if (!ageGroup) {
    ageSelect.setAttribute('aria-invalid', 'true');
    ageSelect.setAttribute('aria-describedby', 'age-error');
    ageError?.classList.remove('hidden');
    ageError.textContent = 'Please select an age group to continue.';
    ageSelect.focus();
    return;
  }
  const difficulty = difficultySelect.value || 'any';
  const selectedCategories = Array.from(categoriesSelect.selectedOptions).map(o => o.value);
  const criteria = { ageGroup, difficulty, categories: selectedCategories, ts: Date.now() };
  saveJSON(STORAGE_KEYS.CRITERIA, criteria);
  window.location.href = 'practice.html';
});

ensureDifficultyLabels();
loadCategories();
