// Axes — two related tasks.

const sharedHead = `d3.csv("data/movies.csv").then(movies => {
  const width = 620, height = 360;
  const margin = { top: 20, right: 30, bottom: 50, left: 50 };
  const innerWidth  = width  - margin.left - margin.right;
  const innerHeight = height - margin.top  - margin.bottom;

  const xScale = d3.scaleLinear()
    .domain(d3.extent(movies, d => +d.runtime)).nice()
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain(d3.extent(movies, d => +d.imdb)).nice()
    .range([innerHeight, 0]);

  const svg = d3.select("#chart");
  const inner = svg.append("g")
    .attr("transform", \`translate(\${margin.left}, \${margin.top})\`);

  inner.selectAll("circle")
    .data(movies).join("circle")
    .attr("cx", d => xScale(+d.runtime))
    .attr("cy", d => yScale(+d.imdb))
    .attr("r", 6)
    .attr("fill", "#2b3a55").attr("fill-opacity", 0.7);
`;

const ifr = { width: 640, height: 400, html: '<svg id="chart" width="620" height="360"></svg>' };

export default {
  id: 'axes',
  title: 'Axes',
  preTask: `
A scatterplot without axes is just a cloud of dots. D3 builds axes for you when you give it a scale.

\`\`\`js
const xAxis = d3.axisBottom(xScale);
inner.append("g")
   .attr("transform", "translate(0, " + innerHeight + ")")
   .call(xAxis);
\`\`\`

There are four builders: \`axisBottom\`, \`axisTop\`, \`axisLeft\`, \`axisRight\`. The name says where the labels go.

The starter code already uses the **margin convention** — a common pattern. It has a \`margin = {top, right, bottom, left}\` object, an inner \`<g>\` translated by \`(margin.left, margin.top)\`, and \`innerWidth\` / \`innerHeight\` for everything inside.
  `.trim(),
  postTask: `
The margin convention is not a D3 thing. It is a pattern that almost every D3 chart uses. Stick to it and your charts will look polished without much effort.
  `.trim(),
  tasks: [
    {
      id: 'add-axes',
      title: 'Add bottom and left axes',
      description: 'Append two `<g>` elements to `inner`. One for the bottom axis (translated to `innerHeight`), one for the left axis. Use `d3.axisBottom(xScale)` and `d3.axisLeft(yScale)`.',
      starterCode: `${sharedHead}
  // TODO: append a <g> for the bottom axis (translated to innerHeight) and call d3.axisBottom(xScale).
  // TODO: append a <g> for the left axis and call d3.axisLeft(yScale).
});
`,
      lockedRanges: [{ from: 1, to: 26 }],
      hint: 'inner.append("g").attr("transform", `translate(0, ${innerHeight})`).call(d3.axisBottom(xScale));   inner.append("g").call(d3.axisLeft(yScale));',
      solution: `${sharedHead}
  inner.append("g")
    .attr("transform", \`translate(0, \${innerHeight})\`)
    .call(d3.axisBottom(xScale));

  inner.append("g")
    .call(d3.axisLeft(yScale));
});
`,
      iframe: ifr
    },
    {
      id: 'axis-label',
      title: 'Add an axis label (and inspect it)',
      description: `Add an SVG \`<text>\` element below the bottom axis. Label it "Runtime (min)", centered horizontally. Use \`text-anchor="middle"\` and place it at \`(innerWidth/2, innerHeight + 40)\`.

**Then open dev tools** (F12 → Elements). Hover over the bottom axis \`<g>\` and look at the \`transform\` attribute and the auto-generated tick labels. None of those numbers were typed by hand — D3 made them from the scale.`,
      starterCode: `${sharedHead}
  inner.append("g")
    .attr("transform", \`translate(0, \${innerHeight})\`)
    .call(d3.axisBottom(xScale));

  inner.append("g")
    .call(d3.axisLeft(yScale));

  // TODO: append an SVG <text> labeled "Runtime (min)" centered below the bottom axis.
});
`,
      lockedRanges: [{ from: 1, to: 33 }],
      hint: 'inner.append("text").attr("x", innerWidth/2).attr("y", innerHeight + 40).attr("text-anchor", "middle").attr("fill", "#1f2540").text("Runtime (min)");',
      solution: `${sharedHead}
  inner.append("g")
    .attr("transform", \`translate(0, \${innerHeight})\`)
    .call(d3.axisBottom(xScale));

  inner.append("g")
    .call(d3.axisLeft(yScale));

  inner.append("text")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + 40)
    .attr("text-anchor", "middle")
    .attr("fill", "#1f2540")
    .text("Runtime (min)");
});
`,
      iframe: ifr
    }
  ]
};
