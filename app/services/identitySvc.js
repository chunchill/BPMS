/**
 * Created by jasperchiu on 3/19/16.
 */
(function (BPMN, $, amplify) {

    BPMN.Services = BPMN.Services || {};
    BPMN.Services.IndentitySvc = (function () {
        var serviceUrl = BPMN.config.serviceUrl;
        var defineRequests = function () {
                //get the latest position for all the cars
                amplify.request.define('login', 'ajax', {
                    type: 'get',
                    dataType : "jsonp",
                    url: serviceUrl + 'history/historic-activity-instances',
                    crossDomain: true,
                    beforeSend: function( xhr ) {
                        xhr.setRequestHeader("authorization", " YWRtaW46YWRtaW4=" );
                    }
                });

                //other request could be defined here
            },

            login = function (option) {
                return BPMN.Services.Utils.defferedRequest('login', option)
            };

        defineRequests();

        return {
            login: login
        };
    })();

})(window.BPMN = window.BPMN || {}, jQuery, amplify)