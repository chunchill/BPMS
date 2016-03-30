/**
 * Created by jasperchiu on 3/19/16.
 */
(function (BPMS, $, amplify) {

    BPMS.Services = BPMS.Services || {};
    BPMS.Services.IndentitySvc = (function () {
        var serviceUrl = BPMS.config.serviceUrl;
        var defineLoginRequest = function (option) {
                var token =BPMS.Services.Utils.getAuthToken(option.username,option.password);
                amplify.request.define('login', 'ajax', {
                    type: 'get',
                    dataType : "json",
                    url: serviceUrl + 'history/historic-activity-instances',
                    crossDomain: true,
                    headers:{
                        'Authorization':token
                    }
                    //beforeSend: function( xhr ) {
                    //    xhr.setRequestHeader("authorization", token);
                    //}
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

})(window.BPMS = window.BPMS || {}, jQuery, amplify)