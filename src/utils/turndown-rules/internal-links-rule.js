"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShortLinkIfPossible = exports.wikiStyleLinksRule = exports.removeBrackets = void 0;
const marked_1 = __importDefault(require("marked"));
const _ = __importStar(require("lodash"));
const filename_utils_1 = require("../filename-utils");
const output_format_1 = require("../../output-format");
const yarle_1 = require("../../yarle");
const turndown_service_1 = require("../turndown-service");
const filter_by_nodename_1 = require("./filter-by-nodename");
const get_attribute_proxy_1 = require("./get-attribute-proxy");
const removeBrackets = (str) => {
    return str.replace(/\[|\]/g, '');
};
exports.removeBrackets = removeBrackets;
exports.wikiStyleLinksRule = {
    filter: filter_by_nodename_1.filterByNodeName('A'),
    replacement: (content, node) => {
        const nodeProxy = get_attribute_proxy_1.getAttributeProxy(node);
        if (!nodeProxy.href) {
            return '';
        }
        const internalTurndownedContent = turndown_service_1.getTurndownService(yarle_1.yarleOptions).turndown(exports.removeBrackets(node.innerHTML));
        const lexer = new marked_1.default.Lexer({});
        const tokens = lexer.lex(internalTurndownedContent);
        const extension = yarle_1.yarleOptions.addExtensionToInternalLinks ? '.md' : '';
        let token = {
            mdKeyword: '',
            text: internalTurndownedContent,
        };
        if (tokens.length > 0 && tokens[0]['type'] === 'heading') {
            token = tokens[0];
            token['mdKeyword'] = `${'#'.repeat(tokens[0]['depth'])} `;
        }
        const value = nodeProxy.href.value;
        const type = nodeProxy.type ? nodeProxy.type.value : undefined;
        const realValue = yarle_1.yarleOptions.urlEncodeFileNamesAndLinks ? encodeURI(value) : value;
        if (type === 'file') {
            return yarle_1.yarleOptions.outputFormat === output_format_1.OutputFormat.ObsidianMD
                ? `![[${realValue}]]`
                : exports.getShortLinkIfPossible(token, value);
        }
        if (value.match(/^(https?:|www\.|file:|ftp:|mailto:)/)) {
            return exports.getShortLinkIfPossible(token, value);
        }
        if (value.startsWith('evernote://')) {
            const fileName = filename_utils_1.normalizeTitle(token['text']);
            const displayName = token['text'];
            const realFileName = yarle_1.yarleOptions.urlEncodeFileNamesAndLinks ? encodeURI(fileName) : fileName;
            if (yarle_1.yarleOptions.outputFormat === output_format_1.OutputFormat.ObsidianMD) {
                return `${token['mdKeyword']}[[${realFileName}${extension}|${displayName}]]`;
            }
            return `${token['mdKeyword']}[${displayName}](${fileName}${extension})`;
        }
        return (yarle_1.yarleOptions.outputFormat === output_format_1.OutputFormat.ObsidianMD)
            ? `${token['mdKeyword']}[[${realValue} | ${token['text']}]]`
            : (yarle_1.yarleOptions.outputFormat === output_format_1.OutputFormat.StandardMD || yarle_1.yarleOptions.outputFormat === output_format_1.OutputFormat.LogSeqMD)
                ? `${token['mdKeyword']}[${token['text']}](${realValue})`
                : `${token['mdKeyword']}[[${realValue}]]`;
    },
};
const getShortLinkIfPossible = (token, value) => {
    return (!token['text'] || _.unescape(token['text']) === _.unescape(value))
        ? yarle_1.yarleOptions.generateNakedUrls ? value : `<${value}>`
        : `${token['mdKeyword']}[${token['text']}](${value})`;
};
exports.getShortLinkIfPossible = getShortLinkIfPossible;
//# sourceMappingURL=internal-links-rule.js.map