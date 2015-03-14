//----------------------------------------------------------------------------
//  Copyright (C) 2015  The Ananta Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// Data Transformation Profile
//============================================================================

var IPython = (function (IPython) {

    /**
     * The constructor of Data transformation Profile
     * @param kernel
     * @param options
     * @constructor
     */
    var DTProfile = function (kernel, options) {

        IPython.Profile.apply(this,[kernel,options]);

        this.gui_type = 'dtp';
        this.profileData = {
            steps :[],
            fileNamePrefix:this.cell_id,
            visuData:{
                datafile:"",
                statfile:"",
                graphs:[]
            }
        };
        this.fields = "";
        this.profileData.visuData.datafile = this.profileData.fileNamePrefix+"data.csv"
        this.profileData.visuData.statfile = this.profileData.fileNamePrefix+"stat.csv"

        //Dialog for profile settings
        this.settingsdialog = new IPython.DtpDialog(this.cell_id);

        //set the input code according to the profile data
        this.set_text(this.setCode(this.profileData));

    };

    /**
     * Data transformation profile is extended from Profile class
     * @type {IPython.Profile}
     */
    DTProfile.prototype = new IPython.Profile();

    /**
     * The additional elements to profile element
     */
    DTProfile.prototype.create_element = function () {
        IPython.Profile.prototype.create_element.apply(this, arguments);

        this.profileheading.text('Data Transformer');
        this.profileheading[0].style.color="#610B4B";
    };

    /**
     * Data transformation code is set here
     * @param profileData
     * @returns {string}
     */
    DTProfile.prototype.setCode = function(profileData) {
        var code =
            '\nfrom ananta_base.data_transformation import DataTransformationProfile, LabelEncodingStep, BinningStep' +
            '\nfrom ananta_base.data_set import TrainingSet' +
            '\nimport ananta_base.data_stat as stat' +

            '\ndtp = DataTransformationProfile()';
        var stepCode = "";
        for(var i=0;i<profileData.steps.length;i++){
            stepCode+=this.addStepCode(profileData.steps[i]);
        }
        var endcode =
            '\ndtp.execute(projects)' +
            '\nstat.getStatistics(projects,"'+profileData.fileNamePrefix+'")' +
            '\nprint "Profile Successfully Executed"' ;

        code  = code+stepCode+endcode;
        return code;
    };

    /**
     * Data transformation steps added to code
     * @param stepData
     * @returns {string}
     */
    DTProfile.prototype.addStepCode = function(stepData){
        var stepType;
        if(stepData.step_type == 'labelEn'){
            stepType = 'LabelEncodingStep';
            var stepName = 'step'+stepData.step_no;
            var fields = '[';
            for(var i=0;i<stepData.fields.length;i++){
                if(i!=0){
                    fields +=','
                }
                fields += '"'+stepData.fields[i]+'"';

            }
            fields +="]";
            var code =
                '\n'+stepName+' = '+stepType+'('+fields+')' +
                '\ndtp.addStep('+stepName+')';
        }
        if(stepData.step_type == 'binning'){
            stepType = 'BinningStep';
            var stepName = 'step'+stepData.step_no;
            var fields = '[';
            for(var i=0;i<stepData.fields.length;i++){
                if(i!=0){
                    fields +=','
                }
                fields += '"'+stepData.fields[i]+'"';

            }
            fields +="]";
            var code =
                '\n'+stepName+' = '+stepType+'('+fields+')' +
                '\ndtp.addStep('+stepName+')';
        }

        return code;
    };

    /**
     * class as a variable
     * @type {Function}
     */
    IPython.DTProfile = DTProfile;

    return IPython;
}(IPython));

///