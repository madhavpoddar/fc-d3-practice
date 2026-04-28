// The smiley scatterplot — the capstone, broken into four small tasks.

const scaffold = `d3.csv("data/movies.csv").then(movies => {
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
`;

const tail = `
  inner.append("g").attr("transform", \`translate(0, \${innerHeight})\`).call(d3.axisBottom(xScale));
  inner.append("g").call(d3.axisLeft(yScale));
});
`;

const ifr = { width: 640, height: 400, html: '<svg id="chart" width="620" height="360"></svg>' };

export default {
  id: 'smiley',
  title: 'The smiley',
  preTask: `
Each movie now has its own \`<g>\` translated to its (runtime, IMDb) point. Inside, the local origin is (0, 0). That means you can build a **custom glyph** with simple coordinates around zero.

We will build a tiny smiley face in four steps: face, eyes, mouth, then make the mouth's curve depend on the IMDb rating.
  `.trim(),
  postTask: `
Once the group-per-datum pattern is in place, building a glyph is a small drawing problem. Changing the visual look (eye shape, fringe for animation films, frowns for low ratings) is mostly SVG, not D3.
  `.trim(),
  tasks: [
    {
      id: 'face',
      title: 'Add the face',
      description: 'Inside each `movieG`, append a circle with `r=10` filled by `colorScale(d.genre)`. Place it at the local origin (0, 0).',
      starterCode: `${scaffold}
  // TODO: append a face circle (r=10, fill = colorScale(d.genre)) inside each movieG.
${tail}`,
      lockedRanges: [
        { from: 1, to: 22 },
        { from: 25, to: 28 }
      ],
      hint: 'movieG.append("circle").attr("r", 10).attr("fill", d => colorScale(d.genre)).attr("stroke", "#1f2540").attr("stroke-width", 0.6);',
      solution: `${scaffold}
  movieG.append("circle")
    .attr("r", 10)
    .attr("fill", d => colorScale(d.genre))
    .attr("stroke", "#1f2540").attr("stroke-width", 0.6);
${tail}`,
      iframe: ifr
    },
    {
      id: 'eyes',
      title: 'Add the eyes',
      description: 'Append two small black circles inside each movieG: one at `(-3, -3)`, one at `(3, -3)`, both with `r=1.2`.',
      starterCode: `${scaffold}
  movieG.append("circle")
    .attr("r", 10)
    .attr("fill", d => colorScale(d.genre))
    .attr("stroke", "#1f2540").attr("stroke-width", 0.6);

  // TODO: add two small eye circles at (-3, -3) and (3, -3), r=1.2, fill="#1f2540".
${tail}`,
      lockedRanges: [
        { from: 1, to: 26 },
        { from: 29, to: 32 }
      ],
      hint: 'movieG.append("circle").attr("cx", -3).attr("cy", -3).attr("r", 1.2).attr("fill", "#1f2540"); — and the same for (3, -3).',
      solution: `${scaffold}
  movieG.append("circle")
    .attr("r", 10)
    .attr("fill", d => colorScale(d.genre))
    .attr("stroke", "#1f2540").attr("stroke-width", 0.6);

  movieG.append("circle").attr("cx", -3).attr("cy", -3).attr("r", 1.2).attr("fill", "#1f2540");
  movieG.append("circle").attr("cx",  3).attr("cy", -3).attr("r", 1.2).attr("fill", "#1f2540");
${tail}`,
      iframe: ifr
    },
    {
      id: 'mouth',
      title: 'Add a (constant) smile',
      description: 'Append a path for the mouth. Use a quadratic Bézier from `(-4, 3)` through `(0, 8)` to `(4, 3)`. Set `fill="none"` and stroke it dark.',
      starterCode: `${scaffold}
  movieG.append("circle")
    .attr("r", 10).attr("fill", d => colorScale(d.genre))
    .attr("stroke", "#1f2540").attr("stroke-width", 0.6);

  movieG.append("circle").attr("cx", -3).attr("cy", -3).attr("r", 1.2).attr("fill", "#1f2540");
  movieG.append("circle").attr("cx",  3).attr("cy", -3).attr("r", 1.2).attr("fill", "#1f2540");

  // TODO: append a <path> mouth using d="M -4 3 Q 0 8 4 3", fill="none", stroke="#1f2540", stroke-width=1.2.
${tail}`,
      lockedRanges: [
        { from: 1, to: 28 },
        { from: 31, to: 34 }
      ],
      hint: 'movieG.append("path").attr("d", "M -4 3 Q 0 8 4 3").attr("stroke", "#1f2540").attr("fill", "none").attr("stroke-width", 1.2).attr("stroke-linecap", "round");',
      solution: `${scaffold}
  movieG.append("circle")
    .attr("r", 10).attr("fill", d => colorScale(d.genre))
    .attr("stroke", "#1f2540").attr("stroke-width", 0.6);

  movieG.append("circle").attr("cx", -3).attr("cy", -3).attr("r", 1.2).attr("fill", "#1f2540");
  movieG.append("circle").attr("cx",  3).attr("cy", -3).attr("r", 1.2).attr("fill", "#1f2540");

  movieG.append("path")
    .attr("d", "M -4 3 Q 0 8 4 3")
    .attr("stroke", "#1f2540").attr("fill", "none")
    .attr("stroke-width", 1.2).attr("stroke-linecap", "round");
${tail}`,
      iframe: ifr
    },
    {
      id: 'encode-rating',
      title: 'Encode rating in the mouth',
      description: 'Right now every smile has the same depth (the control point at y=8). Replace that constant with `(+d.imdb - 7.5) * 6` so higher ratings get bigger smiles.',
      starterCode: `${scaffold}
  movieG.append("circle")
    .attr("r", 10).attr("fill", d => colorScale(d.genre))
    .attr("stroke", "#1f2540").attr("stroke-width", 0.6);

  movieG.append("circle").attr("cx", -3).attr("cy", -3).attr("r", 1.2).attr("fill", "#1f2540");
  movieG.append("circle").attr("cx",  3).attr("cy", -3).attr("r", 1.2).attr("fill", "#1f2540");

  movieG.append("path")
    .attr("d", "M -4 3 Q 0 8 4 3")     // <-- replace the constant 8 with a function of d.imdb
    .attr("stroke", "#1f2540").attr("fill", "none")
    .attr("stroke-width", 1.2).attr("stroke-linecap", "round");
${tail}`,
      lockedRanges: [
        { from: 1, to: 30 },
        { from: 32, to: 33 },
        { from: 35, to: 38 }
      ],
      hint: 'Replace the static string with a function: .attr("d", d => `M -4 3 Q 0 ${3 + (+d.imdb - 7.5) * 6} 4 3`).',
      solution: `${scaffold}
  movieG.append("circle")
    .attr("r", 10).attr("fill", d => colorScale(d.genre))
    .attr("stroke", "#1f2540").attr("stroke-width", 0.6);

  movieG.append("circle").attr("cx", -3).attr("cy", -3).attr("r", 1.2).attr("fill", "#1f2540");
  movieG.append("circle").attr("cx",  3).attr("cy", -3).attr("r", 1.2).attr("fill", "#1f2540");

  movieG.append("path")
    .attr("d", d => {
      const s = (+d.imdb - 7.5) * 6;
      return \`M -4 3 Q 0 \${3 + s} 4 3\`;
    })
    .attr("stroke", "#1f2540").attr("fill", "none")
    .attr("stroke-width", 1.2).attr("stroke-linecap", "round");
${tail}`,
      iframe: ifr
    }
  ]
};
