/**
 * ============================================================================
 * LUMINA - VISUAL ACCESSIBILITY SCRIPT (visual.js)
 * Manages obscured visual simulation, in-place completion notice without auto-scroll,
 * and an interactive second attempt in the improved version.
 * Pure Vanilla JavaScript (ES6).
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initVisualExperience();
});

function initVisualExperience() {
  // Elements for Original Challenge
  const attemptForm = document.getElementById('visual-attempt-form');
  const challengeFeedback = document.getElementById('visual-challenge-feedback');
  const skipBtn = document.getElementById('btn-skip-visual-challenge');

  // Gated Toggle Elements
  const gateStatus = document.getElementById('visual-gate-status');
  const toggleBtn = document.getElementById('visual-toggle-btn');
  const improvedDisplay = document.getElementById('visual-improved-display');
  const originalDisplay = document.getElementById('visual-original-display');

  // Elements for Improved Second-Attempt Task
  const impAttemptForm = document.getElementById('visual-improved-attempt-form');
  const impFeedback = document.getElementById('visual-improved-feedback');

  let isOriginalCompleted = false;

  // --------------------------------------------------------------------------
  // 1. Original Challenge Submission (No Auto-Scrolling)
  // --------------------------------------------------------------------------
  if (attemptForm) {
    attemptForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const selected = attemptForm.querySelector('input[name="dosage_choice"]:checked');

      if (!selected) {
        showFeedback(challengeFeedback, 'Please select a dosage option to make your decision.', 'warning');
        return;
      }

      completeOriginalChallenge(
        '<strong>Task Attempted:</strong> You had to guess because the crucial dosage text was completely obscured inside the visual graphic. In real-world digital services, unlabelled medical labels or inaccessible portals force people with visual impairments to guess or rely on strangers for basic safety.'
      );
    });
  }

  // Skip simulation button
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      completeOriginalChallenge(
        '<strong>Simulation Bypassed:</strong> In this demonstration, the crucial medication dosage was embedded solely inside an image with no text alternative, leaving someone who cannot see the graphic completely without access.'
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

  // --------------------------------------------------------------------------
  // 3. Improved Experience: Second Attempt Interaction
  // --------------------------------------------------------------------------
  if (impAttemptForm) {
    impAttemptForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const selected = impAttemptForm.querySelector('input[name="imp_dosage_choice"]:checked');

      if (!selected) {
        showImprovedFeedback('Please select an option to verify your dosage.', 'warning');
        return;
      }

      if (selected.value === '25mg') {
        showImprovedFeedback(
          '✓ Dosage Verified Successfully: Because the instructions are rendered in accessible, high-contrast text rather than an obscured or unlabelled graphic, you were able to identify and verify the dosage independently and accurately.',
          'success'
        );
      } else {
        showImprovedFeedback(
          'Please re-read the prescription text above carefully: The prescribed dosage is 25mg twice daily after meals.',
          'warning'
        );
      }
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
