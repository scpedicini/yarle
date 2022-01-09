"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imagesRule = void 0;
const yarle_1 = require("../../yarle");
const filter_by_nodename_1 = require("./filter-by-nodename");
const get_attribute_proxy_1 = require("./get-attribute-proxy");
const output_format_1 = require("./../../output-format");
exports.imagesRule = {
    filter: filter_by_nodename_1.filterByNodeName('IMG'),
    replacement: (content, node) => {
        const nodeProxy = get_attribute_proxy_1.getAttributeProxy(node);
        if (!nodeProxy.src) {
            return '';
        }
        const value = nodeProxy.src.value;
        const realValue = yarle_1.yarleOptions.urlEncodeFileNamesAndLinks ? encodeURI(value) : value;
        // while this isn't really a standard, it is common enough
        if (yarle_1.yarleOptions.keepImageSize === output_format_1.OutputFormat.StandardMD || yarle_1.yarleOptions.keepImageSize === output_format_1.OutputFormat.LogSeqMD) {
            const widthParam = node.width || '';
            const heightParam = node.height || '';
            return `![](${realValue} =${widthParam}x${heightParam})`;
        }
        else if (yarle_1.yarleOptions.keepImageSize === output_format_1.OutputFormat.ObsidianMD) {
            return `![|${node.width}x${node.height}](${realValue})`;
        }
        const useObsidianMD = yarle_1.yarleOptions.outputFormat === output_format_1.OutputFormat.ObsidianMD;
        if (useObsidianMD && !value.match(/^[a-z]+:/)) {
            return `![[${realValue}]]`;
        }
        const srcSpl = nodeProxy.src.value.split('/');
        return `![${srcSpl[srcSpl.length - 1]}](${realValue})`;
    },
};
//# sourceMappingURL=images-rule.js.map