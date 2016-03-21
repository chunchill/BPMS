
(function (BPMS, $, ko) {
   var pageSize = BPMS.config.pageSize;
   BPMS.ViewModels = BPMS.ViewModels || {};
   //登录页面viewmodel
   BPMS.ViewModels.WorkListViewModel = function () {

      var self = this;

      self.type = ko.observable();//all due critical undo
      self.viewItem = function (data, e) {

      };
      self.switchTab = function (currentType) {
         self.type(currentType);
         var page = self[currentType].pageIndex();
         if (!page) {
            self[currentType].pageIndex(1);
            self.getData();
         }


      };
      self.init = function () {
         var type = BPMS.Services.Utils.getUrlParam(window.location.href, "type") || "all";
         $("a[href='#" + type + "']").click();
         self.type = ko.observable(type);//all due critical undo
      };
      self.getPrev = function () {
         var currentType = self.type();
         var index = self[currentType].pageIndex();
         if (self[currentType].hasPrev()) {
            self[currentType].pageIndex(index - 1);
            self.getData();
         }
      };
      self.getNext = function () {
         var currentType = self.type();
         var index = self[currentType].pageIndex();
         if (self[currentType].hasNext()) {
            self[currentType].pageIndex(index + 1);
            self.getData();
         }
      };
      self.getData = function () {
         var params = {
            "all": {},
            "due": { "dueBefore": moment().toISOString() },
            "critical": { "priority": 75 },
            "undo": {}
         }
         var currentType = self.type();
         var list = self[currentType].items;
         list.removeAll();

         var page = self[currentType].pageIndex();
         var userId = localStorage.getItem("bpms_userId");

         BPMS.Services.RuntimeSvc.getTasks({ "candidateUser": userId, "active": true })
            .then(function (result) {
               console.log(result);
            });
      };


      var CreateTypeData = function () {

         this.items = ko.observableArray();
         this.pageIndex = ko.observable(0);
         this.pageCount = ko.observable(0);


         this.hasPrev = ko.computed(function () {
            return this.pageIndex() > 1;
         }, this);

         this.hasNext = ko.computed(function () {
            return this.pageIndex() < this.pageCount();
         }, this);
      };


      //self.allList.push({ "key": 1, "desc": "出差报销", "date": "2014-02-16", "time": "14:03", "name": "邵剑秋" });
      //self.allList.push({ "key": 2, "desc": "采购审批", "date": "2014-11-17", "time": "08:55", "name": "小明" });
      //self.allList.push({ "key": 3, "desc": "请假申请", "date": "2015-03-04", "time": "02:44", "name": "小张" });
      //self.allList.push({ "key": 4, "desc": "预定会场", "date": "2016-01-22", "time": "18:33", "name": "小林" });
      ["all", "due", "critical", "undo"].forEach(
         function (item) {
            self[item] = new CreateTypeData();

         }
      );



   };

})(window.BPMS = window.BPMS || {}, jQuery, ko)