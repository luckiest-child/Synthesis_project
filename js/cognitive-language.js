/**
 * ============================================================================
 * LUMINA - COGNITIVE & LANGUAGE ACCESSIBILITY SCRIPT (cognitive-language.js)
 * Manages "Start Challenge" activation, automatic timer, in-place completion notice,
 * and an interactive second attempt in the calm plain-language form.
 * Pure Vanilla JavaScript (ES6).
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initCognitiveLanguageExperience();
});

function initCognitiveLanguageExperience() {
  // Elements for Original Challenge
  const startBtn = document.getElementById('btn-start-cognitive-task');
  const taskArea = document.getElementById('cognitive-task-active-area');
  const timerDisplay = document.getElementById('cognitive-active-timer');
  const cognitiveForm = document.getElementById('cognitive-cluttered-form');
  const challengeFeedback = document.getElementById('cognitive-challenge-feedback');
  const skipBtn = document.getElementById('btn-skip-cognitive-challenge');

  // Gated Toggle Elements
  const gateStatus = document.getElementById('cog-lang-gate-status');
  const toggleBtn = document.getElementById('cog-lang-toggle-btn');
  const improvedDisplay = document.getElementById('cog-lang-improved-display');
  const originalDisplay = document.getElementById('cognitive-language-original-display');

  // Elements for Improved Second-Attempt Task
  const impForm = document.getElementById('cog-lang-improved-attempt-form');
  const impFeedback = document.getElementById('cog-lang-improved-feedback');

  let isOriginalCompleted = false;
  let timerInterval = null;
  let secondsRemaining = 20;

  // --------------------------------------------------------------------------
  // 1. Original Challenge: Start Trigger, Automatic Timer & Submission
  // --------------------------------------------------------------------------
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
          completeOriginalChallenge(
            '<strong>Time Limit Reached:</strong> The 20-second timer ran out. Notice how an arbitrary ticking clock divides attention and creates anxiety, especially for people with ADHD, dyslexia, or processing differences who need extra time to read.'
          );
        }
      }, 1000);
    });
  }

  if (cognitiveForm) {
    cognitiveForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearInterval(timerInterval);

      completeOriginalChallenge(
        '<strong>Task Attempted:</strong> Even with submission, notice how ambiguous placeholder labels and competing cluttered text made it difficult to be certain what was required. Wiping form inputs or rushing users leads to high error rates and cognitive fatigue.'
      );
    });
  }

  // Skip simulation button
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      clearInterval(timerInterval);
      completeOriginalChallenge(
        '<strong>Simulation Bypassed:</strong> This demonstration highlighted how strict time limits, missing persistent labels, and dense jargon overwhelm cognitive processing and working memory.'
      );
    });
  }

  function completeOriginalChallenge(explanationHtml) {
    if (isOriginalCompleted) return;
    isOriginalCompleted = true;

    // Display explanation AND clear completion notification WITHOUT moving page/focus
    if (challengeFeedback) {
      challengeFeedback.innerHTML = `
        ${explanationHtml}
        <div class="challenge-completion-notice" role="status">
          <span>Challenge completed! Scroll down to try the improved version.</span>
          <span class="notice-arrow" aria-hidden="true">&darr;</span>
        </div>
      `;
      challengeFeedback.className = 'challenge-status-box is-visible';
    }

    // Unlock the gated toggle (DO NOT call focus(), DO NOT scroll)
    if (toggleBtn && gateStatus) {
      toggleBtn.removeAttribute('disabled');
      toggleBtn.setAttribute('aria-disabled', 'false');
      gateStatus.textContent = '✓ Challenge completed. Improved accessible version is now unlocked:';
      gateStatus.className = 'gate-status-msg is-unlocked';
    }
  }

  // --------------------------------------------------------------------------
  // 2. Gated Toggle Logic (Switches view on visitor activation)
  // --------------------------------------------------------------------------
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (!isOriginalCompleted) return;

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

  // --------------------------------------------------------------------------
  // 3. Improved Experience: Second Attempt Interaction
  // --------------------------------------------------------------------------
  if (impForm) {
    impForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('imp-calm-name');
      const amountInput = document.getElementById('imp-calm-amount');
      const emailInput = document.getElementById('imp-calm-email');

      if (!nameInput.value.trim() || !amountInput.value.trim() || !emailInput.value.trim()) {
        showImprovedFeedback('Please fill out the required fields to submit.', 'warning');
        return;
      }

      showImprovedFeedback(
        '✓ Application Submitted Calmly: With permanent labels, plain language, and zero countdown pressure, you were able to complete the application with confidence and clarity.',
        'success'
      );
    });
  }

  function showImprovedFeedback(msg, type) {
    if (!impFeedback) return;
    impFeedback.textContent = msg;
    impFeedback.style.display = 'block';
    if (type === 'success') {
      impFeedback.style.color = 'var(--color-success)';
      impFeedback.style.borderLeft = '3px solid var(--color-success)';
    } else {
      impFeedback.style.color = 'var(--color-accent)';
      impFeedback.style.borderLeft = '3px solid var(--color-accent)';
    }
  }
}
