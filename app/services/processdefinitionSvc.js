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

        return {
            getProcessDefinitions: getProcessDefinitions
        };
    })();


})(window.BPMS = window.BPMS || {}, jQuery, amplify)
