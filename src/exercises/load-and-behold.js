export default {
  id: 'load-and-behold',
  title: 'Load and Behold',
  preTask: `
Last week, all our data was \`[10, 30, 50, 100]\`. Real data is almost never that simple. It usually looks like this:

\`\`\`js
const movies = [
  { title: "Inception", genre: "Sci-Fi", runtime: 148, rating: 8.8 },
  { title: "The Dark Knight", genre: "Action", runtime: 152, rating: 9.0 },
  ...
];
\`\`\`

When you bind \`data(movies)\`, each \`d\` is a **whole object**, not a number (that is, each datum contains multiple fields — title, genre, runtime, rating). To get one of the fields, write \`d.fieldName\` such as \`d.rating\`.
  `.trim(),
  postTask: `
Note: \`d3.csv()\` returns everything as **strings** — \`d.runtime\` will be the string \`'99'\`, not the number \`99\`. Convert it with \`+d.runtime\`. For instance, \`.attr("cx", d => d.runtime + 30)\` should be replaced by \`.attr("cy", d => +d.runtime + 30)\`. 

\`d3.json("data/movies.json")\` works the same way as \`d3.csv\` but keeps numbers as numbers. Thus, moving forward we will use JSON for simplicity. 
  `.trim(),
  tasks: [
    {
      id: 'fix-bug',
      title: 'Fix the bug',
      description: 'Only one line is wrong — the line that sets \`width\`. Change it to use the \`runtime\` field of each movie object.',
      starterCode: `const movies = [
  { title: "The Grand Budapest Hotel", genre: "Comedy",    runtime: 99,  rating: 8.1 },
  { title: "Get Out",                  genre: "Horror",    runtime: 104, rating: 7.7 },
  { title: "Coco",                     genre: "Animation", runtime: 105, rating: 8.4 },
  { title: "Mad Max: Fury Road",       genre: "Action",    runtime: 120, rating: 8.1 },
  { title: "Inception",                genre: "Sci-Fi",    runtime: 148, rating: 8.8 },
  { title: "The Dark Knight",          genre: "Action",    runtime: 152, rating: 9.0 }
];

d3.select("#chart")
  .selectAll("rect")
  .data(movies)
  .enter()
  .append("rect")
  .attr("x", 10)
  .attr("y", (d, i) => i * 30 + 10)
  .attr("height", 24)
  .attr("width", d => d)
  .attr("fill", "#2b3a55");
`,
      lockedRanges: [
        { from: 1, to: 17 },
        { from: 19, to: 20 }
      ],
      solution: `const movies = [
  { title: "The Grand Budapest Hotel", genre: "Comedy",    runtime: 99,  rating: 8.1 },
  { title: "Get Out",                  genre: "Horror",    runtime: 104, rating: 7.7 },
  { title: "Coco",                     genre: "Animation", runtime: 105, rating: 8.4 },
  { title: "Mad Max: Fury Road",       genre: "Action",    runtime: 120, rating: 8.1 },
  { title: "Inception",                genre: "Sci-Fi",    runtime: 148, rating: 8.8 },
  { title: "The Dark Knight",          genre: "Action",    runtime: 152, rating: 9.0 }
];

d3.select("#chart")
  .selectAll("rect")
  .data(movies)
  .enter()
  .append("rect")
  .attr("x", 10)
  .attr("y", (d, i) => i * 30 + 10)
  .attr("height", 24)
  .attr("width", d => d.runtime)
  .attr("fill", "#2b3a55");
`,
      iframe: { width: 500, height: 240, html: '<svg id="chart" width="500" height="220" style="border:1px dashed #d6dae4;"></svg>' },
      check(doc) {
        const rects = doc.querySelectorAll('#chart rect');
        return rects.length === 6 && rects[0].getAttribute('width') === '99';
      }
    },
    {
      id: 'load-and-use',
      title: 'Load from a file',
      description: `Even more realistically, data lives in a CSV or JSON file — not hardcoded in the script.

\`\`\`js
d3.csv("data/movies.csv").then(moviesData => {
  // data is an array of objects, one per row
  // ...build your chart here
});
\`\`\`

\`async/await\` works too: \`const moviesData = await d3.csv("data/movies.csv")\`.

Correct the data binding to fix the Runtime error below.
`,
      starterCode: `d3.csv("data/movies.csv").then(moviesData => {
  console.log("Loaded", moviesData.length, "movies:", moviesData);

  d3.select("#chart")
    .selectAll("circle")
    .data()
    .enter()
    .append("circle")
    .attr("cx", d => +d.boxOffice * 0.4)
    .attr("cy", d => 300 - +d.runtime)
    .attr("r",  d => +d.rating)
    .attr("fill", "#2b3a55")
    .attr("fill-opacity", 0.5);
});
`,
      lockedRanges: [
        { from: 1, to: 5 },
        { from: 7, to: 15 }
      ],
      solution: `d3.csv("data/movies.csv").then(moviesData => {
  console.log("Loaded", moviesData.length, "movies:", moviesData);

  d3.select("#chart")
    .selectAll("circle")
    .data(moviesData)
    .enter()
    .append("circle")
    .attr("cx", d => +d.boxOffice * 0.4)
    .attr("cy", d => 300 - +d.runtime)
    .attr("r",  d => +d.rating)
    .attr("fill", "#2b3a55")
    .attr("fill-opacity", 0.5);
});
`,
      iframe: { width: 500, height: 350, html: '<svg id="chart" width="500" height="300" style="border:1px dashed #d6dae4;"></svg>' }
    },
    {
      id: 'read-from-console',
      type: 'mcq',
      title: 'Trying out the console',
      description: `To debug, log lines can be very helpful. **Task 2** logs all 12 movies to the browser developer console (line number 2). Open the browser console, expand the array, and find the \`Oppenheimer\` entry.

**How to open the console:**
- **Chrome / Edge:** F12 → Console tab &nbsp;|&nbsp; Windows: Ctrl + Shift + J &nbsp;|&nbsp; Mac: Cmd + Option + J
- **Firefox:** F12 → Console tab &nbsp;|&nbsp; Windows: Ctrl + Shift + K &nbsp;|&nbsp; Mac: Cmd + Option + K
- **Safari:** Cmd + Option + C &nbsp;(first enable: Safari → Settings → Advanced → Show features for web developers)
- **Mobile browsers:** It isn't always available/straightforward. Please search for how to do that online, or use a desktop browser for this task.

What is the \`rating\` of **Oppenheimer**?`,
      options: [
        { value: 'a', label: '8.1' },
        { value: 'b', label: '8.3' },
        { value: 'c', label: '8.5' },
        { value: 'd', label: '8.6' }
      ],
      correctAnswer: 'b',
      explanation: 'Oppenheimer has a rating of **8.3** — as visible in the console (index 19).',
      explanationImage: 'images/console-oppenheimer.png',
      starterCode: `d3.json("data/movies.json").then(moviesData => {
  const movie = moviesData.find(d => d.title === "Oppenheimer");
  d3.select("#chart")
    .append("text")
    .attr("x", 20).attr("y", 44)
    .attr("font-size", 22)
    .attr("fill", "#1f2540")
    .text(movie.title + " — rating: " + movie.rating);
});`,
      iframe: { width: 520, height: 100, html: '<svg id="chart" width="500" height="80" style="border:1px dashed #d6dae4;"></svg>' }
    }
  ]
};
