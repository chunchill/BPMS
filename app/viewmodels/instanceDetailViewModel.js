
/**
 * Created by jasperchiu on 3/19/16.
 */
(function(BPMN,$,ko){

    BPMN.ViewModels = BPMN.ViewModels || {};
    //登录页面viewmodel
    BPMN.ViewModels.DemoViewModel = function(){
        var self = this;
        self.total = ko.observable();
        self.size = ko.observable();
        BPMN.Services.IndentitySvc.login().then(function(data){

            console.log(JSON.stringify(data));
                self.total(data.total);
                self.size(data.size);

        })


    }

})(window.BPMN = window.BPMN || {}, jQuery, ko)