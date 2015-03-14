//----------------------------------------------------------------------------
//  Copyright (C) 2015  The Ananta Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// Bar Chart
//============================================================================

function barChartSelectGrapgh(file,selection){
    d3.csv(file, function(data) {

        var len = Object.keys(data[0]).length;
        var data_array = new Array(data.length);

        for (j = 0; j < data.length; j++) {
            var object = data[j];
            data_array[j] = parseInt(object[selection]);
        }

        if (isNaN(data_array[0])){
            console.log("NAN")
        }
        else{
            cratebarChar(data_array,selection);
        }
    });
}

function cratebarChar(values,column){
    var max_margin = maxMargin(values),
        min_margin = minMargin(values);

    // A formatter for counts.
    var formatCount = d3.format(",.0f");
    var formatPercent = d3.format(".0%");

    var margin = {top: 10, right: 30, bottom: 30, left: 30},
        width = 250 ,
        height = 200,
        ticks = ((max_margin - min_margin)/width);

    var x = d3.scale.linear()
        .domain([min_margin, max_margin])
        .range([0, width]);

    var data = d3.layout.histogram()
        .bins(x.ticks(100))
    (values);

    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.y; })])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
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

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong>Frequency:</strong> <span style='color:red'>" + formatCount(d.y) + "</span>";
        })

    svg.call(tip);

    var bar = svg.selectAll(".bar")
        .data(data)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    bar.append("rect")
        .attr("x", 1)
        .attr("width",function(){ if(x(data[0].dx)-1<0){return 1;}else{return x(data[0].dx)-1;}})
        .attr("height", function(d) { return height - y(d.y); });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", 30)
        .style("text-anchor", "end")
        .text(column);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -30)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");

    svg.append("text")
        .attr("x", width / 2 )
        .attr("y", 0)
        .style("text-anchor", "middle")
        .text("Frequency of "+column);

}

function maxMargin(data_array){
    var slots_max = data_array[0];
    for (var s = 0; s < data_array.length; s++) //finding maximum value of slots array
    {
        if (data_array[s] > slots_max) {
            slots_max = data_array[s];
        }
    }
    return(slots_max);
}

function minMargin(data_array){
    var slots_min = data_array[0];
    for (var s = 0; s < data_array.length; s++) //finding maximum value of slots array
    {
        if (data_array[s] < slots_min) {
            slots_min = data_array[s];
        }
    }
    return(slots_min);
}
