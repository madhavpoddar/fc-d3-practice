// Scaling it up — combines two-scales (3 tasks) + scaleband (1 task).

export default {
  id: 'scaling-it-up',
  title: 'Scaling it up',
  preTask: `
A bar chart needs one scale. A scatterplot needs **two** — one for x, one for y. And in real charts you compute the domain *from the data* rather than typing in numbers by hand.

The first three tasks build up a scatterplot step by step. The fourth introduces \`scaleBand\`, which handles category names instead of numbers.
  `.trim(),
  postTask: `
\`d3.extent(arr, accessor)\` is shorthand for \`[d3.min(arr, acc), d3.max(arr, acc)]\`. \`.nice()\` rounds the domain outward so future axis ticks land on clean values.

Use \`scaleBand\` whenever an axis carries a list of names. \`xScale("Sci-Fi")\` returns the left edge of that band; \`xScale.bandwidth()\` is the band width.
  `.trim(),
  tasks: [
    {
      id: 'add-y-scale',
      title: 'Add a y-scale',
      description: 'Right now every dot is at `cy = 100` — they all overlap on a horizontal line. Add a `yScale` (linear, domain `[7.5, 9]`, range `[250, 30]`) and use it for `cy`.',
      starterCode: `d3.csv("data/movies.csv").then(movies => {

  const xScale = d3.scaleLinear()
    .domain([90, 200])
    .range([40, 560]);

  // TODO: add a yScale that maps the IMDb rating to a y pixel position.
  //   Linear scale, domain [7.5, 9], range [250, 30].

  d3.select("#chart")
    .selectAll("circle")
    .data(movies)
    .join("circle")
    .attr("cx", d => xScale(+d.runtime))
    .attr("cy", 100)                       // <-- replace with yScale(+d.imdb)
    .attr("r", 6)
    .attr("fill", "#2b3a55").attr("fill-opacity", 0.7);
});
`,
      lockedRanges: [
        { from: 1, to: 5 },
        { from: 10, to: 14 },
        { from: 16, to: 19 }
      ],
      hint: 'const yScale = d3.scaleLinear().domain([7.5, 9]).range([250, 30]); — and use yScale(+d.imdb) for cy. The range goes high-to-low so high ratings appear near the top.',
      solution: `d3.csv("data/movies.csv").then(movies => {

  const xScale = d3.scaleLinear()
    .domain([90, 200])
    .range([40, 560]);

  const yScale = d3.scaleLinear()
    .domain([7.5, 9])
    .range([250, 30]);

  d3.select("#chart")
    .selectAll("circle")
    .data(movies)
    .join("circle")
    .attr("cx", d => xScale(+d.runtime))
    .attr("cy", d => yScale(+d.imdb))
    .attr("r", 6)
    .attr("fill", "#2b3a55").attr("fill-opacity", 0.7);
});
`,
      iframe: { width: 620, height: 320, html: '<svg id="chart" width="600" height="280" style="border:1px dashed #d6dae4;"></svg>' }
    },
    {
      id: 'use-extent',
      title: 'Compute the domain from the data',
      description: 'Hardcoded domains break when the data changes. Replace both `.domain([...])` calls with `d3.extent(movies, d => +d.runtime)` for x, and the same idea for IMDb.',
      starterCode: `d3.csv("data/movies.csv").then(movies => {

  const xScale = d3.scaleLinear()
    .domain([90, 200])                                      // <-- replace
    .range([40, 560]);

  const yScale = d3.scaleLinear()
    .domain([7.5, 9])                                       // <-- replace
    .range([250, 30]);

  d3.select("#chart")
    .selectAll("circle")
    .data(movies)
    .join("circle")
    .attr("cx", d => xScale(+d.runtime))
    .attr("cy", d => yScale(+d.imdb))
    .attr("r", 6)
    .attr("fill", "#2b3a55").attr("fill-opacity", 0.7);
});
`,
      lockedRanges: [
        { from: 1, to: 3 },
        { from: 5, to: 7 },
        { from: 9, to: 19 }
      ],
      hint: 'd3.extent(movies, d => +d.runtime) returns [min, max] in one call.',
      solution: `d3.csv("data/movies.csv").then(movies => {

  const xScale = d3.scaleLinear()
    .domain(d3.extent(movies, d => +d.runtime))
    .range([40, 560]);

  const yScale = d3.scaleLinear()
    .domain(d3.extent(movies, d => +d.imdb))
    .range([250, 30]);

  d3.select("#chart")
    .selectAll("circle")
    .data(movies)
    .join("circle")
    .attr("cx", d => xScale(+d.runtime))
    .attr("cy", d => yScale(+d.imdb))
    .attr("r", 6)
    .attr("fill", "#2b3a55").attr("fill-opacity", 0.7);
});
`,
      iframe: { width: 620, height: 320, html: '<svg id="chart" width="600" height="280" style="border:1px dashed #d6dae4;"></svg>' }
    },
    {
      id: 'add-nice',
      title: 'Round to nice tick values',
      description: 'Add `.nice()` at the end of each scale chain. The domain stretches a little so future axis ticks will land on round numbers.',
      starterCode: `d3.csv("data/movies.csv").then(movies => {

  const xScale = d3.scaleLinear()
    .domain(d3.extent(movies, d => +d.runtime))
    .range([40, 560]);                                        // <-- add .nice()

  const yScale = d3.scaleLinear()
    .domain(d3.extent(movies, d => +d.imdb))
    .range([250, 30]);                                        // <-- add .nice()

  d3.select("#chart")
    .selectAll("circle")
    .data(movies)
    .join("circle")
    .attr("cx", d => xScale(+d.runtime))
    .attr("cy", d => yScale(+d.imdb))
    .attr("r", 6)
    .attr("fill", "#2b3a55").attr("fill-opacity", 0.7);
});
`,
      lockedRanges: [
        { from: 1, to: 4 },
        { from: 6, to: 7 },
        { from: 9, to: 19 }
      ],
      hint: 'Add `.nice()` after `.range(...)` on both scales.',
      solution: `d3.csv("data/movies.csv").then(movies => {

  const xScale = d3.scaleLinear()
    .domain(d3.extent(movies, d => +d.runtime))
    .range([40, 560]).nice();

  const yScale = d3.scaleLinear()
    .domain(d3.extent(movies, d => +d.imdb))
    .range([250, 30]).nice();

  d3.select("#chart")
    .selectAll("circle")
    .data(movies)
    .join("circle")
    .attr("cx", d => xScale(+d.runtime))
    .attr("cy", d => yScale(+d.imdb))
    .attr("r", 6)
    .attr("fill", "#2b3a55").attr("fill-opacity", 0.7);
});
`,
      iframe: { width: 620, height: 320, html: '<svg id="chart" width="600" height="280" style="border:1px dashed #d6dae4;"></svg>' }
    },
    {
      id: 'replace-linear',
      title: 'Switch to scaleBand for categories',
      description: `\`scaleLinear\` only handles numbers — passing genre strings gives \`NaN\` everywhere. Replace the broken \`scaleLinear\` with \`scaleBand\`, add \`.padding(0.2)\`, and change the fixed \`width\` to \`xScale.bandwidth()\`.`,
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
