export default {
  id: 'style-vs-attr',
  title: '.style() vs .attr()',
  preTask: `
You can color an SVG shape in **two different ways**:

\`\`\`js
.attr("fill", "red")    // sets the SVG attribute
.style("fill", "red")   // sets the CSS style
\`\`\`

They look the same, but they are not. **CSS rules from a stylesheet override SVG attributes.** Inline \`.style()\` beats both.

A CSS rule is applied here: \`circle { fill: green; }\`. Predict the color, then run the code.
  `.trim(),
  postTask: `
A simple rule: use \`.attr()\` for things that describe the shape (\`cx\`, \`cy\`, \`r\`, \`d\`). For fill and stroke, pick **one** way (a CSS class + stylesheet, or \`.style()\`) and stick with it. Do not mix them.
  `.trim(),
  tasks: [
    {
      id: 'override',
      title: 'Make the circle red',
      description: 'Without changing the CSS, change the JavaScript so the circle becomes red. There is a one-word change you can make to the line that sets fill.',
      starterCode: `const svg = d3.select("#chart");

svg.append("circle")
  .attr("cx", 150).attr("cy", 100).attr("r", 60)
  .attr("fill", "red");   // <-- this should make the circle red. Will it?
`,
      lockedRanges: [
        { from: 1, to: 4 }
      ],
      hint: 'Change `.attr("fill", "red")` to `.style("fill", "red")`. Inline styles beat stylesheet rules.',
      solution: `const svg = d3.select("#chart");

svg.append("circle")
  .attr("cx", 150).attr("cy", 100).attr("r", 60)
  .style("fill", "red");
`,
      iframe: {
        width: 400,
        height: 240,
        html: '<svg id="chart" width="400" height="200"></svg>',
        extraCSS: 'circle { fill: green; }'
      }
    }
  ]
};
