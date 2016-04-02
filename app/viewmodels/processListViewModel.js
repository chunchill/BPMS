/**
 * Created by jasperchiu on 3/19/16.
 */
//kermit
(function (BPMS, $, ko) {

   BPMS.ViewModels = BPMS.ViewModels || {};
   BPMS.ViewModels.ProcessListViewModel = function () {
      var self = this;
      self.start = ko.observable(0);
      self.total = ko.observable(0);
      self.size = ko.observable(BPMS.config.pageSize);
      self.datasource = ko.observableArray();
      self.getCategory = function (url) {
         if (!url) return "";
         var i = url.lastIndexOf("/");
         if (i >= 0)
            return url[i + 1];
         return "";
      };
      self.hasPrev = ko.observable(false);
      self.hasNext = ko.observable(false);
      var bindRealData = function () {
         var option = {
            size: self.size(),
            start: self.start(),
            startableByUser: localStorage.getItem("bpms_userId"),
            suspended: false
         };
         BPMS.Services.ProcessDefinitionSvc.getProcessDefinitions(option).then(function (result) {
            self.datasource(result.data);
            self.total(result.total);
            self.hasPrev(self.start() > 0);
            self.hasNext(self.start() + self.size() < self.total());
         });
      };

      //mockdata
      //var mockData = [{//TODO:SHOULD BE COMMENTED OUT IF USE THE bindRealData function
      //    id:'myProcess:1:5012',
      //    description: '费用报销',
      //    name: 'F01',
      //    category: 'F'
      //},
      //    {
      //        id:'myProcess:1:5012',
      //        description: '出差请假',
      //        name: 'C01',
      //        category: 'H'
      //    },
      //    {
      //        id:'myProcess:1:5012',
      //        description: '数据维护',
      //        name: 'W01',
      //        category: 'M'
      //    }];
      self.init = function () {
         //self.start(0);
         //self.size(1);
         self.datasource([]);
         //var data = mockData.slice(self.start(), self.size());//TODO:SHOULD BE COMMENTED OUT IF USE THE bindRealData function
         //self.datasource(data);//TODO:SHOULD BE COMMENTED OUT IF USE THE bindRealData function

         bindRealData();

      };
      self.selectToCreate = function (data) {
         //selectedProcessInstanceViewModel.processInstanceId = data.id;
         //selectedProcessInstanceViewModel.processDescription = data.description;
         //selectedProcessInstanceViewModel.processDefinitionName = data.name;
         localStorage.setItem('selectedProcessInstanceViewModel', JSON.stringify(data));
         window.location.replace('processcreate.html');

      };

      self.nextPage = function () {
         if (self.hasNext()) {
            var currentIndex = self.start();
            self.start(currentIndex + self.size());
            //var data = mockData.slice(self.start(), self.start()+self.size());//TODO:SHOULD BE COMMENTED OUT IF USE THE bindRealData function
            //self.datasource(data);//TODO:SHOULD BE COMMENTED OUT IF USE THE bindRealData function
            bindRealData();
         }
      };

      self.previousPage = function () {
         var currentIndex = self.start();
         if (self.hasPrev()) {
            self.start(currentIndex - self.size());
            //var data = mockData.slice(self.start(), self.start()+self.size());//TODO:SHOULD BE COMMENTED OUT IF USE THE bindRealData function
            //self.datasource(data);//TODO:SHOULD BE COMMENTED OUT IF USE THE bindRealData function
            bindRealData();
         }

      };
      self.refresh = function () {
         //var data = mockData.slice(self.start(), self.start()+self.size());//TODO:SHOULD BE COMMENTED OUT IF USE THE bindRealData function
         //self.datasource(data);//TODO:SHOULD BE COMMENTED OUT IF USE THE bindRealData function
         bindRealData();
      };
   };
})(window.BPMS = window.BPMS || {}, jQuery, ko)
