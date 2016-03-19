/**
 * Created by jasperchiu on 3/19/16.
 */
(function (BPMN, $, amplify) {
    BPMN.Services = BPMN.Services || {};
    BPMN.Services.Utils = (function () {
        var defferedRequest = function (resourceId, option) {
            return $.Deferred(function (dfd) {
                amplify.request({
                    resourceId: resourceId,
                    data: option,
                    success: dfd.resolve,
                    error: dfd.reject
                });
            }).promise()
        };

        return {
            defferedRequest: defferedRequest
        };
    })();

})(window.BPMN = window.BPMN || {}, jQuery, amplify)