//----------------------------------------------------------------------------
//  Copyright (C) 2015  The Ananta Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// Semantics Graph
//============================================================================
var width = 960,
    height = 500;

function SemanticSelectGrapgh(selection_1,selection_2){
    d3.csv("a.csv", function(data) {
        var len = Object.keys(data[0]).length;
        var object_properties = new Array(len)
        object_properties = Object.getOwnPropertyNames(data[0]);
        var data_array = new Array(data.length);

        for (j = 0; j < data.length; j++) {
            var object = data[j];
            var property_1 = object_properties[selection_1];
            var property_2 = object_properties[selection_2];

            data_array[j] = [parseInt(object[property_1]),parseInt(object[property_2])];
        }
        createGraph(data_array);
    });

}


function createGraph(data){
    console.log(data);
    var x = d3.scale.linear()
        .domain([0, width])
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([0, height])
        .range([height, 0]);

    var svg = d3.select("#semanticvisdiv").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .call(d3.behavior.zoom().x(x).y(y).scaleExtent([1, 8]).on("zoom", zoom));

    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height);

    var circle = svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("r", 2.5)
        .attr("transform", transform);

    function zoom() {
        circle.attr("transform", transform);
    }

    function transform(d) {
        return "translate(" + x(d[0]) + "," + y(d[1]) + ")";
    }

}

