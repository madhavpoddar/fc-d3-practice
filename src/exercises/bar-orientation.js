// Bar orientation — two related tasks on one page.

const sharedData = `const data = [10, 30, 50, 80];

const scale = d3.scaleLinear()
  .domain([0, 100])
  .range([0, 300]);
`;

export default {
  id: 'bar-orientation',
  title: 'Bar orientation',
  preTask: `
A bar chart from last week — but different. In SVG, the **y-axis points down** (y=0 is at the *top* of the canvas). That is why the bars below hang from the top instead of growing from the bottom.
  `.trim(),
  postTask: `
Going from "hangs from top" to "grows from bottom" is a one-line fix. Going from vertical to horizontal is mostly swapping attributes — \`x\` ↔ \`y\`, \`width\` ↔ \`height\`. The y-down direction is not a D3 thing; it is how all 2D graphics on a screen work.
  `.trim(),
  tasks: [
    {
      id: 'bottom-up',
      title: 'Make bars grow from the bottom',
      description: `
Right now every bar starts at \`y = 0\` (the top) and grows down. Change only the \`y\` attribute so each bar starts at the bottom of the canvas (y = 300) minus its own height.
      `.trim(),
      starterCode: `${sharedData}
d3.select("#chart")
  .selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", (d, i) => i * 60 + 20)
  .attr("y", 0)                              // <-- change this
  .attr("width", 40)
  .attr("height", d => scale(d))
  .attr("fill", "#2b3a55");
`,
      lockedRanges: [
        { from: 1, to: 12 },
        { from: 14, to: 16 }
      ],
      solution: `${sharedData}
d3.select("#chart")
  .selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", (d, i) => i * 60 + 20)
  .attr("y", d => 300 - scale(d))
  .attr("width", 40)
  .attr("height", d => scale(d))
  .attr("fill", "#2b3a55");
`,
      iframe: { width: 500, height: 340, html: '<svg id="chart" width="500" height="300" style="border:1px dashed #d6dae4;"></svg>' }
    },
    {
      id: 'horizontal',
      title: 'Make bars horizontal',
      description: `
Now make the bars run **horizontally** — growing from left to right, stacked top to bottom. You will need to swap which attributes carry the bar's length and position.
      `.trim(),
      starterCode: `${sharedData}
d3.select("#chart")
  .selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", 0)                          // bars start at the left edge
  .attr("y", (d, i) => i * 35 + 10)      // stacked top to bottom
  .attr("width", 40)                     // <-- the bar's length should live here
  .attr("height", d => scale(d))         // <-- but it is in the wrong attribute
  .attr("fill", "#2b3a55");
`,
      lockedRanges: [
        { from: 1, to: 11 },
        { from: 16, to: 16 }
      ],
      hint: 'Swap the values: width should depend on the data (the bar length). height should be a fixed thickness. So width = scale(d), height = 24.',
      solution: `${sharedData}
d3.select("#chart")
  .selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", 0)
  .attr("y", (d, i) => i * 35 + 10)
  .attr("width", d => scale(d))
  .attr("height", 24)
  .attr("fill", "#2b3a55");
`,
      iframe: { width: 380, height: 200, html: '<svg id="chart" width="360" height="170" style="border:1px dashed #d6dae4;"></svg>' }
    }
  ]
};
