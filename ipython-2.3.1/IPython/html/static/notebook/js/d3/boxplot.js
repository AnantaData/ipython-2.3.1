//----------------------------------------------------------------------------
//  Copyright (C) 2015  The Ananta Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// Box Plot Graph
//============================================================================


function boxPlotSelectGrapgh(file,selection){

    var margin = {top: 30, right: 50, bottom: 20, left: 50},
        width = 150 - margin.left - margin.right,
        height = 240 - margin.top - margin.bottom;

    var min = Infinity,
        max = -Infinity;

    var chart = d3.box()
        .whiskers(iqr(1.5))
        .width(width)
        .height(height);

    d3.csv(file, function(data) {
        var len = Object.keys(data[0]).length;
        var object_properties = new Array(len)
        object_properties = Object.getOwnPropertyNames(data[0]);
        var data_array = new Array();
        var element;

        for (j = 0; j < data.length; j++) {
            var object = data[j];

            element = parseInt(object[selection]);
            data_array.push(element);
            if (element>max) max = element;
            if (element<min) min = element;
        }

        chart.domain([min, max]);
        if (isNaN(data_array[0])){
            console.log("NAN")
        }
        else{
            crateboxplot([data_array],width,height,margin,chart,selection);
        }
    });

}

function crateboxplot(data,width,height,margin,chart,Coloumn){

    var svg = d3.select("#visualization-area").append("svg")
        .data(data)
        .attr("class", "box")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.bottom + margin.top)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(chart);

    svg.append("text")
        .attr("x", width / 2 )
        .attr("y", -15)
        .style("text-anchor", "middle")
        .text(Coloumn);
}


// Returns a function to compute the interquartile range.
function iqr(k) {
    return function(d, i) {
        var q1 = d.quartiles[0],
            q3 = d.quartiles[2],
            iqr = (q3 - q1) * k,
            i = -1,
            j = d.length;
        while (d[++i] < q1 - iqr);
        while (d[--j] > q3 + iqr);
        return [i, j];
    };
}