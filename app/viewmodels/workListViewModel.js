
(function (BPMS, $, ko) {

   BPMS.ViewModels = BPMS.ViewModels || {};
   //登录页面viewmodel
   BPMS.ViewModels.WorkListViewModel = function () {

      var self = this;
      self.type = ko.observable("all");//all due critical undo
      self.viewItem = function (id) {


      };
      self.refresh = function () {
         var type = self.type();
         var list = self[type + "List"];
         list.removeAll();
         taskServices.eoQuickSearch(type).then(function (result) {
            if (!result.errorMessage || result.errorMessage == "OK") {
               result.forEach(
                   function (item) {
                      list.push(item);
                   }
               );
            }
         });

      };
      self.total = ko.observable();

      self.allList = ko.observableArray();
      self.allList.push({ "key": 1, "desc": "出差报销", "date": "2014-02-16", "time": "14:03", "name": "邵剑秋" });
      self.allList.push({ "key": 2, "desc": "采购审批", "date": "2014-11-17", "time": "08:55", "name": "小明" });
      self.allList.push({ "key": 3, "desc": "请假申请", "date": "2015-03-04", "time": "02:44", "name": "小张" });
      self.allList.push({ "key": 4, "desc": "预定会场", "date": "2016-01-22", "time": "18:33", "name": "小林" });
      self.dueList = ko.observableArray();
      self.criticalList = ko.observableArray();
      self.undoList = ko.observableArray();
   };

})(window.BPMS = window.BPMS || {}, jQuery, ko)