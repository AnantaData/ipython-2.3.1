//----------------------------------------------------------------------------
//  Copyright (C) 2015  The Ananta Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// Data Cleaning Profile
//============================================================================

var IPython = (function (IPython) {

    /**
     * The constructor of Data Cleaninf profile
     * @param kernel
     * @param options
     * @constructor
     */
    var DCProfile = function (kernel, options) {

        //Inherit from Profile class
        IPython.Profile.apply(this,[kernel,options]);

        //DCProfile specific data
        this.gui_type = 'dcp';
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
        this.settingsdialog = new IPython.DcpDialog(this.cell_id);

        //set the input code according to the profile data
        this.set_text(this.setCode(this.profileData));

    };

    /**
     * File Loading profile is extended from Profile class
     * @type {IPython.Profile}
     */
    DCProfile.prototype = new IPython.Profile();

    /**
     * The additional elements to profile element
     */
    DCProfile.prototype.create_element = function () {
        IPython.Profile.prototype.create_element.apply(this, arguments);

        this.profileheading.text('Data Cleaner');
        this.profileheading[0].style.color="#610B4B";

    };

    /**
     * Data Cleaning code is set here
     * @param profileData
     * @returns {string}
     */
    DCProfile.prototype.setCode = function(profileData){
        var code = 'from ananta_base.base import *' +
            '\nfrom ananta_base.data_cleaning_pan import DataCleaningProfile, UseGlobalConstantStep, IgnoreTupleStep, UseAttributeMeanStep, UseAttributeModeStep, UseAttributeMedianStep' +
            '\nfrom ananta_base.data_io import FileLoadingProfile, FileLoadStep' +
            '\nfrom ananta_base.data_preparing import DataPreparingProfile, DataSortStep, DataSelectStep' +
            '\nfrom ananta_base.data_set import TrainingSet' +
            '\nfrom ananta_base.data_transformation import DataTransformationProfile, LabelEncodingStep, BinningStep' +
            '\nimport ananta_base.data_stat as stat' +

            '\ndcp = DataCleaningProfile()';
        var stepCode = "";
        for(var i=0;i<profileData.steps.length;i++){
            stepCode+=this.addStepCode(profileData.steps[i]);
        }
        var endcode =
            '\ndcp.execute(projects)' +
            '\nstat.getStatistics(projects,"'+profileData.fileNamePrefix+'")' +
            '\nprint "Profile Successfully Executed"' ;

        code  = code+stepCode+endcode;
        return code;
    };

    /**
     * Data cleaning steps added to code
     * @param stepData
     * @returns {string}
     */
    DCProfile.prototype.addStepCode = function(stepData){
        var stepType;
        if(stepData.step_type == 'ignTupl'){
            stepType = 'IgnoreTupleStep';
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
                '\ndcp.addStep('+stepName+')';
        }
        if(stepData.step_type == 'gblCnst'){
            stepType = 'UseGlobalConstantStep';
            var stepName = 'step'+stepData.step_no;
            var fields = '[';
            var consts = '[';
            for(var i=0;i<stepData.fields.length;i++){
                if(i!=0){
                    fields +=','
                    consts +=','
                }
                fields += '"'+stepData.fields[i]+'"';
                consts += stepData.global_const;
            }
            fields +="]";
            consts +="]";
            var code =
                '\n'+stepName+' = '+stepType+'('+consts+','+fields+')' +
                '\ndcp.addStep('+stepName+')';
        }
        if(stepData.step_type == 'atrMean'){
            stepType = 'UseAttributeMeanStep';
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
                '\ndcp.addStep('+stepName+')';
        }

        if(stepData.step_type == 'atrMode'){
            stepType = 'UseAttributeModeStep';
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
                '\ndcp.addStep('+stepName+')';
        }
        if(stepData.step_type == 'atrMedn'){
            stepType = 'UseAttributeMedianStep';
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
                '\ndcp.addStep('+stepName+')';
        }

        return code;
    };

    /**
     * class as a variable
     * @type {Function}
     */
    IPython.DCProfile = DCProfile;

    return IPython;
}(IPython));

////