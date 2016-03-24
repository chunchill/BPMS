
/**
 * Created by jasperchiu on 3/19/16.
 */
(function(BPMS,$,ko){

    BPMS.ViewModels = BPMS.ViewModels || {};
    //登录页面viewmodel
    BPMS.ViewModels.ProcessInstanceViewModel = function(){
        var self = this;
        self.processDefinitionName = ko.observable();
        self.processDefinitionId = ko.observable();
        self.processInstanceId = ko.observable();
        self.processDescription =ko.observable();
        self.dynamicFormItems = ko.observableArray();

        self.submit = function () {
            var data = {
                processDefinitionId:self.processDefinitionId(),
                variables: []
            };
            var data2 = {
                processDefinitionId:self.processDefinitionId(),
                variables: []
            };
            ko.utils.arrayForEach(self.dynamicFormItems(),function(item){
                var _data = {};
                var _data2 ={};
                _data.name = item.option.name;
                _data2.name = item.option.name;
                _data.value = item.value();
                _data2.type = item.type;
                data.variables.push(_data);
                data2.variables.push(_data2);
            });
            BPMS.Services.RuntimeSvc.postProcessInstance(data).then(function (result) {

                console.log(JSON.stringify(result));
                var instanceId = result.id;
                //runtime/process-instances/{processInstanceId}/identitylinks
                var userId= window.localStorage.getItem("bpms_userId");
                if(userId === null){ window.location.replace("RYLogin.html");}
                var option_1 = {userId:userId,type:"owner"};
                self.processInstanceId(instanceId);
                BPMS.Services.RuntimeSvc.postProcessInstanceIndentityLinks(instanceId,option_1).then(function(result){
                    console.log(JSON.stringify(result));

                    BPMS.Services.RuntimeSvc.postProcessInstanceVariables(instanceId,data2).then(function (result) {

                        $("#popupMessage").popup("open");

                    }, function () {
                        //ERR handle
                    })
                });

            },function(){

            });
        };
        //selectedProcessInstanceViewModel.processInstanceId = data.id;
        //selectedProcessInstanceViewModel.processDescription = data.description;
        //selectedProcessInstanceViewModel.processDefinitionName = data.name;
        var data = localStorage.getItem("selectedProcessInstanceViewModel");
        var selectInstance = JSON.parse(data);
        if(selectInstance){
            self.processDefinitionId(selectInstance.id);
            self.processDescription(selectInstance.description);
            self.processDefinitionName(selectInstance.name);

            BPMS.Services.ProcessDefinitionSvc.getProcessDefinitionProperties(selectInstance.id).then(function(result){

                var properites = result.data;
                properites.forEach(function (item,index) {
                   var itemToPush =  BPMS.Services.Utils.handleUIControlItem(item);
                    self.dynamicFormItems.push(itemToPush);
                })
                console.log(result);
            },function(){
                //error handle
            });
        }else{
            window.location.replace("home.html");
        }


    }

})(window.BPMS = window.BPMS || {}, jQuery, ko)
