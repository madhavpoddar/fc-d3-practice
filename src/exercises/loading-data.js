export default {
  id: 'loading-data',
  title: 'Loading external data',
  preTask: `
So far our data has lived inside the JavaScript file. In real projects, data lives in a CSV or JSON file. You load it when the page runs.

\`\`\`js
d3.csv("data/movies.csv").then(data => {
  // data is an array of objects, one per row
  console.log(data);
  // ...build your chart here
});
\`\`\`

Two things to know:

- \`d3.csv()\` returns a **Promise**. Use \`.then(callback)\` to get the data when it arrives.
- \`d3.csv()\` returns everything as **strings** — \`d.runtime\` will be \`"99"\`, not \`99\`. Convert it with \`+d.runtime\` or \`Number(d.runtime)\`.

A CSV file is at \`data/movies.csv\`. Open dev tools → Network tab and click Run to watch the file load.
  `.trim(),
  postTask: `
- \`d3.json("data/movies.json")\` works the same way and keeps numbers as numbers.
- \`async/await\` works too: \`const data = await d3.csv("data/movies.csv")\`.
- For automatic type conversion, pass a row converter: \`d3.csv("data/movies.csv", d => ({...d, runtime: +d.runtime}))\`.
  `.trim(),
  tasks: [
    {
      id: 'load-and-use',
      title: 'Load and plot',
      description: 'Inside the `.then` callback, set the circle positions and sizes. Use `+d.runtime` for `cx` and `+d.imdb * 4` for `r`. The leading `+` converts the string to a number.',
      starterCode: `d3.csv("data/movies.csv").then(data => {
  console.log("Loaded", data.length, "movies:", data);

  d3.select("#chart")
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", /* TODO */ 0)
    .attr("cy", 80)
    .attr("r",  /* TODO */ 5)
    .attr("fill", "#2b3a55")
    .attr("fill-opacity", 0.5);
});
`,
      lockedRanges: [
        { from: 1, to: 7 },
        { from: 10, to: 10 },
        { from: 12, to: 14 }
      ],
      hint: 'cx: `d => +d.runtime`. r: `d => +d.imdb * 4`. The plus sign converts strings to numbers.',
      solution: `d3.csv("data/movies.csv").then(data => {
  console.log("Loaded", data.length, "movies:", data);

  d3.select("#chart")
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => +d.runtime)
    .attr("cy", 80)
    .attr("r",  d => +d.imdb * 4)
    .attr("fill", "#2b3a55")
    .attr("fill-opacity", 0.5);
});
`,
      iframe: { width: 600, height: 200, html: '<svg id="chart" width="600" height="160" style="border:1px dashed #d6dae4;"></svg>' }
    }
  ]
};
