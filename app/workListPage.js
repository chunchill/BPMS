
$(function () {
   var viewModel = new window.BPMS.ViewModels.WorkListViewModel();
   ko.applyBindings(viewModel);
   viewModel.init();

   //$("#logonView").pulltorefresh({
   //   async: true,
   //   // event triggered when refreshing start
   //   refresh: function (event, finishCallback) {
   //      viewModel.getData(finishCallback);
   //   }
   //});
})