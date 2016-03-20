(function (BPMS, $, ko) {

   BPMS.ViewModels = BPMS.ViewModels || {};
   BPMS.ViewModels.HomeViewModel = function () {
      var self = this;
      this.processNumber = ko.observable();
      this.allTaskNumber = ko.observable();
      this.normalTaskNumber = ko.observable();
      this.warningTaskNumber = ko.observable();
      var userId = localStorage.getItem("bpms_userId");

      this.getSummary = function () {

         BPMS.Services.RuntimeSvc.getTasks({ "candidateUser": userId, "active": true })
            .then(function (result) {
               var all = result.total;
               var normal = result.data.filter(
                function (item) {
                   return !item.dueDate || moment(item.dueDate) >= moment();
                }
                ).length;
               self.allTaskNumber(all);
               self.normalTaskNumber(normal);
               self.warningTaskNumber(all - normal);
            });
         BPMS.Services.RuntimeSvc.getProcessInstances({ "involvedUser": userId })
      .then(function (result) {
         self.processNumber(result.total);
      });
      };
   };
})(window.BPMS = window.BPMS || {}, jQuery, ko)