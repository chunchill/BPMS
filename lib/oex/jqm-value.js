// keep reference of original binding in case it gets overwritten
var defaultValueBinding = ko.bindingHandlers.value;

ko.bindingHandlers[getBindingName("value")] = {
	after: defaultValueBinding.after || [],

	init: function() {
		// call original
		return defaultValueBinding.init.apply(this, arguments);
	},

	update: function(element) {
		var output = defaultValueBinding.update.apply(this, arguments);
		refreshElement(element);
		return output;
	}
};