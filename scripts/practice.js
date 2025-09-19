import { loadJSON, STORAGE_KEYS, QUIZ_WORD_COUNT } from './common.js';
import { loadWordsByCategory, getRandomWordsFromSelection, storeResultToLocalStorage } from './data.js';

/*
 Data shape for words JSON: [{ word, meaning, part_of_speech, level }]
 Note: there is a consistent typo 'part_of_speech'. We'll normalize to partOfSpeech.
*/

const criteria = loadJSON(STORAGE_KEYS.CRITERIA);
const isGeminiMode = !!loadJSON(STORAGE_KEYS.GEMINI_SESSION);

const wordCounterEl = document.getElementById('word-counter');
const progressBarEl = document.getElementById('progress-bar');
const speakBtn = document.getElementById('speak-btn');
const spellingInput = document.getElementById('spelling-input');
const submitBtn = document.getElementById('submit-btn');
const feedbackBox = document.getElementById('feedback');
const resultText = document.getElementById('result-text');
const meaningText = document.getElementById('meaning-text');
const nextBtn = document.getElementById('next-btn');
// Audio info buttons (now shown beside main word pre-submission and hidden after answer)
const speakMeaningBtn = document.getElementById('speak-meaning-btn');
const speakPosBtn = document.getElementById('speak-pos-btn');

let allWords = [];
let quizWords = [];
let currentIndex = 0;
let attempts = [];

init();

async function init() {
  if (!criteria && !isGeminiMode) {
    window.location.href = 'home.html';
    return;
  }
  try {
    if (isGeminiMode) {
      // Placeholder: Gemini mode not implemented yet
      console.warn('Gemini mode not implemented in Phase 3');
    } else {
      await loadSelectedCategories();
    }
    selectQuizWords();
    updateCounter();
      // progress bar removed
    prepareForCurrentWord();
    attachEvents();
  } catch (e) {
    console.error('Failed to initialize practice page', e);
  }
}

async function loadSelectedCategories() {
  const catSlugs = criteria.categories || [];
  allWords = await loadWordsByCategory(catSlugs);
}

function selectQuizWords() {
  quizWords = getRandomWordsFromSelection(allWords, criteria);
  if (quizWords.length === 0) {
    wordCounterEl.innerHTML = 'No words available for the chosen settings. <a href="home.html" class="text-primary-600 underline">Go Back</a>';
    speakBtn.disabled = true;
    submitBtn.disabled = true;
    spellingInput.disabled = true;
  }
}

function updateCounter() {
  if (!quizWords.length) return;
  wordCounterEl.textContent = `Word ${currentIndex + 1} of ${quizWords.length}`;
}

function updateProgress() {
  // updateProgress removed (progress bar no longer displayed)
}

function prepareForCurrentWord() {
  if (!quizWords.length) return;
  spellingInput.value = '';
  spellingInput.disabled = false;
  submitBtn.disabled = true;
  feedbackBox.classList.add('hidden');
  nextBtn.disabled = true;
  // Reset meaning display; buttons visible pre-answer
  meaningText.textContent = '';
  showInfoButtonsIfData();
  spellingInput.focus();
}

function attachEvents() {
  spellingInput.addEventListener('input', () => {
    submitBtn.disabled = spellingInput.value.trim().length === 0;
  });
  submitBtn.addEventListener('click', onSubmitSpelling);
  nextBtn.addEventListener('click', onNextWord);
  speakBtn.addEventListener('click', speakCurrentWord);
  speakMeaningBtn?.addEventListener('click', speakMeaning);
  speakPosBtn?.addEventListener('click', speakPartOfSpeech);
}

function speakCurrentWord() {
  if (!quizWords.length) return;
  const current = quizWords[currentIndex];
  if (!current) return;
  const utterance = new SpeechSynthesisUtterance(current.word || '');
  utterance.rate = 0.9;
  utterance.pitch = 1.0;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

function onSubmitSpelling() {
  if (!quizWords.length) return;
  const current = quizWords[currentIndex];
  if (!current) return;
  const userInput = spellingInput.value.trim();
  const correct = userInput.toLowerCase() === current.word.toLowerCase();
  attempts.push({
    word: current.word,
    userSpelling: userInput,
    correctSpelling: current.word,
    correct,
    meaning: current.meaning,
    partOfSpeech: current.partOfSpeech
  });
  showFeedback(correct, current);
}

function showFeedback(correct, current) {
  spellingInput.disabled = true;
  submitBtn.disabled = true;
  feedbackBox.classList.remove('hidden');
  resultText.textContent = correct ? '✔ Correct!' : `❌ Oops! The word was: ${current.word}`;
  resultText.className = 'font-semibold ' + (correct ? 'text-green-600' : 'text-red-600');
  // After submission: do NOT auto-reveal meaning; keep speak buttons available
  meaningText.textContent = ''; // stay blank until future feature (e.g., manual reveal)
  nextBtn.disabled = false;
  // progress bar removed
  if (currentIndex === quizWords.length - 1) {
    nextBtn.textContent = 'See Results';
  } else {
    nextBtn.textContent = 'Next Word';
  }
}

function hideInfoButtons() {
  // Intentionally left blank (buttons persist after submission per new requirement)
}

function showInfoButtonsIfData() {
  if (!quizWords.length) return;
  const current = quizWords[currentIndex];
  if (!current) return;
  if (current.meaning) speakMeaningBtn?.classList.remove('hidden'); else speakMeaningBtn?.classList.add('hidden');
  if (current.partOfSpeech) speakPosBtn?.classList.remove('hidden'); else speakPosBtn?.classList.add('hidden');
}

function speakMeaning() {
  if (!quizWords.length) return;
  const current = quizWords[currentIndex];
  if (!current || !current.meaning) return;
  const utter = new SpeechSynthesisUtterance(current.meaning);
  utter.rate = 1.0;
  utter.pitch = 1.0;
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

function speakPartOfSpeech() {
  if (!quizWords.length) return;
  const current = quizWords[currentIndex];
  if (!current || !current.partOfSpeech) return;
  const label = 'Part of speech: ' + current.partOfSpeech;
  const utter = new SpeechSynthesisUtterance(label);
  utter.rate = 1.0;
  utter.pitch = 1.0;
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

function onNextWord() {
  if (!quizWords.length) return;
  if (currentIndex === quizWords.length - 1) {
    finalizeSession();
    return;
  }
  currentIndex++;
  updateCounter();
    // progress bar removed
  prepareForCurrentWord();
}

function finalizeSession() {
  storeResultToLocalStorage({ criteria, attempts });
  window.location.href = 'results.html';
}
