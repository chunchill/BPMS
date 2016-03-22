/**
 * Created by jasperchiu on 3/19/16.
 */
//这个文件主要用来操作dom元素
var selectedProcessInstanceViewModel = JSON.parse(localStorage.getItem('selectedProcessInstanceViewModel'))
|| new window.BPMS.ViewModels.ProcessInstanceViewModel();
$(function () {
    ko.applyBindings(selectedProcessInstanceViewModel);

})
