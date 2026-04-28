export default {
  id: 'scaleband',
  title: 'scaleBand',
  preTask: `
\`scaleLinear\` only handles numbers. If you put **categories** (genre names, country names) on an axis with a linear scale, you get \`NaN\` everywhere.

For categories, use \`d3.scaleBand\`:

\`\`\`js
const xScale = d3.scaleBand()
  .domain(["Comedy", "Horror", "Sci-Fi"])
  .range([0, 600])
  .padding(0.2);
\`\`\`

\`xScale("Sci-Fi")\` returns the **left edge** of that band. \`xScale.bandwidth()\` is the width.
  `.trim(),
  postTask: `
Use \`scaleBand\` whenever your axis is a list of names. Its sibling \`scalePoint\` returns one point per category instead of a band — useful for scatter plots over categories.
  `.trim(),
  tasks: [
    {
      id: 'replace-linear',
      title: 'Switch to scaleBand',
      description: 'Replace the broken `scaleLinear` with `scaleBand`. Use `.padding(0.2)`. Then change the `width` from a fixed `50` to `xScale.bandwidth()`.',
      starterCode: `d3.csv("data/movies.csv").then(movies => {

  const genres = [...new Set(movies.map(d => d.genre))];

  // BUG: scaleLinear cannot handle category strings.
  const xScale = d3.scaleLinear()
    .domain(genres)
    .range([40, 560]);

  const counts = d3.rollup(movies, v => v.length, d => d.genre);
  const yScale = d3.scaleLinear().domain([0, d3.max(counts.values())]).range([260, 20]);

  d3.select("#chart")
    .selectAll("rect")
    .data(genres)
    .join("rect")
    .attr("x", d => xScale(d))
    .attr("y", d => yScale(counts.get(d)))
    .attr("width", 50)                       // <-- replace with xScale.bandwidth()
    .attr("height", d => 260 - yScale(counts.get(d)))
    .attr("fill", "#2b3a55");
});
`,
      lockedRanges: [
        { from: 1, to: 4 },
        { from: 9, to: 18 },
        { from: 20, to: 23 }
      ],
      hint: 'd3.scaleBand().domain(genres).range([40, 560]).padding(0.2). Then .attr("width", xScale.bandwidth()).',
      solution: `d3.csv("data/movies.csv").then(movies => {

  const genres = [...new Set(movies.map(d => d.genre))];

  const xScale = d3.scaleBand()
    .domain(genres)
    .range([40, 560])
    .padding(0.2);

  const counts = d3.rollup(movies, v => v.length, d => d.genre);
  const yScale = d3.scaleLinear().domain([0, d3.max(counts.values())]).range([260, 20]);

  d3.select("#chart")
    .selectAll("rect")
    .data(genres)
    .join("rect")
    .attr("x", d => xScale(d))
    .attr("y", d => yScale(counts.get(d)))
    .attr("width", xScale.bandwidth())
    .attr("height", d => 260 - yScale(counts.get(d)))
    .attr("fill", "#2b3a55");
});
`,
      iframe: { width: 620, height: 320, html: '<svg id="chart" width="600" height="280" style="border:1px dashed #d6dae4;"></svg>' }
    }
  ]
};
