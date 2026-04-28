// Build a self-contained, runnable HTML document from the student's current code.
// D3 v7 is loaded as ESM from jsdelivr, then attached to window so the user code
// (which uses `d3.select(...)` etc.) "just works" without further changes.
//
// The exported file has a <base> pointing to the current app origin, so relative
// URLs like `d3.csv("data/movies.csv")` continue to resolve to the deployed app.
// (If the app is taken down, the file would need the data alongside it.)

function htmlEscape(s) {
  return String(s).replace(/[<>&"']/g, (c) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// Closing </script> tags inside an inline script must be split, or the parser
// will end the outer <script>. Replace with a safe split.
function safeScriptBody(code) {
  return String(code).replace(/<\/script>/gi, '<\\/script>');
}

export function buildStandaloneHtml({ title, code, bodyHtml, extraCss, baseHref }) {
  const safeTitle = htmlEscape(title || 'D3 Practice — exported task');
  const safeBody  = bodyHtml ?? '<svg id="chart" width="600" height="400"></svg>';
  const safeCss   = extraCss ?? '';
  const baseTag   = baseHref ? `<base href="${htmlEscape(baseHref)}">` : '';

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${safeTitle}</title>
${baseTag}
<style>
  body { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; margin: 16px; color: #1f2540; }
  svg { background: #ffffff; }
  ${safeCss}
</style>
</head>
<body>
<!--
  Exported from D3 Practice Tasks.
  D3 v7 is loaded as an ES module from jsdelivr and attached to window.d3
  so that code written like \`d3.select(...)\` keeps working unchanged.
  If your code loads "data/movies.csv" or similar, the <base> tag above
  points back at the originating app so relative URLs still resolve.
-->
${safeBody}
<script type="module">
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
window.d3 = d3;

${safeScriptBody(code)}
</script>
</body>
</html>
`;
}

export function downloadStandaloneHtml(opts, filename) {
  const html = buildStandaloneHtml(opts);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'task.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
