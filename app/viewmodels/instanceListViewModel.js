
/**
 * Created by jasperchiu on 3/19/16.
 */
(function(BPMS,$,ko){

    BPMS.ViewModels = BPMS.ViewModels || {};
    //登录页面viewmodel
    BPMS.ViewModels.DemoViewModel = function(){
        var self = this;
        self.total = ko.observable();
        self.size = ko.observable();
        BPMS.Services.IndentitySvc.login().then(function(data){

            console.log(JSON.stringify(data));
                self.total(data.total);
                self.size(data.size);

        })


    }

})(window.BPMS = window.BPMS || {}, jQuery, ko)