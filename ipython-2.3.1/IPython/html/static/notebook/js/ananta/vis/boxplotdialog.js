//----------------------------------------------------------------------------
//  Copyright (C) 2015  The Ananta Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// Box Plot Dialog
//============================================================================

var IPython = (function (IPython) {
    "use strict";

    var platform = IPython.utils.platform;

    var BoxPlotDialog = function (cell_id,graph_no ) {
        IPython.ProfileDialog.apply(this, [cell_id]);
        this.cell_id = cell_id;
        this.graph_type = "boxPlot";
        this.graph_show_name = "Box Plot";
        this.dialog_id = cell_id+"_"+this.graph_type+"_"+graph_no+(new Date()).valueOf().toString()+"_";
        this.graph_no = graph_no;
    };

    BoxPlotDialog.prototype = new IPython.ProfileDialog();


    BoxPlotDialog.prototype.show_dialog = function (profile) {

        var element = IPython.ProfileDialog.prototype.show_dialog.apply(this, []);
        if(!element){return;}
        var form_div = this.build_elements(profile);
        element.append(form_div);

        var this_dialog = this;
        this.shortcut_dialog = IPython.minidialog.modal({
            title : "Box Plotter",
            body : element,
            destroy : false,
            buttons : {
                Close : {
                },
                Ok :{class : "btn-primary",
                    click: function(e) {
                        this_dialog.get_values(profile,e);
                        profile.visudialog.update_graph_list(profile);
                        profile.visudialog.minidialogs[this_dialog.graph_no] = this_dialog;
                    }
                }
            }
        });
        this.shortcut_dialog.addClass("modal_stretch modal_stretch-mini");

        this.retrive_elements();
        this.set_dynamic_ui();
        this.set_values(profile);
        this.setInstruction();
    };

    BoxPlotDialog.prototype.setInstruction = function(){
        this.documentation.text('TGive the names of the fields where unfilled data tuples should be removed'+
        '.')
    };

    BoxPlotDialog.prototype.build_elements = function (profile) {

        var div = $('<div/>');
        this.graphNameInp_id = this.dialog_id+"graphname";
        this.statTabl_id = "stattable"+this.dialog_id;

        var graphNameLbl = $('<label for="graphname">Graph Name:</label>');
        var graphNameInp = $('<input type="text" name="graphname"  readonly>');
        var statTabl = $('<table>' +
        '<thead id="statistic_thead" class="fixedHeader">' +
        '<tr class="alternateRow">' +
        '<th><a href="#">Field</a></th>' +
        '<th><a href="#">Count</a></th>' +
        '<th><a href="#">Mean</a></th>' +
        '<th><a href="#">St.Dev</a></th>' +
        '<th><a href="#">Min</a></th>' +
        '<th><a href="#">Q1</a></th>' +
        '<th><a href="#">Median</a></th>' +
        '<th><a href="#">Q3</a></th>' +
        '<th><a href="#">Max</a></th>' +
        '</tr>' +
        '</thead>' +
        '<tbody id="statistic_tbody" class="scrollContent">' +
        '</tbody>' +
        '</table>');

        graphNameInp.attr('id',this.graphNameInp_id);
        statTabl.attr('id',this.statTabl_id);

        div.append(graphNameInp).append(statTabl);

        if(profile.profileData.visuData.graphs.length < (this.step_no+1)){
            console.log(profile.profileData.fileNamePrefix);
            var avlbl = isStatFileExist(profile.profileData.fileNamePrefix);
            if(avlbl) {
                tabulate_2(this.statTabl_id, profile.profileData.fileNamePrefix);
            }else{
                tabulate_2(this.statTabl_id, "");
            }
        }
        return div;
    };

    BoxPlotDialog.prototype.retrive_elements = function(){
        this.graphNameInp = $('#'+this.graphNameInp_id);
        this.statTabl = $('#'+this.statTabl_id);
        this.errDoc = $('#'+this.errorDoc_id);
        this.documentation = $('#'+this.documentation_id);
    };

    BoxPlotDialog.prototype.get_values = function(profile){

        this.errDoc.hide();
        var graphData = {
            graph_no : this.graph_no,
            graph_type : this.graph_type,
            graph_show_name : this.graph_show_name,
            graph_label : this.graph_no+"-"+this.graph_show_name,
            graph_name : this.graph_no+"_"+this.graph_type,
            fields : []
        };
        graphData.fields=this.getCheckedValues();
        profile.profileData.visuData.graphs[this.graph_no] = graphData;
    };

    BoxPlotDialog.prototype.set_values =function(profile){
        var graphData = {
            graph_no : this.graph_no,
            graph_type : this.graph_type,
            graph_show_name : this.graph_show_name,
            graph_label : this.graph_no+"-"+this.graph_show_name,
            graph_name : this.graph_no+"_"+this.graph_type,
            fields : []
        };
        if(profile.profileData.visuData.graphs[this.graph_no]){
            graphData = profile.profileData.visuData.graphs[this.graph_no];
        }
        this.graphNameInp.val(graphData.graph_label);
        this.setCheckedValues(profile,graphData.fields);

    };

    BoxPlotDialog.prototype.getCheckedValues = function(){
        var fields = [];
        var row = this.statTabl[0].children[1].children;
        for(var i=0;i<row.length;i++){
            var checkbox = row[i].children[0].children[0];
            var fieldname = row[i].children[1].innerText;
            if(checkbox.checked){
                fields.push(fieldname);
            }
        }
        return fields;
    };

    BoxPlotDialog.prototype.setCheckedValues = function(profile,fields){
        var checked = [];
        var rows = profile.fields.length;
        for(var j=0;j<rows;j++){
            checked[j] = false;
        }
        for(var i=0;i<fields.length;i++){
            for(var j=0;j<rows;j++){
                var fieldname = profile.fields[j];
                if(fieldname.name == fields[i]){
                    checked[j] = true;
                    break;
                }
            }
        }
        tabulate_3(this.statTabl_id,profile.profileData.fileNamePrefix,checked);
    };

    BoxPlotDialog.prototype.addGraph =function(profile, this_dialog){
        this_dialog.get_values(profile);
        profile.settingsdialog.update_graph_list(profile);
        profile.settingsdialog.minidialogs[this_dialog.graph_no] = this_dialog;
    };

    BoxPlotDialog.prototype.set_dynamic_ui =function(){
    };

    IPython.BoxPlotDialog = BoxPlotDialog;

    return IPython;

}(IPython));