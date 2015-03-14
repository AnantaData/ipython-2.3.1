//----------------------------------------------------------------------------
//  Copyright (C) 2015  The Ananta Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// Attribute Mean Dialog
//============================================================================

var IPython = (function (IPython) {
    "use strict";

    var platform = IPython.utils.platform;

    /**
     * The constructor of Attribute Mean Dialog, this class is extended from ProfileDialog
     * @param cell_id
     * @param step_no
     * @constructor
     */
    var AttrMeanDialog = function (cell_id,step_no ) {
        IPython.ProfileDialog.apply(this, [cell_id]);
        this.cell_id = cell_id;
        this.step_type = "atrMean";
        this.step_show_name = "Attribute Mean";
        this.dialog_id = cell_id+"_"+this.step_type+"_"+step_no+(new Date()).valueOf().toString()+"_";
        this.step_no = step_no;
    };

    /**
     * This class is extended from ProfileDialog
     * @type {IPython.ProfileDialog}
     */
    AttrMeanDialog.prototype = new IPython.ProfileDialog();

    /**
     * This method shows the dialog, all the html elements, events are created here
     * @param profile
     */
    AttrMeanDialog.prototype.show_dialog = function (profile) {

        var element = IPython.ProfileDialog.prototype.show_dialog.apply(this, []);
        if(!element){return;}
        var form_div = this.build_elements(profile);
        element.append(form_div);

        var this_dialog = this;
        this.shortcut_dialog = IPython.minidialog.modal({
            title : "Attribute Mean Step",
            body : element,
            destroy : false,
            buttons : {
                Close : {
                },
                Ok :{class : "btn-primary",
                    click: function(e) {
                        //this_dialog.addStep(profile,this_dialog);
                        this_dialog.get_values(profile,e);
                        profile.settingsdialog.update_step_list(profile);
                        profile.settingsdialog.minidialogs[this_dialog.step_no] = this_dialog;
                    }
                }
            }
        });
        this.shortcut_dialog.addClass("modal_stretch modal_stretch-mini");

        this.retrive_elements();
        this.set_dynamic_ui();
        this.set_values(profile);
        this.setInstruction();
        //this.addStep(profile,this);
        //$([IPython.events]).on('rebuild.QuickHelp', function() { that.force_rebuild = true;});

    };

    /**
     * Set the instructions for the dialog user
     */
    AttrMeanDialog.prototype.setInstruction = function(){
        this.documentation.text('Specify a mean value and tick the respective field/s that should be filled with the given mean value'+
        '.')
    };

    /**
     * This method is called inside the show dialog method and create all the HTML elements
     * @param profile
     * @returns {*|jQuery|HTMLElement}
     */
    AttrMeanDialog.prototype.build_elements = function (profile) {


        var div = $('<div/>');

        this.stepNameInp_id = this.dialog_id+"stepname";
        //this.meanNameInp_id = this.dialog_id+"mean";
        this.statTabl_id = "stattable"+this.dialog_id;

        var stepNameLbl = $('<label for="stepname">Step Name:</label>');
        var stepNameInp = $('<input type="text" name="stepname"  readonly>');
        //var attrNameLbl = $('<label for="stepname">Attribute Mean:</label>');
        //var meanNameInp = $('<input type="text" name="stepname"  />');
        var statTabl = $('<table>' +
        '<thead id="statistic_thead" class="fixedHeader">' +
        '<tr class="alternateRow">' +
        '<th><a href="#">Check</a></th>' +
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

        stepNameInp.attr('id',this.stepNameInp_id);
        statTabl.attr('id',this.statTabl_id);
        //meanNameInp.attr('id',this.meanNameInp_id);

        div.append(stepNameLbl).append(stepNameInp).append(statTabl);

        if(profile.profileData.steps.length < (this.step_no+1)){
            //console.log(profile.profileData.fileNamePrefix);
            var avlbl = isStatFileExist(profile.profileData.fileNamePrefix);
            if(avlbl) {
                tabulate_2(this.statTabl_id, profile.profileData.fileNamePrefix);
            }else{
                tabulate_2(this.statTabl_id, "");
            }
        }

        return div;
    };

    /**
     * All the html elements are called from their id using jquery
     */
    AttrMeanDialog.prototype.retrive_elements = function(){
        this.stepNameInp = $('#'+this.stepNameInp_id);
        //this.attrMeanInp = $('#'+this.meanNameInp_id);
        this.statTabl = $('#'+this.statTabl_id);
        this.errDoc = $('#'+this.errorDoc_id);
        this.documentation = $('#'+this.documentation_id);
    };

    /**
     * when the dialog is finished the values obtained are stored
     * @param profile
     */
    AttrMeanDialog.prototype.get_values = function(profile){

        this.errDoc.hide();
        var stepData = {
            step_no : this.step_no,
            step_type : this.step_type,
            attr_mean : '',
            step_show_name : this.step_show_name,
            step_label : this.step_no+"-"+this.step_show_name,
            step_name : this.step_no+"_"+this.step_type,
            fields : []
        };
        stepData.fields=this.getCheckedValues();
        //stepData.attr_mean=this.attrMeanInp.val();
        profile.profileData.steps[this.step_no] = stepData;
    };

    /**
     * The stored values are set in the GUI, when loading a profile
     * @param profile
     */
    AttrMeanDialog.prototype.set_values =function(profile){
        var stepData = {
            step_no : this.step_no,
            step_type : this.step_type,
            attr_mean : '',
            step_show_name : this.step_show_name,
            step_label : this.step_no+"-"+this.step_show_name,
            step_name : this.step_no+"_"+this.step_type,
            fields : []
        };
        if(profile.profileData.steps[this.step_no]){
            stepData = profile.profileData.steps[this.step_no];
        }
        this.stepNameInp.val(stepData.step_label);
        //this.attrMeanInp.val(stepData.attr_mean);
        this.setCheckedValues(profile,stepData.fields);

    };

    /**
     * Get the values of the ticked check boxes
     * @returns {Array}
     */
    AttrMeanDialog.prototype.getCheckedValues = function(){
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

    /**
     * set the values of check boxes
     * @param profile
     * @param fields
     */
    AttrMeanDialog.prototype.setCheckedValues = function(profile,fields){
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

    /**
     * Add a new Attribute Mean step
     * @param profile
     * @param this_dialog
     */
    AttrMeanDialog.prototype.addStep =function(profile, this_dialog){
        this_dialog.get_values(profile);
        profile.settingsdialog.update_step_list(profile);
        profile.settingsdialog.minidialogs[this_dialog.step_no] = this_dialog;
    };

    /**
     * Set dynamic elements of the UI
     */
    AttrMeanDialog.prototype.set_dynamic_ui =function(){
    };

    /***
     * class variable
     * @type {Function}
     */
    IPython.AttrMeanDialog = AttrMeanDialog;

    return IPython;

}(IPython));



