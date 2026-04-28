export default {
  id: 'group-per-datum',
  title: 'Group per data point',
  preTask: `
Right now each movie is a single \`<circle>\` placed with \`cx\` / \`cy\`. To draw a **custom glyph** (a tiny smiley face), each movie needs to contain *several* shapes — a face, two eyes, a mouth. Setting them all with absolute coordinates is painful.

The trick: wrap each datum in its own \`<g>\` (group), translated to the data point. Then **everything inside the group is positioned around (0, 0)**.

\`\`\`js
inner.selectAll(".movie")
  .data(movies)
  .join("g")
    .attr("class", "movie")
    .attr("transform", d => \`translate(\${xScale(+d.runtime)}, \${yScale(+d.imdb)})\`)
  .append("circle")
    .attr("cx", 0).attr("cy", 0).attr("r", 8);
\`\`\`
  `.trim(),
  postTask: `
This sets up the next page (the smiley). Once each datum has its own group, building a glyph is just appending shapes inside.
  `.trim(),
  tasks: [
    {
      id: 'refactor',
      title: 'Refactor circles into groups',
      description: 'Replace the flat circle binding with a group binding. Each `<g class="movie">` is translated to its (x, y) data point. The circle inside has `cx=0, cy=0`.',
      starterCode: `d3.csv("data/movies.csv").then(movies => {
  const width = 620, height = 360;
  const margin = { top: 20, right: 30, bottom: 50, left: 50 };
  const innerWidth  = width  - margin.left - margin.right;
  const innerHeight = height - margin.top  - margin.bottom;

  const genres = [...new Set(movies.map(d => d.genre))];
  const colorScale = d3.scaleOrdinal().domain(genres).range(d3.schemeTableau10);
  const xScale = d3.scaleLinear().domain(d3.extent(movies, d => +d.runtime)).nice().range([0, innerWidth]);
  const yScale = d3.scaleLinear().domain(d3.extent(movies, d => +d.imdb)).nice().range([innerHeight, 0]);

  const svg = d3.select("#chart");
  const inner = svg.append("g").attr("transform", \`translate(\${margin.left}, \${margin.top})\`);

  // Right now: one flat circle per movie, placed with cx/cy.
  // TODO: refactor so each datum is wrapped in a <g class="movie"> translated to its point,
  //       and the circle is appended inside the group with cx=0, cy=0.
  inner.selectAll("circle")
    .data(movies).join("circle")
    .attr("cx", d => xScale(+d.runtime))
    .attr("cy", d => yScale(+d.imdb))
    .attr("r", 8)
    .attr("fill", d => colorScale(d.genre));

  inner.append("g").attr("transform", \`translate(0, \${innerHeight})\`).call(d3.axisBottom(xScale));
  inner.append("g").call(d3.axisLeft(yScale));
});
`,
      lockedRanges: [
        { from: 1, to: 14 },
        { from: 26, to: 28 }
      ],
      hint: 'const movieG = inner.selectAll(".movie").data(movies).join("g").attr("class", "movie").attr("transform", d => `translate(${xScale(+d.runtime)}, ${yScale(+d.imdb)})`);   movieG.append("circle").attr("r", 8).attr("fill", d => colorScale(d.genre));',
      solution: `d3.csv("data/movies.csv").then(movies => {
  const width = 620, height = 360;
  const margin = { top: 20, right: 30, bottom: 50, left: 50 };
  const innerWidth  = width  - margin.left - margin.right;
  const innerHeight = height - margin.top  - margin.bottom;

  const genres = [...new Set(movies.map(d => d.genre))];
  const colorScale = d3.scaleOrdinal().domain(genres).range(d3.schemeTableau10);
  const xScale = d3.scaleLinear().domain(d3.extent(movies, d => +d.runtime)).nice().range([0, innerWidth]);
  const yScale = d3.scaleLinear().domain(d3.extent(movies, d => +d.imdb)).nice().range([innerHeight, 0]);

  const svg = d3.select("#chart");
  const inner = svg.append("g").attr("transform", \`translate(\${margin.left}, \${margin.top})\`);

  const movieG = inner.selectAll(".movie")
    .data(movies)
    .join("g")
      .attr("class", "movie")
      .attr("transform", d => \`translate(\${xScale(+d.runtime)}, \${yScale(+d.imdb)})\`);

  movieG.append("circle")
    .attr("cx", 0).attr("cy", 0)
    .attr("r", 8)
    .attr("fill", d => colorScale(d.genre));

  inner.append("g").attr("transform", \`translate(0, \${innerHeight})\`).call(d3.axisBottom(xScale));
  inner.append("g").call(d3.axisLeft(yScale));
});
`,
      iframe: { width: 640, height: 400, html: '<svg id="chart" width="620" height="360"></svg>' }
    }
  ]
};
