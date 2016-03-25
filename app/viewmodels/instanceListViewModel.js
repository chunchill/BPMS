/**
 * Created by jasperchiu on 3/19/16.
 */


(function (BPMS, $, ko, moment) {
   BPMS.ViewModels = BPMS.ViewModels || {};
   //登录页面viewmodel
   BPMS.ViewModels.InstanceListViewModel = function () {

      var self = this;

      self.type = ko.observable();//all due critical close
      self.switchTab = function (currentType) {
         self.type(currentType);
         var page = self[currentType].pageIndex();
         if (!page) {
            self[currentType].pageIndex(1);
            self.getData();
         }
      };
      self.selectItem = function ($data) {
         localStorage.setItem("instance", JSON.stringify($data));
         var url = 'instancedetail.html?processInstanceId=' + $data.id + '&processDefinitionId=' + $data.processDefinitionId;
         window.location.href = url;
         return false;
      };
      self.init = function () {
         var type = BPMS.Services.Utils.getUrlParam(window.location.href, "type") || "all";
         $("a[href='#" + type + "']").click();
         self.type = ko.observable(type);
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
      self.formatDate = function (date) {
         if (!date) return "";
         return moment(date).format("YYYY-MM-DD");
      };

      self.formatTime = function (date) {
         if (!date) return "";
         return moment(date).format("HH:mm");
      };
      self.getData = function (callback) {

         var currentType = self.type();
         self[currentType].items.removeAll();
         var size = BPMS.config.pageSize;
         var page = self[currentType].pageIndex();
         var start = (page - 1) * size;

         var userId = localStorage.getItem("bpms_userId");
         var filters = {
            "all": { "involvedUser": userId },
            "due": { "involvedUser": userId/*, "dueBefore": moment().toISOString() */ },
            "critical": { "involvedUser": userId/*, "priority": 75 */ },
            "close": { "involvedUser": userId, "finished": true }
         };
         var param = { "start": start, "size": size };
         $.extend(param, filters[currentType]);
         var items;

         //  BPMS.Services.HistoryInstancesSvc = (function () {
         var getCategory = function (url) {
            if (!url) return "";
            var i = url.lastIndexOf("/");
            if (i >= 0)
               return url[i + 1];
            return "";
         };
         BPMS.Services.HistoryInstancesSvc.getProcessInstances(param)
               .then(function (result) {
                  //console.log(JSON.stringify(result));
                  items = result.data;
                  var pageCount = Math.floor((result.total - 1) / size) + 1;
                  self[currentType].pageCount(pageCount);
                  var requests = result.data.map(function (item) {
                     return BPMS.Services.Utils.restfulRequest('getProcess', item.processDefinitionUrl, {});
                  });
                  $.when.apply(this, requests).then(function () {
                     Array.prototype.forEach.call(arguments, function (item, index) {
                        if (item[0]) item = item[0];

                        if (typeof (item) != "object") return;

                        items[index].category = getCategory(item.category);
                        items[index].processName = item.name;
                        console.log(JSON.stringify(items[index]));
                        self[currentType].items.push(items[index]);

                        if (callback) callback();
                     });
                  });
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
      ["all", "due", "critical", "close"].forEach(
         function (item) {
            self[item] = new CreateTypeData();

         }
      );



   };

})(window.BPMS = window.BPMS || {}, jQuery, ko, moment)