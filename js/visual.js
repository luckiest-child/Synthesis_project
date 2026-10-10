/**
 * ============================================================================
 * LUMINA - VISUAL ACCESSIBILITY SCRIPT (visual.js)
 * Manages the obscured visual simulation, task attempt tracking,
 * gated toggle unlocking, and the accessible improved comparison.
 * Pure Vanilla JavaScript (ES6).
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initVisualExperience();
});

function initVisualExperience() {
  const attemptForm = document.getElementById('visual-attempt-form');
  const challengeFeedback = document.getElementById('visual-challenge-feedback');
  const skipBtn = document.getElementById('btn-skip-visual-challenge');
  const gateStatus = document.getElementById('visual-gate-status');
  const toggleBtn = document.getElementById('visual-toggle-btn');
  const improvedDisplay = document.getElementById('visual-improved-display');
  const originalDisplay = document.getElementById('visual-original-display');

  let isCompleted = false;

  // 1. Handling the task attempt in the obscured challenge
  if (attemptForm) {
    attemptForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const selected = attemptForm.querySelector('input[name="dosage_choice"]:checked');

      if (!selected) {
        showFeedback(challengeFeedback, 'Please select a dosage option to make your decision.', 'warning');
        return;
      }

      // Mark challenge as attempted/completed
      completeChallenge(
        '<strong>Task Attempted:</strong> You had to guess because the crucial dosage text was completely obscured inside the visual graphic. In real-world digital services, unlabelled medical labels or inaccessible portals force people with visual impairments to guess or rely on strangers for basic safety.'
      );
    });
  }

  // 2. Skip or Exit challenge button
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      completeChallenge(
        '<strong>Simulation Bypassed:</strong> In this demonstration, the crucial medication dosage was embedded solely inside an image with no text alternative, leaving someone who cannot see the graphic completely without access.'
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

  // 3. Gated Toggle Logic
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (!isCompleted) return;

      const isShowingImproved = toggleBtn.getAttribute('aria-pressed') === 'true';
      const nextState = !isShowingImproved;

      toggleBtn.setAttribute('aria-pressed', String(nextState));

      if (nextState) {
        toggleBtn.textContent = 'Switch to Original (Obscured)';
        toggleBtn.classList.add('is-active');
        if (originalDisplay) originalDisplay.style.display = 'none';
        if (improvedDisplay) improvedDisplay.classList.add('is-active');
      } else {
        toggleBtn.textContent = 'Switch to Improved (Accessible)';
        toggleBtn.classList.remove('is-active');
        if (originalDisplay) originalDisplay.style.display = 'block';
        if (improvedDisplay) improvedDisplay.classList.remove('is-active');
      }
    });
  }
}
