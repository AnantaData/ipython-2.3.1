// Copyright (c) IPython Development Team.
// Distributed under the terms of the Modified BSD License.

//============================================================================
// QuickHelp button
//============================================================================

var IPython = (function (IPython) {
    "use strict";

    var platform = IPython.utils.platform;

    var DmpDialog = function (selector) {
    };


    DmpDialog.prototype.show_dialog = function (nb,get_dmp_code) {
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
        var element = $('<div/>');

        // The documentation
        var doc = $('<div/>').addClass('alert');
        doc.append(
            $('<button/>').addClass('close').attr('data-dismiss','alert').html('&times;')
        ).append(
            'The File Loading Profile Should be given two inputs. <b>File Type</b> '+
            'which can be csv, txt, json etc.'+
            'and <b>File Name</b> which is the location of file and its name'+
            '.'
        );

        var err_doc = $('<div id="error_doc"/>').addClass('alert-error');
        err_doc.append(
            $('<button/>').addClass('close').attr('data-dismiss','alert').html('&times;')
        ).append(
            ''
        );
        err_doc.hide();
        element.append(doc).append(err_doc);

        var form_div = this.build_dmp_options(nb);
        element.append(form_div);


        this.shortcut_dialog = IPython.dialog.modal({
            title : "Unsupervised Mining Profile",
            body : element,
            destroy : false,
            buttons : {
                Close : {},
                Ok :{class : "btn-primary",
                    click: function(e) {
                        var algorithm = $('#algorithm');
                        //var kernel_type = $('#kerneltype');
                        //var ensemble = $('#ensemble');
                        var err_doc = $('#error_doc');
                        err_doc.hide();
                        var f = algorithm[0];
                        var error = 0;
                        nb.algorithm = algorithm.val();
                        nb.kv=0;
                        if (nb.algorithm=='kmeans'){
                            nb.kv=$('#kv').val();
                        }
                        //nb.fileLoc = fileloc.val();
                        //nb.fileType = filetype.val();

                        if(f.selectedIndex ==0) {
                            e.preventDefault();
                            err_doc.text("Please Specify an Algorithm!");
                            err_doc.show();
                        }else{
                            get_dmp_code(nb,nb.algorithm,nb.kv);
                            return true;
                        }
                        return false;

                    }
                }
            }
        });
        this.shortcut_dialog.addClass("modal_stretch");

        $("#algorithm").change(function(){
            //window.alert("chosen");
            $('#kv').hide()
            if($('#algorithm').val()=='kmeans'){
                $('#kv').show();
            }
            $('#algorithm').val($('#algorithm')[0].files[0].name);
        });
        
        $([IPython.events]).on('rebuild.QuickHelp', function() { that.force_rebuild = true;});


        $('#filetype option[value="' + nb.fileType + '"]').prop('selected', true);
        $('#fileloc').val(nb.fileLoc);
        $('#filenametxt').val(nb.fileName);

    };

    DmpDialog.prototype.build_dmp_options = function (nb) {
        var div = $('<div/>');
        var frm = $(
        '<div class="ui-field-contain">' +
        '<label for="maptype">Algorithm:</label>' +
        '<select name="title" id="algorithm"  >' +
        '<option selected="selected" value=""></option>' +
        '<option  value="gsom" id="type_1">Growing Self Organizing Map</option>' +
        '<option  value="kgsom" id="type_2">Kernel Growing Self Organizing Map</option>'+
        '<option value="kmeans" id = "type_3"> K-Means (k = 4) </option>'+
        '</select>' +
        '<input type="text" id = "kv" style="display:none">Enter Number of Clusters for K-Means</input>'+
        '</div>');
        div.append(frm);
        return div;
    };

    DmpDialog.prototype.build_elements = function (nb) {
        var div = $('<div/>');
        var frm = $('<form method="post" action="demoform.asp">' +
        '<div class="ui-field-contain">' +
        '<label for="filetype">File Type:</label>' +
        '<select name="title" id="filetype"  >' +
        '<option selected="selected" value="'+ nb.fileType+'"></option>' +
        '<option  value="csv" id="type_1">csv</option>' +
        '<option  value="xls" id="type_2">Excel</option>'+
        '<option  value="json" id="type_3">JSON</option>'+
        '<option  value="xml" id="type_3">XML</option>'+
        '</select>' +
        '<label for="fileloc">File Location:</label>' +
        '<input type="text" name="fileloc" id="fileloc" value="">' +
        '<label for="filename">File Name:</label>' +
        '<input type="file" name="filename" id="filename" >' +
        '<input type="text" name="filenametxt" id="filenametxt" readonly>' +
        '</div>' +
        '</form>');
        div.append(frm);
        return div;
    };

    IPython.DmpDialog = DmpDialog;

    return IPython;

}(IPython));

////