/**
 * Created by jasperchiu on 3/19/16.
 */
(function (BPMS, $, amplify) {

   BPMS.Services = BPMS.Services || {};
   BPMS.Services.RuntimeSvc = (function () {
      var serviceUrl = BPMS.config.serviceUrl;
      var getTasks = function (options) {
         return BPMS.Services.Utils.restfulRequest('getTasks', 'runtime/tasks', options);
      };
      var postTasks = function (id,options) {
         return BPMS.Services.Utils.restfulPost('postTasks', 'runtime/tasks/' + id, options);
      };
      var getProcessInstances = function (options) {
         return BPMS.Services.Utils.restfulRequest('getProcessInstances', 'runtime/process-instances', options);
      };
      return {
         getTasks: getTasks,
         postTasks: postTasks,
         getProcessInstances: getProcessInstances
      };
   })();


})(window.BPMS = window.BPMS || {}, jQuery, amplify)
