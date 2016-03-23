(function (BPMS, $, ko, moment) {

   BPMS.ViewModels = BPMS.ViewModels || {};
   //登录页面viewmodel
   BPMS.ViewModels.TaskActionViewModel = function () {
      var writableFields = [];
      var keyValue = {};
      var self = this;
      self.userId = localStorage.getItem("bpms_userId");
      self.taskId = BPMS.Services.Utils.getUrlParam(window.location.href, "taskId");
      self.processInstanceId = BPMS.Services.Utils.getUrlParam(window.location.href, "processInstanceId");
      self.name = ko.observable();
      self.mappings = [];
      self.processDefinitionId = "";
      self.description = ko.observable();
      self.started = ko.observable(false);


      self.tasks = ko.observableArray();
      self.forms = ko.observableArray();
      self.flows = ko.observableArray();
      self.formatDateTime = function (dateTime) {
         if (!dateTime) return "";
         return moment(dateTime).format("YYYY-MM-DD HH:mm");
      };
      self.formatDate = function (dateTime) {
         if (!dateTime) return "";
         return moment(dateTime).format("YYYY-MM-DD");
      };
      self.formatTime = function (dateTime) {
         if (!dateTime) return "";
         return moment(dateTime).format("HH:mm");
      };
      self.bindFormData = function () {
         writableFields.forEach(
         function (item, index) {

            var formItem = {
               type: item.type,
               value: ko.observable(item.value),
               option: { name: item.name, id: item.id },
               enumValues: item.enumValues
            };
            if (formItem.type == "text") {
               formItem.option.data_clear_btn = true;
            }
            //jqm has a bug that id should be same as name for checkbox
            if (formItem.type == "bool" || formItem.type == "boolean") {
               keyValue[formItem.option.id] = formItem.option.name;
               formItem.option.id = formItem.option.name;
            }

            self.forms.push(formItem);
         });

      };
      //http://localhost:52548/BPMS/taskaction.html?taskId=5040&processInstanceId=5034  writable
      self.start = function () {
         BPMS.Services.RuntimeSvc.postTasks(self.taskId, {
            "action": "claim",
            "assignee": self.userId
         })
       .then(function () {
          self.bindFormData();
          self.started(true);
       }).then(function (r) {
          console.log(r);
       });
      };
      self.flow = {
         "decision": ko.observable(),
         "assignee": ko.observable(),
         "date": ko.observable(),
         "time": ko.observable(),
         "comment": ko.observable()
      };

      self.selectFlow = function ($data) {
         self.flow.decision($data.decision || "");
         self.flow.assignee($data.assignee || "");
         self.flow.date(self.formatDate($data.endTime));
         self.flow.time(self.formatTime($data.endTime));
         self.flow.comment($data.comment || "");
      };
      self.init = function () {

         self.tasks.removeAll();
         self.flows.removeAll();

         var data = localStorage.getItem("task");
         data = data && JSON.parse(data);
         if (!self.taskId || !self.processInstanceId
            || !data || !data.id || !data.processInstanceId
            || data.id != self.taskId || data.processInstanceId != self.processInstanceId) window.location.href = "home.html";

         self.name(data.name);
         self.processDefinitionId = data.processDefinitionId;
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

         self.description(data.description || "");

         self.taskId = BPMS.Services.Utils.getUrlParam(window.location.href, "taskId");
         BPMS.Services.FormSvc.getFormData({ /*"processDefinitionId": self.processDefinitionId */"taskId": self.taskId }).then(

            function (result) {
               if (result && result && result.formProperties)
                  result.formProperties.forEach(
                     function (item) {
                        if (!item.writable)
                           self.tasks.push(item);
                        else
                           writableFields.push(item);
                     }
                  );



            }
         );


         BPMS.Services.HistoryInstancesSvc.getVariableInstances({ "processInstanceId": self.processInstanceId })
            .then(function (result) {
               result.data.forEach(
                  function (item) {

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

         //form/form-data 动态表单的中文描述
      };
   };
})(window.BPMS = window.BPMS || {}, jQuery, ko, moment);
