async function DrawMap() {
  const populationData = (
    await d3.csv(
      "https://gist.githubusercontent.com/curran/0ac4077c7fc6390f5dd33bf5c06cb5ff/raw/605c54080c7a93a417a3cea93fd52e7550e76500/UN_Population_2019.csv"
    )
  ).map((d) => {
    const population = d["2020"];
    return {
      country: d["Country"],
      population: Number(population),
      id: d["Country code"],
    };
  });
  const countryDataOriginal = await d3.json("./countries-100m.json");

  const countryData = topojson.feature(
    countryDataOriginal,
    countryDataOriginal.objects["countries"]
  );

  console.log({ countryData, populationData });
  const populationMap = new Map();
  for (let i = 0; i < populationData.length; i++) {
    populationMap.set(populationData[i].id, populationData[i].population);
  }

  const width = 1280;
  const height = 1000;

  const pathGenerator = d3.geoPath().projection(d3.geoEquirectangular());

  // const colors = d3
  //   .scaleLinear()
  //   .domain([
  //     d3.min(populationData, (d) => d.population),
  //     d3.max(populationData, (d) => d.population),
  //   ])
  //   .range(["white", "green"]);

  // add the svg canvas
  const svg = d3
    .select("#main")
    .append("svg")
    .attr("id", "svg")
    .attr("width", width)
    .attr("height", height);

  // // Creating the container
  // const g = svg
  //   .append("g")
  //   .attr("transform", "translate(1/2, " + 100 + ")");

  // Creating counties layer
  svg.append("g")
    .attr('id', 'countries')
    .selectAll("path")
    .data(countryData.features)
    .enter()
    .append("path")
    .attr("d", (d) => pathGenerator(d))
    .attr("data-population", (d) => populationMap.get(d.id))
    .attr("class", "country")
    .attr("id", "country")
    .attr("fill", "none")
    // .attr("fill", (d) => colors(populationMap.get(d.id)));
    .attr("fill", "steelblue");

  // const legend = d3
  //   .legendColor()
  //   .scale(colors)
  //   .orient("horizontal")
  //   // .cells([3, 12, 21, 30, 39, 48, 57, 66])
  //   .shapeWidth(30)
  //   .shapeHeight(6)
  //   .labelAlign("end")
  //   .labels(({ i, generatedLabels }) => {
  //     return `${generatedLabels[i]}`;
  //   })
  //   .labelFormat("f");

  // svg
  //   .append("g")
  //   .attr("transform", "translate(600,120)")
  //   .attr("id", "legend")
  //   .call(legend);

  // tooltip
  const tooltip = d3
    .select("#main")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .text("tooltip");

  d3.selectAll("#country")
    .on("mouseover", function (event, data) {
      const populationInfo = populationData.find(
        (d) => d.country.toLowerCase() === data.properties.name.toLowerCase()
      );
      if (populationInfo) {
        return tooltip
          .style("visibility", "visible")
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 35 + "px")
          .attr("data-population", populationInfo.population)
          .text(`${populationInfo.country}: ${populationInfo.population}`);
      }
    })
    .on("mouseout", function () {
      return tooltip.style("visibility", "hidden");
    });
}

DrawMap();
