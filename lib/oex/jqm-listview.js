/**
 * Created by jasperchiu on 3/13/16.
 */
ko.bindingHandlers.listview = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var res = ko.bindingHandlers.foreach.init(element, valueAccessor()['listview']);
        $(element).listview();
        return res;
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var res = ko.bindingHandlers.foreach.update(element, valueAccessor()['listview'], allBindingsAccessor, viewModel, bindingContext);
        $(element).listview('refresh');
        return res;
    }
};