// Copyright (c) IPython Development Team.
// Distributed under the terms of the Modified BSD License.

//============================================================================
// QuickHelp button
//============================================================================

var IPython = (function (IPython) {
    "use strict";

    var platform = IPython.utils.platform;

    var DcpDialog = function (selector) {
    };

    /*var cmd_ctrl = 'Ctrl-';
    var platform_specific;

    if (platform === 'MacOS') {
        // Mac OS X specific
        cmd_ctrl = 'Cmd-';
        platform_specific = [
            { shortcut: "Cmd-Up",     help:"go to cell start"  },
            { shortcut: "Cmd-Down",   help:"go to cell end"  },
            { shortcut: "Opt-Left",   help:"go one word left"  },
            { shortcut: "Opt-Right",  help:"go one word right"  },
            { shortcut: "Opt-Backspace",      help:"del word before"  },
            { shortcut: "Opt-Delete",         help:"del word after"  },
        ];
    } else {
        // PC specific
        platform_specific = [
            { shortcut: "Ctrl-Home",  help:"go to cell start"  },
            { shortcut: "Ctrl-Up",     help:"go to cell start"  },
            { shortcut: "Ctrl-End",   help:"go to cell end"  },
            { shortcut: "Ctrl-Down",  help:"go to cell end"  },
            { shortcut: "Ctrl-Left",  help:"go one word left"  },
            { shortcut: "Ctrl-Right", help:"go one word right"  },
            { shortcut: "Ctrl-Backspace", help:"del word before"  },
            { shortcut: "Ctrl-Delete",    help:"del word after"  },
        ];
    }

    var cm_shortcuts = [
        { shortcut:"Tab",   help:"code completion or indent" },
        { shortcut:"Shift-Tab",   help:"tooltip" },
        { shortcut: cmd_ctrl + "]",   help:"indent"  },
        { shortcut: cmd_ctrl + "[",   help:"dedent"  },
        { shortcut: cmd_ctrl + "a",   help:"select all"  },
        { shortcut: cmd_ctrl + "z",   help:"undo"  },
        { shortcut: cmd_ctrl + "Shift-z",   help:"redo"  },
        { shortcut: cmd_ctrl + "y",   help:"redo"  },
    ].concat( platform_specific );*/



      


    DcpDialog.prototype.show_dcp_dialog = function (nb,get_dcp_code) {
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

        var form_div = this.build_visu_form(nb);
        element.append(form_div);





        window.alert("jquery problem");
        /*
        // Command mode
        var cmd_div = this.build_command_help();
        element.append(cmd_div);

        // Edit mode
        var edit_div = this.build_edit_help(cm_shortcuts);
        element.append(edit_div);*/


        this.shortcut_dialog = IPython.dialog.modal({
            title : "File Loading Profile",
            body : element,
            destroy : false,
            buttons : {
                Close : {},
                Ok :{class : "btn-primary",
                    click: function(e) {
                        var filetype = $('#filetype');
                        var filename = $('#filenametxt');
                        var fileloc = $('#fileloc');
                        var err_doc = $('#error_doc');
                        err_doc.hide();
                        var f = filetype[0];
                        var error = 0;
                        nb.fileName = filename.val();
                        nb.fileLoc = fileloc.val();
                        nb.fileType = filetype.val();

                        if(f.selectedIndex ==0) {
                            e.preventDefault();
                            err_doc.text("File Type not selected");
                            err_doc.show();
                        }else if(!nb.fileName) {
                            e.preventDefault();
                            err_doc.text("File Name is not given");
                            err_doc.show();
                        }else if(!nb.fileLoc) {
                            e.preventDefault();
                            err_doc.text("File Location is not given");
                            err_doc.show();
                        }else{
                            get_dcp_code(nb,nb.fileType,nb.fileLoc+nb.fileName);
                            //window.alert(fileloc.val() + filename[0].files[0].name);
                            return true;
                        }
                        return false;

                    }
                }
            }
        });
        this.shortcut_dialog.addClass("modal_stretch");

        $("#filename").change(function(){
            window.alert("chosen");
            $('#filenametxt').val($('#filename')[0].files[0].name);
        });
        
        $([IPython.events]).on('rebuild.QuickHelp', function() { that.force_rebuild = true;});


        $('#filetype option[value="' + nb.fileType + '"]').prop('selected', true);
        $('#fileloc').val(nb.fileLoc);
        $('#filenametxt').val(nb.fileName);

    };

    DcpDialog.prototype.build_visu_form = function (nb) {
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

    ///home/lakmal/PycharmProjects/GSOM/

    /*
    FlpDialog.prototype.build_command_help = function () {
        var command_shortcuts = IPython.keyboard_manager.command_shortcuts.help();
        return build_div('<h4>Command Mode (press <code>Esc</code> to enable)</h4>', command_shortcuts);
    };

    var special_case = { pageup: "PageUp", pagedown: "Page Down", 'minus': '-' };
    var prettify = function (s) {
        s = s.replace(/-$/, 'minus'); // catch shortcuts using '-' key
        var keys = s.split('-');
        var k, i;
        for (i=0; i < keys.length; i++) {
            k = keys[i];
            if ( k.length == 1 ) {
                keys[i] = "<code><strong>" + k + "</strong></code>";
                continue; // leave individual keys lower-cased
            }
            keys[i] = ( special_case[k] ? special_case[k] : k.charAt(0).toUpperCase() + k.slice(1) );
            keys[i] = "<code><strong>" + keys[i] + "</strong></code>";
        }
        return keys.join('-');


    };

    FlpDialog.prototype.build_edit_help = function (cm_shortcuts) {
        var edit_shortcuts = IPython.keyboard_manager.edit_shortcuts.help();
        jQuery.merge(cm_shortcuts, edit_shortcuts);
        return build_div('<h4>Edit Mode (press <code>Enter</code> to enable)</h4>', cm_shortcuts);
    };

    var build_one = function (s) {
        var help = s.help;
        var shortcut = prettify(s.shortcut);
        return $('<div>').addClass('quickhelp').
            append($('<span/>').addClass('shortcut_key').append($(shortcut))).
            append($('<span/>').addClass('shortcut_descr').text(' : ' + help));

    };

    var build_div = function (title, shortcuts) {
        var i, half, n;
        var div = $('<div/>').append($(title));
        var sub_div = $('<div/>').addClass('hbox');
        var col1 = $('<div/>').addClass('box-flex1');
        var col2 = $('<div/>').addClass('box-flex1');
        n = shortcuts.length;
        half = ~~(n/2);  // Truncate :)
        for (i=0; i<half; i++) { col1.append( build_one(shortcuts[i]) ); }
        for (i=half; i<n; i++) { col2.append( build_one(shortcuts[i]) ); }
        sub_div.append(col1).append(col2);
        div.append(sub_div);
        return div;
    };
    */

    // Set module variables
    IPython.DcpDialog = DcpDialog;

    return IPython;

}(IPython));
