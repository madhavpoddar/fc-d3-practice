export default {
  id: 'data-as-objects',
  title: 'Data as objects',
  preTask: `
Last week, all our data was \`[10, 30, 50, 100]\`. Real data is almost never that simple. It usually looks like this:

\`\`\`js
[
  { title: "Inception", runtime: 148, imdb: 8.8 },
  { title: "The Dark Knight", runtime: 152, imdb: 9.0 },
  ...
]
\`\`\`

When you bind \`.data(movies)\`, each \`d\` is a **whole object**, not a number. To get one field, write \`d.runtime\` or \`d.imdb\`.

The chart below tries to draw a bar for each movie's runtime — but the bars are invisible. Open dev tools and check the \`<rect>\` elements: their \`width\` is "[object Object]".
  `.trim(),
  postTask: `
When the data is \`[10, 30, 50]\`, \`d => d\` returns the number itself. When the data is \`[{runtime: 99}, ...]\`, \`d => d\` returns the whole object. The browser then reads it as \`0\` for numeric attributes.
  `.trim(),
  tasks: [
    {
      id: 'fix-bug',
      title: 'Fix the bug',
      description: 'Only one line is wrong — the line that sets `width`. Change it to use the runtime field of each movie object.',
      starterCode: `const movies = [
  { title: "The Grand Budapest Hotel", genre: "Comedy",    runtime: 99,  imdb: 8.1 },
  { title: "Get Out",                  genre: "Horror",    runtime: 104, imdb: 7.7 },
  { title: "Coco",                     genre: "Animation", runtime: 105, imdb: 8.4 },
  { title: "Mad Max: Fury Road",       genre: "Action",    runtime: 120, imdb: 8.1 },
  { title: "Inception",                genre: "Sci-Fi",    runtime: 148, imdb: 8.8 },
  { title: "The Dark Knight",          genre: "Action",    runtime: 152, imdb: 9.0 }
];

d3.select("#chart")
  .selectAll("rect")
  .data(movies)
  .enter()
  .append("rect")
  .attr("x", 10)
  .attr("y", (d, i) => i * 30 + 10)
  .attr("height", 24)
  .attr("width", d => d)         // <-- BUG: d is an object, not a number
  .attr("fill", "#2b3a55");
`,
      lockedRanges: [
        { from: 1, to: 17 },
        { from: 19, to: 20 }
      ],
      hint: 'Each `d` is a movie object. Use `d.runtime` instead of just `d`.',
      solution: `const movies = [
  { title: "The Grand Budapest Hotel", genre: "Comedy",    runtime: 99,  imdb: 8.1 },
  { title: "Get Out",                  genre: "Horror",    runtime: 104, imdb: 7.7 },
  { title: "Coco",                     genre: "Animation", runtime: 105, imdb: 8.4 },
  { title: "Mad Max: Fury Road",       genre: "Action",    runtime: 120, imdb: 8.1 },
  { title: "Inception",                genre: "Sci-Fi",    runtime: 148, imdb: 8.8 },
  { title: "The Dark Knight",          genre: "Action",    runtime: 152, imdb: 9.0 }
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
    }
  ]
};
