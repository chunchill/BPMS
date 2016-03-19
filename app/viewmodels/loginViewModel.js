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
        self.errorMessage =ko.observable();

        self.login = function(){
            var username = self.username();
            var password = self.password();
            BPMN.Services.IndentitySvc.login({username:username,password:password})
                .then(function(data){
                    var token = BPMN.Services.Utils.getAuthToken(username,password);
                    window.localStorage.setItem("bpms_token",token);
                    window.localStorage.setItem("bpms_userId",username);
                    BPMN.Services.RuntimeSvc.getTasks().then(function(data){
                        alert(JSON.stringify(data));
                        window.location.replace('home.html');
                    },function(){
                        self.errorMessage('没有取到任务！');
                        $("#popupMessage").popup("open");

                    });

            },function(){
                    self.errorMessage('登录失败！');
                    $("#popupMessage").popup("open");

            });
        }
    }

})(window.BPMN = window.BPMN || {}, jQuery, ko)