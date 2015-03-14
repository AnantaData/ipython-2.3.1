//----------------------------------------------------------------------------
//  Copyright (C) 2015  The Ananta Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// Statistics related methods
//============================================================================

/**
 * populate evaluation results to table
 */
function populate_eval(){

    d3.csv("stat.csv",function(data){
        dataset = data.map(function(d) { return [ +d["het"], +d["hom"] ]; });
        console.log(dataset)
        var columns = ['het','hom'];
        var table = d3.select("#eval_table");
        var thead = table.append('thead');
        var tbody = table.append('tbody')
        thead.append("tr")
            .selectAll("th")
            .data(columns)
            .enter()
            .append("th")
            .text(function(column) { return column; });

        var rows = tbody.selectAll("tr")
            .data(data)
            .enter()
            .append("tr");
        var cells = rows.selectAll("td")
            .data(function(row) {
                return columns.map(function(column) {
                    return {column: column, value: row[column]};
                });
            })
            .enter()
            .append("td")
            .text(function(d) { return d.value; });
    });

}

/**
 * Tabulate data to table without any change
 * @param filenameprefix
 */
function tabulate(filenameprefix){
    d3.csv(filenameprefix+"stat.csv", function(data) {
        // the columns you'd like to display
        var columns = ["Field","Count","Mean","St.Dev","Min","Q1","Median","Q3","Max"];

        var table = d3.select("#stat_table");
                //.append("table"),
            //thead = d3.select("#statictic_thead"),
            //tbody = d3.select("#statictic_tbody");
        var thead = table.select("thead");
        var tbody = table.select("tbody");
        //thead.style("fixedHeader");

        // append the header row
        thead.select("tr")
            .selectAll("th")
            .data(columns)
            .enter()
            .append("th")
            .text(function(column) { return column; });

        // create a row for each object in the data
        var rows = tbody.selectAll("tr")
            .data(data)
            .enter()
            .append("tr");

        // create a cell in each row for each column
        var cells = rows.selectAll("td")
            .data(function(row) {
                return columns.map(function(column) {
                    return {column: column, value: row[column]};
                });
            })
            .enter()
            .append("td")
            .text(function(d) { return d.value; });
    });

}

/**
 * Tabulate data to table with check box
 * @param stattableid
 * @param filenameprefix
 */
function tabulate_2(stattableid,filenameprefix){
    var table_id = "#"+stattableid;
    d3.csv(filenameprefix+"stat.csv", function(data) {
        // the columns you'd like to display
        var columns = ["Check","Field","Count","Mean","St.Dev","Min","Q1","Median","Q3","Max"];

        var table = d3.select(table_id);
        //.append("table"),
        //thead = d3.select("#statictic_thead"),
        //tbody = d3.select("#statictic_tbody");
        var thead = table.select("thead");
        var tbody = table.select("tbody");
        //thead.style("fixedHeader");

        // append the header row
        thead.select("tr")
            .selectAll("th")
            .data(columns)
            .enter()
            .append("th")
            .text(function(column) { return column; });

        // create a row for each object in the data
        var rows = tbody.selectAll("tr")
            .data(data)
            .enter()
            .append("tr");



        // create a cell in each row for each column
        var cells = rows.selectAll("td")
            .data(function(row) {
                return columns.map(function(column) {
                    return {column: column, value: row[column]};
                });
            })
            .enter()
            .append("td")
            .html(function(d) {
                //console.log(d.column);
                if (d.column === "Check") {
                    return '<input type="checkbox" />';
                }

                else {
                    return d.value;
                }
            });


    });

}

/**
 * Tabulate data to table with checkboxes with checked values
 * @param stattableid
 * @param filenameprefix
 * @param checked
 */
function tabulate_3(stattableid,filenameprefix,checked){
    var table_id = "#"+stattableid;
    d3.csv(filenameprefix+"stat.csv", function(data) {
        // the columns you'd like to display
        var columns = ["Check","Field","Count","Mean","St.Dev","Min","Q1","Median","Q3","Max"];

        var table = d3.select(table_id);
        //.append("table"),
        //thead = d3.select("#statictic_thead"),
        //tbody = d3.select("#statictic_tbody");
        var thead = table.select("thead");
        var tbody = table.select("tbody");
        //thead.style("fixedHeader");

        // append the header row
        thead.select("tr")
            .selectAll("th")
            .data(columns)
            .enter()
            .append("th")
            .text(function(column) { return column; });

        // create a row for each object in the data
        var rows = tbody.selectAll("tr")
            .data(data)
            .enter()
            .append("tr");



        // create a cell in each row for each column
        var cells = rows.selectAll("td")
            .data(function(row,i) {
                return columns.map(function(column) {
                    return {row:i, column: column, value: row[column]};
                });
            })
            .enter()
            .append("td")
            .html(function(d) {
                console.log(d);
                console.log(d.column);

                if (d.column === "Check") {
                    if(checked[d.row]) {
                        return '<input type="checkbox" checked="true"/>';
                    }else{
                        return '<input type="checkbox" />';
                    }
                }

                else {
                    return d.value;
                }
            });


    });

}

/**
 * Tabulate types data to table with checkboxes
 * @param stattableid
 * @param filenameprefix
 */
function tabulate_4(stattableid,filenameprefix){
    var table_id = "#"+stattableid;
    d3.csv(filenameprefix+"types.csv", function(data) {
        // the columns you'd like to display
        var columns = ["Check","Field","DataType"];

        var table = d3.select(table_id);
        //.append("table"),
        //thead = d3.select("#statictic_thead"),
        //tbody = d3.select("#statictic_tbody");
        var thead = table.select("thead");
        var tbody = table.select("tbody");
        //thead.style("fixedHeader");

        // append the header row
        thead.select("tr")
            .selectAll("th")
            .data(columns)
            .enter()
            .append("th")
            .text(function(column) { return column; });

        // create a row for each object in the data
        var rows = tbody.selectAll("tr")
            .data(data)
            .enter()
            .append("tr");



        // create a cell in each row for each column
        var cells = rows.selectAll("td")
            .data(function(row) {
                return columns.map(function(column) {
                    return {column: column, value: row[column]};
                });
            })
            .enter()
            .append("td")
            .html(function(d) {
                //console.log(d.column);
                if (d.column === "Check") {
                    return '<input type="checkbox" />';
                }

                else {
                    return d.value;
                }
            });


    });

}

/**
 * Tabulate types data to a table with checkboxes
 * @param stattableid
 * @param filenameprefix
 * @param checked
 */
function tabulate_5(stattableid,filenameprefix,checked){
    var table_id = "#"+stattableid;
    d3.csv(filenameprefix+"types.csv", function(data) {
        // the columns you'd like to display
        var columns = ["Check","Field","DataType"];

        var table = d3.select(table_id);
        //.append("table"),
        //thead = d3.select("#statictic_thead"),
        //tbody = d3.select("#statictic_tbody");
        var thead = table.select("thead");
        var tbody = table.select("tbody");
        //thead.style("fixedHeader");

        // append the header row
        thead.select("tr")
            .selectAll("th")
            .data(columns)
            .enter()
            .append("th")
            .text(function(column) { return column; });

        // create a row for each object in the data
        var rows = tbody.selectAll("tr")
            .data(data)
            .enter()
            .append("tr");



        // create a cell in each row for each column
        var cells = rows.selectAll("td")
            .data(function(row,i) {
                return columns.map(function(column) {
                    return {row:i, column: column, value: row[column]};
                });
            })
            .enter()
            .append("td")
            .html(function(d) {
                console.log(d);
                console.log(d.column);

                if (d.column === "Check") {
                    if(checked[d.row]) {
                        return '<input type="checkbox" checked="true"/>';
                    }else{
                        return '<input type="checkbox" />';
                    }
                }

                else {
                    return d.value;
                }
            });


    });

}

/**
 * ajax call to get names of the fileds in the data set
 * @returns {Array}
 */
function getFields(){
    var fields = [];
    $.ajax({
        type: "GET",
        url: "types.csv",
        dataType: "text",
        async:false
    }).success(function (csvd) {
        var field_list = csvd.split('\n');
        var field_data;
        for(var i=1;i<field_list.length;i++){
            field_data = field_list[i].split(',');
            fields.push({name:field_data[0],type:field_data[1]})
        }
    }).done(function() {
        //alert( "success" );
    }).fail(function() {
        //alert( "error" );
    }).always(function() {
        //alert( "complete" );
    });
    return fields;
}

/**
 * ajax call to get the updated names of the fields in the data set
 * @param filenameprefix
 * @returns {Array}
 */
function getFields_New(filenameprefix){
    var fields = [];
    $.ajax({
        type: "GET",
        url: filenameprefix+"types.csv",
        dataType: "text",
        async:false
    }).success(function (csvd) {
        var field_list = csvd.split('\n');
        var field_data;
        for(var i=0;i<field_list.length;i++){
            field_data = field_list[i].split(',');
            fields.push({name:field_data[0],type:field_data[1]})
        }
    }).done(function() {
        //alert( "success" );
    }).fail(function() {
        //alert( "error" );
    }).always(function() {
        //alert( "complete" );
    });
    return fields;
}

/**
 * check whether the stat file is there
 * @param filenameprefix
 * @returns {boolean}
 */
function isStatFileExist(filenameprefix){
    var avlbl = false;
    $.ajax({
        type: "GET",
        url: filenameprefix+"stat.csv",
        dataType: "text",
        async:false
    }).success(function (csvd) {
        avlbl = true;
    }).done(function() {
        //alert( "success" );
    }).fail(function() {
        //alert( "fail" );
    }).always(function() {
        //alert( "complete" );
    });
    return avlbl;
}

/**
 * check whether the types file is there
 * @param filenameprefix
 * @returns {boolean}
 */
function isTypesFileExist(filenameprefix){
    var avlbl = false;
    $.ajax({
        type: "GET",
        url: filenameprefix+"types.csv",
        dataType: "text",
        async:false
    }).success(function (csvd) {
        avlbl = true;
    }).done(function() {
        //alert( "success" );
    }).fail(function() {
        //alert( "fail" );
    }).always(function() {
        //alert( "complete" );
    });
    return avlbl;
}

