//----------------------------------------------------------------------------
//  Copyright (C) 2015  The Ananta Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// Hex Binning Graph
//============================================================================
var margin = {top: 70, right: 20, bottom: 40, left: 50};

function hexBinningCreateGrapgh(file) {

    var width = 600 - margin.left - margin.right,
        height = 480 - margin.top - margin.bottom;

    d3.csv(file, function (data) {

        var x = data.map(function(d) { return d.x});
        var y = data.map(function(d) { return d.y});
        var colorlabel = data.map(function(d) { return d.c});

        //var points = new Array(data.length);
        var point_x = new Array(data.length);
        var point_y = new Array(data.length);

        for (var i = 0; i < data.length; i++) {
            point_x[i] = new Array(x[i]);
            point_y[i] = new Array(y[i]);
        }
        createHexBinChart(point_x,point_y,colorlabel,height,width);
    });

}


function createHexBinChart(x_arr,y_arr,colorlabel_arr,height,width){

    var max_x = maxMargin_x(x_arr);
    var max_y = maxMargin_y(y_arr);

    var x_factor = 0;
    var y_factor = 0;

    if(max_x!=0){
        x_factor = width/max_x;
    }
    if(max_y!=0){
        y_factor = height/max_y;
    }

    var points = new Array(colorlabel_arr.length);

    for (var i = 0; i < colorlabel_arr.length; i++) {

        var x_cor = x_arr[i]*x_factor;
        var y_cor = height-(y_arr[i]*y_factor);

        points[i] = new Array(x_cor,y_cor);
    }

    var color_blue = d3.scale.linear()
        .domain([0, 20])
        .range(["white", "steelblue"])
        .interpolate(d3.interpolateLab);

    var color_red = d3.scale.linear()
        .domain([0, 20])
        .range(["white", "red"])
        .interpolate(d3.interpolateLab);

    var color_green = d3.scale.linear()
        .domain([0, 20])
        .range(["white", "green"])
        .interpolate(d3.interpolateLab);

    var color = d3.scale.linear()
        .domain([0, 3])
        .range(["yellow", "darkred"])
        .interpolate(d3.interpolateLab);

    var x = d3.scale.linear()
        .domain([0, 100])
        .range([0,width]);

    var y = d3.scale.linear()
        .domain([0, 100])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
        //.tickSize(6, -height);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
        //.tickSize(6, -width);

    var hexbin = d3.hexbin()
        .size([width, height])
        .radius(x(2.5));

    var svg = d3.select("#visualization-area").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var title = d3.select("svg").append("g")
        .attr("transform", "translate(" +margin.left+ "," +margin.top+ ")")
        .attr("class","title");

    title.append("text")
        .attr("x", (width / 2))
        .attr("y", -30 )
        .attr("text-anchor", "middle")
        .style("font-size", "22px")
        .text("Hexagonal Binning");


    svg.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("class", "mesh")
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.selectAll(".hex")
        .data(points)
        .enter().append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("class", "mesh")
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
        .attr("clip-path", "url(#clip)")
        .selectAll(".hexagon")
        .data(hexbin(points))
        .enter().append("path")
        .attr("class", "hexagon")
        .attr("d", hexbin.hexagon())
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        //.style("fill", function(d,i) { if(colorlabel_arr[i]=="g"){ return color_green(d.length); } else if(colorlabel_arr[i]=="r"){return color_red(d.length)} else{ return color_blue(d.length);} });
        .style("fill", function(d,i) { return color(d.length);});
    svg.append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", height + margin.bottom - 5)
        .style("text-anchor", "end")
        .text("Scaled X");

    svg.append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Scaled Y");

}

function maxMargin_x(data_array){
    var slots_maxx = data_array[0];
    for (var s = 0; s < data_array.length; s++) //finding maximum value of slots array
    {
        slots_maxx = Math.max(slots_maxx,data_array[s]);
    }
    return(slots_maxx);
}

function maxMargin_y(data_array){
    var slots_maxy = data_array[0];
    for (var s = 0; s < data_array.length; s++) //finding maximum value of slots array
    {
        slots_maxy = Math.max(slots_maxy,data_array[s]);
    }
    return(slots_maxy);
}


