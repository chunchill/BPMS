/**
 * Created by jasperchiu on 3/19/16.
 */
/**
 * Created by jasperchiu on 3/19/16.
 */
(function (BPMS, $, ko) {

   BPMS.ViewModels = BPMS.ViewModels || {};
   //登录页面viewmodel
   BPMS.ViewModels.LoginViewModel = function () {
      var self = this;
      self.username = ko.observable();
      self.password = ko.observable();
      self.errorMessage = ko.observable();

      self.login = function () {
         var username = self.username();
         var password = self.password();
         BPMS.Services.IndentitySvc.login({ username: username, password: password })
            .then(function (data) {
               var token = BPMS.Services.Utils.getAuthToken(username, password);
               window.localStorage.setItem("bpms_token", token);
               window.localStorage.setItem("bpms_userId", username);
               BPMS.Services.RuntimeSvc.getTasks().then(function (data) {
                  //alert(JSON.stringify(data));
                  window.location.replace('home.html');
               }, function (a, b, c) {
                  var message = JSON.stringify(a) + ";" + JSON.stringify(b) + ";" + JSON.stringify(c);
                  alert(message);
                  localStorage.removeItem("bpms_token");
                  localStorage.removeItem("bpms_userId");
                  self.errorMessage('没有取到任务！');
                  $("#popupMessage").popup("open");
               });

            }, function (a, b, c) {
               var message = JSON.stringify(a) + ";" + JSON.stringify(b) + ";" + JSON.stringify(c);
               alert(message);
               localStorage.removeItem("bpms_token");
               localStorage.removeItem("bpms_userId");
               self.errorMessage('登录失败！');
               $("#popupMessage").popup("open");

            });
      };
   };

})(window.BPMS = window.BPMS || {}, jQuery, ko)