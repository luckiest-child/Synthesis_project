/**
 * ============================================================================
 * LUMINA - HEARING ACCESSIBILITY SCRIPT (hearing.js)
 * Manages silent broadcast simulation, in-place completion notice without auto-scroll,
 * and an interactive second attempt in the improved captioned player.
 * Pure Vanilla JavaScript (ES6).
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initHearingExperience();
});

function initHearingExperience() {
  // Elements for Original Challenge
  const attemptForm = document.getElementById('hearing-attempt-form');
  const challengeFeedback = document.getElementById('hearing-challenge-feedback');
  const skipBtn = document.getElementById('btn-skip-hearing-challenge');
  const playSilentBtn = document.getElementById('btn-play-silent-broadcast');
  const silentScreenText = document.getElementById('silent-screen-indicator');

  // Gated Toggle Elements
  const gateStatus = document.getElementById('hearing-gate-status');
  const toggleBtn = document.getElementById('hearing-toggle-btn');
  const improvedDisplay = document.getElementById('hearing-improved-display');
  const originalDisplay = document.getElementById('hearing-original-display');

  // Elements for Improved Second-Attempt Task
  const playCaptionedBtn = document.getElementById('btn-play-captioned-broadcast');
  const liveCaptionBox = document.getElementById('live-caption-display');
  const visualAlertBanner = document.getElementById('visual-status-banner-improved');
  const impAttemptForm = document.getElementById('hearing-improved-attempt-form');
  const impFeedback = document.getElementById('hearing-improved-feedback');

  let isOriginalCompleted = false;

  // --------------------------------------------------------------------------
  // 1. Original Challenge: Silent Broadcast & Form Submission
  // --------------------------------------------------------------------------
  if (playSilentBtn && silentScreenText) {
    playSilentBtn.addEventListener('click', () => {
      silentScreenText.textContent = '▶ Broadcast Playing: [Speaker talking on screen &bull; Audio track unavailable &bull; No captions available]';
      playSilentBtn.textContent = 'Replay Broadcast';
      playSilentBtn.setAttribute('aria-label', 'Replay silent broadcast');
    });
  }

  if (attemptForm) {
    attemptForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const selected = attemptForm.querySelector('input[name="transit_gate"]:checked');

      if (!selected) {
        showFeedback(challengeFeedback, 'Please select an option to submit your response.', 'warning');
        return;
      }

      completeOriginalChallenge(
        '<strong>Task Attempted:</strong> Notice how you had to guess an answer because the spoken instruction was delivered without captions or text alternatives. When public transit hubs, lectures, or video calls omit captions, d/Deaf individuals miss critical directions entirely.'
      );
    });
  }

  // Skip simulation button
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      completeOriginalChallenge(
        '<strong>Simulation Bypassed:</strong> In this demonstration, the transit announcement communicated essential gate changes through speech alone with no text alternative on screen, leaving visitors unable to hear completely excluded.'
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

  // --------------------------------------------------------------------------
  // 3. Improved Experience: Second Attempt Interaction
  // --------------------------------------------------------------------------
  if (playCaptionedBtn) {
    playCaptionedBtn.addEventListener('click', () => {
      if (visualAlertBanner) visualAlertBanner.style.display = 'block';
      if (liveCaptionBox) {
        liveCaptionBox.style.display = 'block';
        liveCaptionBox.textContent = '🔊 [Captions]: "Attention all passengers: Track 1 is closed for maintenance. Please proceed to West Annex Bay 2 to board the replacement express shuttle."';
      }
      playCaptionedBtn.textContent = 'Replay Captioned Broadcast';
    });
  }

  if (impAttemptForm) {
    impAttemptForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const selected = impAttemptForm.querySelector('input[name="imp_transit_gate"]:checked');

      if (!selected) {
        showImprovedFeedback('Please select an option to submit your transit decision.', 'warning');
        return;
      }

      if (selected.value === 'west_annex') {
        showImprovedFeedback(
          '✓ Destination Confirmed: With synchronized captions and a visual alert banner, you received the critical spoken instructions in real time without needing audio.',
          'success'
        );
      } else {
        showImprovedFeedback(
          'Please review the captions or transcript above: The broadcast announces that passengers must board at West Annex Bay 2.',
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
