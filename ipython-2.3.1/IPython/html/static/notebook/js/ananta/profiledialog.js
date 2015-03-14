//----------------------------------------------------------------------------
//  Copyright (C) 2015  The Ananta Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// Profile Dialog
//============================================================================

var IPython = (function (IPython) {
    "use strict";

    var platform = IPython.utils.platform;

    /**
     * Profile Dialog is the parent class of settings dialog of profiles
     * @param cell_id
     * @constructor
     */
    var ProfileDialog = function (cell_id) {
        this.cell_id = cell_id;
        this.dialog_id = cell_id+"_set_";
    };

    /**
     * This method creates the elements and their events of the profile dialog
     * @returns {*|jQuery|HTMLElement}
     */
    ProfileDialog.prototype.show_dialog = function () {

        if ( this.force_rebuild ) {
            this.shortcut_dialog.remove();
            delete(this.shortcut_dialog);
            this.force_rebuild = false;
        }
        if ( this.shortcut_dialog ){
            // if dialog is already shown, close it
            $(this.shortcut_dialog).modal("toggle");
            return;
        }


        var element = $('<div/>');
        var doc = this.build_documentation();
        var err_doc = this.build_error_doc()
        element.append(doc).append(err_doc);

        return element;

    };

    /**
     * Instructions element
     * @returns {*|jQuery}
     */
    ProfileDialog.prototype.build_documentation = function(){
        this.documentation_id = this.dialog_id+"documentation";
        var doc = $('<div/>').addClass('alert');
        doc.append(
            $('<button/>').addClass('close').attr('data-dismiss','alert').html('&times;')
        ).append(
            ''
        );
        doc.attr('id',this.documentation_id);
        return doc;
    }

    /**
     * Error documentation is created here
     * @returns {*|jQuery}
     */
    ProfileDialog.prototype.build_error_doc = function(){
        this.errorDoc_id = this.dialog_id+"errordoc";
        var err_doc = $('<div/>').addClass('alert-error');
        err_doc.append(
            $('<button/>').addClass('close').attr('data-dismiss','alert').html('&times;')
        ).append('');
        err_doc.hide();
        err_doc.attr('id',this.errorDoc_id);
        return err_doc;
    }

    /**
     * class as a variable
     * @type {Function}
     */
    IPython.ProfileDialog = ProfileDialog;

    return IPython;

}(IPython));