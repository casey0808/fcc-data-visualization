$(document).ready(function(){
    $.getJSON({
        // url: "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json",
        url: "GDP-data.json",
        success: function(result) {
            const dataset = result.data;
            // parse the date
            var parser = d3.timeParse("%Y-%m-%d");
            dataset.forEach(function(d){
                d[2] = parser(d[0]);
            })
            
            // set the dimensions of the canvas
            const w = 1000;
            const h = 600;
            const padding = 80;

            // set the ranges
            const xScale = d3.scaleTime()
                             .domain([d3.min(dataset, (d) => d[2]), d3.max(dataset, (d) => d[2])])
                             .range([padding, w - padding]);

            const yScale = d3.scaleLinear()                 
                             .domain([0, d3.max(dataset, (d) => d[1])])
                             .range([h-padding, padding]);

            // add the svg canvas
            const svg = d3.select("#container")
                          .append("svg")
                          .attr("width", w)
                          .attr("height", h);
            
            // define the tooltip              
            var tooltip = d3.select("body")
                            .append("div")
                            .attr("id", "tooltip")
                            .style("display", "none") 
            
            // add the bar chart                
            svg.selectAll("rect")
               .data(dataset)
               .enter()
               .append("rect")
               .attr("class", "bar")
               .attr("x", (d, i) => xScale(d[2]))
               .attr("y", (d) => yScale(d[1]))
               .attr("width", 3)
               .attr("height", (d) => h - padding - yScale(d[1]))
               .attr("fill", "#3282b8")
               .attr("data-date", (d) => d[0])
               .attr("data-gdp", (d) => d[1])
               .on("mouseover", function(d){ 
                    tooltip.style("display", "block")
                           .attr("data-date", d[0])
                    tooltip.html(d[2].getFullYear() + " Q" + ((d[2].getMonth())/3 + 1) + "<br/>" + "$" + d[1] + " Billion")
                           .style("left", (d3.event.pageX + 16) + "px")
                           .style("top", "500px");
               })
               .on("mouseout", function(){
                    tooltip.style("display", "none")
               })
            
            // set the axes
            const xAxis = d3.axisBottom(xScale);
            const yAxis = d3.axisLeft(yScale);

            svg.append("g")
               .attr("transform", "translate(0, " + (h - padding) + ")")
               .attr("id", "x-axis")
               .call(xAxis);
        
            svg.append("g")
               .attr("transform", "translate(" + padding + ", 0)")
               .attr("id", "y-axis")
               .call(yAxis)
            
            // add title   
            svg.append("text")
               .attr("x", (w/2))
               .attr("y", (padding-20))
               .attr("text-anchor", "middle")
               .attr("id", "title")
               .style("font-size", "24px")
               .text("United States GDP")
            
            // add y-axis label
            svg.append("text")
               .attr("transform", "translate(" + (padding + 10) + ", " + (padding * 2) + ")rotate(-90)")
               .attr("dy", "1em")
               .style("text-anchor", "middle")
               .text("Gross Domestic Product")

        }

    })
})
