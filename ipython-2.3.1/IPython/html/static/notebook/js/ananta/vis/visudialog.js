//----------------------------------------------------------------------------
//  Copyright (C) 2015  The Ananta Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// File Loading Profile
//============================================================================

var IPython = (function (IPython) {
    "use strict";

    var platform = IPython.utils.platform;

    var VisuDialog = function (cell_id) {
        IPython.ProfileDialog.apply(this, [cell_id]);
        this.minidialogs = [];
    };

    VisuDialog.prototype = new IPython.ProfileDialog();


    VisuDialog.prototype.show_dialog = function (profile) {
        profile.fields = getFields();
        var element = IPython.ProfileDialog.prototype.show_dialog.apply(this, []);
        if(!element){return;}
        var form_div = this.build_elements(profile);
        element.append(form_div);

        var this_dialog = this;
        this.shortcut_dialog = IPython.dialog.modal({
            title : "Visualization Options",
            body : element,
            destroy : false,
            buttons : {
                Close : {},
                Ok :{class : "btn-primary",
                    click: function(e) {
                        this_dialog.get_values(profile , e);
                        visualize(profile.profileData.visuData);
                        $()
                    }
                }
            }
        });
        this.shortcut_dialog.addClass("modal_stretch");

        this.retrive_elements();
        this.set_dynamic_ui(profile);
        this.set_values(profile);
        this.setInstruction();

        $([IPython.events]).on('rebuild.QuickHelp', function() { that.force_rebuild = true;});

    };

    /**
     * Create Dialog box elements
     */

    VisuDialog.prototype.build_elements = function (nb) {
        var div = $('<div/>');
        var left = $('<div class="stepinputui-left" />');
        var right = $('<div class="stepinputui-right" />');
        var inr1left = $('<div class="stepinputui-select" />');
        var inr1right = $('<div class="stepinputui-button" />');
        var inr2left = $('<div class="stepinputui-select" />');
        var inr2right = $('<div class="stepinputui-button" />');

        this.graphTypeInp_id = this.dialog_id+"graphtype";
        this.graphTypeBtn_id = this.dialog_id+"graphaddbtn";
        this.graphListInp_id = this.dialog_id+"graphlist";
        this.editGraphBtn_id = this.dialog_id+"grapheditbtn";
        this.dletGraphBtn_id = this.dialog_id+"graphdletbtn";

        var graphTypeLbl = $('<label for="graphtype">Graph Type:</label>');
        var graphTypeInp = $('<select  name="graphtype"  size="10" >' +
        '<option  value="barChrt" >Bar Chart</option>' +
        '<option  value="sctPlot" >Scatter Plot</option>'+
        '<option  value="boxPlot" >Box Plot</option>'+
        '<option  value="hexBinn" >Hexagonal Binning</option>'+
        '</select>');
        var graphTypeBtn = $('<button >Add Graph</button>');
        var graphListLbl = $('<label for="graphlist">Graphs:</label>');
        var graphListInp = $('<select  name="graphlist" size="10" >' +
        '</select>');
        var editGraphBtn = $('<button >Edit Graph</button>');
        var dletGraphBtn = $('<button >Delete Graph</button>');

        graphTypeInp.attr('id',this.graphTypeInp_id);
        graphTypeBtn.attr('id',this.graphTypeBtn_id);
        graphListInp.attr('id',this.graphListInp_id);
        editGraphBtn.attr('id',this.editGraphBtn_id);
        dletGraphBtn.attr('id',this.dletGraphBtn_id);

        inr1left.append(graphTypeLbl).append(graphTypeInp);
        inr1right.append(graphTypeBtn);
        left.append(inr1left).append(inr1right);
        inr2left.append(graphListLbl).append(graphListInp);
        inr2right.append(editGraphBtn).append(dletGraphBtn);
        right.append(inr2left).append(inr2right);
        div.append(left).append(right);
        return div;
    };

    VisuDialog.prototype.setInstruction = function(){
        this.documentation.text('The visualization options should be given. ')
    };

    VisuDialog.prototype.retrive_elements = function(){
        this.graphTypeInp = $('#'+this.graphTypeInp_id);
        this.graphTypeBtn = $('#'+this.graphTypeBtn_id);
        this.graphListInp = $('#'+this.graphListInp_id);
        this.editGraphBtn = $('#'+this.editGraphBtn_id);
        this.dletGraphBtn = $('#'+this.dletGraphBtn_id);
        this.errDoc = $('#'+this.errorDoc_id);
        this.documentation = $('#'+this.documentation_id);
    };

    VisuDialog.prototype.get_values = function(profile, e){
        profile.set_text(profile.setCode(profile.profileData));
    };

    VisuDialog.prototype.set_values =function(profile){
        this.update_graph_list(profile);
    };

    VisuDialog.prototype.set_dynamic_ui =function(profile){
        var this_dialog = this;
        this.graphTypeBtn.click(function(){
            var that = profile.visudialog;
            var selected = that.graphTypeInp.val();
            var graph_no = profile.profileData.visuData.graphs.length;
            //window.alert(graph_no);
            var minidialog;
            if(selected == 'barChrt'){
                minidialog = new IPython.BarChartDialog(profile.cell_id,graph_no);
            }else if (selected == 'sctPlot'){
                minidialog = new IPython.ScatterPlotDialog(profile.cell_id,graph_no);
            }else if(selected == 'boxPlot'){
                minidialog = new IPython.BoxPlotDialog(profile.cell_id,graph_no);
            }else if(selected == 'hexBinn'){
                minidialog = new IPython.HexBinningDialog(profile.cell_id,graph_no);
            }
            minidialog.show_dialog(profile);
        });
        this.editGraphBtn.click(function(){
            var that = profile.visudialog;
            var graph_no = profile.visudialog.graphListInp[0].selectedIndex;
            //window.alert(graph_no);
            if(graph_no>that.minidialogs.length-1){
                for(var i=0;i<profile.profileData.visuData.graphs.length;i++) {
                    var selected = profile.profileData.visuData.graphs[i].graph_type;
                    if(selected == 'barChrt'){
                        that.minidialogs[i] = new IPython.BarChartDialog(profile.cell_id,graph_no);
                    }else if (selected == 'sctPlot'){
                        that.minidialogs[i] = new IPython.ScatterPlotDialog(profile.cell_id,graph_no);
                    }else if(selected == 'boxPlot'){
                        that.minidialogs[i] = new IPython.BoxPlotDialog(profile.cell_id,graph_no);
                    }else if(selected == 'hexBinn'){
                        that.minidialogs[i] = new IPython.HexBinningDialog(profile.cell_id,graph_no);
                    }
                }
            }
            that.minidialogs[graph_no].show_dialog(profile);

        });
        this.dletGraphBtn.click(function(){
            var graph_no = profile.visudialog.graphListInp[0].selectedIndex;
            var new_graphs = [];
            for(var i=0; i<graph_no;i++){
                new_graphs[i] = profile.profileData.visuData.graphs[i];
            }
            for(var i=graph_no+1;i<profile.profileData.visuData.graphs.length;i++){
                var graph  = profile.profileData.visuData.graphs[i];
                graph.graph_no = i-1;
                graph.graph_label = graph.graph_no+"-"+graph.graph_show_name;
                graph.graph_name = graph.graph_no+"_"+graph.graph_type;
                new_graphs[i-1] = graph;
            }
            profile.profileData.visuData.graphs = new_graphs;
            this_dialog.update_graph_list(profile);
            this_dialog.minidialogs.splice(graph_no,1);
            for(var i=graph_no;i<this_dialog.minidialogs.length;i++){
                this_dialog.minidialogs[i].graph_no = i;
            }
        });
    };

    VisuDialog.prototype.update_graph_list= function(profile){
        this.graphListInp.empty();
        var graphData;
        for(var i = 0;i<profile.profileData.visuData.graphs.length;i++){
            graphData = profile.profileData.visuData.graphs[i];
            this.graphListInp.append('<option  value="'+graphData.graph_name+'" >'+graphData.graph_label+'</option>');
        }
    }

    IPython.VisuDialog = VisuDialog;

    return IPython;

}(IPython));



