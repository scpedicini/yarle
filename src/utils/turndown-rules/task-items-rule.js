"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskItemsRule = void 0;
const output_format_1 = require("./../../output-format");
const yarle_1 = require("../../yarle");
const filter_by_nodename_1 = require("./filter-by-nodename");
const get_attribute_proxy_1 = require("./get-attribute-proxy");
exports.taskItemsRule = {
    filter: filter_by_nodename_1.filterByNodeName('EN-TODO'),
    replacement: (content, node) => {
        var _a, _b;
        const nodeProxy = get_attribute_proxy_1.getAttributeProxy(node);
        // If <EN-TODO> is already in <LI> (it always is in newer Evernote builds),
        // don't add an extra list bullet
        const prefix = yarle_1.yarleOptions.outputFormat === output_format_1.OutputFormat.LogSeqMD ? '' :
            ((_b = (_a = node.parentElement) === null || _a === void 0 ? void 0 : _a.nodeName) === null || _b === void 0 ? void 0 : _b.toUpperCase()) === 'LI' ? '' : '- ';
        return `${prefix}${(nodeProxy.checked.value === 'true' ? '[x]' : '[ ]')} ${content}`;
    },
};
//# sourceMappingURL=task-items-rule.js.map