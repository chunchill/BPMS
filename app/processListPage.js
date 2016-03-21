/**
 * Created by jasperchiu on 3/19/16.
 */
//这个文件主要用来操作dom元素
var processListViewModel = new window.BPMS.ViewModels.ProcessListViewModel();
$(function () {
    $("#draggable").pulltorefresh({
        async: true,
        // event triggered when refreshing start
        refresh: function(event, finishCallback) {
            element = $(this)
            setTimeout(function(){
                processListViewModel.refresh();

                // you must call this function if refreshing process runs asynchronusly
                finishCallback();
            }, 1000);
        },
        abort: function() {
            //alert("abort");
        }
    });


    ko.applyBindings(processListViewModel);
    processListViewModel.init();

})
