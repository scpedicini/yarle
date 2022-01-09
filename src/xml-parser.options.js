"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmlParserOptions = void 0;
const he_1 = __importDefault(require("he"));
/* istanbul ignore next */
exports.xmlParserOptions = {
    attributeNamePrefix: '@_',
    attrNodeName: 'attr',
    textNodeName: '#text',
    ignoreAttributes: true,
    ignoreNameSpace: false,
    allowBooleanAttributes: false,
    parseNodeValue: true,
    parseAttributeValue: false,
    trimValues: true,
    cdataTagName: '__cdata',
    cdataPositionChar: '\\c',
    localeRange: '',
    parseTrueNumberOnly: false,
    attrValueProcessor: (a) => he_1.default.decode(a, { isAttributeValue: true }),
    tagValueProcessor: (a) => he_1.default.decode(a),
};
//# sourceMappingURL=xml-parser.options.js.map