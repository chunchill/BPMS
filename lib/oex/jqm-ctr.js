/**
 * Created by jasperchiu on 3/22/16.
 */


/*
*
* <div databind="dynamicUIControl:{type:xxx,option:{xxx:xxx,xxx,xxx}}"></div>
*
*data-bind="value:name" type="email" data-theme="b" ' +
 'data-clear-btn="true" name="email" id="email" placeholder="xxx"


 <label for="select-native-1">Basic:</label>
     <select name="select-native-1" id="select-native-1">
         <option value="1">The 1st Option</option>
         <option value="2">The 2nd Option</option>
         <option value="3">The 3rd Option</option>
         <option value="4">The 4th Option</option>
     </select>
* */
ko.bindingHandlers.dynamicUIControl = {

   init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
      // This will be called when the binding is first applied to an element
      // Set up any initial state, event handlers, etc. here
      var dateInputHTML = '<label></label><input type="date"/>';
      var inputHTML = '<label></label><input type="text"/>';
      var selectHTML = '<label></label><select></select>';
      var checkboxHTML = '<label></label><input type="checkbox">';
      var numberHTML = '<label></label><input type="number">';

      var value = valueAccessor();
      var valueUnwrapped = ko.unwrap(value);

      switch (valueUnwrapped.type) {
         case "date":
            $(element).html(dateInputHTML);
            break;
         case "string":
         case "text":
            $(element).html(inputHTML);
            break;
         case "enum":
            $(element).html(selectHTML);
            break;
         case "boolean":
         case "bool":
            $(element).html(checkboxHTML);
            break;
         case "number":
         case "long":
            $(element).html(numberHTML);
            break;
         default:
            break;
      }
      $($(element).children("label")[0]).attr("for", valueUnwrapped.name);
      $($(element).children("label")[0]).html(valueUnwrapped.name);
      var tag;
      if (valueUnwrapped.type === "enum") {
         tag = $($(element).children("select")[0]);
         $.each(valueUnwrapped.enumValues, function (index, item) {
            tag.append("<option value='" + item.id + "'>" + item.name + "</option>");
         });
         for (_p in valueUnwrapped.option) {
            var temp = _p.replace(/\_/g, "-");
            tag.attr(temp, valueUnwrapped.option[_p]);
         }
      }
      else {
         tag = $($(element).children("input")[0]);
         for (_p in valueUnwrapped.option) {
            var temp = _p.replace(/\_/g, "-");
            tag.attr(temp, valueUnwrapped.option[_p]);
         }
      }
      var binding = "value:value";
      if (valueUnwrapped.type == "boolean" || valueUnwrapped.type == "bool")
         binding = "checked:value";
      if (valueUnwrapped.type == "enum")
         binding = "selected:value";
      tag.attr("data-bind", binding);
      // if (valueUnwrapped.type == "enum") {
      //  console.log($(element).find(".ui-select"));
      // $(element).find(".ui-select").attr("data-bind", "select:value");

      // }
      $(element).trigger('create');
   }
};