
(function (BPMS, $, ko) {

   BPMS.ViewModels = BPMS.ViewModels || {};
   //登录页面viewmodel
   BPMS.ViewModels.WorkListViewModel = function () {

      var self = this;
      var type = BPMS.Services.Utils.getUrlParam(window.location.href, "type") || "all";

      self.type = ko.observable(type);//all due critical undo
      self.viewItem = function (data, e) {

      };
      self.switchTab = function (data, e) {

         var currentType = $(e.target).attr("href").substring(1);
         self.type(currentType);
         var page = self[currentType + "Page"]();
         if (!page) {
            self[currentType + "Page"](1);
            self.getData();
         }


      };
      self.getData = function () {
         var currentType = self.type();
         var list = self[currentType + "List"];
         list.removeAll();
         var page = self[currentType + "Page"];
         var userId = localStorage.getItem("bpms_userId");

         BPMS.Services.RuntimeSvc.getTasks({ "candidateUser": userId, "active": true })
            .then(function (result) {
               console.log(result);
            });
      };


      self.refresh = function () {



      };


      //self.allList.push({ "key": 1, "desc": "出差报销", "date": "2014-02-16", "time": "14:03", "name": "邵剑秋" });
      //self.allList.push({ "key": 2, "desc": "采购审批", "date": "2014-11-17", "time": "08:55", "name": "小明" });
      //self.allList.push({ "key": 3, "desc": "请假申请", "date": "2015-03-04", "time": "02:44", "name": "小张" });
      //self.allList.push({ "key": 4, "desc": "预定会场", "date": "2016-01-22", "time": "18:33", "name": "小林" });
      self.allList = ko.observableArray();
      self.dueList = ko.observableArray();
      self.criticalList = ko.observableArray();
      self.undoList = ko.observableArray();
      self.allPage = ko.observable();
      self.duePage = ko.observable();
      self.criticalPage = ko.observable();
      self.undoPage = ko.observable();
   };

})(window.BPMS = window.BPMS || {}, jQuery, ko)