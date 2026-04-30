// Bar orientation — two related tasks on one page.

const sharedData = `const data = [10, 30, 50, 80];

const scale = d3.scaleLinear()
  .domain([0, 100])
  .range([0, 300]);
`;

export default {
  id: 'bar-orientation',
  title: 'Raising the Bar',
  preImage: 'images/svg-rect-coords.svg',
  preTask: `
In SVG, **(0, 0) is at the top-left** and the **y-axis points downward** — as shown in the diagram above. A \`rect\` with \`y = 0\` therefore anchors at the very top of the canvas and grows downward from there. This trips people up: the bars below are not broken, they are just growing in the wrong direction.
  `.trim(),
//   postTask: `
// Going from "hangs from top" to "grows from bottom" is a one-line fix. Going from vertical to horizontal is mostly swapping attributes — \`x\` ↔ \`y\`, \`width\` ↔ \`height\`. The y-down direction is not a D3 thing; it is how all 2D graphics on a screen work.
//   `.trim(),
  tasks: [
    {
      id: 'diagnose-bottom-up',
      type: 'mcq',
      title: 'Spot the fix',
      description: `
The bars are hanging from the top — you can see it in the preview on the right. Which attribute line(s) need to change to make them grow from the bottom instead, with the fewest edits?
      `.trim(),
      options: [
        { value: 'y',      label: 'Line number 13 (\"y\" attribute)' },
        { value: 'height', label: 'Line number 15 (\"height\" attribute)' },
        { value: 'both',   label: 'Both lines 13 and 15 (\"y\" and \"height\" attributes)' },
        { value: 'other',  label: 'Neither — a different attribute needs changing' },
      ],
      correctAnswer: 'y',
      explanation: `
Only \`y\` needs to change. It is currently fixed at \`0\` (the top of the canvas), so every bar anchors at the top and grows downward. The height is correct as-is.
      `.trim(),
      starterCode: `${sharedData}
d3.select("#chart")
  .selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", (d, i) => i * 60 + 20)
  .attr("y", 0)                              // <-- ?
  .attr("width", 40)
  .attr("height", d => scale(d))             // <-- ?
  .attr("fill", "#2b3a55");
`,
      previewImmediately: true,
      iframe: { width: 500, height: 340, html: '<svg id="chart" width="500" height="300" style="border:1px dashed #d6dae4;"></svg>' }
    },
    {
      id: 'bottom-up',
      title: 'Make bars grow from the bottom',
      description: `
Right now every bar starts at \`y = 0\` (the top) and grows down. Correct it to have a non-flipped vertical bar chart. 
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
Now make the bars run **horizontally** — growing from left to right, stacked top to bottom. 
      `.trim(),
      starterCode: `${sharedData}
d3.select("#chart")
  .selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", 0)                          // bars start at the left edge
  .attr("y", (d, i) => i * 60 + 20)      
  .attr("width", 40)                     
  .attr("height", d => scale(d))         
  .attr("fill", "#2b3a55");
`,
      lockedRanges: [
        { from: 1, to: 12 },
        { from: 16, to: 16 }
      ],
      solution: `${sharedData}
d3.select("#chart")
  .selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", 0)
  .attr("y", (d, i) => i * 60 + 20)
  .attr("width", d => scale(d))
  .attr("height", 40)
  .attr("fill", "#2b3a55");
`,
      iframe: { width: 380, height: 200, html: '<svg id="chart" width="500" height="300" style="border:1px dashed #d6dae4;"></svg>' }
    }
  ]
};
