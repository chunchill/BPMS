
/**
 * Created by jasperchiu on 3/19/16.
 */
(function (BPMS, $, ko) {

    BPMS.ViewModels = BPMS.ViewModels || {};
    //登录页面viewmodel
    BPMS.ViewModels.ProcessInstanceViewModel = function () {
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
            var data = {
                processDefinitionId: self.processDefinitionId(),
                variables: []
            };
            var data2 = {
                processDefinitionId: self.processDefinitionId(),
                variables: []
            };
            ko.utils.arrayForEach(self.dynamicFormItems(), function (item) {
                var _data = {};
                var _data2 = {};
                _data.name = item.option.id;
                _data2.name = item.option.id;
                _data.value = item.value();
                _data2.type = item.type;
                data.variables.push(_data);
                data2.variables.push(_data2);
            });
            BPMS.Services.RuntimeSvc.postProcessInstance(data).then(function (result) {
                self.processInstanceId(result.id);
                $("#popupsubmit").popup("open");
            }, function () {
                self.errormsg("提交数据出错了！");
                $("#popupMessage").popup("open");
            });
        };
        //selectedProcessInstanceViewModel.processInstanceId = data.id;
        //selectedProcessInstanceViewModel.processDescription = data.description;
        //selectedProcessInstanceViewModel.processDefinitionName = data.name;
        var data = localStorage.getItem("selectedProcessInstanceViewModel");
        var selectInstance = JSON.parse(data);
        if (selectInstance) {
            self.processDefinitionId(selectInstance.id);
            self.processDescription(selectInstance.description);
            self.processDefinitionName(selectInstance.name);

            BPMS.Services.ProcessDefinitionSvc.getProcessDefinitionProperties(selectInstance.id).then(function (result) {

                var properites = result.data;
                properites.forEach(function (item) {
                    var itemToPush = BPMS.Services.Utils.handleUIControlItem(item);
                    self.dynamicFormItems.push(itemToPush);
                });
                },
                function () {
                    self.errormsg("取数据出错了！");
                    $("#popupMessage").popup("open");

                });
        } else {
            window.location.replace("home.html");
        }
    };

})(window.BPMS = window.BPMS || {}, jQuery, ko)
