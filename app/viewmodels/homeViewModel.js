(function (BPMS, $, ko) {

   BPMS.ViewModels = BPMS.ViewModels || {};
   BPMS.ViewModels.HomeViewModel = function () {
      var loader = $.mobile.loading();
      loader.show();
      var self = this;
      this.processNumber = ko.observable();
      this.allTaskNumber = ko.observable();
      this.normalTaskNumber = ko.observable();
      this.warningTaskNumber = ko.observable();
      var userId = localStorage.getItem("bpms_userId");
      this.userId = userId;
      this.getSummary = function () {

         BPMS.Services.RuntimeSvc.getTasks({ "candidateUser": userId, "active": true })
            .then(function (result) {
               var all = result.total;
               var normal = result.data.filter(
                function (item) {
                   return item && item.dueDate && moment(item.dueDate) >= moment();
                }
                ).length;

               var warning = result.data.filter(
                function (item) {
                   return item && item.dueDate && moment(item.dueDate) < moment();
                }
                ).length;

               self.allTaskNumber(all);
               self.normalTaskNumber(normal);
               self.warningTaskNumber(warning);
            });
         
         BPMS.Services.RuntimeSvc.getProcessInstances({ "involvedUser": userId })
      .then(function (result) {
         self.processNumber(result.total);
         loader.hide();
      });
      };
   };
})(window.BPMS = window.BPMS || {}, jQuery, ko)