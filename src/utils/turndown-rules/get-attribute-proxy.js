"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttributeProxy = void 0;
const getAttributeProxy = (node) => {
    const handler = {
        get(target, key) {
            return target[key];
        },
    };
    return new Proxy(node.attributes, handler);
};
exports.getAttributeProxy = getAttributeProxy;
//# sourceMappingURL=get-attribute-proxy.js.map