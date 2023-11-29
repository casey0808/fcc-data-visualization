// import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

async function DrawMap() {
  const [educationDataRes, countyDataRes] = await Promise.all([
    fetch(
      'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
    ),
    fetch(
      'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
    ),
  ]);

  const educationData = await educationDataRes.json();
  const countyDataOriginal = await countyDataRes.json();
  console.log('educationData', educationData);
  console.log('countyDataOriginal', countyDataOriginal);

  const countyData = topojson.feature(
    countyDataOriginal,
    countyDataOriginal.objects['counties']
  );

  console.log('countyData', countyData);
  const stateData = topojson.feature(
    countyDataOriginal,
    countyDataOriginal.objects['states']
  );

  const educationMap = new Map();
  educationData?.map((data) =>
    educationMap.set(data.fips, data.bachelorsOrHigher)
  );

  console.log(educationMap);

  const width = 960;
  const height = 900;
  const margin = {
    top: 50,
    bottom: 10,
    left: 10,
    right: 10,
  };

  // the data is already projected ?
  const pathGenerator = d3.geoPath().projection(null);

  const colors = d3
    .scaleLinear()
    .domain([
      d3.min(educationData, (d) => d.bachelorsOrHigher),
      d3.max(educationData, (d) => d.bachelorsOrHigher),
    ])
    .range(['white', 'green']);

  // add the svg canvas
  const svg = d3
    .select('#main')
    .append('svg')
    .attr('id', 'svg')
    .attr('width', width)
    .attr('height', height);

  // title
  svg
    .append('text')
    .attr('x', width / 2)
    .attr('y', margin.top)
    .attr('id', 'title')
    .attr('text-anchor', 'middle')
    .text('United States Educational Attainment');

  svg
    .append('text')
    .attr('x', width / 2)
    .attr('y', margin.top + 30)
    .attr('id', 'description')
    .attr('text-anchor', 'middle')
    .text(
      `Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)`
    );

  // Creating the container
  const g = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + 100 + ')');

  // Creating counties layer
  g.append('g')
    .selectAll('path')
    .data(countyData.features)
    .enter()
    .append('path')
    .attr('d', (d) => pathGenerator(d))
    .attr('data-fips', (d) => d.id)
    .attr('data-education', (d) => educationMap.get(d.id))
    .attr('class', 'county')
    .attr('fill', 'none')
    .attr('fill', (d) => colors(educationMap.get(d.id)));

  // Creating state layer on top of counties layer.
  g.append('g')
    .attr('id', 'states')
    .selectAll('path')
    .data(stateData.features)
    .enter()
    .append('path')
    .attr('key', (d) => d.id)
    .attr('d', pathGenerator)
    .attr('class', 'state')
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-width', '0.5px');

  const legend = d3.legendColor().scale(colors).orient('horizontal').cells([3, 12, 21, 30, 39, 48, 57, 66]).shapeWidth(30).shapeHeight(6).labelAlign('end').labelFormat('.0f');
  svg.append('g').attr('transform', 'translate(600,120)').attr('id', 'legend').call(legend);
}

DrawMap();
