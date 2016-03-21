(function (BPMS, $, ko) {

   BPMS.ViewModels = BPMS.ViewModels || {};
   //登录页面viewmodel
   BPMS.ViewModels.TaskActionViewModel = function () {
      var self = this;
      self.taskId = BPMS.Services.Utils.getUrlParam(window.location.href, "taskId");
      self.processInstanceId = BPMS.Services.Utils.getUrlParam(window.location.href, "processInstanceId");
      self.init = function () {
         if (!self.taskId || !self.processInstanceId) window.location.href = "home.html";
         BPMS.Services.HistoryInstancesSvc.getVariableInstances({ "processInstanceId": self.processInstanceId })
            .then(function (result) {
               console.log(result);
            });
      };

   };

})(window.BPMS = window.BPMS || {}, jQuery, ko)
