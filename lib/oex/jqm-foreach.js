var foreachBindingName = getBindingName("foreach");

ko.bindingHandlers[foreachBindingName] = (function() {
	function wrapForEachOptions(element, valueAccessor) {
		return function() {
			var modelValue = valueAccessor();
			var unwrapped = ko.utils.peekObservable(modelValue);

			if (!unwrapped || typeof unwrapped.length === "number") {
				return {
					"foreach": modelValue,
					"afterRender": function() { refreshElement(element); },
					"templateEngine": ko.nativeTemplateEngine.instance
				};
			}

			// wrap afterRender
			var afterRender = unwrapped.afterRender;
			unwrapped.afterRender = function() {
				// run assigned fn first
				if (afterRender) {
					var fn = ko.utils.peekObservable(afterRender);
					fn.apply(this, arguments);
				}

				refreshElement(element);
			};

			// register dependencies
			ko.unwrap(modelValue);

			return {
				"foreach": unwrapped.data,
				"as": unwrapped.as,
				"includeDestroyed": unwrapped.includeDestroyed,
				"afterAdd": unwrapped.afterAdd,
				"beforeRemove": unwrapped.beforeRemove,
				"afterRender": unwrapped.afterRender,
				"beforeMove": unwrapped.beforeMove,
				"afterMove": unwrapped.afterMove,
				"templateEngine": ko.nativeTemplateEngine.instance
			};
		};
	}

	return {
		init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
			return ko.bindingHandlers.template.init(element, wrapForEachOptions(element, valueAccessor), allBindings, viewModel, bindingContext);
		},

		update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
			return ko.bindingHandlers.template.update(element, wrapForEachOptions(element, valueAccessor), allBindings, viewModel, bindingContext);
		}	
	};
})();

ko.virtualElements.allowedBindings[foreachBindingName] = true;