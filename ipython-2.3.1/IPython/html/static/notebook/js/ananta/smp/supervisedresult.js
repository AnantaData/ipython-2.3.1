/**
 * Created by tiroshan on 1/21/15.
 */



function supervisedResultGrapgh(){
    console.log("sup");

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 500,//- margin.left - margin.right,
        height = 350 ;//- margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.2);


    var y = d3.scale.linear()
        .range([height, 0]);



    d3.csv("sup_out.csv", type, function(error, data) {
        x.domain(data.map(function(d) { return d.rankorder; }));
        y.domain([0, d3.max(data, function(d) { return d.churn; })]);

        var colorlabel = data.map(function (d) {
            return d.class
        });

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(width/100);

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10, "%");

        var svg = d3.select("#visualization-area").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", 30)
            .style("text-anchor", "end")
            .text("Rank order");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Churn Probability");

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.rankorder); })
            .attr("width", x.rangeBand)
            .attr("y", function(d) { return y(d.churn); })
            .attr("height", function(d) { return height - y(d.rankorder); })
            .style("fill", function(d,i) {  if(colorlabel[i]==1){ return "#c994c7";} else {return "#addd8e";}  });

    });
}

function type(d) {
    d.churn = +d.churn;
    return d;
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
    var slots_max = data_array[0];
    for (var s = 0; s < data_array.length; s++) //finding maximum value of slots array
    {
        if (data_array[s] < slots_max) {
            slots_max = data_array[s];
        }
    }
    return(slots_max);
}
