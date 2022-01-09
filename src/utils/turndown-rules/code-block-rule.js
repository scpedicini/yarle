"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeBlockRule = exports.unescapeMarkdown = void 0;
const filter_by_nodename_1 = require("./filter-by-nodename");
const get_attribute_proxy_1 = require("./get-attribute-proxy");
const markdownBlock = '\n```\n';
const isCodeBlock = (node) => {
    const nodeProxy = get_attribute_proxy_1.getAttributeProxy(node);
    const codeBlockFlag = '-en-codeblock:true';
    return nodeProxy.style && nodeProxy.style.value.indexOf(codeBlockFlag) >= 0;
};
const getIntendNumber = (node) => {
    const nodeProxy = get_attribute_proxy_1.getAttributeProxy(node);
    const paddingAttr = 'padding-left:';
    let intendNumber = 0;
    if (nodeProxy.style && nodeProxy.style.value.indexOf(paddingAttr) >= 0) {
        intendNumber = Math.floor(nodeProxy.style.value.split(paddingAttr)[1].split('px')[0] / 20);
    }
    return intendNumber;
};
const unescapeMarkdown = (s) => s.replace(/\\(.)/g, '$1');
exports.unescapeMarkdown = unescapeMarkdown;
exports.codeBlockRule = {
    filter: filter_by_nodename_1.filterByNodeName('DIV'),
    replacement: (content, node) => {
        const nodeProxy = get_attribute_proxy_1.getAttributeProxy(node);
        const intend = getIntendNumber(node);
        content = `${'\t'.repeat(intend)}${content}`;
        if (isCodeBlock(node)) {
            // turndown has already escaped markdown chars (and all '\') in content;
            // reverse that to avoid extraneous backslashes in code block.
            content = exports.unescapeMarkdown(content);
            return `${markdownBlock}${content}${markdownBlock}`;
        }
        if (node.parentElement && isCodeBlock(node.parentElement) && node.parentElement.firstElementChild === node) {
            return `${content}`;
        }
        if (node.parentElement && isCodeBlock(node.parentElement)) {
            return `\n${content}`;
        }
        const childHtml = node.innerHTML;
        /*return node.isBlock
            ? childHtml !== '<br>'
                ? `\n${content}\n`
                : `${content}`
            : `${content}`;
        */
        return node.isBlock ? `\n${content}\n` : content;
    },
};
//# sourceMappingURL=code-block-rule.js.map