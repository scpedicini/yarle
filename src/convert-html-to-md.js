"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertHtml2Md = void 0;
const jsdom_1 = require("jsdom");
const turndown_service_1 = require("./utils/turndown-service");
const output_format_1 = require("./output-format");
const fixSublists = (node) => {
    const ulElements = Array.from(node.getElementsByTagName('ul'));
    const olElements = Array.from(node.getElementsByTagName('ol'));
    const listElements = ulElements.concat(olElements);
    listElements.forEach(listNode => {
        if (listNode.parentElement.tagName === 'LI') {
            listNode.parentElement.replaceWith(listNode);
        }
        if (listNode.previousElementSibling &&
            listNode.previousElementSibling.tagName === 'LI') {
            // The below moves, not copies. https://stackoverflow.com/questions/7555442/move-an-element-to-another-parent-after-changing-its-id
            listNode.previousElementSibling.appendChild(listNode);
        }
    });
    // The contents of every EN list item are wrapped by a div element. `<li><div>foo</div></li>`
    // We need to remove this `<div>`, since it's a block element and will lead to unwanted whitespace otherwise
    const liElements = Array.from(node.getElementsByTagName('li'));
    for (const liNode of liElements) {
        const listNodeDiv = liNode.firstElementChild;
        if (listNodeDiv && listNodeDiv.tagName === 'DIV') {
            const childElementsArr = Array.from(listNodeDiv.childNodes);
            listNodeDiv.replaceWith(...childElementsArr);
        }
    }
    return node;
};
const convertHtml2Md = (yarleOptions, { htmlContent }) => {
    const content = htmlContent.replace(/<!DOCTYPE en-note [^>]*>/, '<!DOCTYPE html>')
        .replace(/(<a [^>]*)\/>/, '$1></a>').replace(/<div[^\/\<]*\/>/g, '');
    const contentNode = new jsdom_1.JSDOM(content).window.document
        .getElementsByTagName('en-note').item(0);
    let contentInMd = turndown_service_1.getTurndownService(yarleOptions).turndown(fixSublists(contentNode));
    const newLinePlaceholder = new RegExp('<YARLE_NEWLINE_PLACEHOLDER>', 'g');
    contentInMd = contentInMd.replace(newLinePlaceholder, '');
    if (yarleOptions.outputFormat === output_format_1.OutputFormat.LogSeqMD) {
        contentInMd = contentInMd.replace(/\n/g, '\n- ') // add a "- " at each new line
            // .replace(/\r/g, '\n')
            .replace(/<br>/g, '[:br]') // fix new line in table
            .replace(/- \|/g, ' |') // fix table problem
            .replace(/- __\n/g, '- \n') // fix empty bold/italic
            .replace(/- \*\*\*\*\n/g, '- \n')
            .replace(/- _\*\*\*\*_\n/g, '- \n')
            .replace(/- \*\*__\*\*\n/g, '- \n');
        contentInMd = `- ${contentInMd}`; // the first line
    }
    return contentInMd && contentInMd !== 'undefined' ? { content: contentInMd } : { content: '' };
};
exports.convertHtml2Md = convertHtml2Md;
//# sourceMappingURL=convert-html-to-md.js.map