//----------------------------------------------------------------------------
//  Copyright (C) 2015  The Ananta Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// Profile
//============================================================================

var IPython = (function (IPython) {

    /**
     * The Profile is extended from codecell class of IPython
     * @param kernel
     * @param options
     * @constructor
     */
    var Profile = function (kernel, options) {

        IPython.CodeCell.apply(this,[kernel,options]);
        this.visudialog = new IPython.VisuDialog(this.cell_id);
    };

    /**
     * The Profile is extended from codecell class of IPython
     * @type {IPython.CodeCell}
     */
    Profile.prototype = new IPython.CodeCell();

    /**
     * Basic profile elements and events are created here
     * The five buttons, instructions and the error documentation are added
     */
    Profile.prototype.create_element = function () {

        IPython.Cell.prototype.create_element.apply(this, arguments);

        var prof = $('<div></div>');
        var cell =  $('<div></div>').addClass('cell border-box-sizing code_cell');
        cell.attr('tabindex','2');

        var input = $('<div></div>').addClass('input');
        var prompt = $('<div style="width:65px;float:left;"/>').addClass('prompt input_prompt');
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


        this.b1id = this.cell_id+"flpSetBtn";
        this.b2id = this.cell_id+"flpExcBtn";
        this.b3id = this.cell_id+"flpVisBtn";
        this.b4id = this.cell_id+"flpSSBtn";
        this.b5id = this.cell_id+"flpRABtn";
        this.profileheading = $('<h4 style="float:left; width:35%; ">'+this.heading+'</h4>');
        this.b1 = $('<button id="'+this.b1id+'" title="Profile Settings" type="button" class="btn btn-default icon-cogs"/>');
        this.b2 = $('<button id="'+this.b2id+'" title="Execute Profile" type="button" class="btn btn-default icon-play"/>');
        this.b3 = $('<button id="'+this.b3id+'" title="Visualize Related Information" type="button" class="btn btn-default icon-eye-open"/>');
        this.b4 = $('<button id="'+this.b4id+'" title="Show Statistics" type="button" class="btn btn-default icon-signal"/>');
        this.b5 = $('<button id="'+this.b5id+'" title="Run Up To Here" type="button" class="btn btn-default icon-forward"/>');
        var btngrp = $('<div class="btn-group profile-element" role="group" aria-label="..." style="align-content: center;width: 30%"></div>');

        btngrp.append(this.b1).append(this.b2).append(this.b5).append(this.b3).append(this.b4);

        var brk = $('<br>');
        var full = $('<div></div>');

        full.addClass('clear');
        output.addClass('profile-element');
        full.append(prompt).append(this.profileheading).append(btngrp).append(input).append(widget_area).append(output).append(visdiv);
        cell.append(full);

        this.element = cell;
        this.output_area = new IPython.OutputArea(output, true);
        this.completer = new IPython.Completer(this);

        var profile = this;
        this.b1.click(function(e){
            e.preventDefault();
            profile.settingsdialog.show_dialog(profile);
        });
        this.b2.click(function(e){
            e.preventDefault();
            IPython.notebook.execute_cell();

        });
        this.b3.click(function(e){
            e.preventDefault();
            profile.visudialog.show_dialog(profile);

        });
        this.b4.click(function(e){
            e.preventDefault();
            var table = $("#stat_table")[0];
            var tbody = table.children[1];
            var len = tbody.children.length;
            for(var i=0;i<len;i++){
                tbody.deleteRow();
            }
            if(!profile.profileData.fileNamePrefix){
                window.alert("File Name Prefix is unknown.");
            }else {
                tabulate(profile.profileData.fileNamePrefix);
            }

        });
        this.b5.click(function(e){
            IPython.notebook.execute_cells_above_and_me();

        });


    };

    /**
     * Set input prompt
     * @param prompt_value
     * @param lines_number
     * @returns {string}
     */
    Profile.input_prompt_classical = function (prompt_value, lines_number) {
        var ns;
        if (prompt_value === undefined) {
            ns = "&nbsp;";
        } else {
            ns = encodeURIComponent(prompt_value);
        }
        return 'Profile&nbsp;[' + ns + ']:';
    };

    /**
     * Load Profile from JSON file
     * @param data
     */
    Profile.prototype.fromJSON = function (data) {

        IPython.CodeCell.prototype.fromJSON.apply(this, arguments);
        this.gui_type = data.gui_type;
        this.profileData = data.profileData;

    };

    /**
     * Save profile to JSON file
     * @returns {*|string|Object}
     */
    Profile.prototype.toJSON = function () {
        var data = IPython.CodeCell.prototype.toJSON.apply(this);

        data.gui_type = this.gui_type;
        data.profileData = this.profileData;
        return data;
    };

    /**
     * class as a variable
     * @type {Function}
     */
    IPython.Profile = Profile;

    return IPython;
}(IPython));

///
