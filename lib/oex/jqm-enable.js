var enableBindingName = getBindingName("enable");
var disableBindingName = getBindingName("disable");

ko.bindingHandlers[enableBindingName] = {
	update: function(element, valueAccessor) {
		var $element = $(element);
		var value = ko.unwrap(valueAccessor());

		var widgetName = getWidgetName($element);
		if (widgetName) {
			$element[widgetName]()[widgetName](value ? "enable" : "disable");
		} else {
			// this may or may not be a widget but applying the 'ui-disabled' class should be sufficient
			// note: there is a bug in jqm with anchors with data-role set to 'button' that causes errors
			// when running 'enable/disable'
			$element
				.prop("disabled", !value)
				.toggleClass("ui-disabled", !value);
		}
	}
};

// note: `disable` uses the `enable` binding but if we prefix it we need to add that binding as well
if (!(disableBindingName in ko.bindingHandlers)) {
	ko.bindingHandlers[getBindingName("disable")] = {
		update: function(element, valueAccessor) {
			ko.bindingHandlers[enableBindingName].update(element, function() { return !ko.unwrap(valueAccessor()); });
		}
	};
}