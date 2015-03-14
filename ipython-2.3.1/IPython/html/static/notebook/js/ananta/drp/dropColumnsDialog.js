//============================================================================
// Drop Columns By Name Dialog
//============================================================================

var IPython = (function (IPython) {
    "use strict";

    var platform = IPython.utils.platform;

    /**
     * The constructor of Drop Columns Dialog, this class is extended from ProfileDialog
     * @param cell_id
     * @param step_no
     * @constructor
     */
    var DropColumnsDialog = function (cell_id,step_no ) {
        IPython.ProfileDialog.apply(this, [cell_id]);
        this.cell_id = cell_id;
        this.step_type = "removeCol";
        this.step_show_name = "Drop Columns";
        this.dialog_id = cell_id+"_"+this.step_type+"_"+step_no+(new Date()).valueOf().toString()+"_";
        this.step_no = step_no;
    };

    /**
     * This class is extended from ProfileDialog
     * @type {IPython.ProfileDialog}
     */
    DropColumnsDialog.prototype = new IPython.ProfileDialog();

    /**
     * This method shows the dialog, all the html elements, events are created here
     * @param profile
     */
    DropColumnsDialog.prototype.show_dialog = function (profile) {

        var element = IPython.ProfileDialog.prototype.show_dialog.apply(this, []);
        if(!element){return;}
        var form_div = this.build_elements(profile);
        element.append(form_div);

        var this_dialog = this;
        this.shortcut_dialog = IPython.minidialog.modal({
            title : "Drop Column/s Step",
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
    DropColumnsDialog.prototype.setInstruction = function(){
        this.documentation.text('Tick the field names which should not be used in mining'+
        '.')
    };

    /**
     * This method is called inside the show dialog method and create all the HTML elements
     * @param profile
     * @returns {*|jQuery|HTMLElement}
     */
    DropColumnsDialog.prototype.build_elements = function (profile) {


        var div = $('<div/>');

        this.stepNameInp_id = this.dialog_id+"stepname";
        this.statTabl_id = "stattable"+this.dialog_id;

        var stepNameLbl = $('<label for="stepname">Step Name:</label>');
        var stepNameInp = $('<input type="text" name="stepname"  readonly>');
        var statTabl = $('<table>' +
        '<thead id="statistic_thead" class="fixedHeader">' +
        '<tr class="alternateRow">' +
        '<th><a href="#">Field</a></th>' +
        '<th><a href="#">DataType</a></th>' +
        '</tr>' +
        '</thead>' +
        '<tbody id="statistic_tbody" class="scrollContent">' +
        '</tbody>' +
        '</table>');

        stepNameInp.attr('id',this.stepNameInp_id);
        statTabl.attr('id',this.statTabl_id);

        div.append(stepNameLbl).append(stepNameInp).append(statTabl);

        if(profile.profileData.steps.length < (this.step_no+1)){
            //console.log(profile.profileData.fileNamePrefix);
            var avlbl = isTypesFileExist(profile.profileData.fileNamePrefix);
            var fields;
            if(avlbl) {
                tabulate_4(this.statTabl_id, profile.profileData.fileNamePrefix);
            }else{
                tabulate_4(this.statTabl_id, "");
            }

        }
        return div;
    };

    /**
     * All the html elements are called from their id using jquery
     */
    DropColumnsDialog.prototype.retrive_elements = function(){
        this.stepNameInp = $('#'+this.stepNameInp_id);
        this.statTabl = $('#'+this.statTabl_id);
        this.errDoc = $('#'+this.errorDoc_id);
        this.documentation = $('#'+this.documentation_id);
    };

    /**
     * when the dialog is finished the values obtained are stored
     * @param profile
     */
    DropColumnsDialog.prototype.get_values = function(profile){

        this.errDoc.hide();
        var stepData = {
            step_no : this.step_no,
            step_type : this.step_type,
            step_show_name : this.step_show_name,
            step_label : this.step_no+"-"+this.step_show_name,
            step_name : this.step_no+"_"+this.step_type,
            fields : []
        };
        stepData.fields=this.getCheckedValues();
        profile.profileData.steps[this.step_no] = stepData;
    };

    /**
     * The stored values are set in the GUI, when loading a profile
     * @param profile
     */
    DropColumnsDialog.prototype.set_values =function(profile){
        var stepData = {
            step_no : this.step_no,
            step_type : this.step_type,
            step_show_name : this.step_show_name,
            step_label : this.step_no+"-"+this.step_show_name,
            step_name : this.step_no+"_"+this.step_type,
            fields : []
        };
        if(profile.profileData.steps[this.step_no]){
            stepData = profile.profileData.steps[this.step_no];
        }
        this.stepNameInp.val(stepData.step_label);
        this.setCheckedValues(profile,stepData.fields);
    };

    /**
     * Get the values of the ticked check boxes
     * @returns {Array}
     */
    DropColumnsDialog.prototype.getCheckedValues = function(){
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
    DropColumnsDialog.prototype.setCheckedValues = function(profile,fields){
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
        tabulate_3(this.statTabl_id,checked);
    };

    /**
     * Add a new Drop Columns By Names step
     * @param profile
     * @param this_dialog
     */
    DropColumnsDialog.prototype.addStep =function(profile, this_dialog){
        this_dialog.get_values(profile);
        profile.settingsdialog.update_step_list(profile);
        profile.settingsdialog.minidialogs[this_dialog.step_no] = this_dialog;
    };

    /**
     * Set dynamic elements of the UI
     */
    DropColumnsDialog.prototype.set_dynamic_ui =function(){
    };

    /***
     * class variable
     * @type {Function}
     */
    IPython.DropColumnsDialog = DropColumnsDialog;

    return IPython;

}(IPython));

