$(document).ready(function(){
    $.getJSON({
        // url: "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json",
        url:"global-temperature.json",
        success: function(result){
            const basetemp = result.baseTemperature;
            const dataset = result.monthlyVariance;
            var formatNum = d3.format(".1f")
            var formatMonth = d3.timeFormat("%b")
            var yearRange = [];
            var monthRange = [];
            dataset.forEach(function(d){
                yearRange.push(d.year);
                // monthRange.push(d.month);
                d['date'] = new Date(d.year, d.month-1, 1);
                d['monthName'] = formatMonth(d.date);
                monthRange.push(d.monthName);
            })
            yearRange = [...new Set(yearRange)];
            monthRange = [...new Set(monthRange)];


            // set dimensions
            const w = 1400;
            const h = 700;
            const padding = 80;

            // set the ranges
            const xScale = d3.scaleBand()
                             .domain(yearRange)
                             .range([padding, w - padding])
                             .padding(0.15);
            const yScale = d3.scaleBand()
                             .domain(monthRange)
                             .range([padding, h - padding])
                             .padding(0.01);

            // build color scale
            const myColor = d3.scaleSequential()
                              .domain([d3.min(dataset, (d) => d.variance), d3.max(dataset, (d) => d.variance)])
                              .interpolator(d3.interpolateTurbo)

            // add the svg canvas
            const svg = d3.select("#container")
                          .append("svg")
                          .attr("width", w)
                          .attr("height", h);

            // define the tooltip
            const tooltip = d3.select("body")
                              .append("div")
                              .attr("id", "tooltip")
                              .style("display", "none")

            // add the plot
            svg.selectAll("rect")
               .data(dataset)
               .enter()
               .append("rect")
               .attr("class", "cell")
               .attr("x", (d) => xScale(d.year))
               .attr("y", (d) => yScale(d.monthName))
               .attr("width", xScale.bandwidth())
               .attr("height", yScale.bandwidth())
               .style("fill", (d) => myColor(d.variance))
               .attr("data-year", (d) => d.year)
               .attr("data-month", (d) => d.month)
               .attr("data-temp", (d) => d.variance + basetemp)
               .on("mouseover", function(d){
                    tooltip.style("display", "block")
                           .attr("data-year", d.Year)
                    tooltip.html(d.year + " " + d.monthName + "</br>" + "Temp: " + formatNum(d.variance + basetemp) + "°C" 
                            + "</br>" + "Var: " + formatNum(d.variance) + "°C")
                           .style("left", (d3.event.pageX + 16) + "px")
                           .style("top", (d3.event.pageY) + "px")
                })
                .on("mouseout", function(){
                    tooltip.style("display", "none")
                })
            
            // set the axes
            const xAxis = d3.axisBottom(xScale)
                            .tickValues(d3.range(1760, 2020, 10))
                            .tickFormat(d3.format("d"));
            const yAxis = d3.axisLeft(yScale);


            svg.append("g")
               .attr("transform", "translate(0, " + (h - padding) + ")")
               .attr("id", "x-axis")
               .call(xAxis)
               .selectAll("text")
               .style("text-anchor", "end")
               .attr("dx", "-.8em")
               .attr("dy", "-.5em")
               .attr("transform", "rotate(-90)");
        
            svg.append("g")
               .attr("transform", "translate(" + padding + ", 0)")
               .attr("id", "y-axis")
               .call(yAxis)

            // add title   
            svg.append("text")
               .attr("x", (w/2))
               .attr("y", (padding - 50))
               .attr("text-anchor", "middle")
               .attr("id", "title")
               .style("font-size", "26px")
               .text("Monthly Global Land-Surface Temperature")

            svg.append("text")
               .attr("x", (w/2))
               .attr("y", (padding - 20))
               .attr("text-anchor", "middle")
               .attr("id", "subtitle")
               .style("font-size", "18px")
               .text("1753 - 2015: base temperature 8.66 °C")

        }
    })
})
