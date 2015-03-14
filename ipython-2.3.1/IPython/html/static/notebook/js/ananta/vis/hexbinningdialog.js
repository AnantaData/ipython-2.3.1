//----------------------------------------------------------------------------
//  Copyright (C) 2015  The Ananta Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// Hex Binning Dialog
//============================================================================
var IPython = (function (IPython) {
    "use strict";
    var platform = IPython.utils.platform;

    var HexBinningDialog = function (selector) {
    };

    HexBinningDialog.prototype.show_dialog = function (nb) {
        // toggles display of keyboard shortcut dialog
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

        var element =  $('<div id="hexbinchartvisdiv"></div>');

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

        hexBinningCreateGrapgh();

        this.shortcut_dialog = IPython.dialog.modal({
            title : "Self Oraganizing Map Graph ",
            body : element,
            destroy : false,
            buttons : {
                Close : {}
            }
        });
        this.shortcut_dialog.addClass("modal_stretch");

        $("#filename").change(function(){
            //window.alert("chosen");
            $('#filenametxt').val($('#filename')[0].files[0].name);
        });

        $([IPython.events]).on('rebuild.QuickHelp', function() { that.force_rebuild = true;});

        $('#filetype option[value="' + nb.fileType + '"]').prop('selected', true);
        $('#fileloc').val(nb.fileLoc);
        $('#filenametxt').val(nb.fileName);

    };

    IPython.HexBinningDialog = HexBinningDialog;

    return IPython;

}(IPython));
