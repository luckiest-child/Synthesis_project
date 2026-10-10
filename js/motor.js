/**
 * ============================================================================
 * LUMINA - MOTOR ACCESSIBILITY SCRIPT (motor.js)
 * Manages the pointer-suppressed keyboard challenge, sequential completion tracking,
 * gated toggle unlocking, and the accessible keyboard/pointer grid.
 * Pure Vanilla JavaScript (ES6).
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initMotorExperience();
});

function initMotorExperience() {
  const step1Btn = document.getElementById('motor-step-1');
  const step2Btn = document.getElementById('motor-step-2');
  const step3Btn = document.getElementById('motor-step-3');
  const keyboardFeedback = document.getElementById('motor-keyboard-feedback');
  const challengeFeedback = document.getElementById('motor-challenge-feedback');
  const skipBtn = document.getElementById('btn-skip-motor-challenge');
  const gateStatus = document.getElementById('motor-gate-status');
  const toggleBtn = document.getElementById('motor-toggle-btn');
  const improvedDisplay = document.getElementById('motor-improved-display');
  const originalDisplay = document.getElementById('motor-original-display');

  let isCompleted = false;
  let stepsDone = { 1: false, 2: false, 3: false };

  // 1. Keyboard task sequence
  if (step1Btn && step2Btn && step3Btn) {
    step1Btn.addEventListener('click', (e) => {
      // In pointer-suppressed area, mouse events are disabled via CSS pointer-events: none.
      // Keyboard activation via Enter/Space triggers click event.
      stepsDone[1] = true;
      step1Btn.textContent = '✓ Step 1: Document Loaded';
      step1Btn.style.backgroundColor = '#ECECE8';
      updateKeyboardStatus('Step 1 complete. Now navigate to Step 2 using Tab.');
      checkAllSteps();
    });

    step2Btn.addEventListener('click', () => {
      if (!stepsDone[1]) {
        updateKeyboardStatus('Please complete Step 1 first.');
        return;
      }
      stepsDone[2] = true;
      step2Btn.textContent = '✓ Step 2: Settings Verified';
      step2Btn.style.backgroundColor = '#ECECE8';
      updateKeyboardStatus('Step 2 complete. Tab to Step 3 to submit.');
      checkAllSteps();
    });

    step3Btn.addEventListener('click', () => {
      if (!stepsDone[1] || !stepsDone[2]) {
        updateKeyboardStatus('Please complete Steps 1 and 2 before submitting.');
        return;
      }
      stepsDone[3] = true;
      step3Btn.textContent = '✓ Step 3: Submitted';
      step3Btn.style.backgroundColor = '#ECECE8';
      checkAllSteps();
    });
  }

  function updateKeyboardStatus(msg) {
    if (keyboardFeedback) {
      keyboardFeedback.textContent = msg;
    }
  }

  function checkAllSteps() {
    if (stepsDone[1] && stepsDone[2] && stepsDone[3]) {
      completeChallenge(
        '<strong>Sequence Completed via Keyboard:</strong> Notice how exhausting it was to navigate with an awkward tab sequence and missing focus indicators. For someone with repetitive strain injury, tremors, or using a switch device, unpredictable tab stops cause severe physical fatigue.'
      );
    }
  }

  // 2. Skip simulation button
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      completeChallenge(
        '<strong>Simulation Bypassed:</strong> This task required navigating sequential controls using only a keyboard across awkward tab stops and suppressed pointer input, demonstrating the friction of poorly structured motor interfaces.'
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
        toggleBtn.textContent = 'Switch to Original (Inaccessible Keyboard)';
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
}
