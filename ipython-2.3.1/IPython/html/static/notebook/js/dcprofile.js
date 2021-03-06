//----------------------------------------------------------------------------
//  Copyright (C) 2008-2011  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// CodeCell
//============================================================================
/**
 * An extendable module that provide base functionnality to create cell for notebook.
 * @module IPython
 * @namespace IPython
 * @submodule Profile
 */


/* local util for codemirror */
var posEq = function(a, b) {return a.line == b.line && a.ch == b.ch;};

/**
 *
 * function to delete until previous non blanking space character
 * or first multiple of 4 tabstop.
 * @private
 */
CodeMirror.commands.delSpaceToPrevTabStop = function(cm){
    var from = cm.getCursor(true), to = cm.getCursor(false), sel = !posEq(from, to);
    if (!posEq(from, to)) { cm.replaceRange("", from, to); return; }
    var cur = cm.getCursor(), line = cm.getLine(cur.line);
    var tabsize = cm.getOption('tabSize');
    var chToPrevTabStop = cur.ch-(Math.ceil(cur.ch/tabsize)-1)*tabsize;
    from = {ch:cur.ch-chToPrevTabStop,line:cur.line};
    var select = cm.getRange(from,cur);
    if( select.match(/^\ +$/) !== null){
        cm.replaceRange("",from,cur);
    } else {
        cm.deleteH(-1,"char");
    }
};


var IPython = (function (IPython) {
    "use strict";

    var utils = IPython.utils;
    var keycodes = IPython.keyboard.keycodes;

    /**
     * A Cell conceived to write code.
     *
     * The kernel doesn't have to be set at creation time, in that case
     * it will be null and set_kernel has to be called later.
     * @class DCProfile
     * @extends IPython.Cell
     *
     * @constructor
     * @param {Object|null} kernel
     * @param {object|undefined} [options]
     *      @param [options.cm_config] {object} config to pass to CodeMirror
     */
    var DCProfile = function (kernel, options) {
        this.kernel = kernel || null;
        this.collapsed = false;

        // create all attributed in constructor function
        // even if null for V8 VM optimisation
        this.input_prompt_number = null;
        this.celltoolbar = null;
        this.output_area = null;
        this.last_msg_id = null;
        this.completer = null;

        this.dcpdialog = new IPython.DcpDialog();
        this.visudialog = new IPython.VisuDialog();

        var cm_overwrite_options  = {
            onKeyEvent: $.proxy(this.handle_keyevent,this)
        };

        options = this.mergeopt(DCProfile, options, {cm_config:cm_overwrite_options});

        IPython.Cell.apply(this,[options]);

        // Attributes we want to override in this subclass.
        //this.cell_type = "flp";
        this.cell_type = "code";
        this.gui_type = 'dcp';
        //
        this.fileName = "";
        this.fileType ="";

        var that = this;
        this.element.focusout(
            function() { that.auto_highlight(); }
        );
    };

    DCProfile.options_default = {
        cm_config : {
            extraKeys: {
                "Tab" :  "indentMore",
                "Shift-Tab" : "indentLess",
                "Backspace" : "delSpaceToPrevTabStop",
                "Cmd-/" : "toggleComment",
                "Ctrl-/" : "toggleComment"
            },
            mode: 'ipython',
            theme: 'ipython',
            matchBrackets: true,
            // don't auto-close strings because of CodeMirror #2385
            autoCloseBrackets: "()[]{}"
        }
    };

    DCProfile.msg_cells = {};

    DCProfile.prototype = new IPython.Cell();

    /**
     * @method auto_highlight
     */
    DCProfile.prototype.auto_highlight = function () {
        this._auto_highlight(IPython.config.cell_magic_highlight);
    };

    /** @method create_element */
    DCProfile.prototype.create_element = function () {
        IPython.Cell.prototype.create_element.apply(this, arguments);

        var prof = $('<div></div>');
        var cell =  $('<div></div>').addClass('cell border-box-sizing code_cell');
        cell.attr('tabindex','2');

        var input = $('<div></div>').addClass('input');
        var prompt = $('<div/>').addClass('prompt input_prompt');
        var inner_cell = $('<div />').addClass('inner_cell');
        this.celltoolbar = new IPython.CellToolbar(this);
        inner_cell.append(this.celltoolbar.element);
        var input_area = $('<div style="display: none;"/>').addClass('input_area');
        //var input_area = $('<div/>').addClass('input_area');
        this.code_mirror = CodeMirror(input_area.get(0), this.cm_config);
        $(this.code_mirror.getInputField()).attr("spellcheck", "false");
        inner_cell.append(input_area);
        //input.append(prompt).append(inner_cell);
        input.append(inner_cell);

        var widget_area = $('<div/>')
            .addClass('widget-area')
            .hide();
        this.widget_area = widget_area;
        var widget_prompt = $('<div/>')
            .addClass('prompt')
            .appendTo(widget_area);
        var widget_subarea = $('<div/>')
            .addClass('widget-subarea')
            .appendTo(widget_area);
        this.widget_subarea = widget_subarea;
        var widget_clear_buton = $('<button />')
            .addClass('close')
            .html('&times;')
            .click(function() {
                widget_area.slideUp('', function(){ widget_subarea.html(''); });
            })
            .appendTo(widget_prompt);

        var output = $('<div></div>');
        var visdiv = $('<div id="flpvisdiv"></div>');
        /*var prof = $('<p></p>');
        prof.addClass('hacked');
        output.append(prof);*/

        var get_flp_code= function(nb,fileType,fileName) {
            var code = 'from ananta_base.base import *' +
                '\nfrom ananta_base.data_cleaning_pan import DataCleaningProfile, UseGlobalConstantStep, IgnoreTupleStep' +
                '\nfrom ananta_base.data_io import FileLoadingProfile, FileLoadStep' +
                '\nfrom ananta_base.data_preparing import DataPreparingProfile, DataSortStep, DataSelectStep' +
                '\nfrom ananta_base.data_set import TrainingSet' +
                '\nfrom ananta_base.data_transformation import DataTransformationProfile, EncodingStep' +
                '\nprojects = TrainingSet()' +
                '\nflp1 = FileLoadingProfile()' +
                '\ns1 = FileLoadStep("' + fileType + '", "' + fileName + '")' +
                '\nflp1.addStep(s1)' +
                '\nflp1.execute(projects)' +
                //'\ndf = projects.data.describe()' +
                '\ndf = projects.data' +
                '\nprint df' +
                '\ndf.to_csv("a.csv", sep=",", encoding="utf-8")' +
                '';
            nb.set_text(code);

        }


        get_flp_code(this, this.fileType,this.fileName);


        var gui = $('<div></div>');
        var in1 = $(''+
        '<form>'+
        'File Type : <input id="flpFileType" type="text" name="FileType" value=""><br>'+
        'File Name: <input id="flpFileName" type="text" name="FileName" value=""><br>'+
        '<input type="submit" value="Execute">'+
        '</form>' );
        var b1 = $('<button id="flpSetBtn" type="button" class="btn btn-default">Profile Settings</button>');
        var b2 = $('<button id="flpExcBtn" type="button" class="btn btn-default">Execute Profile</button>');
        var b3 = $('<button id="flpVisBtn" type="button" class="btn btn-default">Visualize </button>');
        var b4 = $('<button id="flpSSBtn" type="button" class="btn btn-default">Show Statistics</button>');
        var btngrp = $('<div class="btn-group profile-element" role="group" aria-label="..."></div>');
        /*'<button id="flpExcBtn" type="button">Execute</button>' +
        '<button id="flpExcBtn" type="button">Execute</button>' );*/
        var nb = this
        in1.submit(function(e) {
            e.preventDefault();
            get_flp_code(nb, $("#flpFileType").val(),$("#flpFileName").val());
        });
        b1.click(function(e){
            e.preventDefault();
            nb.dcpdialog.show_dcp_dialog(nb,get_flp_code);
        });
        b2.click(function(e){
            e.preventDefault();
            IPython.notebook.execute_cell();
        });
        b3.click(function(e){
            e.preventDefault();
            nb.visudialog.show_visu_dialog(nb,get_flp_code);
            //boxPlotSelectGrapgh(2);
        });
        //gui.append(in1).append(b1);
        //cell.append(input).append(widget_area).append(output);
        var left = $('<div id="sidebuttons" ></div>');
        //left.addClass('cell border-box-sizing code_cell');
        var brk = $('<br>');
        var right = $('<div id="visarea" "></div>');
        //right.addClass('cell border-box-sizing code_cell');
        var full = $('<div></div>');
        right.append('<h4>Data Cleaning Profile</h4>')
        full.addClass('clear');

        output.addClass('profile-element');

        //right.append(input).append(widget_area).append(output).append(visdiv);
        left.append(prompt)
        btngrp.append(b1).append(b2).append(b3).append(b4);
        //left.append(btngrp);
        //cell.append(left).append(brk).append(right);
        full.append(left).append(right).append(btngrp).append(input).append(widget_area).append(output).append(visdiv);
        cell.append(full);
        //prof.append(cell).append(gui);

        this.element = cell;
        this.output_area = new IPython.OutputArea(output, true);
        this.completer = new IPython.Completer(this);


    };


    /** @method bind_events */
    DCProfile.prototype.bind_events = function () {
        IPython.Cell.prototype.bind_events.apply(this);
        var that = this;

        this.element.focusout(
            function() { that.auto_highlight(); }
        );
    };


    /**
     *  This method gets called in CodeMirror's onKeyDown/onKeyPress
     *  handlers and is used to provide custom key handling. Its return
     *  value is used to determine if CodeMirror should ignore the event:
     *  true = ignore, false = don't ignore.
     *  @method handle_codemirror_keyevent
     */
    DCProfile.prototype.handle_codemirror_keyevent = function (editor, event) {

        var that = this;
        // whatever key is pressed, first, cancel the tooltip request before
        // they are sent, and remove tooltip if any, except for tab again
        var tooltip_closed = null;
        if (event.type === 'keydown' && event.which != keycodes.tab ) {
            tooltip_closed = IPython.tooltip.remove_and_cancel_tooltip();
        }

        var cur = editor.getCursor();
        if (event.keyCode === keycodes.enter){
            this.auto_highlight();
        }

        if (event.which === keycodes.down && event.type === 'keypress' && IPython.tooltip.time_before_tooltip >= 0) {
            // triger on keypress (!) otherwise inconsistent event.which depending on plateform
            // browser and keyboard layout !
            // Pressing '(' , request tooltip, don't forget to reappend it
            // The second argument says to hide the tooltip if the docstring
            // is actually empty
            IPython.tooltip.pending(that, true);
        } else if ( tooltip_closed && event.which === keycodes.esc && event.type === 'keydown') {
            // If tooltip is active, cancel it.  The call to
            // remove_and_cancel_tooltip above doesn't pass, force=true.
            // Because of this it won't actually close the tooltip
            // if it is in sticky mode. Thus, we have to check again if it is open
            // and close it with force=true.
            if (!IPython.tooltip._hidden) {
                IPython.tooltip.remove_and_cancel_tooltip(true);
            }
            // If we closed the tooltip, don't let CM or the global handlers
            // handle this event.
            event.stop();
            return true;
        } else if (event.keyCode === keycodes.tab && event.type === 'keydown' && event.shiftKey) {
            if (editor.somethingSelected()){
                var anchor = editor.getCursor("anchor");
                var head = editor.getCursor("head");
                if( anchor.line != head.line){
                    return false;
                }
            }
            IPython.tooltip.request(that);
            event.stop();
            return true;
        } else if (event.keyCode === keycodes.tab && event.type == 'keydown') {
            // Tab completion.
            IPython.tooltip.remove_and_cancel_tooltip();
            if (editor.somethingSelected()) {
                return false;
            }
            var pre_cursor = editor.getRange({line:cur.line,ch:0},cur);
            if (pre_cursor.trim() === "") {
                // Don't autocomplete if the part of the line before the cursor
                // is empty.  In this case, let CodeMirror handle indentation.
                return false;
            } else {
                event.stop();
                this.completer.startCompletion();
                return true;
            }
        }

        // keyboard event wasn't one of those unique to code cells, let's see
        // if it's one of the generic ones (i.e. check edit mode shortcuts)
        return IPython.Cell.prototype.handle_codemirror_keyevent.apply(this, [editor, event]);
    };

    // Kernel related calls.

    DCProfile.prototype.set_kernel = function (kernel) {
        this.kernel = kernel;
    };

    /**
     * Execute current code cell to the kernel
     * @method execute
     */
    DCProfile.prototype.execute = function () {
        this.output_area.clear_output();

        // Clear widget area
        this.widget_subarea.html('');
        this.widget_subarea.height('');
        this.widget_area.height('');
        this.widget_area.hide();

        this.set_input_prompt('*');
        this.element.addClass("running");
        if (this.last_msg_id) {
            this.kernel.clear_callbacks_for_msg(this.last_msg_id);
        }
        var callbacks = this.get_callbacks();
        var old_msg_id = this.last_msg_id;
        this.last_msg_id = this.kernel.execute(this.get_text(), callbacks, {silent: false, store_history: true});
        if (old_msg_id) {
            delete DCProfile.msg_cells[old_msg_id];
        }
        DCProfile.msg_cells[this.last_msg_id] = this;
    };

    /**
     * Construct the default callbacks for
     * @method get_callbacks
     */
    DCProfile.prototype.get_callbacks = function () {
        return {
            shell : {
                reply : $.proxy(this._handle_execute_reply, this),
                payload : {
                    set_next_input : $.proxy(this._handle_set_next_input, this),
                    page : $.proxy(this._open_with_pager, this)
                }
            },
            iopub : {
                output : $.proxy(this.output_area.handle_output, this.output_area),
                clear_output : $.proxy(this.output_area.handle_clear_output, this.output_area),
            },
            input : $.proxy(this._handle_input_request, this)
        };
    };

    DCProfile.prototype._open_with_pager = function (payload) {
        $([IPython.events]).trigger('open_with_text.Pager', payload);
    };

    /**
     * @method _handle_execute_reply
     * @private
     */
    DCProfile.prototype._handle_execute_reply = function (msg) {
        this.set_input_prompt(msg.content.execution_count);
        this.element.removeClass("running");
        $([IPython.events]).trigger('set_dirty.Notebook', {value: true});
    };

    /**
     * @method _handle_set_next_input
     * @private
     */
    DCProfile.prototype._handle_set_next_input = function (payload) {
        var data = {'cell': this, 'text': payload.text};
        $([IPython.events]).trigger('set_next_input.Notebook', data);
    };

    /**
     * @method _handle_input_request
     * @private
     */
    DCProfile.prototype._handle_input_request = function (msg) {
        this.output_area.append_raw_input(msg);
    };


    // Basic cell manipulation.

    DCProfile.prototype.select = function () {
        var cont = IPython.Cell.prototype.select.apply(this);
        if (cont) {
            this.code_mirror.refresh();
            this.auto_highlight();
        }
        return cont;
    };

    DCProfile.prototype.render = function () {
        var cont = IPython.Cell.prototype.render.apply(this);
        // Always execute, even if we are already in the rendered state
        return cont;
    };

    DCProfile.prototype.unrender = function () {
        // CodeCell is always rendered
        return false;
    };

    DCProfile.prototype.select_all = function () {
        var start = {line: 0, ch: 0};
        var nlines = this.code_mirror.lineCount();
        var last_line = this.code_mirror.getLine(nlines-1);
        var end = {line: nlines-1, ch: last_line.length};
        this.code_mirror.setSelection(start, end);
    };


    DCProfile.prototype.collapse_output = function () {
        this.collapsed = true;
        this.output_area.collapse();
    };


    DCProfile.prototype.expand_output = function () {
        this.collapsed = false;
        this.output_area.expand();
        this.output_area.unscroll_area();
    };

    DCProfile.prototype.scroll_output = function () {
        this.output_area.expand();
        this.output_area.scroll_if_long();
    };

    DCProfile.prototype.toggle_output = function () {
        this.collapsed = Boolean(1 - this.collapsed);
        this.output_area.toggle_output();
    };

    DCProfile.prototype.toggle_output_scroll = function () {
        this.output_area.toggle_scroll();
    };


    DCProfile.input_prompt_classical = function (prompt_value, lines_number) {
        var ns;
        if (prompt_value === undefined) {
            ns = "&nbsp;";
        } else {
            ns = encodeURIComponent(prompt_value);
        }
        return 'Profile&nbsp;[' + ns + ']:';
    };

    DCProfile.input_prompt_continuation = function (prompt_value, lines_number) {
        var html = [DCProfile.input_prompt_classical(prompt_value, lines_number)];
        for(var i=1; i < lines_number; i++) {
            html.push(['...:']);
        }
        return html.join('<br/>');
    };

    DCProfile.input_prompt_function = DCProfile.input_prompt_classical;


    DCProfile.prototype.set_input_prompt = function (number) {
        var nline = 1;
        if (this.code_mirror !== undefined) {
            nline = this.code_mirror.lineCount();
        }
        this.input_prompt_number = number;
        var prompt_html = DCProfile.input_prompt_function(this.input_prompt_number, nline);
        // This HTML call is okay because the user contents are escaped.
        this.element.find('div.input_prompt').html(prompt_html);
    };


    DCProfile.prototype.clear_input = function () {
        this.code_mirror.setValue('');
    };


    DCProfile.prototype.get_text = function () {
        return this.code_mirror.getValue();
    };


    DCProfile.prototype.set_text = function (code) {
        return this.code_mirror.setValue(code);
    };


    DCProfile.prototype.clear_output = function (wait) {
        this.output_area.clear_output(wait);
        this.set_input_prompt();
    };


    // JSON serialization

    DCProfile.prototype.fromJSON = function (data) {
        IPython.Cell.prototype.fromJSON.apply(this, arguments);
        if (data.cell_type === 'code' && data.gui_type==='dcp') {
            if (data.input !== undefined) {
                this.set_text(data.input);
                // make this value the starting point, so that we can only undo
                // to this state, instead of a blank cell
                this.code_mirror.clearHistory();
                this.auto_highlight();
            }
            if (data.prompt_number !== undefined) {
                this.set_input_prompt(data.prompt_number);
            } else {
                this.set_input_prompt();
            }
            this.output_area.trusted = data.trusted || false;
            this.output_area.fromJSON(data.outputs);
            if (data.collapsed !== undefined) {
                if (data.collapsed) {
                    this.collapse_output();
                } else {
                    this.expand_output();
                }
            }
            /*this.fileName = data.fileName;
            this.fileType = data.fileType;
            this.fileLoc = data.fileLoc;*/
        }
    };


    DCProfile.prototype.toJSON = function () {
        var data = IPython.Cell.prototype.toJSON.apply(this);
        data.input = this.get_text();
        // is finite protect against undefined and '*' value
        if (isFinite(this.input_prompt_number)) {
            data.prompt_number = this.input_prompt_number;
        }
        var outputs = this.output_area.toJSON();
        data.outputs = outputs;
        data.language = 'python';
        data.trusted = this.output_area.trusted;
        data.collapsed = this.collapsed;
        ////////
        data.gui_type = this.gui_type;
        /*data.fileName = this.fileName;
        data.fileType = this.fileType;
        data.fileLoc = this.fileLoc;*/
        return data;
    };

    /**
     * handle cell level logic when a cell is unselected
     * @method unselect
     * @return is the action being taken
     */
    DCProfile.prototype.unselect = function () {
        var cont = IPython.Cell.prototype.unselect.apply(this);
        if (cont) {
            // When a code cell is usnelected, make sure that the corresponding
            // tooltip and completer to that cell is closed.
            IPython.tooltip.remove_and_cancel_tooltip(true);
            if (this.completer !== null) {
                this.completer.close();
            }
        }
        return cont;
    };

    IPython.DCProfile = DCProfile;

    return IPython;
}(IPython));
