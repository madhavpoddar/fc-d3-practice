// Three small tasks all about scales.

export default {
  id: 'two-scales',
  title: 'Scales for two dimensions',
  preTask: `
A bar chart needs one scale. A scatterplot needs **two** — one for x and one for y. And in real charts, you compute the domain *from the data* instead of typing in numbers.

This page has three small tasks. They take a chart from "all dots on one line" to a clean scatterplot with rounded tick values.
  `.trim(),
  postTask: `
\`d3.extent(arr, accessor)\` is short for \`[d3.min(arr, acc), d3.max(arr, acc)]\`. \`.nice()\` rounds the domain outward to nice tick values (for example, 7.7..9.0 becomes 7.5..9.0).
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
      description: 'Add `.nice()` at the end of each scale chain. Then look at where the dots fall — the domain stretches a little so future axis ticks land on round numbers.',
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
    }
  ]
};
