"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spanRule = void 0;
const yarle_1 = require("../../yarle");
const output_format_1 = require("../../output-format");
const filter_by_nodename_1 = require("./filter-by-nodename");
const get_attribute_proxy_1 = require("./get-attribute-proxy");
const EVERNOTE_HIGHLIGHT = '-evernote-highlight:true;';
const EVERNOTE_COLORHIGHLIGHT = '--en-highlight';
const BOLD = 'bold';
const ITALIC = 'italic';
exports.spanRule = {
    filter: filter_by_nodename_1.filterByNodeName('SPAN'),
    replacement: (content, node) => {
        const HIGHLIGHT_SEPARATOR = yarle_1.yarleOptions.outputFormat === output_format_1.OutputFormat.ObsidianMD ? '==' : '`';
        const nodeProxy = get_attribute_proxy_1.getAttributeProxy(node);
        if (nodeProxy.style) {
            const nodeValue = nodeProxy.style.value;
            if (yarle_1.yarleOptions.outputFormat === output_format_1.OutputFormat.LogSeqMD) {
                // this aims to care for bold text generated as <span style="font-weight: bold;">Bold</span>
                if (content !== '<YARLE_NEWLINE_PLACEHOLDER>') {
                    const hasBold = nodeValue.includes(BOLD);
                    const hasItalic = nodeValue.includes(ITALIC);
                    if (hasBold && !hasItalic) {
                        return `**${content}**`;
                    }
                    if (!hasBold && hasItalic) {
                        return `_${content}_`;
                    }
                    if (hasBold && hasItalic) {
                        return `_**${content}**_`;
                    }
                }
            }
            return nodeValue.includes(EVERNOTE_HIGHLIGHT) || nodeValue.includes(EVERNOTE_COLORHIGHLIGHT) ?
                `${HIGHLIGHT_SEPARATOR}${content}${HIGHLIGHT_SEPARATOR}` :
                content;
        }
        return content;
    },
};
//# sourceMappingURL=span-rule.js.map