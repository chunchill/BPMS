ko.bindingHandlers.vclick = {
	init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
		var eventHandler = function (e) {
			var fn = valueAccessor();
			var args, vm, returnValue;

			if (fn) {
				args = $.makeArray(args);
				vm = bindingContext.$data;

				// ko uses the vm as the first argument for events
				args.unshift(vm);

				returnValue = fn.apply(vm, args) || false;

				// ko cancels events unless overwritten by dev passing true
				if (returnValue !== true) {
					e.preventDefault();
				}

				return returnValue;
			}
		};

		var $element = $(element).on("vclick", eventHandler);

		// cleanup
    ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
      $element.off("vclick", eventHandler);
    });
	}
};