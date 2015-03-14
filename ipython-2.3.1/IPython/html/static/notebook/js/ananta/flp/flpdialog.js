//----------------------------------------------------------------------------
//  Copyright (C) 2015  The Ananta Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// File Loading Profile Dialog
//============================================================================

var IPython = (function (IPython) {
    "use strict";

    var platform = IPython.utils.platform;

    /**
     * The constructor of FlpDialog,  this class is extended from ProfileDialog
     * @param cell_id
     * @constructor
     */
    var FlpDialog = function (cell_id) {
        IPython.ProfileDialog.apply(this, [cell_id]);
    };

    /**
     * This class is extended from ProfileDialog
     * @type {IPython.ProfileDialog}
     */
    FlpDialog.prototype = new IPython.ProfileDialog();

    /**
     * This method shows the dialog, all the html elements, events are created here
     * @param profile
     */
    FlpDialog.prototype.show_dialog = function (profile) {

        var element = IPython.ProfileDialog.prototype.show_dialog.apply(this, []);
        if(!element){return;}
        var form_div = this.build_elements(profile);
        element.append(form_div);

        var this_dialog = this;
        this.shortcut_dialog = IPython.dialog.modal({
            title : "File Loading Profile",
            body : element,
            destroy : false,
            buttons : {
                Close : {},
                Ok :{class : "btn-primary",
                    click: function(e) {
                        return this_dialog.get_values(profile, e);
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
     * The instruction for the dialog user
     */
    FlpDialog.prototype.setInstruction = function(){
        this.documentation.text('The File Loading Profile Should be given two inputs. <b>File Type</b> '+
        'which can be csv, txt, json etc.'+
        'and <b>File Name</b> which is the location of file and its name'+
        '.')
    };

    /**
     * This method is called inside the show dialog method and create all the HTML elements
     * @param profile
     * @returns {*|jQuery|HTMLElement}
     */
    FlpDialog.prototype.build_elements = function (profile) {
        var div = $('<div/>');

        this.fileTypeInp_id = this.dialog_id+"filetype";
        this.fileLoctInp_id = this.dialog_id+"fileloc";
        this.fileNameInp_id = this.dialog_id+"filename";
        this.fileNameTxt_id = this.dialog_id+"filenametxt"

        var fileTypeLbl = $('<label for="filetype">File Type:</label>');
        var fileTypeInp = $('<select name="filetype"  >' +
                                '<option selected="selected" value=""></option>' +
                                '<option  value="csv" >CSV</option>' +
                                '<option  value="xls" >Excel</option>'+
                                '<option  value="json" >JSON</option>'+
                                '<option  value="xml" >XML</option>'+
                            '</select>');
        var fileLoctLbl = $('<label for="fileloc">File Location:</label>');
        var fileLoctInp = $('<input type="text" name="fileloc" >');
        var fileNameLbl = $('<label for="filename">File Name:</label>');
        var fileNameInp = $('<input type="file" name="filename"  >');
        var fileNameTxt = $('<input type="text" name="filenametxt"  readonly>');

        fileTypeInp.attr('id',this.fileTypeInp_id);
        fileLoctInp.attr('id',this.fileLoctInp_id);
        fileNameInp.attr('id',this.fileNameInp_id);
        fileNameTxt.attr('id',this.fileNameTxt_id);

        div.append(fileTypeLbl).append(fileTypeInp)
            .append(fileLoctLbl).append(fileLoctInp)
            .append(fileNameLbl).append(fileNameInp).append(fileNameTxt);
        return div;
    };

    /**
     * All the html elements are called from their id using jquery
     */
    FlpDialog.prototype.retrive_elements = function(){
        this.fileTypeInp = $('#'+this.fileTypeInp_id);
        this.fileLoctInp = $('#'+this.fileLoctInp_id);
        this.fileNameInp = $('#'+this.fileNameInp_id);
        this.fileNameTxt = $('#'+this.fileNameTxt_id);
        this.errDoc = $('#'+this.errorDoc_id);
        this.documentation = $('#'+this.documentation_id);
    };

    /**
     * when the dialog is finished the values obtained are stored
     * @param profile
     * @param e
     * @returns {boolean}
     */
    FlpDialog.prototype.get_values = function(profile, e){

        this.errDoc.hide();
        if(!profile.settingsdialog.fileNameTxt.val()){
            profile.profileData.fileName = profile.settingsdialog.fileNameInp[0].files[0].name;
        }
        else {
            profile.profileData.fileName = profile.settingsdialog.fileNameTxt.val();
        }
        profile.profileData.fileLoc = profile.settingsdialog.fileLoctInp.val();
        profile.profileData.fileType = profile.settingsdialog.fileTypeInp.val();

        if(this.fileTypeInp[0].selectedIndex ==0) {
            e.preventDefault();
            profile.settingsdialog.errDoc.text("File Type not selected");
            profile.settingsdialog.errDoc.show();
        }else if(!profile.profileData.fileName) {
            e.preventDefault();
            profile.settingsdialog.errDoc.text("File Name is not given");
            profile.settingsdialog.errDoc.show();
        }else if(!profile.profileData.fileLoc) {
            e.preventDefault();
            profile.settingsdialog.errDoc.text("File Location is not given");
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
    FlpDialog.prototype.set_values =function(profile){
        $('#'+this.fileTypeInp_id+' option[value="' + profile.profileData.fileType + '"]').prop('selected', true);
        this.fileLoctInp.val(profile.profileData.fileLoc);
        this.fileNameTxt.val(profile.profileData.fileName);
    };

    /**
     * Set dynamic elements of ui
     */
    FlpDialog.prototype.set_dynamic_ui =function(){
        var this_dialog = this;
        this.fileNameInp.change(function(){
            this_dialog.fileNameTxt.val(this_dialog.fileNameInp[0].files[0].name);
        });
    };

    /**
     * class variable
     * @type {Function}
     */
    IPython.FlpDialog = FlpDialog;

    return IPython;

}(IPython));
