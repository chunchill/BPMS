// note: this does not rely on knockout's checked binding
ko.bindingHandlers[getBindingName("selected")] = (function () {
   function getValue(element) {
      return $(element).val();
   }

   return {
      after: ["attr", "value"],
      init: function (element, valueAccessor, allBindings) {
         var modelValue = valueAccessor();
         if (ko.isWriteableObservable(modelValue)) {
            var handler = function() {
               modelValue(getValue(element, allBindings));
            };
            var $element = $(element).on("change", handler);

            // cleanup
            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
               $element.off("change", handler);
            });
         }
      },

      update: function (element, valueAccessor, allBindings) {


         var value = ko.unwrap(valueAccessor());
         var $element = $(element);
         var elementValue = getValue(element, allBindings);
         if (elementValue != value)
            element.value = value;
         refreshElement($element);
      }
   };
})();