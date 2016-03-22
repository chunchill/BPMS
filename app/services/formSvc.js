
(function (BPMS) {

   BPMS.Services = BPMS.Services || {};
   BPMS.Services.FormSvc = (function () {
      var getFormData = function (options) {
         return BPMS.Services.Utils.restfulRequest('getFormData', 'form/form-data', options);
      };
      return {
         getFormData: getFormData
      };
   })();
})(window.BPMS = window.BPMS || {}, jQuery, amplify)
