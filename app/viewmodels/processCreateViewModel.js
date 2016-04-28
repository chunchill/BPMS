
/**
 * Created by jasperchiu on 3/19/16.
 */
(function (BPMS, $, ko) {

   BPMS.ViewModels = BPMS.ViewModels || {};
   //登录页面viewmodel
   BPMS.ViewModels.ProcessCreateViewModel = function () {
      var keyValue = {};
      var loader = $.mobile.loading();
      var self = this;
      self.processDefinitionName = ko.observable();
      self.processDefinitionId = ko.observable();
      self.processInstanceId = ko.observable();
      self.processDescription = ko.observable();
      self.dynamicFormItems = ko.observableArray();
      self.errormsg = ko.observable();
      self.finish = function () {
         window.location.href = "processlist.html";
      };
      self.submit = function () {
         loader.show();
         var data = {
            processDefinitionId: self.processDefinitionId(),
            variables: []
         };
         ko.utils.arrayForEach(self.dynamicFormItems(), function (item) {
            var tempData = { "name": item.option.id, "value": item.value() };
            if (item.type == "bool" || item.type == "boolean") {
               for (var key in keyValue) {
                  if (tempData.name == keyValue[key]) {
                     tempData.name = key;
                  }
               }
            }
            data.variables.push(tempData);
         });
         BPMS.Services.RuntimeSvc.postProcessInstance(data).then(function (result) {
            self.processInstanceId(result.id);
            $("#popupsubmit").popup("open");
            loader.hide();
         }, function () {
            self.errormsg("提交数据出错了！");
            $("#popupMessage").popup("open");
            loader.hide();
         });
      };

      var data = localStorage.getItem("selectedProcessCreateViewModel");
      var selectInstance = JSON.parse(data);
      if (selectInstance) {
         loader.show();
         self.processDefinitionId(selectInstance.id);
         self.processDescription(selectInstance.description);
         self.processDefinitionName(selectInstance.name);

         BPMS.Services.ProcessDefinitionSvc.getProcessDefinitionProperties(selectInstance.id).then(function (result) {

            var properites = result.data;
            properites.forEach(function (item) {
               var itemToPush = BPMS.Services.Utils.handleUIControlItem(item, keyValue);
               self.dynamicFormItems.push(itemToPush);
            });
            loader.hide();
         },
             function () {
                self.errormsg("取数据出错了！");
                $("#popupMessage").popup("open");
                loader.hide();
             });
      } else {
         window.location.replace("home.html");
      }
   };

})(window.BPMS = window.BPMS || {}, jQuery, ko)
