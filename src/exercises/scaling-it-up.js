// Scaling it up — combines two-scales (3 tasks) + scaleband (1 task).

export default {
  id: 'scaling-it-up',
  title: 'Scaling it up',
  preTask: `
A **\`scale\`** is just a function use to map values in the data \`domain\` to a defined \`range\` in pixel position. For example, \`d3.scaleLinear().domain([5, 10]).range([0, 100])\` maps a data value of 7 to roughly 40. (5 to pixel position 0, 10 to pixel position 100)

A bar chart needs one scale. A scatterplot needs two — one for x, one for y. All the charts below use SVG of width 500 and height 300. 

The first three tasks build up a scatterplot step by step. Then later go back to a bar chart for trying out the equivalent for categorical values: \`scaleBand\`.
  `.trim(),
  postTask: `
\`d3.extent(arr, accessor)\` is shorthand for \`[d3.min(arr, acc), d3.max(arr, acc)]\`.
  `.trim(),
  tasks: [
    {
      id: 'one-scale',
      title: 'Add Y-scale',
      description: 'Change the \`cy\` attribute of the circles distributed along the y-axis according to their rating using yScale. You may even modify the yScale if required. Higher rating on top and lower ratings on the bottom.',
      starterCode: `d3.json("data/movies.json").then(movies => {
  const yScale = d3.scaleLinear()
    .domain([5, 10])
    .range([0, 300]);
    
  d3.select("#chart")
    .selectAll("circle")
    .data(movies)
    .enter()
    .append("circle")
    .attr("cx", 250)
    .attr("cy", d => d.rating)
    .attr("r", 6)
    .attr("fill", "#2b3a55")
    .attr("fill-opacity", 0.7);
});
`,
      lockedRanges: [
        { from: 1, to: 1 },
        { from: 5, to: 11 },
        { from: 13, to: 100 }
      ],
      solutionNote: `In SVG, \`y = 0\` is the **top** of the screen and \`y = 300\` is the **bottom**. Inverting the range to \`[300, 0]\` flips this so high ratings land near the top:

<svg width="300" height="420" viewBox="0 0 300 420" style="display:block;margin:10px 0;font-family:system-ui,sans-serif;font-size:13px;">
  <rect x="8" y="8" width="284" height="404" fill="#f8f9fb" stroke="#d6dae4" stroke-width="1" rx="8"/>
  <text x="95" y="32" text-anchor="middle" font-size="12" font-weight="600" fill="#4a5568">domain</text>
  <text x="213" y="32" text-anchor="middle" font-size="12" font-weight="600" fill="#4a5568">range (pixel y)</text>
  <text x="95" y="47" text-anchor="middle" font-size="10" fill="#9aa5b4">[5, 10]</text>
  <text x="213" y="47" text-anchor="middle" font-size="10" fill="#9aa5b4">[300, 0] · 0 = screen top</text>
  <line x1="95" y1="70" x2="95" y2="370" stroke="#b0bac8" stroke-width="1.5"/>
  <line x1="213" y1="70" x2="213" y2="370" stroke="#b0bac8" stroke-width="1.5"/>
  <line x1="91" y1="70" x2="99" y2="70" stroke="#5b7fa6" stroke-width="2"/>
  <text x="83" y="74" text-anchor="end" fill="#5b7fa6" font-weight="600">10</text>
  <line x1="99" y1="70" x2="207" y2="70" stroke="#5b7fa6" stroke-width="1.5" stroke-dasharray="4,3"/>
  <circle cx="213" cy="70" r="5.5" fill="#5b7fa6"/>
  <text x="221" y="74" text-anchor="start" fill="#5b7fa6" font-weight="600">0</text>
  <text x="154" y="86" text-anchor="middle" font-size="11" fill="#5b7fa6" font-style="italic">yScale(10) = 0</text>
  <line x1="91" y1="130" x2="99" y2="130" stroke="#b0bac8" stroke-width="1.5"/>
  <text x="83" y="134" text-anchor="end" fill="#4a5568">9</text>
  <text x="221" y="134" text-anchor="start" fill="#4a5568">60</text>
  <line x1="91" y1="190" x2="99" y2="190" stroke="#e36588" stroke-width="2"/>
  <text x="83" y="194" text-anchor="end" fill="#e36588" font-weight="600">8</text>
  <text x="154" y="182" text-anchor="middle" font-size="11" fill="#e36588" font-style="italic">yScale(8) = 120</text>
  <line x1="99" y1="190" x2="207" y2="190" stroke="#e36588" stroke-width="1.5" stroke-dasharray="4,3"/>
  <circle cx="213" cy="190" r="5.5" fill="#e36588"/>
  <text x="221" y="194" text-anchor="start" fill="#e36588" font-weight="600">120</text>
  <line x1="91" y1="250" x2="99" y2="250" stroke="#b0bac8" stroke-width="1.5"/>
  <text x="83" y="254" text-anchor="end" fill="#4a5568">7</text>
  <text x="221" y="254" text-anchor="start" fill="#4a5568">180</text>
  <line x1="91" y1="310" x2="99" y2="310" stroke="#b0bac8" stroke-width="1.5"/>
  <text x="83" y="314" text-anchor="end" fill="#4a5568">6</text>
  <text x="221" y="314" text-anchor="start" fill="#4a5568">240</text>
  <line x1="91" y1="370" x2="99" y2="370" stroke="#b07d10" stroke-width="2"/>
  <text x="83" y="374" text-anchor="end" fill="#b07d10" font-weight="600">5</text>
  <line x1="99" y1="370" x2="207" y2="370" stroke="#b07d10" stroke-width="1.5" stroke-dasharray="4,3"/>
  <circle cx="213" cy="370" r="5.5" fill="#b07d10"/>
  <text x="221" y="374" text-anchor="start" fill="#b07d10" font-weight="600">300</text>
  <text x="154" y="388" text-anchor="middle" font-size="11" fill="#b07d10" font-style="italic">yScale(5) = 300</text>
</svg>`,
      solution: `d3.json("data/movies.json").then(movies => {
  const yScale = d3.scaleLinear()
    .domain([5, 10])
    .range([300, 0]); // Invert the range so higher ratings are near the top.

  // An alternative solution would be:
  //    const yScale = d3.scaleLinear()
  //      .domain([10, 5])
  //      .range([0, 300]);

  // or, like we did previously:
  //    const yScale = d3.scaleLinear()
  //      .domain([5, 10])
  //      .range([0, 300]);
  // and then invert the y value:
  //      .attr("cy", d => 300 - yScale(d.rating));

  d3.select("#chart")
    .selectAll("circle")
    .data(movies)
    .enter()
    .append("circle")
    .attr("cx", 250)
    .attr("cy", d => yScale(d.rating))
    .attr("r", 6)
    .attr("fill", "#2b3a55")
    .attr("fill-opacity", 0.7);
});
`,
      iframe: { width: 620, height: 320, html: '<svg id="chart" width="500" height="300" style="border:1px dashed #d6dae4;"></svg>' }
    },
    {
      id: 'add-y-scale',
      title: 'Add X-scale',
      description: 'Right now every circle is at `cx = 250`. Add a xScale that maps the runtime to a pixel position along x-axis. Also use that scale for \`cx\`. Note that the width of the SVG is 500, but you may want to leave some margin for axes and labels.',
      starterCode: `d3.json("data/movies.json").then(movies => {
  const yScale = d3.scaleLinear()
    .domain([5, 10])
    .range([300, 0]);
    
  // const xScale = d3.scaleLinear()

  d3.select("#chart")
    .selectAll("circle")
    .data(movies)
    .enter()
    .append("circle")
    .attr("cx", 250)
    .attr("cy", d => yScale(d.rating))
    .attr("r", 6)
    .attr("fill", "#2b3a55")
    .attr("fill-opacity", 0.7);
});
`,
      lockedRanges: [
        { from: 1, to: 5 },
        { from: 8, to: 12 },
        { from: 14, to: 99 }
      ],
      solution: `d3.json("data/movies.json").then(movies => {

  const yScale = d3.scaleLinear()
    .domain([5, 10])
    .range([300, 0]);

  const xScale = d3.scaleLinear()
    .domain([d3.min(movies, d => d.runtime), d3.max(movies, d => d.runtime)]) // Instead of hardcoding the domain, we can compute it based on minimum and maximum values.
    .range([0, 500]); // Note that the range is not inverted for x.
  
    // An alternate for min/max in the domain is using the extent function, which returns both min and max in one call: 
    //  .domain(d3.extent(movies, d => d.runtime))

  d3.select("#chart")
    .selectAll("circle")
    .data(movies)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.runtime))
    .attr("cy", d => yScale(d.rating))
    .attr("r", 6)
    .attr("fill", "#2b3a55")
    .attr("fill-opacity", 0.7);
});
`,
      iframe: { width: 620, height: 320, html: '<svg id="chart" width="500" height="300" style="border:1px dashed #d6dae4;"></svg>' }
    },
    {
      id: 'use-extent',
      title: 'Compute the domain from the data',
      description: `Hardcoded domains break when the data(\`JSON\`) changes. Replace the \`.domain([...])\` for \`yScale\` to use either \`d3.extent\` or compute the \`d3.min\` and \`d3.max\` functions (like the sample solution for task 2) on the \`rating\` field. Observe the impact.

      \`d3.extent(arr, accessor)\` is shorthand for \`[d3.min(arr, acc), d3.max(arr, acc)]\`.
`,
      starterCode: `d3.json("data/movies.json").then(movies => {

  const xScale = d3.scaleLinear()
    .domain(d3.extent(movies, d => d.runtime))
    .range([0, 500]); 

  const yScale = d3.scaleLinear()
    .domain([5, 10])
    .range([300, 0]);

  d3.select("#chart")
    .selectAll("circle")
    .data(movies)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.runtime))
    .attr("cy", d => yScale(d.rating))
    .attr("r", 6)
    .attr("fill", "#2b3a55")
    .attr("fill-opacity", 0.7);
});
`,
      lockedRanges: [
        { from: 1, to: 7 },
        { from: 9, to: 99 }
      ],
      solution: `d3.json("data/movies.json").then(movies => {

  const xScale = d3.scaleLinear()
    .domain(d3.extent(movies, d => d.runtime))
    .range([0, 500]); 

  const yScale = d3.scaleLinear()
    .domain(d3.extent(movies, d => d.rating))
    .range([300, 0]);

  d3.select("#chart")
    .selectAll("circle")
    .data(movies)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.runtime))
    .attr("cy", d => yScale(d.rating))
    .attr("r", 6)
    .attr("fill", "#2b3a55")
    .attr("fill-opacity", 0.7);
});
`,
      iframe: { width: 620, height: 320, html: '<svg id="chart" width="500" height="300" style="border:1px dashed #d6dae4;"></svg>' }
    },
    {
      id: 'replace-linear',
      title: 'Switch to scaleBand for categories',
      description: `\`scaleLinear\` only handles numbers — passing genre strings gives \`NaN\` everywhere. Replace the broken \`scaleLinear\` with \`scaleBand\` and observe the result. Additionally, check out how the runtime differs across genres instead of rating.`,
      starterCode: `d3.json("data/movies.json").then(movies => {

  // Advance content (maybe ignored for now): Calculate the unique genres in the data. We will use that for the domain of the xScale.
  const allGenres = [...new Set(movies.map(d => d.genre))];
  
  console.log("allGenres:", allGenres); // Check the console to see the list of genres.

  const xScale = d3.scaleLinear()
    .domain(allGenres)
    .range([0, 500]);

  const yScale = d3.scaleLinear()
    .domain(d3.extent(movies, d => d.rating))
    .range([300, 0]);

  d3.select("#chart")
    .selectAll("circle")
    .data(movies)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.genre))
    .attr("cy", d => yScale(d.rating))
    .attr("r", 6)
    .attr("fill", "#2b3a55")
    .attr("fill-opacity", 0.7);
});
`,
      lockedRanges: [
        { from: 1, to: 7 },
        { from: 9, to: 12 },
        { from: 14, to: 21 },
        { from: 23, to: 99 }
      ],
      solution: `d3.json("data/movies.json").then(movies => {

  // Advance content (maybe ignored for now): Calculate the unique genres in the data. We will use that for the domain of the xScale.
  const allGenres = [...new Set(movies.map(d => d.genre))];
  
  console.log("allGenres:", allGenres); // Check the console to see the list of genres.

  const xScale = d3.scaleBand()
    .domain(allGenres)
    .range([0, 500]);

  const yScale = d3.scaleLinear()
    .domain(d3.extent(movies, d => d.runtime))
    .range([300, 0]);

  d3.select("#chart")
    .selectAll("circle")
    .data(movies)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.genre))
    .attr("cy", d => yScale(d.runtime))
    .attr("r", 6)
    .attr("fill", "#2b3a55")
    .attr("fill-opacity", 0.7);
});
`,
      iframe: { width: 620, height: 320, html: '<svg id="chart" width="500" height="300" style="border:1px dashed #d6dae4;"></svg>' }
    },
    {
      id: 'correct-count-scale',
      title: 'Fix the bar chart scale bugs',
      description: `Currently you see only two bars instead of eight (there are 8 genres in the data). There are two bugs in the code. Try to find and fix them both.`,
      starterCode: `d3.json("data/movies.json").then(movies => {

  // Advance content (maybe ignored for now): Calculate the number of movies per genre.
  const movieCountPerGenre = Array.from(
    d3.rollup(movies, v => v.length, d => d.genre),
    ([genre, count]) => ({ genre, count })
  );
  console.log("movieCountPerGenre:", movieCountPerGenre); // Check the console to see the data.

  const xScale = d3.scaleBand()
    .domain(movieCountPerGenre.map(d => d.genre))
    .range([0, 500])
    .padding(0.2);

  const yScale = d3.scaleLinear()
    .domain([d3.min(movieCountPerGenre, d => d.count), d3.max(movieCountPerGenre, d => d.count)])
    .range([300, 0]);

  d3.select("#chart")
    .selectAll("rect")
    .data(movieCountPerGenre)
    .enter()
    .append("rect")
    .attr("x", d => xScale(d.genre))
    .attr("y", d => yScale(d.count))
    .attr("width", xScale.bandwidth()) // gives the width of each bar based on the number of categories and the range.
    .attr("height", d => yScale(d.count))
    .attr("fill", "#2b3a55");
});
`,
      lockedRanges: [
        { from: 1, to: 14 },
        { from: 18, to: 24 },
        { from: 26, to: 26 },
        { from: 28, to: 99 }
      ],
      hint: 'Bug 1: I intentionally did not use the extent function here. Bug 2: The y attribute is perfectly correct, but the height is wrong.',
      solutionNote: `**Bug 1 — domain must start at 0:** \`domain([min, max])\` maps the minimum count to the baseline and the maximum count to y = 0 (screen top). Combined with the height bug, bars at both extremes become invisible — only the middle values show. Always anchor a bar chart's y-domain at \`0\`.

**Bug 2 — calculating height with an inverted y-axis:**

<svg width="340" height="420" viewBox="0 0 340 420" style="display:block;margin:10px 0;font-family:system-ui,sans-serif;font-size:12px;">
  <rect x="8" y="8" width="324" height="404" fill="#f8f9fb" stroke="#d6dae4" stroke-width="1" rx="8"/>
  <text x="170" y="30" text-anchor="middle" font-size="12" font-weight="600" fill="#4a5568">Bug 2: bar height with an inverted y-axis</text>
  <text x="170" y="46" text-anchor="middle" font-size="10" fill="#9aa5b4">count = 3, max = 4 · yScale(3) = 75 · yScale(0) = 300</text>
  <line x1="52" y1="56" x2="52" y2="362" stroke="#b0bac8" stroke-width="1.5"/>
  <line x1="48" y1="60" x2="56" y2="60" stroke="#9aa5b4" stroke-width="1.5"/>
  <text x="43" y="64" text-anchor="end" fill="#9aa5b4" font-size="11">0</text>
  <line x1="56" y1="60" x2="218" y2="60" stroke="#d6dae4" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="221" y="64" text-anchor="start" fill="#9aa5b4" font-size="10" font-style="italic">screen top</text>
  <line x1="48" y1="134" x2="56" y2="134" stroke="#e36588" stroke-width="2"/>
  <text x="43" y="138" text-anchor="end" fill="#e36588" font-size="11" font-weight="600">75</text>
  <line x1="56" y1="134" x2="218" y2="134" stroke="#e36588" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="221" y="138" text-anchor="start" fill="#e36588" font-size="10">bar top  (.attr("y", yScale(d.count)))</text>
  <line x1="48" y1="207" x2="56" y2="207" stroke="#b03030" stroke-width="1" stroke-dasharray="3,2"/>
  <text x="43" y="211" text-anchor="end" fill="#b03030" font-size="10">150</text>
  <line x1="56" y1="207" x2="128" y2="207" stroke="#b03030" stroke-width="1" stroke-dasharray="3,2"/>
  <line x1="48" y1="354" x2="56" y2="354" stroke="#5b7fa6" stroke-width="2"/>
  <text x="43" y="358" text-anchor="end" fill="#5b7fa6" font-size="11" font-weight="600">300</text>
  <line x1="56" y1="354" x2="218" y2="354" stroke="#5b7fa6" stroke-width="1.5"/>
  <text x="221" y="358" text-anchor="start" fill="#5b7fa6" font-size="10">baseline  (yScale(0))</text>
  <text x="98" y="118" text-anchor="middle" font-size="11" fill="#b03030" font-weight="600">✗ wrong</text>
  <rect x="68" y="134" width="60" height="73" fill="#e36588" fill-opacity="0.15" stroke="#e36588" stroke-width="1.5" stroke-dasharray="5,3"/>
  <line x1="132" y1="134" x2="136" y2="134" stroke="#e36588" stroke-width="1.5"/>
  <line x1="134" y1="134" x2="134" y2="207" stroke="#e36588" stroke-width="1.5"/>
  <line x1="132" y1="207" x2="136" y2="207" stroke="#e36588" stroke-width="1.5"/>
  <text x="139" y="175" text-anchor="start" fill="#b03030" font-size="11" font-weight="600">75</text>
  <text x="98" y="374" text-anchor="middle" font-size="10" fill="#b03030">yScale(d.count)</text>
  <text x="98" y="388" text-anchor="middle" font-size="10" fill="#b03030">= 75  (too short)</text>
  <text x="190" y="118" text-anchor="middle" font-size="11" fill="#1e6c34" font-weight="600">✓ correct</text>
  <rect x="160" y="134" width="60" height="220" fill="#2b3a55" fill-opacity="0.15" stroke="#2b3a55" stroke-width="1.5"/>
  <line x1="224" y1="134" x2="228" y2="134" stroke="#5b7fa6" stroke-width="1.5"/>
  <line x1="226" y1="134" x2="226" y2="354" stroke="#5b7fa6" stroke-width="1.5"/>
  <line x1="224" y1="354" x2="228" y2="354" stroke="#5b7fa6" stroke-width="1.5"/>
  <text x="231" y="248" text-anchor="start" fill="#1e5c8e" font-size="11" font-weight="600">225</text>
  <text x="190" y="374" text-anchor="middle" font-size="10" fill="#1e5c8e">yScale(0) − yScale(d.count)</text>
  <text x="190" y="388" text-anchor="middle" font-size="10" fill="#1e5c8e">= 300 − 75 = 225 ✓</text>
</svg>`,
      solution: `d3.json("data/movies.json").then(movies => {

  // Advance content (maybe ignored for now): Calculate the number of movies per genre.
  const movieCountPerGenre = Array.from(
    d3.rollup(movies, v => v.length, d => d.genre),
    ([genre, count]) => ({ genre, count })
  );
  console.log("movieCountPerGenre:", movieCountPerGenre); // Check the console to see the data.

  const xScale = d3.scaleBand()
    .domain(movieCountPerGenre.map(d => d.genre))
    .range([0, 500])
    .padding(0.2);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(movieCountPerGenre, d => d.count)])
    .range([300, 0]);

  d3.select("#chart")
    .selectAll("rect")
    .data(movieCountPerGenre)
    .enter()
    .append("rect")
    .attr("x", d => xScale(d.genre))
    .attr("y", d => yScale(d.count))
    .attr("width", xScale.bandwidth()) // gives the width of each bar based on the number of categories and the range.
    .attr("height", d => yScale(0) - yScale(d.count))
    .attr("fill", "#2b3a55");
});
`,
      iframe: { width: 620, height: 320, html: '<svg id="chart" width="500" height="300" style="border:1px dashed #d6dae4;"></svg>' }
    }
  ]
};
