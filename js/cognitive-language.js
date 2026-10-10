/**
 * ============================================================================
 * LUMINA - COGNITIVE & LANGUAGE ACCESSIBILITY SCRIPT (cognitive-language.js)
 * Manages the "Start Challenge" activation, automatic timer, form clutter,
 * plain-language comparison, gated toggle unlocking, and accessible calm form.
 * Pure Vanilla JavaScript (ES6).
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initCognitiveLanguageExperience();
});

function initCognitiveLanguageExperience() {
  const startBtn = document.getElementById('btn-start-cognitive-task');
  const taskArea = document.getElementById('cognitive-task-active-area');
  const timerDisplay = document.getElementById('cognitive-active-timer');
  const cognitiveForm = document.getElementById('cognitive-cluttered-form');
  const challengeFeedback = document.getElementById('cognitive-challenge-feedback');
  const skipBtn = document.getElementById('btn-skip-cognitive-challenge');
  const gateStatus = document.getElementById('cog-lang-gate-status');
  const toggleBtn = document.getElementById('cog-lang-toggle-btn');
  const improvedDisplay = document.getElementById('cog-lang-improved-display');
  const originalDisplay = document.getElementById('cog-lang-original-display');

  let isCompleted = false;
  let timerInterval = null;
  let secondsRemaining = 20;

  // 1. Starting the challenge automatically activates task and timer
  if (startBtn && taskArea) {
    startBtn.addEventListener('click', () => {
      startBtn.style.display = 'none';
      taskArea.style.display = 'block';

      // Start automatic countdown timer
      secondsRemaining = 20;
      if (timerDisplay) timerDisplay.textContent = '00:20';

      timerInterval = setInterval(() => {
        secondsRemaining--;
        const formatted = secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining;
        if (timerDisplay) timerDisplay.textContent = `00:${formatted}`;

        if (secondsRemaining <= 0) {
          clearInterval(timerInterval);
          completeChallenge(
            '<strong>Time Limit Reached:</strong> The 20-second timer ran out. Notice how an arbitrary ticking clock divides attention and creates anxiety, especially for people with ADHD, dyslexia, or processing differences who need extra time to read.'
          );
        }
      }, 1000);
    });
  }

  // 2. Form submission attempt
  if (cognitiveForm) {
    cognitiveForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearInterval(timerInterval);

      completeChallenge(
        '<strong>Task Attempted:</strong> Even with submission, notice how ambiguous placeholder labels and competing cluttered text made it difficult to be certain what was required. Wiping form inputs or rushing users leads to high error rates and cognitive fatigue.'
      );
    });
  }

  // 3. Skip simulation button
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      clearInterval(timerInterval);
      completeChallenge(
        '<strong>Simulation Bypassed:</strong> This demonstration highlighted how strict time limits, missing persistent labels, and dense jargon overwhelm cognitive processing and working memory.'
      );
    });
  }

  function completeChallenge(message) {
    if (isCompleted) return;
    isCompleted = true;

    showFeedback(challengeFeedback, message, 'info');

    // Unlock the gated improved-version toggle
    if (toggleBtn && gateStatus) {
      toggleBtn.removeAttribute('disabled');
      toggleBtn.setAttribute('aria-disabled', 'false');
      gateStatus.textContent = '✓ Challenge completed. Improved accessible version is now unlocked:';
      gateStatus.className = 'gate-status-msg is-unlocked';
      toggleBtn.focus();
    }
  }

  function showFeedback(container, htmlContent, type) {
    if (!container) return;
    container.innerHTML = htmlContent;
    container.className = 'challenge-status-box is-visible';
    if (type === 'warning') {
      container.style.borderLeft = '3px solid var(--color-accent)';
    } else {
      container.style.borderLeft = '3px solid var(--color-text)';
    }
  }

  // 4. Gated Toggle Logic
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (!isCompleted) return;

      const isShowingImproved = toggleBtn.getAttribute('aria-pressed') === 'true';
      const nextState = !isShowingImproved;

      toggleBtn.setAttribute('aria-pressed', String(nextState));

      if (nextState) {
        toggleBtn.textContent = 'Switch to Original (Cluttered & Timed)';
        toggleBtn.classList.add('is-active');
        if (originalDisplay) originalDisplay.style.display = 'none';
        if (improvedDisplay) improvedDisplay.classList.add('is-active');
      } else {
        toggleBtn.textContent = 'Switch to Improved (Calm & Clear)';
        toggleBtn.classList.remove('is-active');
        if (originalDisplay) originalDisplay.style.display = 'block';
        if (improvedDisplay) improvedDisplay.classList.remove('is-active');
      }
    });
  }
}
