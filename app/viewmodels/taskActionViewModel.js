(function (BPMS, $, ko) {

   BPMS.ViewModels = BPMS.ViewModels || {};
   //登录页面viewmodel
   BPMS.ViewModels.TaskActionViewModel = function() {
      var self = this;
      self.taskId = BPMS.Services.Utils.getUrlParam(window.location.href, "taskId");
      self.processInstanceId = BPMS.Services.Utils.getUrlParam(window.location.href, "processInstanceId");
      self.name = ko.observable();
      self.description = ko.observable();
      self.tasks = ko.observableArray();
      self.flows = ko.observableArray();
      self.init = function() {
         var data = localStorage.getItem("task");
         data = data && JSON.parse(data);
         if (!self.taskId || !self.processInstanceId
            || !data || !data.id || !data.processInstanceId
            || data.id != self.taskId || data.processInstanceId != self.processInstanceId) window.location.href = "home.html";

         self.name(data.name);

         self.description(data.description || "");
         BPMS.Services.HistoryInstancesSvc.getVariableInstances({ "processInstanceId": self.processInstanceId })
            .then(function(result) {
               result.data.forEach(
                  function(item) {
                     self.tasks.push(item);

                  }
               );

            });
         BPMS.Services.HistoryInstancesSvc.getActivityInstances({ "processInstanceId": self.processInstanceId })
            .then(function(result) {
               console.log(result);
               result.data.forEach(
                  function(item) {
                     self.flows.push(item);
                  });
            });
      };
   };
})(window.BPMS = window.BPMS || {}, jQuery, ko);
