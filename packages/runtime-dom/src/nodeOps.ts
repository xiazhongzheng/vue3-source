export const nodeOps = {
    createElement: tagName => document.createElement(tagName),
    remove: child => {
        const parent = child.parentNode;
        if (parent) {
            parent.removeChind(child);
        }
    },
    insert: (child, parent, anchor = null) => {
        // anchor 参照物  为空 则插入最后
        parent.insertBefore(child, anchor);
    },
    querySelector: selector => document.querySelector(selector),
    setElementText: (el, text) => el.textContent = text,
    createText: text => document.createTextNode(text),
    setText: (node, text) => node.nodeValue = text
}