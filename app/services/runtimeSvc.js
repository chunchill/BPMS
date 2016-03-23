/**
 * Created by jasperchiu on 3/19/16.
 */
(function (BPMS, $, amplify) {

    BPMS.Services = BPMS.Services || {};
    BPMS.Services.RuntimeSvc = (function () {
        var serviceUrl = BPMS.config.serviceUrl, getTasks = function (options) {
            return BPMS.Services.Utils.restfulRequest('getTasks', 'runtime/tasks', options);
        }, postTasks = function (id, options) {
            return BPMS.Services.Utils.restfulPost('postTasks', 'runtime/tasks/' + id, options);
        }, getProcessInstances = function (options) {
            return BPMS.Services.Utils.restfulRequest('getProcessInstances', 'runtime/process-instances', options);
        }, postProcessInstance = function (options) {
            return BPMS.Services.Utils.restfulPost('postProcessInstance', 'runtime/process-instances', options);
        }, postProcessInstanceIndentityLinks = function (id, options) {
            return BPMS.Services.Utils.restfulPost('postProcessInstanceIndentityLinks', 'runtime/process-instances/' + id + '/identitylinks', options);
        }, postProcessInstanceVariables = function (id, options) {
            return BPMS.Services.Utils.restfulPost('postProcessInstanceVariables', 'runtime/process-instances/' + id + '/variables', options);
        };
        return {
            getTasks: getTasks,
            getProcessInstances: getProcessInstances,
            postTasks: postTasks,
            postProcessInstance: postProcessInstance,
            postProcessInstanceIndentityLinks: postProcessInstanceIndentityLinks,
            postProcessInstanceVariables: postProcessInstanceVariables
        };
    })();


})(window.BPMS = window.BPMS || {}, jQuery, amplify)
