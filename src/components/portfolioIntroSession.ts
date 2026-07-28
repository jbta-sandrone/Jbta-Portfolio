export const PORTFOLIO_INTRO_SESSION_KEY = "jbta-portfolio-intro-seen";

export function shouldShowPortfolioIntro() {
  try {
    return window.sessionStorage.getItem(PORTFOLIO_INTRO_SESSION_KEY) !== "true";
  } catch {
    return true;
  }
}

export function markPortfolioIntroSeen() {
  try {
    window.sessionStorage.setItem(PORTFOLIO_INTRO_SESSION_KEY, "true");
  } catch {
    // Storage can be unavailable in privacy-restricted contexts.
  }
}
