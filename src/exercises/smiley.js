// The smiley scatterplot — the capstone, broken into four small tasks.

const scaffold = `d3.json("data/movies.json").then(movies => {
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
`;

// scaffold = 19 lines of content (lines 1–19) + trailing newline
// tail adds: empty line then });
const tail = `
});
`;

const ifr = { width: 620, height: 320, html: '<svg id="chart" width="600" height="300" style="border:1px dashed #d6dae4;"></svg>' };

// Line layout after scaffold (lines 1–19 + trailing \n):
//   scaffold \n  →  line 20 empty (scaffold trailing + template \n)
//   content lines follow
//   tail \n  →  one empty line before });

export default {
  id: 'smiley',
  title: 'The smiley',
  preTask: `
Each movie now has its own \`<g>\` translated to its (runtime, rating) point. Inside, the local origin is (0, 0). That means you can build a **custom glyph** with simple coordinates around zero.

We will build a tiny smiley face in four steps: face, eyes, mouth, then make the mouth's curve depend on the rating.
  `.trim(),
  postTask: `
Once the group-per-datum pattern is in place, building a glyph is a small drawing problem. Changing the visual look (eye shape, frowns for low ratings) is mostly SVG, not D3.
  `.trim(),
  tasks: [
    {
      id: 'face',
      title: 'Add the face',
      description: 'Inside each `movieG`, append a circle with `r=10` filled by `colorScale(d.genre)`. Place it at the local origin (0, 0).',
      starterCode: `${scaffold}
  // TODO: append a face circle (r=10, fill = colorScale(d.genre)) inside each movieG.
${tail}`,
      // scaffold=18 lines; template \n → empty 19; TODO → 20; tail \n → empty 21; }); → 22
      lockedRanges: [
        { from: 1, to: 19 },
        { from: 22, to: 26 }
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
      // Lines: 1–18 scaffold | 19 empty | 20–23 face circle | 24 empty | 25 TODO | 26 empty (tail) | 27 });
      lockedRanges: [
        { from: 1, to: 24 },
        { from: 27, to: 30 }
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
      // Lines: 1–18 scaffold | 19 empty | 20–22 face | 23 empty | 24–25 eyes | 26 empty | 27 TODO | 28 empty (tail) | 29 });
      lockedRanges: [
        { from: 1, to: 26 },
        { from: 29, to: 33 }
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
      description: 'Right now every smile has the same depth (the control point at y=8). Replace that constant with `(d.rating - 7.5) * 6` so higher ratings get bigger smiles.',
      starterCode: `${scaffold}
  movieG.append("circle")
    .attr("r", 10).attr("fill", d => colorScale(d.genre))
    .attr("stroke", "#1f2540").attr("stroke-width", 0.6);

  movieG.append("circle").attr("cx", -3).attr("cy", -3).attr("r", 1.2).attr("fill", "#1f2540");
  movieG.append("circle").attr("cx",  3).attr("cy", -3).attr("r", 1.2).attr("fill", "#1f2540");

  movieG.append("path")
    .attr("d", "M -4 3 Q 0 8 4 3")     // <-- replace the constant 8 with a function of d.rating
    .attr("stroke", "#1f2540").attr("fill", "none")
    .attr("stroke-width", 1.2).attr("stroke-linecap", "round");
${tail}`,
      // Lines: 1–18 scaffold | 19 empty | 20–22 face | 23 empty | 24–25 eyes | 26 empty
      //        | 27 movieG.append("path") | 28 .attr("d",...) EDIT TARGET | 29–30 stroke/linecap
      //        | 31 empty (tail) | 32 });
      lockedRanges: [
        { from: 1, to: 27 },
        { from: 29, to: 36 }
      ],
      hint: 'Replace the static string with a function: .attr("d", d => `M -4 3 Q 0 ${3 + (d.rating - 7.5) * 6} 4 3`).',
      solution: `${scaffold}
  movieG.append("circle")
    .attr("r", 10).attr("fill", d => colorScale(d.genre))
    .attr("stroke", "#1f2540").attr("stroke-width", 0.6);

  movieG.append("circle").attr("cx", -3).attr("cy", -3).attr("r", 1.2).attr("fill", "#1f2540");
  movieG.append("circle").attr("cx",  3).attr("cy", -3).attr("r", 1.2).attr("fill", "#1f2540");

  movieG.append("path")
    .attr("d", d => {
      const s = (d.rating - 7.5) * 6;
      return \`M -4 3 Q 0 \${3 + s} 4 3\`;
    })
    .attr("stroke", "#1f2540").attr("fill", "none")
    .attr("stroke-width", 1.2).attr("stroke-linecap", "round");
${tail}`,
      iframe: ifr
    }
  ]
};
