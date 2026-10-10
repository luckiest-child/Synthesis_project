/**
 * ============================================================================
 * LUMINA - HEARING ACCESSIBILITY SCRIPT (hearing.js)
 * Manages the silent video-style audio broadcast simulation, task attempt tracking,
 * gated toggle unlocking, and the accessible synchronized captioned player.
 * Pure Vanilla JavaScript (ES6).
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initHearingExperience();
});

function initHearingExperience() {
  const attemptForm = document.getElementById('hearing-attempt-form');
  const challengeFeedback = document.getElementById('hearing-challenge-feedback');
  const skipBtn = document.getElementById('btn-skip-hearing-challenge');
  const gateStatus = document.getElementById('hearing-gate-status');
  const toggleBtn = document.getElementById('hearing-toggle-btn');
  const improvedDisplay = document.getElementById('hearing-improved-display');
  const originalDisplay = document.getElementById('hearing-original-display');
  const playSilentBtn = document.getElementById('btn-play-silent-broadcast');
  const silentScreenText = document.getElementById('silent-screen-indicator');

  let isCompleted = false;

  // 1. Silent video-style playback simulation
  if (playSilentBtn && silentScreenText) {
    playSilentBtn.addEventListener('click', () => {
      silentScreenText.textContent = '▶ Broadcast Playing: [Speaker talking on screen &bull; Audio track unavailable &bull; No captions available]';
      playSilentBtn.textContent = 'Replay Broadcast';
      playSilentBtn.setAttribute('aria-label', 'Replay silent broadcast');
    });
  }

  // 2. Handling the task attempt
  if (attemptForm) {
    attemptForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const selected = attemptForm.querySelector('input[name="transit_gate"]:checked');

      if (!selected) {
        showFeedback(challengeFeedback, 'Please select an option to submit your response.', 'warning');
        return;
      }

      completeChallenge(
        '<strong>Task Attempted:</strong> Notice how you had to guess an answer because the spoken instruction was delivered without captions or text alternatives. When public transit hubs, lectures, or video calls omit captions, d/Deaf individuals miss critical directions entirely.'
      );
    });
  }

  // 3. Skip simulation button
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      completeChallenge(
        '<strong>Simulation Bypassed:</strong> In this demonstration, the transit announcement communicated essential gate changes through speech alone with no text alternative on screen, leaving visitors unable to hear completely excluded.'
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
        toggleBtn.textContent = 'Switch to Original (Silent Audio)';
        toggleBtn.classList.add('is-active');
        if (originalDisplay) originalDisplay.style.display = 'none';
        if (improvedDisplay) improvedDisplay.classList.add('is-active');
      } else {
        toggleBtn.textContent = 'Switch to Improved (Captioned)';
        toggleBtn.classList.remove('is-active');
        if (originalDisplay) originalDisplay.style.display = 'block';
        if (improvedDisplay) improvedDisplay.classList.remove('is-active');
      }
    });
  }
}
