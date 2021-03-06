//----------------------------------------------------------------------------
//  Copyright (C) 2015  The Ananta Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// Data Cleaning Profile Dialog
//============================================================================

var IPython = (function (IPython) {
    "use strict";

    var platform = IPython.utils.platform;

    var DcpDialog = function (selector) {

    };

    /**
     * The constructor of FlpDialog,  this class is extended from ProfileDialog
     * @param cell_id
     * @constructor
     */
    var DcpDialog = function (cell_id) {
        IPython.ProfileDialog.apply(this, [cell_id]);
        this.minidialogs = [];
    };

    /**
     * This class is extended from ProfileDialog
     * @type {IPython.ProfileDialog}
     */
    DcpDialog.prototype = new IPython.ProfileDialog();

    /**
     * This method shows the dialog, all the html elements, events are created here
     * @param profile
     */
    DcpDialog.prototype.show_dialog = function (profile) {
        profile.fields = getFields();
        var element = IPython.ProfileDialog.prototype.show_dialog.apply(this, []);
        if(!element){return;}
        var form_div = this.build_elements(profile);
        element.append(form_div);

        var this_dialog = this;
        this.shortcut_dialog = IPython.dialog.modal({
            title : "Data Cleaning Profile",
            body : element,
            destroy : false,
            buttons : {
                Close : {},
                Ok :{class : "btn-primary",
                    click: function(e) {
                        this_dialog.get_values(profile , e);
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
     * This method is called inside the show dialog method and create all the HTML elements
     * @param nb
     * @returns {*|jQuery|HTMLElement}
     */
    DcpDialog.prototype.build_elements = function (nb) {
        var div = $('<div/>');
        var left = $('<div class="stepinputui-left" />');
        var right = $('<div class="stepinputui-right" />');
        var inr1left = $('<div class="stepinputui-select" />');
        var inr1right = $('<div class="stepinputui-button" />');
        var inr2left = $('<div class="stepinputui-select" />');
        var inr2right = $('<div class="stepinputui-button" />');

        this.stepTypeInp_id = this.dialog_id+"steptype";
        this.stepTypeBtn_id = this.dialog_id+"stepaddbtn";
        this.stepListInp_id = this.dialog_id+"steplist";
        this.editStepBtn_id = this.dialog_id+"stepeditbtn";
        this.dletStepBtn_id = this.dialog_id+"stepdletbtn";


        var stepTypeLbl = $('<label for="steptype">Step Type:</label>');
        var stepTypeInp = $('<select  name="steptype"  size="10" >' +
                                '<option  value="ignTupl" >Ignore Tuples</option>' +
                                '<option  value="gblCnst" >Global Constatnt Filling</option>'+
                                '<option  value="atrMean" >Attribute Mean Filling</option>'+
                                '<option  value="atrMode" >Attribute Mode Filling</option>'+
                                '<option  value="atrMedn" >Attribute Median Filling</option>'+
                            '</select>');
        var stepTypeBtn = $('<button >Add Step</button>');
        var stepListLbl = $('<label for="steplist">Steps:</label>');
        var stepListInp = $('<select  name="steplist" size="10" >' +
                            '</select>');
        var editStepBtn = $('<button >Edit Step</button>');
        var dletStepBtn = $('<button >Delete Step</button>');

        stepTypeInp.attr('id',this.stepTypeInp_id);
        stepTypeBtn.attr('id',this.stepTypeBtn_id);
        stepListInp.attr('id',this.stepListInp_id);
        editStepBtn.attr('id',this.editStepBtn_id);
        dletStepBtn.attr('id',this.dletStepBtn_id);

        inr1left.append(stepTypeLbl).append(stepTypeInp);
        inr1right.append(stepTypeBtn);
        left.append(inr1left).append(inr1right);
        inr2left.append(stepListLbl).append(stepListInp);
        inr2right.append(editStepBtn).append(dletStepBtn);
        right.append(inr2left).append(inr2right);
        div.append(left).append(right);
        return div;
    };

    /**
     * Set the instructions for the dialog user
     */
    DcpDialog.prototype.setInstruction = function(){
        this.documentation.text('The Data Cleaning Profile should be given the steps. ')
    };

    /**
     * All the html elements are called from their id using jquery
     */
    DcpDialog.prototype.retrive_elements = function(){
        this.stepTypeInp = $('#'+this.stepTypeInp_id);
        this.stepTypeBtn = $('#'+this.stepTypeBtn_id);

        this.stepListInp = $('#'+this.stepListInp_id);
        this.editStepBtn = $('#'+this.editStepBtn_id);
        this.dletStepBtn = $('#'+this.dletStepBtn_id);
        this.errDoc = $('#'+this.errorDoc_id);
        this.documentation = $('#'+this.documentation_id);
    };

    /**
     * when the dialog is finished the values obtained are stored
     * @param profile
     * @param e
     */
    DcpDialog.prototype.get_values = function(profile, e){
        profile.set_text(profile.setCode(profile.profileData));
    };

    /**
     * The stored values are set in the GUI, when loading a profile
     * @param profile
     */
    DcpDialog.prototype.set_values =function(profile){
        this.update_step_list(profile);
    };

    /**
     * Set dynamic elements of the UI
     * @param profile
     */
    DcpDialog.prototype.set_dynamic_ui =function(profile){
        var this_dialog = this;
        this.stepTypeBtn.click(function(){
            var that = profile.settingsdialog;
            var selected = that.stepTypeInp.val();
            var step_no = profile.profileData.steps.length;
            //window.alert(step_no);
            var minidialog;
            if(selected == 'ignTupl'){
                //that.minidialogs[step_no] = new IPython.IgnTuplDialog(profile.cell_id,step_no);
                minidialog = new IPython.IgnTuplDialog(profile.cell_id,step_no);
            }else if (selected == 'gblCnst'){
                minidialog = new IPython.GlblConstDialog(profile.cell_id,step_no);
            }else if(selected == 'atrMean'){
                minidialog = new IPython.AttrMeanDialog(profile.cell_id,step_no);
            }else if(selected == 'atrMode'){
                minidialog = new IPython.AttrModeDialog(profile.cell_id,step_no);
            }else if(selected == 'atrMedn'){
                minidialog = new IPython.AttrMedianDialog(profile.cell_id,step_no);
            }
            //that.minidialogs[step_no].show_dialog(profile);
            minidialog.show_dialog(profile);
        });
        this.editStepBtn.click(function(){
            var that = profile.settingsdialog;
            var step_no = profile.settingsdialog.stepListInp[0].selectedIndex;
            //window.alert(step_no);
            //window.alert(that.minidialogs);
            if(step_no>that.minidialogs.length-1){
                for(var i=0;i<profile.profileData.steps.length;i++) {
                    var selected = profile.profileData.steps[i].step_type;
                    if (selected == 'ignTupl') {
                        that.minidialogs[i] = new IPython.IgnTuplDialog(profile.cell_id, i);
                    } else if (selected == 'gblCnst') {
                        that.minidialogs[i] = new IPython.GlblConstDialog(profile.cell_id, i);
                    } else if (selected == 'atrMean') {
                        that.minidialogs[i] = new IPython.AttrMeanDialog(profile.cell_id, i);
                    } else if (selected == 'atrMode') {
                        that.minidialogs[i] = new IPython.AttrModeDialog(profile.cell_id, i);
                    } else if (selected == 'atrMedn') {
                        that.minidialogs[i] = new IPython.AttrMedianDialog(profile.cell_id, i);
                    }
                }
            }
            that.minidialogs[step_no].show_dialog(profile);

        });
        this.dletStepBtn.click(function(){
            var step_no = profile.settingsdialog.stepListInp[0].selectedIndex;
            var new_steps = [];
            for(var i=0; i<step_no;i++){
                new_steps[i] = profile.profileData.steps[i];
            }
            for(var i=step_no+1;i<profile.profileData.steps.length;i++){
                var step  = profile.profileData.steps[i];
                step.step_no = i-1;
                step.step_label = step.step_no+"-"+step.step_show_name;
                step.step_name = step.step_no+"_"+step.step_type;
                new_steps[i-1] = step;
            }
            profile.profileData.steps = new_steps;
            this_dialog.update_step_list(profile);
            this_dialog.minidialogs.splice(step_no,1);
            for(var i=step_no;i<this_dialog.minidialogs.length;i++){
                this_dialog.minidialogs[i].step_no = i;
            }
        });
    };

    /**
     * Update step details when user edit steps
     * @param profile
     */
    DcpDialog.prototype.update_step_list= function(profile){
        this.stepListInp.empty();
        var stepData;
        for(var i = 0;i<profile.profileData.steps.length;i++){
            stepData = profile.profileData.steps[i];
            this.stepListInp.append('<option  value="'+stepData.step_name+'" >'+stepData.step_label+'</option>');
        }
    }

    /**
     * class variable
     * @type {Function}
     */
    IPython.DcpDialog = DcpDialog;

    return IPython;

}(IPython));

///