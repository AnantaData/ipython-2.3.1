//----------------------------------------------------------------------------
//  Copyright (C) 2015  The Ananta Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// Unsupervised Mining Profile
//============================================================================

var IPython = (function (IPython) {

    /**
     * The constructor of Unsupervised Mining Profile
     * @param kernel
     * @param options
     * @constructor
     */
    var UMProfile = function (kernel, options) {

        IPython.Profile.apply(this, [kernel,options]);

        this.gui_type = 'ump';
        this.profileData = {
            algorithm: ""

        };

        //this.profileData.visuData.datafile = this.profileData.fileNamePrefix+"somout.csv"

        //Dialog for profile settings
        this.settingsdialog = new IPython.UmpDialog(this.cell_id);
        this.visudialog = new IPython.UnVisuDialog(this.cell_id,"somout.csv");


        //set the input code according to the profile data
        this.set_text(this.setCode(this.profileData));

    };

    /**
     * Unsupervised Mining profile is extended from Profile class
     * @type {IPython.Profile}
     */
    UMProfile.prototype = new IPython.Profile();

    /**
     * The additional elements to profile element
     */
    UMProfile.prototype.create_element = function () {
        IPython.Profile.prototype.create_element.apply(this, arguments);

        this.profileheading.text('Unsupervised Miner');
        this.profileheading[0].style.color="#0B615E";
    };

    /**
     * Unsupervised Mining code is set here
     * @param profileData
     * @returns {string}
     */
    UMProfile.prototype.setCode = function (profileData) {


        var alg = "";
        var scheme="MapEvalStep()";
        algorithm = profileData.algorithm;
        //alert(profileData.algorithm)
        if (algorithm == 'kgsom') {
            alg = 'KGSOMStep(np.array(projects.data).shape[1])';
        }
        else if (algorithm == 'gsom') {
            alg = 'GSOMStep(np.array(projects.data).shape[1])';
        }
        else if (algorithm == 'kmeans') {
            alg = 'KmeanStep('+profileData.kv+')';
            scheme='KMeanEvalStep()'
        }
        var code = 'from ananta_base.base import *' +
            '\nfrom ananta_base.mining import unsupervised_mining as um' +
            '\nimport numpy as np' +
            '\nump1 = um.UnsupervisedMiningProfile()' +
            '\ns1= um.' + alg + '' +
            '\ns2=um.'+scheme +
            '\nump1.addStep(s1)' +
            '\nump1.addStep(s2)' +
            '\nump1.execute(projects)' +
                //'\ndf = projects.data.describe()' +
            '\ndf = projects.data' +
            '\nprint df.shape' +
            '\ndf.tofile("a.csv", sep=",")' +
            '';
        return code;

    }

    /**
     * class as a variable
     * @type {Function}
     */
    IPython.UMProfile = UMProfile;

    return IPython;
}(IPython));

