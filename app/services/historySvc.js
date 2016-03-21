/**
 * Created by jasperchiu on 3/19/16.
 */

(function (BPMS, $, amplify) {

    BPMS.Services = BPMS.Services || {};
    BPMS.Services.HistoryInstancesSvc = (function () {
        var serviceUrl = BPMS.config.serviceUrl;
        var getHistoricInstances = function (options) {
            return BPMS.Services.Utils.restfulRequest('getHistoricInstances','history/historic-process-instances', options);
        };

        return {
            getHistoricInstances: getHistoricInstances
        };
    })();


})(window.BPMS = window.BPMS || {}, jQuery, amplify)
