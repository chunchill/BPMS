(function (BPMS, $, ko) {

   BPMS.ViewModels = BPMS.ViewModels || {};
   //登录页面viewmodel
   BPMS.ViewModels.InstanceDetailViewModel = function () {
      var self = this;
      self.userId = localStorage.getItem("bpms_userId");
      self.processInstanceId = BPMS.Services.Utils.getUrlParam(window.location.href, "processInstanceId");
      self.processDefinitionId = BPMS.Services.Utils.getUrlParam(window.location.href, "processDefinitionId");
      console.log(self.processInstanceId);
      console.log(self.processDefinitionId);
      var data = localStorage.getItem("instance");
      console.log(data);
      data = data && JSON.parse(data);
      if (!self.processInstanceId || !self.processDefinitionId
         || !data || !data.id || !data.processDefinitionId
         || data.id != self.processInstanceId || data.processDefinitionId != self.processDefinitionId)
         window.location.href = "home.html";

      self.data = data;

      self.flows = ko.observableArray();

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

      self.selectFlow = function ($data) {
         self.flow.decision($data.decision || "");
         self.flow.assignee($data.assignee || "");
         self.flow.date(self.formatDate($data.endTime));
         self.flow.time(self.formatTime($data.endTime));
         self.flow.comment($data.comment || "");
      };
      self.init = function () {

         self.flows.removeAll();
      }
   };

})(window.BPMS = window.BPMS || {}, jQuery, ko)
