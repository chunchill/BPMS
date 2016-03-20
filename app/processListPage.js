/**
 * Created by jasperchiu on 3/19/16.
 */
//这个文件主要用来操作dom元素
var processListViewModel = new window.BPMS.ViewModels.ProcessListViewModel();
$(function () {
    ko.applyBindings(processListViewModel);
    processListViewModel.init();
})
