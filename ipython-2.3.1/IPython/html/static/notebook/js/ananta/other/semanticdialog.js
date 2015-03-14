var IPython = (function (IPython) {
    "use strict";

    var platform = IPython.utils.platform;

    var SemanticDialog = function (selector) {
    };


    SemanticDialog.prototype.show_dialog = function (nb,selection_1,selection_2) {
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

        /*var command_shortcuts = IPython.keyboard_manager.command_shortcuts.help();
         var edit_shortcuts = IPython.keyboard_manager.edit_shortcuts.help();
         var help, shortcut;
         var i, half, n;*/

        var element =  $('<div id="semanticvisdiv"></div>');

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

        SemanticSelectGrapgh(selection_1,selection_2);

        this.shortcut_dialog = IPython.dialog.modal({
            title : "Data Distribution between column "+selection_1+" and "+selection_2 ,
            body : element,
            destroy : false,
            buttons : {
                Close : {}
            }
        });
        this.shortcut_dialog.addClass("modal_stretch");

        //$("#filename").change(function(){
        //    window.alert("chosen");
        //    $('#filenametxt').val($('#filename')[0].files[0].name);
        //});

        //$([IPython.events]).on('rebuild.QuickHelp', function() { that.force_rebuild = true;});


        //$('#filetype option[value="' + nb.fileType + '"]').prop('selected', true);
        //$('#fileloc').val(nb.fileLoc);
        //$('#filenametxt').val(nb.fileName);

    };

    IPython.SemanticDialog = SemanticDialog;

    return IPython;

}(IPython));
