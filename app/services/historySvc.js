/**
 * Created by jasperchiu on 3/19/16.
 */

(function (BPMS, $, amplify) {

   BPMS.Services = BPMS.Services || {};
   BPMS.Services.HistoryInstancesSvc = (function () {
      //var serviceUrl = BPMS.config.serviceUrl;
      var getProcessInstances = function (options) {
         return BPMS.Services.Utils.restfulRequest('getProcessInstances', 'history/historic-process-instances', options);
      };
      var getActivityInstances = function (options) {
         return BPMS.Services.Utils.restfulRequest('getActivityInstances', 'history/historic-activity-instances', options);
      };
      var getVariableInstances = function (options) {
         return BPMS.Services.Utils.restfulRequest('getVariableInstances', 'history/historic-variable-instances', options);
      };

      return {
         getProcessInstances: getProcessInstances,
         getActivityInstances: getActivityInstances,
         getVariableInstances: getVariableInstances,
      };
   })();


})(window.BPMS = window.BPMS || {}, jQuery, amplify)
