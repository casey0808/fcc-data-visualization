$(document).ready(function(){
    $.getJSON({
        url: "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json",
        success: function(dataset){

            // parse time
            dataset.forEach(function(d){
                d.Seconds = new Date(d.Seconds * 1000);
            })

            // set dimensions
            const w = 1000;
            const h = 600;
            const padding = 80;

            // set the ranges
            const xScale = d3.scaleLinear()
                             .domain([d3.min(dataset, (d) => d.Year) - 1, d3.max(dataset, (d) => d.Year)])
                             .range([padding, w - padding]);
            const yScale = d3.scaleTime()
                             .domain(d3.extent(dataset, (d) => d.Seconds))
                             .range([padding, h - padding]);
            
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
            
            // add the scatter plot
            svg.selectAll("circle")
               .data(dataset)
               .enter()
               .append("circle")
               .attr("cx", (d) => xScale(d.Year))
               .attr("cy", (d) => yScale(d.Seconds))
               .attr("r", 7)
               .attr("class", "dot")
               .attr("data-xvalue", (d) => d.Year)
               .attr("data-yvalue", (d) => d.Seconds)
               .attr("data-legend", function(d){ return (d.Doping === "") ? 
                                                "No doping allegations" : 
                                                "Riders with doping allegations"})
               .attr("fill", function(d){ return (d.Doping === "") ? 
                                        "orange" : 
                                        "lightblue"})
               .on("mouseover", function(d){
                    tooltip.style("display", "block")
                           .attr("data-year", d.Year)
                    tooltip.html(d.Name + ": " + d.Nationality + "</br>" + "Year: " + d.Year + ", Time: " + d.Time +
                                "</br></br>" + d.Doping)
                           .style("left", (d3.event.pageX + 16) + "px")
                           .style("top", (d3.event.pageY) + "px")
                })
               .on("mouseout", function(){
                    tooltip.style("display", "none")
                })



            // set the axes
            const xAxis = d3.axisBottom(xScale)
                            .tickFormat(d3.format("d"));
                           
            const yAxis = d3.axisLeft(yScale)
                            .tickFormat(d3.timeFormat("%M:%S"));                            
                               
            
            svg.append("g")
               .attr("transform", "translate(0, " + (h - padding) + ")")
               .attr("id", "x-axis")
               .style("font-size", "12px")
               .call(xAxis)

            svg.append("g")
               .attr("transform", "translate(" + (padding) + ", 0)")
               .attr("id", "y-axis")
               .style("font-size", "12px")
               .call(yAxis)
              

            // title
            svg.append("text")
               .attr("x", (w/2))
               .attr("y", (padding - 40))
               .attr("text-anchor", "middle")
               .attr("id", "title")
               .style("font-size", "26px")
               .text("Doping in Professional Bicycle Racing")

            // subtitle
            svg.append("text")
               .attr("x", (w/2))
               .attr("y", (padding - 10))
               .attr("text-anchor", "middle")
               .attr("id", "title")
               .style("font-size", "18px")
               .attr("font-weight", "100")
               .text("35 Fastest times up Alpe d'Huez")


            // y-axis label
            svg.append("text")
            .attr("transform", "translate(" + 30 + ", " + (padding * 2) + ")rotate(-90)")
            .style("text-anchor", "middle")
            .style("font-size", "18px")
            .text("Time in Minutes")

            // x-axis label
            svg.append("text")
            .attr("transform", "translate(" + 500 + ", " + (h - 30) + ")")
            .style("text-anchor", "middle")
            .style("font-size", "18px")
            .text("Year")

            // data legend
            legend = [{"color": "orange", "text": "No doping allegations"}, {"color": "lightblue", "text": "Riders with doping allegations"}]
            legend.forEach(function(legend, i){
                svg.append("rect")
                    .attr("id", "legend")
                    .attr("x", 910)
                    .attr("y", 300 + i * 20)
                    .attr("width", 15)
                    .attr("height", 15)
                    .attr("fill", legend.color)

                svg.append("text")
                   .attr("x", 765)
                   .attr("y", 312 + i * 20)
                   .attr("font-size", "11px")
                   .attr("font-weight", "100")
                   .text(legend.text)
            })

        }
    })
})