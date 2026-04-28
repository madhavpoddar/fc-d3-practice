export default {
  id: 'line-chart',
  title: 'Line chart',
  preTask: `
For bars and scatterplots, you create one DOM element per data point. For a **line chart**, you create *one* element — a single \`<path>\` whose \`d\` attribute draws a line through every point.

\`\`\`js
const lineGen = d3.line()
  .x(d => xScale(+d.runtime))
  .y(d => yScale(+d.imdb));

svg.append("path")
  .attr("d", lineGen(sortedData))   // produces "M 10 200 L 50 180 ..."
  .attr("fill", "none")             // important — paths fill black by default
  .attr("stroke", "steelblue")
  .attr("stroke-width", 2);
\`\`\`

Do not forget \`fill="none"\`. Without it, the path fills the area under the line.
  `.trim(),
  postTask: `
\`d3.line\` is one of several path generators. Others: \`d3.area\`, \`d3.arc\` (pie charts), and curve types like \`d3.curveBasis\` for smoothing.
  `.trim(),
  tasks: [
    {
      id: 'build-line',
      title: 'Build the path',
      description: 'Define a line generator and append a single `<path>` to the inner group. The data is already sorted by runtime.',
      starterCode: `d3.csv("data/movies.csv").then(movies => {
  const width = 620, height = 320;
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };
  const innerWidth  = width  - margin.left - margin.right;
  const innerHeight = height - margin.top  - margin.bottom;

  movies.sort((a, b) => +a.runtime - +b.runtime);

  const xScale = d3.scaleLinear()
    .domain(d3.extent(movies, d => +d.runtime)).nice()
    .range([0, innerWidth]);
  const yScale = d3.scaleLinear()
    .domain(d3.extent(movies, d => +d.imdb)).nice()
    .range([innerHeight, 0]);

  const svg = d3.select("#chart");
  const inner = svg.append("g").attr("transform", \`translate(\${margin.left}, \${margin.top})\`);

  // TODO: define d3.line() generator and append a single <path>.

  inner.append("g").attr("transform", \`translate(0, \${innerHeight})\`).call(d3.axisBottom(xScale));
  inner.append("g").call(d3.axisLeft(yScale));
});
`,
      lockedRanges: [
        { from: 1, to: 18 },
        { from: 21, to: 24 }
      ],
      hint: 'const lineGen = d3.line().x(d => xScale(+d.runtime)).y(d => yScale(+d.imdb));   inner.append("path").attr("d", lineGen(movies)).attr("fill", "none").attr("stroke", "#e36588").attr("stroke-width", 2);',
      solution: `d3.csv("data/movies.csv").then(movies => {
  const width = 620, height = 320;
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };
  const innerWidth  = width  - margin.left - margin.right;
  const innerHeight = height - margin.top  - margin.bottom;

  movies.sort((a, b) => +a.runtime - +b.runtime);

  const xScale = d3.scaleLinear()
    .domain(d3.extent(movies, d => +d.runtime)).nice()
    .range([0, innerWidth]);
  const yScale = d3.scaleLinear()
    .domain(d3.extent(movies, d => +d.imdb)).nice()
    .range([innerHeight, 0]);

  const svg = d3.select("#chart");
  const inner = svg.append("g").attr("transform", \`translate(\${margin.left}, \${margin.top})\`);

  const lineGen = d3.line()
    .x(d => xScale(+d.runtime))
    .y(d => yScale(+d.imdb));

  inner.append("path")
    .attr("d", lineGen(movies))
    .attr("fill", "none")
    .attr("stroke", "#e36588")
    .attr("stroke-width", 2);

  inner.selectAll("circle").data(movies).join("circle")
    .attr("cx", d => xScale(+d.runtime)).attr("cy", d => yScale(+d.imdb))
    .attr("r", 3).attr("fill", "#1f2540");

  inner.append("g").attr("transform", \`translate(0, \${innerHeight})\`).call(d3.axisBottom(xScale));
  inner.append("g").call(d3.axisLeft(yScale));
});
`,
      iframe: { width: 640, height: 360, html: '<svg id="chart" width="620" height="320"></svg>' }
    }
  ]
};
