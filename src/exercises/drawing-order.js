// Drawing order — three tasks on one page.

const code_90_30_60 = `// Three circles of different radius, all centered at (200, 150).

const svg = d3.select("#chart");

svg.append("circle")
  .attr("cx", 200).attr("cy", 150).attr("r", 90)
  .attr("fill", "Indigo");

svg.append("circle")
  .attr("cx", 200).attr("cy", 150).attr("r", 30)
  .attr("fill", "Crimson");

svg.append("circle")
  .attr("cx", 200).attr("cy", 150).attr("r", 60)
  .attr("fill", "LightGreen");
`;

const code_90_30_60_data = `// Three circles of different radius, all centered at (200, 150).

const svg = d3.select("#chart");

const circleData = [
  { radius: 90, color: "Indigo" },
  { radius: 30, color: "Crimson" },
  { radius: 60, color: "LightGreen" },
];

svg.selectAll("circle")
  .data(circleData)
  .enter()
  .append("circle")
  .attr("cx", 200)
  .attr("cy", 150)
  .attr("r", d => d.radius)
  .attr("fill", d => d.color);
`;

const code_90_30_60_data_sorted = `// Three circles of different radius, all centered at (200, 150).

const svg = d3.select("#chart");

const circleData = [
  { radius: 90, color: "Indigo" },
  { radius: 30, color: "Crimson" },
  { radius: 60, color: "LightGreen" },
];

// Instead of sorting the data manually, we can use d3.descending to sort by radius in descending order.
circleData.sort((a, b) => d3.descending(a.radius, b.radius));

svg.selectAll("circle")
  .data(circleData)
  .enter()
  .append("circle")
  .attr("cx", 200)
  .attr("cy", 150)
  .attr("r", d => d.radius)
  .attr("fill", d => d.color);
`;

const ifr = { width: 500, height: 320, html: '<svg id="chart" width="500" height="300"></svg>' };

export default {
  id: 'drawing-order',
  title: "Bull's Eye!",
  preTask: `
**D3 draws shapes in the order they appear in the code.** The first shape is drawn first. Later shapes are painted on top of earlier ones. This is called the *painter's algorithm*. This becomes particularly important when the shapes overlap.
  `.trim(),
//   postTask: `
// This idea is everywhere in D3. When you bind data with \`.data(arr).enter().append(...)\`, the elements appear in the order of the array. To put a shape on top, append it last.
//   `.trim(),
  tasks: [
    {
      id: 'predict-90-30-60',
      type: 'mcq',
      title: 'Predict — how many circles will you see?',
      description: `
Look at the code on the left. Three circles share the same center. They are drawn in this order: r=90 (Indigo), r=30 (Crimson), r=60 (LightGreen). How many circles will be **visible (even partially)** in the final image?

Pick an answer, then click **Submit** to run the code and check.
      `.trim(),
      options: [
        { value: '0', label: '0 (there is an error in the code)' },
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' }
      ],
      correctAnswer: '2',
      explanation: `
The Crimson circle (r=30) is drawn second, on top of Indigo. Then the LightGreen circle (r=60) is drawn on top of Crimson, covering it completely. So you see only the LightGreen disc and the Indigo ring around it — the Crimson circle is hidden.
      `.trim(),
      starterCode: code_90_30_60,
      iframe: ifr
    },
    {
      id: 'reorder-90-30-60',
      title: 'Now make all three visible',
      description: `
Same three sizes (90, 30, 60). Change the order of the three circle blocks so **all three circles are visible** as concentric rings.
      `.trim(),
      starterCode: code_90_30_60,
      lockedRanges: [
        { from: 1, to: 4 },
      ],
      solution: `// Largest first, smallest last — three concentric rings.

const svg = d3.select("#chart");

svg.append("circle")
  .attr("cx", 200).attr("cy", 150).attr("r", 90)
  .attr("fill", "Indigo");    // drawn FIRST (bottom)

svg.append("circle")
  .attr("cx", 200).attr("cy", 150).attr("r", 60)
  .attr("fill", "LightGreen"); // drawn SECOND

svg.append("circle")
  .attr("cx", 200).attr("cy", 150).attr("r", 30)
  .attr("fill", "Crimson");   // drawn THIRD (top)
`,
      iframe: ifr
    },
    {
      id: 'predict-30-60-90',
      title: 'What about with data binding?',
      description: `Now the circles are created with data binding. The order is the same: r=90 (Indigo), r=30 (Crimson), r=60 (LightGreen). Change the \`circleData\` array so **all three circles are visible** as concentric rings.
      `.trim(),
      starterCode: code_90_30_60_data,
      lockedRanges: [
        { from: 1, to: 4 },
        { from: 10, to: 19 }
      ],
      solution: [
        `// Yes — same idea: largest first, smallest last.

const svg = d3.select("#chart");

const circleData = [
  { radius: 90, color: "Indigo" },
  { radius: 60, color: "LightGreen" },
  { radius: 30, color: "Crimson" },
];

svg.selectAll("circle")
  .data(circleData)
  .enter()
  .append("circle")
  .attr("cx", 200)
  .attr("cy", 150)
  .attr("r", d => d.radius)
  .attr("fill", d => d.color);
`,
        code_90_30_60_data_sorted,
      ],
      iframe: ifr
    }
  ]
};
