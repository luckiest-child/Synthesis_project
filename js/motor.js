/**
 * ============================================================================
 * LUMINA - MOTOR ACCESSIBILITY SCRIPT (motor.js)
 * Deliberately mismatched task/tab order, pointer suppression without positive tabindex,
 * no auto-scroll upon completion, and interactive second attempt in improved version.
 * Pure Vanilla JavaScript (ES6).
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initMotorExperience();
});

function initMotorExperience() {
  // Elements for Original Challenge
  const controlsContainer = document.getElementById('motor-controls-container');
  const step1Btn = document.getElementById('motor-step-1');
  const step2Btn = document.getElementById('motor-step-2');
  const step3Btn = document.getElementById('motor-step-3');
  const keyboardFeedback = document.getElementById('motor-keyboard-feedback');
  const challengeFeedback = document.getElementById('motor-challenge-feedback');
  const skipBtn = document.getElementById('btn-skip-motor-challenge');

  // Gated Toggle Elements
  const gateStatus = document.getElementById('motor-gate-status');
  const toggleBtn = document.getElementById('motor-toggle-btn');
  const improvedDisplay = document.getElementById('motor-improved-display');
  const originalDisplay = document.getElementById('motor-original-display');

  // Elements for Improved Second-Attempt Task
  const impStep1Btn = document.getElementById('motor-improved-step-1');
  const impStep2Btn = document.getElementById('motor-improved-step-2');
  const impStep3Btn = document.getElementById('motor-improved-step-3');
  const impFeedback = document.getElementById('motor-improved-feedback');

  let isOriginalCompleted = false;
  let originalSteps = { 1: false, 2: false, 3: false };
  let improvedSteps = { 1: false, 2: false, 3: false };

  // --------------------------------------------------------------------------
  // 1. Original Challenge: Pointer Suppression & Keyboard Sequence
  // --------------------------------------------------------------------------
  if (controlsContainer) {
    // Intercept mouse pointer clicks strictly within the challenge container
    controlsContainer.addEventListener('mousedown', (e) => {
      // If user clicks with mouse, block it and guide to keyboard
      e.preventDefault();
      updateKeyboardStatus('Pointer click blocked: please navigate using Tab and activate with Enter or Space.');
    });
  }

  // Handle keyboard activations for original steps
  if (step1Btn && step2Btn && step3Btn) {
    step1Btn.addEventListener('click', (e) => {
      // In standard browsers, mouse click has detail > 0, keyboard has detail === 0
      if (e.detail > 0) {
        updateKeyboardStatus('Pointer click blocked: use Enter or Space to activate Step 1.');
        return;
      }
      originalSteps[1] = true;
      step1Btn.textContent = '✓ Step 1: Loaded';
      step1Btn.style.backgroundColor = '#ECECE8';
      updateKeyboardStatus('Step 1 complete. Press Tab to continue; Step 3 appears before Step 2 in the tab order.');
      checkOriginalSteps();
    });

    step2Btn.addEventListener('click', (e) => {
      if (e.detail > 0) {
        updateKeyboardStatus('Pointer click blocked: use Enter or Space to activate Step 2.');
        return;
      }
      if (!originalSteps[1]) {
        updateKeyboardStatus('Sequence error: You must complete Step 1 before Step 2.');
        return;
      }
      originalSteps[2] = true;
      step2Btn.textContent = '✓ Step 2: Verified';
      step2Btn.style.backgroundColor = '#ECECE8';
      updateKeyboardStatus('Step 2 complete. Press Shift+Tab twice to return to Step 3.');
      checkOriginalSteps();
    });

    step3Btn.addEventListener('click', (e) => {
      if (e.detail > 0) {
        updateKeyboardStatus('Pointer click blocked: use Enter or Space to activate Step 3.');
        return;
      }
      if (!originalSteps[1] || !originalSteps[2]) {
        updateKeyboardStatus('Sequence error: Please complete Steps 1 and 2 before Step 3.');
        return;
      }
      originalSteps[3] = true;
      step3Btn.textContent = '✓ Step 3: Submitted';
      step3Btn.style.backgroundColor = '#ECECE8';
      checkOriginalSteps();
    });
  }

  function updateKeyboardStatus(msg) {
    if (keyboardFeedback) {
      keyboardFeedback.textContent = msg;
    }
  }

  function checkOriginalSteps() {
    if (originalSteps[1] && originalSteps[2] && originalSteps[3]) {
      completeOriginalChallenge(
        '<strong>Sequence Completed via Keyboard:</strong> Notice how difficult it was to navigate with small, cramped buttons and awkward intermediate tab stops. For someone with motor tremors, fatigue, or using switch devices, awkward keyboard flow causes severe physical strain.'
      );
    }
  }

  // Skip simulation button
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      completeOriginalChallenge(
        '<strong>Simulation Bypassed:</strong> This task required navigating sequential controls using only the keyboard across small targets and intermediate options, demonstrating the physical friction of poorly structured motor interfaces.'
      );
    });
  }

  function completeOriginalChallenge(explanationHtml) {
    if (isOriginalCompleted) return;
    isOriginalCompleted = true;

    // Display explanation AND the clear completion notification WITHOUT moving page/focus
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
        toggleBtn.textContent = 'Switch to Original (Awkward Flow)';
        toggleBtn.classList.add('is-active');
        if (originalDisplay) originalDisplay.style.display = 'none';
        if (improvedDisplay) improvedDisplay.classList.add('is-active');
      } else {
        toggleBtn.textContent = 'Switch to Improved (Accessible Flow)';
        toggleBtn.classList.remove('is-active');
        if (originalDisplay) originalDisplay.style.display = 'block';
        if (improvedDisplay) improvedDisplay.classList.remove('is-active');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. Improved Experience: Second Attempt Interaction
  // --------------------------------------------------------------------------
  if (impStep1Btn && impStep2Btn && impStep3Btn) {
    impStep1Btn.addEventListener('click', () => {
      improvedSteps[1] = true;
      impStep1Btn.textContent = '✓ 1. Document Loaded';
      impStep1Btn.style.backgroundColor = 'var(--color-surface-hover)';
      checkImprovedSteps();
    });

    impStep2Btn.addEventListener('click', () => {
      if (!improvedSteps[1]) {
        showImprovedFeedback('Please activate Step 1 first.', 'warning');
        return;
      }
      improvedSteps[2] = true;
      impStep2Btn.textContent = '✓ 2. Settings Verified';
      impStep2Btn.style.backgroundColor = 'var(--color-surface-hover)';
      checkImprovedSteps();
    });

    impStep3Btn.addEventListener('click', () => {
      if (!improvedSteps[1] || !improvedSteps[2]) {
        showImprovedFeedback('Please activate Steps 1 and 2 before finalizing.', 'warning');
        return;
      }
      improvedSteps[3] = true;
      impStep3Btn.textContent = '✓ 3. Submission Finalized';
      impStep3Btn.style.backgroundColor = 'var(--color-surface-hover)';
      checkImprovedSteps();
    });
  }

  function checkImprovedSteps() {
    if (improvedSteps[1] && improvedSteps[2] && improvedSteps[3]) {
      showImprovedFeedback(
        '✓ Task Completed Comfortably: In this accessible version, generous 48px targets, natural tab order, and prominent focus indicators allow you to complete the task effortlessly with either a keyboard or pointer.',
        'success'
      );
    }
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
