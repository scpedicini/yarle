"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterByNodeName = void 0;
const filterByNodeName = (nodename) => {
    return (node) => {
        return node.nodeName === nodename || node.nodeName.toLowerCase() === nodename;
    };
};
exports.filterByNodeName = filterByNodeName;
//# sourceMappingURL=filter-by-nodename.js.map