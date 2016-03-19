/**
 * Created by jasperchiu on 3/19/16.
 */
/**
 * Created by jasperchiu on 3/19/16.
 */
(function(BPMN,$,ko){

    BPMN.ViewModels = BPMN.ViewModels || {};
    //登录页面viewmodel
    BPMN.ViewModels.LoginViewModel = function(){
        var self = this;
        self.username = ko.observable();
        self.password = ko.observable();
    }

})(window.BPMN = window.BPMN || {}, jQuery, ko)