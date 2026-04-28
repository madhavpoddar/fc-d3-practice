// SPA mode: adapter-static still prerenders the shell, but components run only in the browser.
// Justification: this is a code-playground app — server rendering of CodeMirror / iframe-based
// preview adds complexity with zero benefit since none of the content is meaningful pre-hydration.
export const prerender = true;
export const ssr = false;
export const trailingSlash = 'never';
