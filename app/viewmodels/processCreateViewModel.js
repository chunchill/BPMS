
/**
 * Created by jasperchiu on 3/19/16.
 */
(function(BPMS,$,ko){

    BPMS.ViewModels = BPMS.ViewModels || {};
    //登录页面viewmodel
    BPMS.ViewModels.ProcessInstanceViewModel = function(){
        var self = this;
        self.processDefinitionName = ko.observable();
        self.processDefinitionId = ko.observable();
        self.processDescription =ko.observable();
        self.dynamicFormItems = ko.observableArray();


    }

})(window.BPMS = window.BPMS || {}, jQuery, ko)
