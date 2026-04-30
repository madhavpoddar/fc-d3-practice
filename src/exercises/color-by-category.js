export default {
  id: 'color-by-category',
  title: 'Color by category',
  preTask: `
When you encode a third variable as color, a scatterplot becomes much more useful. For categories:

\`\`\`js
const colorScale = d3.scaleOrdinal()
  .domain(genres)
  .range(d3.schemeTableau10);
\`\`\`

\`d3.schemeTableau10\` is a built-in palette of 10 clear, accessible colors. Other options: \`schemeCategory10\`, \`schemeSet2\`, \`schemeDark2\`.
  `.trim(),
  postTask: `
For continuous values (rating, temperature, age), use \`d3.scaleSequential\` with a color interpolator (\`d3.interpolateBlues\` and so on). Different scale, same idea.
  `.trim(),
  tasks: [
    {
      id: 'apply-color',
      title: 'Color the dots by genre',
      description: 'Two changes: (1) define `colorScale` near the top, (2) update the `fill` attribute to use it.',
      starterCode: `d3.json("data/movies.json").then(movies => {
  const genres = [...new Set(movies.map(d => d.genre))];

  // TODO: define colorScale here

  const xScale = d3.scaleLinear()
    .domain(d3.extent(movies, d => d.runtime)).nice()
    .range([30, 570]);
  const yScale = d3.scaleLinear()
    .domain(d3.extent(movies, d => d.rating)).nice()
    .range([270, 30]);

  d3.select("#chart")
    .selectAll("circle")
    .data(movies)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.runtime))
    .attr("cy", d => yScale(d.rating))
    .attr("r", 7)
    .attr("fill", "#2b3a55")               // <-- replace with d => colorScale(d.genre)
    .attr("fill-opacity", 0.85);
});
`,
      lockedRanges: [
        { from: 1, to: 2 },
        { from: 5, to: 20 },
        { from: 22, to: 23 }
      ],
      hint: 'const colorScale = d3.scaleOrdinal().domain(genres).range(d3.schemeTableau10); — then .attr("fill", d => colorScale(d.genre)).',
      solution: `d3.json("data/movies.json").then(movies => {
  const genres = [...new Set(movies.map(d => d.genre))];

  const colorScale = d3.scaleOrdinal()
    .domain(genres)
    .range(d3.schemeTableau10);

  const xScale = d3.scaleLinear()
    .domain(d3.extent(movies, d => d.runtime)).nice()
    .range([30, 570]);
  const yScale = d3.scaleLinear()
    .domain(d3.extent(movies, d => d.rating)).nice()
    .range([270, 30]);

  d3.select("#chart")
    .selectAll("circle")
    .data(movies)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.runtime))
    .attr("cy", d => yScale(d.rating))
    .attr("r", 7)
    .attr("fill", d => colorScale(d.genre))
    .attr("fill-opacity", 0.85);
});
`,
      iframe: { width: 620, height: 320, html: '<svg id="chart" width="600" height="300" style="border:1px dashed #d6dae4;"></svg>' }
    }
  ]
};
