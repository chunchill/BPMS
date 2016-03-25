(function (BPMS, $, ko) {

   BPMS.ViewModels = BPMS.ViewModels || {};
   //登录页面viewmodel
   BPMS.ViewModels.InstanceDetailViewModel = function () {
      var self = this;
      self.userId = localStorage.getItem("bpms_userId");
      self.processInstanceId = BPMS.Services.Utils.getUrlParam(window.location.href, "processInstanceId");
      self.processDefinitionId = BPMS.Services.Utils.getUrlParam(window.location.href, "processDefinitionId");
      var data = localStorage.getItem("instance");
      data = data && JSON.parse(data);
      if (!self.processInstanceId || !self.processDefinitionId
         || !data || !data.id || !data.processDefinitionId
         || data.id != self.processInstanceId || data.processDefinitionId != self.processDefinitionId)
         window.location.href = "home.html";

      self.data = data;

      self.flows = ko.observableArray();
      self.tasks = ko.observableArray();

      self.flow = {
         "decision": ko.observable(),
         "assignee": ko.observable(),
         "date": ko.observable(),
         "time": ko.observable(),
         "comment": ko.observable()
      };

      self.formatDate = function (date) {
         if (!date) return "";
         return moment(date).format("YYYY-MM-DD");
      };

      self.formatTime = function (date) {
         if (!date) return "";
         return moment(date).format("HH:mm");
      };
      self.formatDateTime = function (dateTime) {
         if (!dateTime) return "";
         return moment(dateTime).format("YYYY-MM-DD HH:mm");
      };
      self.translateValue = function (value) {
         if (value == null || typeof (value) == "undefined")
            return "";
         if (value === "true")
            return "同意";
         if (value === "false")
            return "拒绝";

         if (typeof (value) == "boolean") return value ? "同意" : "拒绝";
         return value;
      };

      self.selectFlow = function ($data) {
         self.flow.decision($data.decision || "");
         self.flow.assignee($data.assignee || "");
         self.flow.date(self.formatDate($data.endTime));
         self.flow.time(self.formatTime($data.endTime));
         self.flow.comment($data.comment || "");
      };
      self.init = function () {

         self.flows.removeAll();
         self.tasks.removeAll();

         BPMS.Services.FormSvc.getFormData({ "processDefinitionId": self.processDefinitionId }).then(
          function (result) {
             if (result && result && result.formProperties)
                result.formProperties.forEach(
                   function (item) {
                      // if (!item.writable)
                      self.tasks.push(item);
                   }
                );
          });


         BPMS.Services.HistoryInstancesSvc.getActivityInstances({ "processInstanceId": self.processInstanceId })
            .then(function (result) {
               result.data.forEach(
                  function (item) {
                     self.flows.push(item);
                  });
            });



         BPMS.Services.HistoryInstancesSvc.getVariableInstances({ "processInstanceId": self.processInstanceId })
            .then(function (result) {
               result.data.forEach(
                  function (item) {

                  }
               );
            });


      }
   }
}

)(window.BPMS = window.BPMS || {}, jQuery, ko)
