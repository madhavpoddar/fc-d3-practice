export default {
  id: 'bonus',
  title: 'Bonus: encode box office',
  preTask: `
You now have a smiley scatterplot with **x = runtime, y = rating, color = genre, expression = rating**. That is already four variables. Let us add one more: **box office revenue** (millions $) → **face size**.

\`\`\`js
const sizeScale = d3.scaleLinear()
  .domain(d3.extent(movies, d => +d.boxOffice))
  .range([8, 22]);
\`\`\`

Then \`.attr("r", d => sizeScale(+d.boxOffice))\` for the face. To keep the eyes and mouth in proportion, multiply their offsets by \`r/10\`.
  `.trim(),
  postTask: `
You have built a custom data-driven visualization in D3. That was the goal of this session. Well done.
  `.trim(),
  tasks: [
    {
      id: 'size-encoding',
      title: 'Make face size encode box office',
      description: 'Define `sizeScale`, then resize the face, eyes, and mouth in proportion. Open-ended — make it your own.',
      starterCode: `d3.csv("data/movies.csv").then(movies => {
  const width = 700, height = 400;
  const margin = { top: 20, right: 30, bottom: 50, left: 50 };
  const innerWidth  = width  - margin.left - margin.right;
  const innerHeight = height - margin.top  - margin.bottom;

  const genres = [...new Set(movies.map(d => d.genre))];
  const colorScale = d3.scaleOrdinal().domain(genres).range(d3.schemeTableau10);
  const xScale = d3.scaleLinear().domain(d3.extent(movies, d => +d.runtime)).nice().range([0, innerWidth]);
  const yScale = d3.scaleLinear().domain(d3.extent(movies, d => +d.imdb)).nice().range([innerHeight, 0]);

  // TODO: define sizeScale based on +d.boxOffice

  const svg = d3.select("#chart");
  const inner = svg.append("g").attr("transform", \`translate(\${margin.left}, \${margin.top})\`);

  const movieG = inner.selectAll(".movie").data(movies).join("g")
    .attr("class", "movie")
    .attr("transform", d => \`translate(\${xScale(+d.runtime)}, \${yScale(+d.imdb)})\`);

  // TODO: build a smiley inside each group, sized by sizeScale(+d.boxOffice).

  inner.append("g").attr("transform", \`translate(0, \${innerHeight})\`).call(d3.axisBottom(xScale));
  inner.append("g").call(d3.axisLeft(yScale));
});
`,
      lockedRanges: [],
      hint: 'sizeScale = d3.scaleLinear().domain(d3.extent(movies, d => +d.boxOffice)).range([8, 22]). For each glyph, multiply your eye/mouth offsets by (sizeScale(+d.boxOffice) / 10) to keep the proportions.',
      solution: `d3.csv("data/movies.csv").then(movies => {
  const width = 700, height = 400;
  const margin = { top: 20, right: 30, bottom: 50, left: 50 };
  const innerWidth  = width  - margin.left - margin.right;
  const innerHeight = height - margin.top  - margin.bottom;

  const genres = [...new Set(movies.map(d => d.genre))];
  const colorScale = d3.scaleOrdinal().domain(genres).range(d3.schemeTableau10);
  const xScale = d3.scaleLinear().domain(d3.extent(movies, d => +d.runtime)).nice().range([0, innerWidth]);
  const yScale = d3.scaleLinear().domain(d3.extent(movies, d => +d.imdb)).nice().range([innerHeight, 0]);
  const sizeScale = d3.scaleLinear().domain(d3.extent(movies, d => +d.boxOffice)).range([8, 22]);

  const svg = d3.select("#chart");
  const inner = svg.append("g").attr("transform", \`translate(\${margin.left}, \${margin.top})\`);

  const movieG = inner.selectAll(".movie").data(movies).join("g")
    .attr("class", "movie")
    .attr("transform", d => \`translate(\${xScale(+d.runtime)}, \${yScale(+d.imdb)})\`);

  movieG.append("circle")
    .attr("r", d => sizeScale(+d.boxOffice))
    .attr("fill", d => colorScale(d.genre))
    .attr("stroke", "#1f2540").attr("stroke-width", 0.6);

  movieG.append("circle")
    .attr("cx", d => -0.3 * sizeScale(+d.boxOffice))
    .attr("cy", d => -0.3 * sizeScale(+d.boxOffice))
    .attr("r",  d =>  0.12 * sizeScale(+d.boxOffice))
    .attr("fill", "#1f2540");
  movieG.append("circle")
    .attr("cx", d =>  0.3 * sizeScale(+d.boxOffice))
    .attr("cy", d => -0.3 * sizeScale(+d.boxOffice))
    .attr("r",  d =>  0.12 * sizeScale(+d.boxOffice))
    .attr("fill", "#1f2540");

  movieG.append("path")
    .attr("d", d => {
      const r = sizeScale(+d.boxOffice);
      const s = (+d.imdb - 7.5) * 6;
      return \`M \${-0.4*r} \${0.3*r} Q 0 \${0.3*r + s} \${0.4*r} \${0.3*r}\`;
    })
    .attr("stroke", "#1f2540").attr("fill", "none")
    .attr("stroke-width", 1.2).attr("stroke-linecap", "round");

  inner.append("g").attr("transform", \`translate(0, \${innerHeight})\`).call(d3.axisBottom(xScale));
  inner.append("g").call(d3.axisLeft(yScale));
});
`,
      iframe: { width: 720, height: 440, html: '<svg id="chart" width="700" height="400"></svg>' }
    }
  ]
};
