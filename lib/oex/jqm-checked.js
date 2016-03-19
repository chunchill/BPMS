// note: this does not rely on knockout's checked binding
ko.bindingHandlers[getBindingName("checked")] = (function() {
	function getValue(element, allBindings) {
		return allBindings.has("checkedValue") ? ko.unwrap(allBindings.get("checkedValue")) : element.value;
	}

	return {
		after: ["attr", "value"],

		init: function(element, valueAccessor, allBindings) {
			var modelValue = valueAccessor();

			// if writeable hook into dom event to update model
			if (ko.isWriteableObservable(modelValue)) {
				var handler = function(e) {
					modelValue(e.target.type === "checkbox" ? e.target.checked : getValue(element, allBindings));
				};

				var $element = $(element).on("click", handler);

				// cleanup
				ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
					$element.off("click", handler);
				});
			}
		},

		update: function(element, valueAccessor, allBindings) {
			var value = ko.unwrap(valueAccessor());
			var $element = $(element);

			if (element.type === "checkbox") {
				if ($element.prop("checked") !== value) {
					$element.prop("checked", value);
					refreshElement($element);
				}
			} else {
				var elementValue = getValue(element, allBindings);
				element.checked = value === elementValue;
				refreshElement($element);
			}
		}
	};
})();