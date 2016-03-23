
$(function () {
   var viewModel = new window.BPMS.ViewModels.InstanceListViewModel();
   ko.applyBindings(viewModel);
   viewModel.init();
})