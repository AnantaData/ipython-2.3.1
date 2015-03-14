//----------------------------------------------------------------------------
//  Copyright (C) 2015  The Ananta Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// Create Graph module - message passing interface for graphs
//============================================================================
function visualize(visuData){

    $('#visualization-area').empty();
    var graph_src = visuData.datafile;
    var stat_src = visuData.statfile;

    var graph_count = visuData.graphs.length;
    console.log(visuData.graphs);
    console.log(graph_src);
    console.log(graph_count);

    for(var i=0;i<graph_count;i++){

        console.log(visuData.graphs[i]);


        if(visuData.graphs[i].graph_type == "scatter"){
            console.log("scatter");
                scatterplotCreateGrapgh(graph_src);
        }

        else if(visuData.graphs[i].graph_type == "barChrt"){
            console.log("bar");
            for(f=0;f<visuData.graphs[i].fields.length;f++){
                var column = visuData.graphs[i].fields[f];
                console.log(visuData.graphs[i].fields[f]);
                barChartSelectGrapgh(graph_src,column);
            }

        }

        else if(visuData.graphs[i].graph_type == "boxPlot"){
            console.log("boxplot");
            for(f=0;f<visuData.graphs[i].fields.length;f++){
                var column = visuData.graphs[i].fields[f];
                console.log(visuData.graphs[i].fields[f]);
                boxPlotSelectGrapgh(graph_src,column);

            }
        }

        else if(visuData.graphs[i].graph_type == "hexbinning"){
            console.log("hex");
            hexBinningCreateGrapgh(graph_src);
        }
    }
}