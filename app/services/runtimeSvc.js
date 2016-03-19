/**
 * Created by jasperchiu on 3/19/16.
 */
(function (BPMN, $, amplify) {

    BPMN.Services = BPMN.Services || {};
    BPMN.Services.RuntimeSvc = (function () {
        var serviceUrl = BPMN.config.serviceUrl;
        var getTasks = function (options) {
            return BPMN.Services.Utils.restfulRequest('getTasks','runtime/tasks', options);
        };

        return {
            getTasks: getTasks
        };
    })();


})(window.BPMN = window.BPMN || {}, jQuery, amplify)