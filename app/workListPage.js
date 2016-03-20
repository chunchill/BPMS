
$(function () {
   var viewModel = new window.BPMS.ViewModels.WorkListViewModel();
   ko.applyBindings(viewModel);
   viewModel.init();
})
