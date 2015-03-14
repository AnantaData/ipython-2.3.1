//============================================================================
// Supervised Mining Profile Dialog
//============================================================================

var IPython = (function (IPython) {
    "use strict";

    var platform = IPython.utils.platform;

    /**
     * The constructor of SmpDialog,  this class is extended from ProfileDialog
     * @param cell_id
     * @constructor
     */
    var SmpDialog = function (cell_id) {
        IPython.ProfileDialog.apply(this, [cell_id]);
    };

    /**
     * This class is extended from ProfileDialog
     * @type {IPython.ProfileDialog}
     */
    SmpDialog.prototype = new IPython.ProfileDialog();

    /**
     * This method shows the dialog, all the html elements, events are created here
     * @param profile
     */
    SmpDialog.prototype.show_dialog = function (profile) {

        var element = IPython.ProfileDialog.prototype.show_dialog.apply(this, []);
        if(!element){return;}
        var form_div = this.build_elements(profile);
        element.append(form_div);

        var this_dialog = this;
        this.shortcut_dialog = IPython.dialog.modal({
            title : "Supervised Mining Profile",
            body : element,
            destroy : false,
            buttons : {
                Close : {},
                Ok :{class : "btn-primary",
                    click: function(e) {
                        this_dialog.get_values(profile, e);
                    }
                }
            }
        });
        this.shortcut_dialog.addClass("modal_stretch");

        this.retrive_elements();
        this.set_dynamic_ui();
        this.set_values(profile);
        this.setInstruction();

        $([IPython.events]).on('rebuild.QuickHelp', function() { that.force_rebuild = true;});


    };

    /**
     * Set the instructions for the dialog user
     */
    SmpDialog.prototype.setInstruction = function(){
        this.documentation.text('Please enter the algorithm you wish to run on this predictive analysis.');
    };

    /**
     * This method is called inside the show dialog method and create all the HTML elements
     * @param profile
     * @returns {*|jQuery|HTMLElement}
     */
    SmpDialog.prototype.build_elements = function (profile) {
        var div = $('<div/>');

        this.alg_inp_id = this.dialog_id+"algorithm";
        this.res_var_id = this.dialog_id+"response_var";

        var algLbl = $('<label for="algorithm">Model</label>');
        var algInp = $('<select name="algorithm"  >' +
        '<option selected="selected" value=""></option>' +
        '<option  value="logit" >Logistic Regression</option>' +
        '<option  value="ranfor" >Random Forest Regression</option>'+
        '<option  value="svm" >Support Vector Classifier</option>'+
        '</select>');


        var resLbl = $('<label for= "response_var" >Response Variable(Y)</label>');
        var resSel = $('<select name="response_var" >' +
        '<option selected = "selected" value=""></option>' +
        '</select>');
        var fieldList= getFields();
        //alert(fieldList.length);
        for (var i = 0 ; i < fieldList.length; i++){
            resSel.append($('<option value="'+fieldList[i].name+'" >'+fieldList[i].name+'</option>'));
        }





        algInp.attr('id',this.alg_inp_id);
        resSel.attr('id',this.res_var_id);
        div.append(algLbl).append(algInp).append(resLbl).append(resSel);
        return div;
    };

    /**
     * All the html elements are called from their id using jquery
     */
    SmpDialog.prototype.retrive_elements = function(){
        this.algInp  = $('#'+this.alg_inp_id);
        this.resSel  = $('#'+this.res_var_id);
        this.errDoc = $('#'+this.errorDoc_id);
        this.documentation = $('#'+this.documentation_id);
    };

    /**
     * when the dialog is finished the values obtained are stored
     * @param profile
     * @param e
     */
    SmpDialog.prototype.get_values = function(profile, e){

        this.errDoc.hide();
        if(!profile.settingsdialog.algInp.val()){
            profile.profileData.algorithm = profile.settingsdialog.algInp[0].algorithm[0].name;
        }
        else {
            profile.profileData.algorithm = profile.settingsdialog.algInp.val();
        }
        if(!profile.settingsdialog.resSel.val()){
            profile.profileData.response_var = profile.settingsdialog.resSel[0].response_var[0].name;
        }
        else {
            profile.profileData.response_var = profile.settingsdialog.resSel.val();
        }
        if(this.alg_inp_id[0].selectedIndex ==0) {
            e.preventDefault();
            profile.settingsdialog.errDoc.text("Algorithm Not Selected");
            profile.settingsdialog.errDoc.show();
        }else if(this.res_var_id[0].selectedIndex ==0) {
            e.preventDefault();
            profile.settingsdialog.errDoc.text("Response Variable Not Selected");
            profile.settingsdialog.errDoc.show();
        }else{
            profile.set_text(profile.setCode(profile.profileData));
            //get_flp_code(profile.profileData,profile.profileData.fileType,profile.profileData.fileLoc+profile.profileData.fileName);
            return true;
        }
        return false;
    };

    /**
     * The stored values are set in the GUI, when loading a profile
     * @param profile
     */
    SmpDialog.prototype.set_values =function(profile){
        $('#'+this.alg_inp_id+' option[value="' + profile.profileData.algorithm + '"]').prop('selected', true);

    };

    /**
     * Set dynamic elements of the UI
     * @param profile
     */
    SmpDialog.prototype.set_dynamic_ui =function(){
        var this_dialog = this;
        this.algInp.change(function(){
            //this_dialog.fileNameTxt.val(this_dialog.fileNameInp[0].files[0].name);
            console.log('selected');
        });
    };

    /**
     * class variable
     * @type {Function}
     */
    IPython.SmpDialog = SmpDialog;

    return IPython;

}(IPython));
