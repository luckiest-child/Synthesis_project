/**
 * ============================================================================
 * LUMINA - CORE SCRIPT (main.js)
 * Accessible navigation disclosure, skip-link focus management, and page tracking.
 * Pure Vanilla JavaScript (ES6).
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initSkipLink();
});

/**
 * Accessible mobile navigation disclosure
 * Controls aria-expanded, toggles visibility, and listens for Escape key.
 */
function initMobileNav() {
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.querySelector('.primary-nav');

  if (!navToggle || !primaryNav) return;

  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    const nextState = !isExpanded;

    navToggle.setAttribute('aria-expanded', String(nextState));
    primaryNav.classList.toggle('is-open', nextState);
    navToggle.setAttribute('aria-label', nextState ? 'Close navigation' : 'Open navigation');
  });

  // Close menu when Escape key is pressed
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && primaryNav.classList.contains('is-open')) {
      navToggle.setAttribute('aria-expanded', 'false');
      primaryNav.classList.remove('is-open');
      navToggle.setAttribute('aria-label', 'Open navigation');
      navToggle.focus();
    }
  });

  // Close menu if clicked outside
  document.addEventListener('click', (event) => {
    if (primaryNav.classList.contains('is-open') &&
        !primaryNav.contains(event.target) &&
        !navToggle.contains(event.target)) {
      navToggle.setAttribute('aria-expanded', 'false');
      primaryNav.classList.remove('is-open');
      navToggle.setAttribute('aria-label', 'Open navigation');
    }
  });
}

/**
 * Skip-link focus shift management (WCAG 2.4.1)
 * Ensures keyboard focus moves reliably to the main container.
 */
function initSkipLink() {
  const skipLink = document.querySelector('.skip-link');
  const mainContent = document.getElementById('main-content');

  if (!skipLink || !mainContent) return;

  skipLink.addEventListener('click', () => {
    mainContent.setAttribute('tabindex', '-1');
    mainContent.focus();
    mainContent.addEventListener('blur', () => {
      mainContent.removeAttribute('tabindex');
    }, { once: true });
  });
}
