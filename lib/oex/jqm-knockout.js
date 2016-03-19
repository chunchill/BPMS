(function (ko, $, prefix) {
    "use strict";
    function getWidgetName($element) {
        var tag = $element[0].nodeName.toLowerCase();
        var type = $element.jqmData("type") || $element[0].type;
        var role = $element.jqmData("role");

        // note: jqm uses a select for a on/off toggle so we want to check range before checking select
        if (type === "range" || role === "slider") {
            return "slider";
        }

        if (tag === "select") {
            return "selectmenu";
        }

        if (tag === "button" || type === "button") {
            return "button";
        }

        if (tag === "input") {
            if (type === "checkbox" || type === "radio") {
                return "checkboxradio";
            }

            return "textinput";
        }

        if (tag === "ul" && role === "listview") {
            return "listview";
        }

        return null;
    }

    function canRefresh(widgetName) {
        // text input does not have a refresh method (or a real need for it for that matter)
        return widgetName && widgetName !== "textinput";
    }

    function refreshElement(element) {
        // for comment nodes look for parent
        if (element.nodeType === 8) {
            refreshElement(element.parentNode);
        } else {
            var $element = $(element);

            var widgetName = getWidgetName($element);
            if (canRefresh(widgetName)) {
                $element[widgetName]()[widgetName]("refresh");
            } else if ($.mobile.activePage.has(element).length) {
                // if widget not found, trigger create on the page and hope for best
                $.mobile.activePage.trigger("create");
            }
        }
    }

    function getBindingName(name) {
        if (prefix) {
            // if a prefix is assigned convert name to title-case
            return prefix + name.charAt(0).toUpperCase() + name.substring(1);
        }

        return name;
    }

// note: this does not rely on knockout's checked binding
    ko.bindingHandlers[getBindingName("checked")] = (function () {
        function getValue(element, allBindings) {
            return allBindings.has("checkedValue") ? ko.unwrap(allBindings.get("checkedValue")) : element.value;
        }

        return {
            after: ["attr", "value"],

            init: function (element, valueAccessor, allBindings) {
                var modelValue = valueAccessor();

                // if writeable hook into dom event to update model
                if (ko.isWriteableObservable(modelValue)) {
                    var handler = function (e) {
                        modelValue(e.target.type === "checkbox" ? e.target.checked : getValue(element, allBindings));
                    };

                    var $element = $(element).on("click", handler);

                    // cleanup
                    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                        $element.off("click", handler);
                    });
                }
            },

            update: function (element, valueAccessor, allBindings) {
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
    var enableBindingName = getBindingName("enable");
    var disableBindingName = getBindingName("disable");

    ko.bindingHandlers[enableBindingName] = {
        update: function (element, valueAccessor) {
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
            update: function (element, valueAccessor) {
                ko.bindingHandlers[enableBindingName].update(element, function () {
                    return !ko.unwrap(valueAccessor());
                });
            }
        };
    }
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
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $element.off("vclick", eventHandler);
            });
        }
    };
    var foreachBindingName = getBindingName("foreach");

    ko.bindingHandlers[foreachBindingName] = (function () {
        function wrapForEachOptions(element, valueAccessor) {
            return function () {
                var modelValue = valueAccessor();
                var unwrapped = ko.utils.peekObservable(modelValue);

                if (!unwrapped || typeof unwrapped.length === "number") {
                    return {
                        "foreach": modelValue,
                        "afterRender": function () {
                            refreshElement(element);
                        },
                        "templateEngine": ko.nativeTemplateEngine.instance
                    };
                }

                // wrap afterRender
                var afterRender = unwrapped.afterRender;
                unwrapped.afterRender = function () {
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
            init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                return ko.bindingHandlers.template.init(element, wrapForEachOptions(element, valueAccessor), allBindings, viewModel, bindingContext);
            },

            update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                return ko.bindingHandlers.template.update(element, wrapForEachOptions(element, valueAccessor), allBindings, viewModel, bindingContext);
            }
        };
    })();

    ko.virtualElements.allowedBindings[foreachBindingName] = true;
    ko.bindingHandlers[getBindingName("text")] = {
        init: function () {
            return {controlsDescendantBindings: true};
        },

        update: function (element, valueAccessor) {
            var value = ko.unwrap(valueAccessor());
            var textElement = $(element).find(".ui-btn-text")[0] || element;

            $(textElement).text(value);
        }
    };
// keep reference of original binding in case it gets overwritten
    var defaultValueBinding = ko.bindingHandlers.value;

    ko.bindingHandlers[getBindingName("value")] = {
        after: defaultValueBinding.after || [],

        init: function () {
            // call original
            return defaultValueBinding.init.apply(this, arguments);
        },

        update: function (element) {
            var output = defaultValueBinding.update.apply(this, arguments);
            refreshElement(element);
            return output;
        }
    };


    ko.bindingHandlers[getBindingName('filterText')] = {
        init: function (element, valueAccessor) {
            var value = ko.unwrap(valueAccessor());
            $(element).attr('data-filtertext', value);
        },

        update: function (element, valueAccessor) {
            var value = ko.unwrap(valueAccessor());
            $(element).attr('data-filtertext', value);
        }

    };


    ko.bindingHandlers['jqmListView'] = {
        init: function (element, valueAccessor) {
            var value = ko.unwrap(valueAccessor());
            $(element).listview({
                defaults: true
            });
        },

        update: function (element, valueAccessor) {
            var value = ko.unwrap(valueAccessor());
            $(element).attr('data-filtertext', value);
        }

    };

    ko.virtualElements.allowedBindings.jqmTemplate = true;
    ko.virtualElements.allowedBindings.jqmRefreshList = true;
    ko.bindingHandlers.jqmTemplate = {
        init: ko.bindingHandlers.template.init,
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {
            ko.bindingHandlers.template.update(element, valueAccessor,
                allBindingsAccessor, viewModel, context);
            try {
                $(element).listview('refresh');
            } catch (e) {
                //$(element).listview();
            }
        }
    };

    ko.bindingHandlers.jqmRefreshList = {
        update: function (element, valueAccessor) {

            ko.utils.unwrapObservable(valueAccessor()); //just to create a dependency
            setTimeout(function () { //To make sure the refresh fires after the DOM is updated

                try {
                    $(element).listview();
                    $(element).listview('refresh');
                } catch (e) {
                    //$(element).listview();
                }

            }, 0);
        }
    };


    function createAttributeBindings(ko,attr){
        var dataAttr = 'data-'+ attr;
        ko.bindingHandlers[getBindingName(attr)] = {
            init: function (element, valueAccessor) {
                var value = ko.unwrap(valueAccessor());
                $(element).attr(dataAttr, value);
            },

            update: function (element, valueAccessor) {
                var value = ko.unwrap(valueAccessor());
                $(element).attr(dataAttr, value);
            }

        };
    }

    createAttributeBindings(ko,'filterText');
    createAttributeBindings(ko,'icon');

    //ko.bindingHandlers[getBindingName('icon')] = {
    //    init: function (element, valueAccessor) {
    //        var value = ko.unwrap(valueAccessor());
    //
    //        var hrefElement = $(element).find("ui-btn")[0] || element;
    //        hrefElement.addClass('ui-icon-'+value);
    //    },
    //
    //    update: function (element, valueAccessor) {
    //        var value = ko.unwrap(valueAccessor());
    //
    //        var hrefElement = $(element).find("ui-btn")[0] || element;
    //        hrefElement.addClass('ui-icon-'+value);
    //    }
    //
    //};



})(window.ko, window.jQuery, "jqm");