//----------------------------------------------------------------------------
//  Copyright (C) 2015  The Ananta Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// Scatter Plot Graph
//============================================================================
function scatterplotCreateGrapgh(file) {

    var margin = {top: 70, right: 20, bottom: 40, left: 50};

    var width = 620 - margin.left - margin.right,
        height = 480 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    // setup fill color
    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
        .ticks(8)
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#visualization-area").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv(file, function (error, data) {

        data.forEach(function(d) {
            d.x = +d.x;
            d.y = +d.y;
        });

        x.domain(d3.extent(data, function (d) {
            return d.x;
        })).nice();
        y.domain(d3.extent(data, function (d) {
            return d.y;
        })).nice();

        //draw X axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
              .text("Scaled X Axis");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Scaled Y Axis");

        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("stroke", "none")
            .attr("r", 3.5)
            .attr("cx", function (d) {
                return x(d.x);
            })
            .attr("cy", function (d) {
                return y(d.y);
            })
            .style("fill", function(d) { return color(d.c); });

        var legend = svg.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });


        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) {
                return d;
            });

        var title = d3.select("svg").append("g")
            .attr("transform", "translate(" +margin.left+ "," +margin.top+ ")")
            .attr("class","title");

        title.append("text")
            .attr("x", (width / 2))
            .attr("y", -30 )
            .attr("text-anchor", "middle")
            .style("font-size", "22px")
            .text("Scatter Plot");

    });
}

