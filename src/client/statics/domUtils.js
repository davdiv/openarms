exports.getParentByTagName = function(tagName, element, elementStop) {
    tagName = tagName.toLowerCase();
    while (element && element !== elementStop) {
        if (element.tagName.toLowerCase() === tagName) {
            return element;
        }
        element = element.parentNode;
    }
};