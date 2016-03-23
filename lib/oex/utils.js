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
	//if (prefix) {
	//	// if a prefix is assigned convert name to title-case
	//	return prefix + name.charAt(0).toUpperCase() + name.substring(1);
	//}

	return name;
}