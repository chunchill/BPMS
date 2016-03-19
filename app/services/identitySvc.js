/**
 * Created by jasperchiu on 3/19/16.
 */
(function (BPMN, $, amplify) {

    BPMN.Services = BPMN.Services || {};
    BPMN.Services.IndentitySvc = (function () {
        var serviceUrl = BPMN.config.serviceUrl;
        var defineLoginRequest = function (option) {
                var token =BPMN.Services.Utils.getAuthToken(option.username,option.password);
                amplify.request.define('login', 'ajax', {
                    type: 'get',
                    dataType : "json",
                    url: serviceUrl + 'history/historic-activity-instances',
                    crossDomain: true,
                    beforeSend: function( xhr ) {
                        xhr.setRequestHeader("authorization", token);
                    }
                });
            },

            login = function (option) {
                defineLoginRequest(option);
                return $.Deferred(function (dfd) {
                    amplify.request({
                        resourceId: 'login',
                        data: option,
                        success: dfd.resolve,
                        error: dfd.reject
                    });
                }).promise();
            };



        return {
            login: login
        };
    })();

})(window.BPMN = window.BPMN || {}, jQuery, amplify)