export default {
  id: 'enter-vs-join',
  title: 'enter vs join',
  preTask: `
The pattern you have been writing is:

\`\`\`js
selection.selectAll("rect")
  .data(arr)
  .enter()
  .append("rect")
  .attr(...)
\`\`\`

D3 v7 added a shorter version that does the same thing in one step:

\`\`\`js
selection.selectAll("rect")
  .data(arr)
  .join("rect")
  .attr(...)
\`\`\`

For static charts, both give the same output. \`.join()\` is especially useful when the data updates — but even here, it is less to type.
  `.trim(),
  postTask: `
You will see both forms online. They are interchangeable for our purposes. Use whichever you find easier to read.
  `.trim(),
  tasks: [
    {
      id: 'rewrite',
      title: 'Rewrite with .join()',
      description: 'Replace `.enter().append("circle")` with a single `.join("circle")`. The output should look the same.',
      starterCode: `const data = [25, 60, 95, 130, 165];

d3.select("#chart")
  .selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", d => d)
  .attr("cy", 80)
  .attr("r", 20)
  .attr("fill", "#e36588");
`,
      lockedRanges: [
        { from: 1, to: 4 },
        { from: 7, to: 11 }
      ],
      hint: 'Replace the two lines `.enter()` and `.append("circle")` with one line: `.join("circle")`.',
      solution: `const data = [25, 60, 95, 130, 165];

d3.select("#chart")
  .selectAll("circle")
  .data(data)
  .join("circle")
  .attr("cx", d => d)
  .attr("cy", 80)
  .attr("r", 20)
  .attr("fill", "#e36588");
`,
      iframe: { width: 250, height: 200, html: '<svg id="chart" width="220" height="160" style="border:1px dashed #d6dae4;"></svg>' }
    }
  ]
};
