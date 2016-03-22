/**
 * Created by jasperchiu on 3/19/16.
 */
/**
 * Created by jasperchiu on 3/19/16.
 */
(function (BPMS, $, amplify) {

    BPMS.Services = BPMS.Services || {};
    BPMS.Services.ProcessDefinitionSvc = (function () {
        var serviceUrl = BPMS.config.serviceUrl;
        var getProcessDefinitions = function (options) {
            return BPMS.Services.Utils.restfulRequest('getProcessDefinitions','repository/process-definitions', options);
        };
        var getProcessDefinitionProperties = function (id) {
           return BPMS.Services.Utils.restfulRequest('processDefinitionProperties', "process-definition/" + id + "/properties");
        };
        return {
           getProcessDefinitions: getProcessDefinitions,
           getProcessDefinitionProperties: getProcessDefinitionProperties
        };
    })();


})(window.BPMS = window.BPMS || {}, jQuery, amplify)
