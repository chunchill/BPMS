/**
 * Created by jasperchiu on 3/19/16.
 */

(function (BPMS, $, ko) {

    BPMS.ViewModels = BPMS.ViewModels || {};
    BPMS.ViewModels.ProcessListViewModel = function () {
        var self = this;
        self.start = ko.observable(0);
        self.size = ko.observable(1);
        self.datasource = ko.observableArray();

        var bindRealData = function(){
            var option = {size:self.size(),start:self.start(),startableByUser:'admin'};
            BPMS.Services.ProcessDefinitionSvc.getProcessDefinitions(option).then(function (result) {
                self.datasource(result.data);
            })
        }
        //mockdata
        var mockData = [{//TODO:SHOULD BE COMMENTED OUT IF USE THE bindRealData function
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
            var data = mockData.slice(self.start(), self.size());//TODO:SHOULD BE COMMENTED OUT IF USE THE bindRealData function
            self.datasource(data);//TODO:SHOULD BE COMMENTED OUT IF USE THE bindRealData function
            /*
             bindRealData();
            */
        },
            disableNextPageButton = function () {
                if(!$("#btnNext").hasClass('ui-disabled'))
                    $("#btnNext").addClass('ui-disabled')
                if($("#btnPre").hasClass('ui-disabled')){
                    $("#btnPre").removeClass('ui-disabled');
                }
            },
            disablePreviousButton = function() {
                if (!$("#btnPre").hasClass('ui-disabled'))
                    $("#btnPre").addClass('ui-disabled')
                if ($("#btnNext").hasClass('ui-disabled')) {
                    $("#btnNext").removeClass('ui-disabled');
                }
            },

            self.nextPage = function (data,event) {

                if (self.datasource().length > 0) {
                    var currentIndex = self.start();
                    self.start(currentIndex + self.size());
                    var data = mockData.slice(self.start(), self.start()+self.size());//TODO:SHOULD BE COMMENTED OUT IF USE THE bindRealData function
                    self.datasource(data);//TODO:SHOULD BE COMMENTED OUT IF USE THE bindRealData function

                    /*
                     bindRealData();
                     */
                }else{
                    disableNextPageButton();
                }
            },

            self.previousPage = function (data,event)  {
                var currentIndex = self.start();
                if (currentIndex > 0) {
                    self.start(currentIndex - self.size());
                    var data = mockData.slice(self.start(), self.start()+self.size());//TODO:SHOULD BE COMMENTED OUT IF USE THE bindRealData function
                    self.datasource(data);//TODO:SHOULD BE COMMENTED OUT IF USE THE bindRealData function

                    /*
                     bindRealData();
                     */
                }else{
                    disablePreviousButton();
                }

            },
            self.refresh = function(){
                var currentIndex = self.start();
                var data = mockData.slice(self.start(), self.start()+self.size());//TODO:SHOULD BE COMMENTED OUT IF USE THE bindRealData function
                self.datasource(data);//TODO:SHOULD BE COMMENTED OUT IF USE THE bindRealData function

                /*
                 bindRealData();
                 */
            }

    }

})(window.BPMS = window.BPMS || {}, jQuery, ko)
