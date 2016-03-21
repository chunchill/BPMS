/**
 * Created by jasperchiu on 3/19/16.
 */

(function (BPMS, $, ko) {

    BPMS.ViewModels = BPMS.ViewModels || {};
    BPMS.ViewModels.InstanceListViewModel = function () {


        var self = this;

        self.type = ko.observable();//all due critical closed
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
            var params= {
                "all": {},
                "due": {"dueBefore":null},
                "critical": {},
                "undo": {},
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



        ["all", "due", "critical", "closed"].forEach(
            function (item) {
                self[item] = new CreateTypeData();

            }
        );


    };

})(window.BPMS = window.BPMS || {}, jQuery, ko)
