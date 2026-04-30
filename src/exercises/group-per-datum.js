export default {
  id: 'group-per-datum',
  title: 'Group / Translate / Transform',
  preTask: `
SVG's \`<g>\` element groups shapes together. Combined with \`transform="translate(x, y)"\`, it shifts the whole group — meaning everything inside is positioned **relative to (0, 0)**.

\`\`\`js
const movieG = d3.select("#chart")
  .selectAll(".movie")
  .data(movies)
  .enter().append("g")
    .attr("class", "movie")
    .attr("transform", d => \`translate(\${xScale(d.runtime)}, \${yScale(d.rating)})\`);

movieG.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 8);
\`\`\`

Once each datum has its own group at the right position, building a **glyph** (multiple shapes per point) is easy — just append shapes inside the group.
  `.trim(),
  postTask: `
This sets up the next page (the smiley). Once each datum has its own group, building a glyph is just a small drawing problem inside a local coordinate system around (0, 0).
  `.trim(),
  tasks: [
    {
      id: 'refactor',
      title: 'Refactor circles into groups',
      description: 'Replace the flat circle binding with a group binding. Each `<g class="movie">` is translated to its (x, y) data point. The circle inside uses `cx=0, cy=0`.',
      starterCode: `d3.json("data/movies.json").then(movies => {
  const genres = [...new Set(movies.map(d => d.genre))];
  const colorScale = d3.scaleOrdinal().domain(genres).range(d3.schemeTableau10);

  const xScale = d3.scaleLinear()
    .domain(d3.extent(movies, d => d.runtime)).nice()
    .range([30, 570]);
  const yScale = d3.scaleLinear()
    .domain(d3.extent(movies, d => d.rating)).nice()
    .range([270, 30]);

  // Right now: one flat circle per movie, placed with cx / cy.
  // TODO: change to a <g class="movie"> per movie, translated to its data point,
  //       with the circle inside at cx=0, cy=0.
  d3.select("#chart")
    .selectAll("circle")
    .data(movies)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.runtime))
    .attr("cy", d => yScale(d.rating))
    .attr("r", 8)
    .attr("fill", d => colorScale(d.genre));
});
`,
      lockedRanges: [
        { from: 1, to: 14 },
        { from: 25, to: 26 }
      ],
      hint: 'const movieG = d3.select("#chart").selectAll(".movie").data(movies).enter().append("g").attr("class", "movie").attr("transform", d => `translate(${xScale(d.runtime)}, ${yScale(d.rating)})`);   movieG.append("circle").attr("r", 8).attr("fill", d => colorScale(d.genre));',
      solution: `d3.json("data/movies.json").then(movies => {
  const genres = [...new Set(movies.map(d => d.genre))];
  const colorScale = d3.scaleOrdinal().domain(genres).range(d3.schemeTableau10);

  const xScale = d3.scaleLinear()
    .domain(d3.extent(movies, d => d.runtime)).nice()
    .range([30, 570]);
  const yScale = d3.scaleLinear()
    .domain(d3.extent(movies, d => d.rating)).nice()
    .range([270, 30]);

  const movieG = d3.select("#chart")
    .selectAll(".movie")
    .data(movies)
    .enter()
    .append("g")
    .attr("class", "movie")
    .attr("transform", d => \`translate(\${xScale(d.runtime)}, \${yScale(d.rating)})\`);

  movieG.append("circle")
    .attr("cx", 0).attr("cy", 0)
    .attr("r", 8)
    .attr("fill", d => colorScale(d.genre));
});
`,
      iframe: { width: 620, height: 320, html: '<svg id="chart" width="600" height="300" style="border:1px dashed #d6dae4;"></svg>' }
    }
  ]
};
