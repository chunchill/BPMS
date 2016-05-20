
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
        self.tableItems = ko.observableArray();
        self.tableItem = {};
        self.tableData = { "headers": ko.observableArray(), "rows": ko.observableArray() };
        self.errormsg = ko.observable();
        self.finish = function () {
            window.location.href = "processlist.html";
        };
        self.appendData = function () {
            var index = self.tableData.rows().length + 1;
            var row = [];
            self.tableItems().forEach(function (item) {
                row.push(item.value());
            });
            row.push("delete");
            row.unshift(index);
            self.tableData.rows.push(row);
            self.tableWidget.refresh();
        };
        self.removeItem = function (row) {
            self.tableData.rows.remove(row);
            self.tableWidget.refresh();
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
        self.tableWidget = $.data($("#table")[0], "mobile-table");
        if (selectInstance) {
            loader.show();
            self.processDefinitionId(selectInstance.id);
            self.processDescription(selectInstance.description);
            self.processDefinitionName(selectInstance.name);

            BPMS.Services.ProcessDefinitionSvc.getProcessDefinitionProperties(selectInstance.id).then(function (result) {
                var getItemType = function (id) {
                    id = id.toLowerCase();
                    if (id.indexOf("_item") < 0)
                        return 1;
                    if (id.endsWith("_item"))
                        return 3;
                    return 2;
                };
                var properites = result.data;
                var tempItems = [];
                properites.forEach(function (item) {

                    var itemToPush = BPMS.Services.Utils.handleUIControlItem(item, keyValue);
                    var itemType = getItemType(itemToPush.option.id);
                    if (itemType == 1)
                        self.dynamicFormItems.push(itemToPush);
                    else if (itemType == 2)
                        tempItems.push(itemToPush);
                    else {
                        self.tableItem = itemToPush;
                    }

                });
                tempItems.sort(function (a, b) {
                    return a.option.id > b.option.id;
                });
                self.tableData.headers.push("序号");
                tempItems.forEach(function (item) {
                    if (item.option.id.toLowerCase().indexOf(self.tableItem.option.id.toLowerCase()) == 0) {
                        item.writable = item.writable && self.tableItem.writable;
                        self.tableData.headers.push(item.option.name);
                        self.tableItems.push(item);
                    }
                });
                self.tableData.headers.push("操作");
                self.tableWidget.refresh();
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
