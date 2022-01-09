"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newLineRule = void 0;
const filter_by_nodename_1 = require("./filter-by-nodename");
const get_attribute_proxy_1 = require("./get-attribute-proxy");
exports.newLineRule = {
    filter: filter_by_nodename_1.filterByNodeName('BR'),
    replacement: (content, node) => {
        const nodeProxy = get_attribute_proxy_1.getAttributeProxy(node);
        return '<YARLE_NEWLINE_PLACEHOLDER>';
    },
};
//# sourceMappingURL=newline-rule.js.map