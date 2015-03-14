//----------------------------------------------------------------------------
//  Copyright (C) 2015  The Ananta Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// Scatter Plot Graph Dialog
//============================================================================

var IPython = (function (IPython) {
    "use strict";

    var platform = IPython.utils.platform;

    var ScatterPlotDialog = function (selector) {
    };


    ScatterPlotDialog.prototype.show_dialog = function (nb) {
        var prof = nb;
        var that = this;
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

        var element =  $('<div id="scattervisdiv"></div>');

        // The documentation
        var doc = $('<div/>');
        doc.append(
            $('<button/>').addClass('close').attr('data-dismiss','alert').html('&times;')
        );

        var err_doc = $('<div id="error_doc"/>').addClass('alert-error');
        err_doc.append(
            $('<button/>').addClass('close').attr('data-dismiss','alert').html('&times;')
        );

        err_doc.hide();
        element.append(doc).append(err_doc);

        scatterplotCreateGrapgh();

        this.shortcut_dialog = IPython.dialog.modal({
            title : "Scatter Plot GSOM",
            body : element,
            destroy : false,
            buttons : {
                Close : {}
            }
        });
        this.shortcut_dialog.addClass("modal_stretch");

        $([IPython.events]).on('rebuild.QuickHelp', function() { that.force_rebuild = true;});

    };

    IPython.ScatterPlotDialog = ScatterPlotDialog;

    return IPython;

}(IPython));
