async function DrawMap() {
  // const [videoGameRes, movieSalesRes, kickstarterRes] = await Promise.all([
  //   fetch(
  //     "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"
  //   ),
  //   fetch(
  //     "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"
  //   ),
  //   fetch(
  //     "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json"
  //   ),
  // ]);
  // const movieSales = await d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json");
  const movieSales = await d3.json("./movie.json");

  // const videoGameSales = await videoGameRes.json();
  // const movieSales = await movieSalesRes.json();
  // const kickstarterPledges = await kickstarterRes.json();

  const width = 1060;
  const height = 900;

  const colors = d3.scaleOrdinal(
    movieSales.children.map((d) => d.name),
    d3.schemeTableau10
  );

  // compute the layout
  const root = d3.treemap().size([960, 600]).padding(1).round(true)(
    d3
      .hierarchy(movieSales)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value)
  );

  // add the svg canvas
  const svg = d3
    .select("#main")
    .append("svg")
    .attr("id", "svg")
    .attr("width", width)
    .attr("height", height);

  // title
  // svg
  // .select("#title")
  //   .append("div")
  //   .attr("x", width / 2)
  //   .attr("y", 60)
  //   .attr("id", "title")
  //   .attr("text-anchor", "middle")
  //   .text("Movie Sales");

  // description
  // svg
  //   .append("text")
  //   .attr("x", width / 2)
  //   .attr("y", 90)
  //   .attr("id", "description")
  //   .attr("text-anchor", "middle")
  //   .text(`Top 100 Highest Grossing Movies Grouped By Genre`);

  // Add a cell for each leaf of the hierarchy.
  const leaf = svg
    .selectAll("g")
    .data(root.leaves())
    .join("g")
    .attr("transform", (d) => `translate(${d.x0},${d.y0 + 115})`)
    .attr("id", "leaf");

  // Append a color rectangle.
  leaf
    .append("rect")
    .attr("fill", (d) => {
      while (d.depth > 1) d = d.parent;
      return colors(d.data.name);
    })
    .attr("fill-opacity", 0.6)
    .attr("class", "tile")
    .attr("data-value", (d) => d.data.value)
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0);

  svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
    .attr("x", function (d) {
      return d.x0 + 1;
    })
    .attr("y", function (d) {
      return d.y0 + 140;
    })
    .text((d) => d.data.name)
    .html((d) =>
      d.data.name
        .split(/\s/)
        .map((str, i) => {
          if (i > 4) return;
          return `<tspan x=${d.x0 + 1} y=${d.y0 + 125 + 11 * i}>${str}</tspan>`;
        })
        .join("")
    )
    .attr("font-size", "9px")
    .attr("fill", "black")
    .style("overflow", "hidden");

  // legend
  const legend1 = d3
    .legendColor()
    .scale(colors)
    .cellFilter((d, i) => i < 3)
    .shapeWidth(16)
    .shapeHeight(16)
    .shapePadding(10)
    .labelAlign("end")
    .labels(({ i, generatedLabels }) => {
      return `${generatedLabels[i]}`;
    });

  const legend2 = d3
    .legendColor()
    .scale(colors)
    .cellFilter((d, i) => i >= 3 && i < 6)
    .shapeWidth(16)
    .shapeHeight(16)
    .shapePadding(10)
    .labelAlign("end")
    .labels(({ i, generatedLabels }) => {
      return `${generatedLabels[i]}`;
    });

  const legend3 = d3
    .legendColor()
    .scale(colors)
    .cellFilter((d, i) => i >= 6)
    .shapeWidth(16)
    .shapeHeight(16)
    .shapePadding(10)
    .labelAlign("end")
    .labels(({ i, generatedLabels }) => {
      return `${generatedLabels[i]}`;
    });

  const legendWrapper = svg.append("g").attr("id", "legend");

  legendWrapper
    .append("g")
    .attr("transform", `translate(730 , 30)`)
    .attr("class", "legend-item")
    .call(legend1);

  legendWrapper
    .append("g")
    .attr("transform", `translate(820 , 30)`)
    .attr("class", "legend-item")
    .call(legend2);

  legendWrapper
    .append("g")
    .attr("transform", `translate(910 ,30)`)
    .attr("class", "legend-item")
    .call(legend3);

  // tooltip
  const tooltip = d3
    .select("#main")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .text("tooltip");

  d3.selectAll("#leaf")
    .on("mouseover", function (event, data) {
      return tooltip
        .style("visibility", "visible")
        .style("left", event.pageX - 5 + "px")
        .style("top", event.pageY + "px")
        .html(
          `Name: ${data.data.name}<br />
				Category: ${data.data.category}<br />
				Value: ${data.data.value}`
        )
        .attr("data-value", data.data.value);
    })
    .on("mouseout", function () {
      return tooltip.style("visibility", "hidden");
    });
}

DrawMap();
