//----------------------------------------------------------------------------
//  Copyright (C) 2015  The Ananta Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// Supervised / Unsupervised graph selection Dialog
//============================================================================

var IPython = (function (IPython) {
    "use strict";

    var platform = IPython.utils.platform;
    var src_file;

    var UnVisuDialog = function (cell_id,src) {
        IPython.ProfileDialog.apply(this, [cell_id]);
        this.minidialogs = [];
        src_file = src;
    };

    var json_msg;

    UnVisuDialog.prototype = new IPython.ProfileDialog();


    UnVisuDialog.prototype.show_dialog = function (profile) {
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
                        if(json_msg!=null){
                            visualize(json_msg);
                        }
                    }
                }
            }
        });
        this.shortcut_dialog.addClass("modal_stretch");

        this.retrive_elements();
        this.set_dynamic_ui(profile);
        this.setInstruction();

        $([IPython.events]).on('rebuild.QuickHelp', function() { that.force_rebuild = true;});

    };

    UnVisuDialog.prototype.build_elements = function (nb) {
        var div = $('<div/>');
        var left = $('<div class="stepinputui-left" />');
        var inr1left = $('<div class="stepinputui-select" />');
        var inr1right = $('<div class="stepinputui-button" />');

        this.graphTypeInp_id = this.dialog_id+"graphtype";
        this.graphTypeBtn_id = this.dialog_id+"graphaddbtn";
        this.graphListInp_id = this.dialog_id+"graphlist";
        this.editGraphBtn_id = this.dialog_id+"grapheditbtn";
        this.dletGraphBtn_id = this.dialog_id+"graphdletbtn";


        var graphTypeLbl = $('<label for="graphtype">Graph Type:</label>');
        var graphTypeInp = $('<select  name="graphtype"  size="5" >' +
        '<option  value="scatter" >Scatter Plot</option>' +
        '<option  value="hexbinning" >Hexagonal Binning</option>'+
        '</select>');
        var graphTypeBtn = $('<button >Select</button>');
        var graphListLbl = $('<label for="graphlist">Graphs:</label>');
        var graphListInp = $('<select  name="graphlist" size="10" >' +
        '</select>');
        var dletGraphBtn = $('<button >Delete Graph</button>');

        graphTypeInp.attr('id',this.graphTypeInp_id);
        graphTypeBtn.attr('id',this.graphTypeBtn_id);
        graphListInp.attr('id',this.graphListInp_id);

        inr1left.append(graphTypeLbl).append(graphTypeInp);
        inr1right.append(graphTypeBtn);
        left.append(inr1left).append(inr1right);
        div.append(left)
        return div;
    };

    UnVisuDialog.prototype.setInstruction = function(){
        this.documentation.text('The visualization options should be given. ')
    };

    UnVisuDialog.prototype.retrive_elements = function(){
        this.graphTypeInp = $('#'+this.graphTypeInp_id);
        this.graphTypeBtn = $('#'+this.graphTypeBtn_id);

        this.graphListInp = $('#'+this.graphListInp_id);
        this.dletGraphBtn = $('#'+this.dletGraphBtn_id);
        this.errDoc = $('#'+this.errorDoc_id);
        this.documentation = $('#'+this.documentation_id);
    };

    UnVisuDialog.prototype.get_values = function(profile, e){
        profile.set_text(profile.setCode(profile.profileData));
    };

    UnVisuDialog.prototype.set_values =function(profile){
        this.update_graph_list(profile);
    };

    UnVisuDialog.prototype.set_dynamic_ui =function(profile){
        var this_dialog = this;
        this.graphTypeBtn.click(function(){
            var that = profile.visudialog;
            var selected = that.graphTypeInp.val();
            var graph_no = profile.profileData.visuData.graphs.length;
            //window.alert(graph_no);
            var minidialog;
            this_dialog.update_graph(profile,selected);
        });
    };

    UnVisuDialog.prototype.update_graph= function(profile,type){
        json_msg = {
            "datafile":src_file,
            "statfile":"",
            "graphs":[
                {
                    "graph_type":type
                }
            ]
        };
    }

    IPython.UnVisuDialog = UnVisuDialog;

    return IPython;

}(IPython));

