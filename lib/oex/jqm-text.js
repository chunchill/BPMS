ko.bindingHandlers[getBindingName("text")] = {
	init: function() {
		return { controlsDescendantBindings: true };
	},

	update: function (element, valueAccessor) {
		var value = ko.unwrap(valueAccessor());
		var textElement = $(element).find(".ui-btn-text")[0] || element;
			
		$(textElement).text(value);
	}
};
