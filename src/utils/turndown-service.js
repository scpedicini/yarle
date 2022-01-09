"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTurndownService = void 0;
const turndown_1 = __importDefault(require("turndown"));
const joplin_turndown_plugin_gfm_1 = require("joplin-turndown-plugin-gfm");
const turndown_rules_1 = require("./turndown-rules");
const output_format_1 = require("./../output-format");
const getTurndownService = (yarleOptions) => {
    /* istanbul ignore next */
    const turndownService = new turndown_1.default(Object.assign(Object.assign({ br: '' }, yarleOptions.turndownOptions), { blankReplacement: (content, node) => {
            return node.isBlock ? '\n\n' : '';
        }, keepReplacement: (content, node) => {
            return node.isBlock ? `\n${node.outerHTML}\n` : node.outerHTML;
        }, defaultReplacement: (content, node) => {
            return node.isBlock ? `\n${content}\n` : content;
        } }));
    turndownService.use(joplin_turndown_plugin_gfm_1.gfm);
    turndownService.addRule('span', turndown_rules_1.spanRule);
    turndownService.addRule('strikethrough', turndown_rules_1.strikethroughRule);
    turndownService.addRule('evernote task items', turndown_rules_1.taskItemsRule);
    turndownService.addRule('wikistyle links', turndown_rules_1.wikiStyleLinksRule);
    turndownService.addRule('images', turndown_rules_1.imagesRule);
    if (yarleOptions.outputFormat === output_format_1.OutputFormat.LogSeqMD) {
        turndownService.addRule('logseq_hr', {
            filter: ['hr'],
            // tslint:disable-next-line:typedef
            replacement(content) {
                return '\r  ---'; // this \r is important, used to diff from \n
            },
        });
    }
    if (yarleOptions.keepMDCharactersOfENNotes) {
        turndownService.escape = ((str) => str);
    }
    if (yarleOptions.monospaceIsCodeBlock) {
        turndownService.addRule('codeblocks', turndown_rules_1.monospaceCodeBlockRule);
    }
    else {
        turndownService.addRule('codeblocks', turndown_rules_1.codeBlockRule);
    }
    if (yarleOptions.keepOriginalAmountOfNewlines) {
        turndownService.addRule('newline', turndown_rules_1.newLineRule);
    }
    return turndownService;
};
exports.getTurndownService = getTurndownService;
//# sourceMappingURL=turndown-service.js.map