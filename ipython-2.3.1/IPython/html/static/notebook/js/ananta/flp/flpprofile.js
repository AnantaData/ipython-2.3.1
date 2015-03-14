//----------------------------------------------------------------------------
//  Copyright (C) 2015  The Ananta Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// File Loading Profile
//============================================================================

var IPython = (function (IPython) {

    /**
     * The constructor of File Loading Profile
     * @param kernel
     * @param options
     * @constructor
     */

    var FLProfile = function (kernel, options) {

        //Inherit from Profile class
        IPython.Profile.apply(this, [kernel,options]);

        //FLProfile specific data
        this.gui_type = 'flp';
        this.profileData = {
            fileName :"",
            fileType :"",
            fileLoc : "",
            fileNamePrefix:this.cell_id,
            visuData:{
                datafile:"",
                statfile:"",
                graphs:[]
            }
        };
        this.profileData.visuData.datafile = this.profileData.fileNamePrefix+"data.csv"
        this.profileData.visuData.statfile = this.profileData.fileNamePrefix+"stat.csv"
        //Dialog for profile settings
        this.settingsdialog = new IPython.FlpDialog(this.cell_id);

        //set the input code according to the profile data
        this.set_text(this.setCode(this.profileData));

    };

    /**
     * File Loading profile is extended from Profile class
     * @type {IPython.Profile}
     */
    FLProfile.prototype = new IPython.Profile();

    /**
     * The additional elements to profile element
     */
    FLProfile.prototype.create_element = function () {
        IPython.Profile.prototype.create_element.apply(this, arguments);

        this.profileheading.text('File Loader');
        this.profileheading[0].style.color="#B404AE";

    };

    /**
     * File Loading code is set here
     * @param profileData
     * @returns {string}
     */
    FLProfile.prototype.setCode = function(profileData){
        var imports =
            '\nfrom ananta_base.data_io import FileLoadingProfile, FileLoadStep' +
            '\nfrom ananta_base.data_set import TrainingSet' +
            '\nimport ananta_base.data_stat as stat';
        var code =
            '\nprojects = TrainingSet()' +
            '\nflp1 = FileLoadingProfile()' +
            '\ns1 = FileLoadStep("' + profileData.fileType + '", "' + profileData.fileLoc+profileData.fileName + '")' +
            '\nflp1.addStep(s1)' +
            '\nflp1.execute(projects)' +
            '\nstat.getStatistics(projects,"'+profileData.fileNamePrefix+'")' +
            '\nprint "Profile Successfully Executed"' ;

        return imports+code;
    }

    /**
     * class as a variable
     * @type {Function}
     */
    IPython.FLProfile = FLProfile;

    return IPython;
}(IPython));
