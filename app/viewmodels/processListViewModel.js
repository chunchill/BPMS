/**
 * Created by jasperchiu on 3/19/16.
 */
(function (BPMN, $, ko) {

    BPMN.ViewModels = BPMN.ViewModels || {};
    BPMN.ViewModels.ProcessListViewModel = function () {
        var self = this;
        self.start = ko.observable(0);
        self.size = ko.observable(1);
        self.datasource = ko.observableArray();


        //mockdata
        var mockData = [{
            description: '费用报销',
            name: 'F01',
            category: 'F'
        },
            {
                description: '出差请假',
                name: 'C01',
                category: 'H'
            },
            {
                description: '数据维护',
                name: 'W01',
                category: 'M'
            }];
        self.init = function () {
            self.start(0);
            self.size(1);
            self.datasource([]);
            var data = mockData.slice(self.start(), self.size());
            self.datasource(data);
        },

            self.nextPage = function () {
                if (self.datasource().length > 0) {
                    var currentIndex = self.start();
                    self.start(currentIndex + self.size());
                    var data = mockData.slice(self.start(), self.start()+self.size());
                    self.datasource(data);
                }
            },

            self.previousPage = function () {
                var currentIndex = self.start();
                if (currentIndex > 0) {
                    self.start(currentIndex - self.size());
                    var data = mockData.slice(self.start(), self.start()+self.size());
                    self.datasource(data);
                }

            },
            self.refresh = function(){
                var currentIndex = self.start();
                var data = mockData.slice(self.start(), self.start()+self.size());
                self.datasource(data);
            }

    }

})(window.BPMN = window.BPMN || {}, jQuery, ko)