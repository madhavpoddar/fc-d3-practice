export default {
  id: 'bonus',
  title: 'Bonus: encode box office',
  preTask: `
You now have a smiley scatterplot with **x = runtime, y = rating, color = genre, expression = rating**. That is already four variables. Let's add one more: **box office revenue** (millions $) → **face size**.

\`\`\`js
const sizeScale = d3.scaleLinear()
  .domain(d3.extent(movies, d => d.boxOffice))
  .range([6, 20]);
\`\`\`

Use \`sizeScale(d.boxOffice)\` as the face radius. To keep the eyes and mouth in proportion, multiply their offsets by \`r / 10\` where \`r = sizeScale(d.boxOffice)\`.
  `.trim(),
  postTask: `
You have built a custom data-driven visualization in D3. That was the goal of this session. Well done.
  `.trim(),
  tasks: [
    {
      id: 'size-encoding',
      title: 'Make face size encode box office',
      description: 'The smiley below uses a fixed face radius of 10. Define `sizeScale` and update the face, eyes, and mouth so their size reflects each movie\'s box office revenue.',
      starterCode: `d3.json("data/movies.json").then(movies => {
  const genres = [...new Set(movies.map(d => d.genre))];
  const colorScale = d3.scaleOrdinal().domain(genres).range(d3.schemeTableau10);

  const xScale = d3.scaleLinear()
    .domain(d3.extent(movies, d => d.runtime)).nice()
    .range([30, 570]);
  const yScale = d3.scaleLinear()
    .domain(d3.extent(movies, d => d.rating)).nice()
    .range([270, 30]);

  // TODO: define sizeScale — map d.boxOffice to a radius range like [6, 20]

  const movieG = d3.select("#chart")
    .selectAll(".movie")
    .data(movies)
    .enter()
    .append("g")
    .attr("class", "movie")
    .attr("transform", d => \`translate(\${xScale(d.runtime)}, \${yScale(d.rating)})\`);

  // TODO: draw the smiley glyph using sizeScale(d.boxOffice) for the face radius.
  //       Scale eyes and mouth coordinates proportionally (multiply offsets by r/10).
});
`,
      lockedRanges: [],
      hint: 'const sizeScale = d3.scaleLinear().domain(d3.extent(movies, d => d.boxOffice)).range([6, 20]); — then for each shape use d => { const r = sizeScale(d.boxOffice); ... } and multiply all offsets (cx, cy, mouth control point) by r/10.',
      solution: `d3.json("data/movies.json").then(movies => {
  const genres = [...new Set(movies.map(d => d.genre))];
  const colorScale = d3.scaleOrdinal().domain(genres).range(d3.schemeTableau10);

  const xScale = d3.scaleLinear()
    .domain(d3.extent(movies, d => d.runtime)).nice()
    .range([30, 570]);
  const yScale = d3.scaleLinear()
    .domain(d3.extent(movies, d => d.rating)).nice()
    .range([270, 30]);

  const sizeScale = d3.scaleLinear()
    .domain(d3.extent(movies, d => d.boxOffice))
    .range([6, 20]);

  const movieG = d3.select("#chart")
    .selectAll(".movie")
    .data(movies)
    .enter()
    .append("g")
    .attr("class", "movie")
    .attr("transform", d => \`translate(\${xScale(d.runtime)}, \${yScale(d.rating)})\`);

  movieG.append("circle")
    .attr("r", d => sizeScale(d.boxOffice))
    .attr("fill", d => colorScale(d.genre))
    .attr("stroke", "#1f2540").attr("stroke-width", 0.6);

  movieG.append("circle")
    .attr("cx", d => -0.3 * sizeScale(d.boxOffice))
    .attr("cy", d => -0.3 * sizeScale(d.boxOffice))
    .attr("r",  d =>  0.12 * sizeScale(d.boxOffice))
    .attr("fill", "#1f2540");
  movieG.append("circle")
    .attr("cx", d =>  0.3 * sizeScale(d.boxOffice))
    .attr("cy", d => -0.3 * sizeScale(d.boxOffice))
    .attr("r",  d =>  0.12 * sizeScale(d.boxOffice))
    .attr("fill", "#1f2540");

  movieG.append("path")
    .attr("d", d => {
      const r = sizeScale(d.boxOffice);
      const s = (d.rating - 7.5) * 6;
      return \`M \${-0.4*r} \${0.3*r} Q 0 \${0.3*r + s} \${0.4*r} \${0.3*r}\`;
    })
    .attr("stroke", "#1f2540").attr("fill", "none")
    .attr("stroke-width", 1.2).attr("stroke-linecap", "round");
});
`,
      iframe: { width: 620, height: 320, html: '<svg id="chart" width="600" height="300" style="border:1px dashed #d6dae4;"></svg>' }
    }
  ]
};
