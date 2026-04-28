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
      starterCode: `d3.csv("data/movies.csv").then(movies => {
  const width = 620, height = 360;
  const margin = { top: 20, right: 30, bottom: 50, left: 50 };
  const innerWidth  = width  - margin.left - margin.right;
  const innerHeight = height - margin.top  - margin.bottom;

  const genres = [...new Set(movies.map(d => d.genre))];

  // TODO: define colorScale here

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
    .attr("r", 7)
    .attr("fill", "#2b3a55")               // <-- replace with d => colorScale(d.genre)
    .attr("fill-opacity", 0.85);

  inner.append("g").attr("transform", \`translate(0, \${innerHeight})\`).call(d3.axisBottom(xScale));
  inner.append("g").call(d3.axisLeft(yScale));
});
`,
      lockedRanges: [
        { from: 1, to: 7 },
        { from: 10, to: 25 },
        { from: 27, to: 31 }
      ],
      hint: 'const colorScale = d3.scaleOrdinal().domain(genres).range(d3.schemeTableau10); then .attr("fill", d => colorScale(d.genre)).',
      solution: `d3.csv("data/movies.csv").then(movies => {
  const width = 620, height = 360;
  const margin = { top: 20, right: 30, bottom: 50, left: 50 };
  const innerWidth  = width  - margin.left - margin.right;
  const innerHeight = height - margin.top  - margin.bottom;

  const genres = [...new Set(movies.map(d => d.genre))];

  const colorScale = d3.scaleOrdinal()
    .domain(genres)
    .range(d3.schemeTableau10);

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
    .attr("r", 7)
    .attr("fill", d => colorScale(d.genre))
    .attr("fill-opacity", 0.85);

  inner.append("g").attr("transform", \`translate(0, \${innerHeight})\`).call(d3.axisBottom(xScale));
  inner.append("g").call(d3.axisLeft(yScale));
});
`,
      iframe: { width: 640, height: 400, html: '<svg id="chart" width="620" height="360"></svg>' }
    }
  ]
};
