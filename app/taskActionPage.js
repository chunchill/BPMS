
$(function () {
   var viewModel = new window.BPMS.ViewModels.TaskActionViewModel();
   ko.applyBindings(viewModel);
   viewModel.init();

})