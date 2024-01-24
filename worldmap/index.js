async function DrawMap() {
  const populationData = (
    await d3.csv(
      // "https://gist.githubusercontent.com/curran/0ac4077c7fc6390f5dd33bf5c06cb5ff/raw/605c54080c7a93a417a3cea93fd52e7550e76500/UN_Population_2019.csv"
      "./population.csv"
    )
  ).map((d) => {
    const population = d.Last;
    return {
      country: d.Country,
      population: Number(population),
      id: d.Country,
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

  const pathGenerator = d3.geoPath().projection(d3.geoNaturalEarth1());

  const graticule = d3.geoGraticule10();

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

  svg
    .append("path")
    .attr("d", () => pathGenerator(graticule))
    .attr("fill", "none")
    .attr("stroke", "lightgray");

  // Creating counties layer
  svg
    .append("g")
    .attr("id", "countries")
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
        (d) =>
          d.country.toLowerCase().indexOf(data.properties.name.toLowerCase()) >
            -1 ||
          data.properties.name.toLowerCase().indexOf(d.country.toLowerCase()) >
            -1
      );
      if (populationInfo) {
        return tooltip
          .style("visibility", "visible")
          .style("left", event.pageX - 220 + "px")
          .style("top", event.pageY - 100 + "px")
          .attr("data-population", populationInfo.population)
          .text(
            `${populationInfo.country}: ${populationInfo.population} million`
          );
      }
    })
    .on("mouseout", function () {
      return tooltip.style("visibility", "hidden");
    });
}

DrawMap();
