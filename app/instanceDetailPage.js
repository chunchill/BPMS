
$(function () {
   var viewModel = new window.BPMS.ViewModels.InstanceDetailViewModel();
   ko.applyBindings(viewModel);
   viewModel.init();

})