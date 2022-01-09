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
exports.dropTheRope = exports.parseStream = exports.yarleOptions = exports.defaultYarleOptions = void 0;
// tslint:disable:no-console
const fs_1 = __importDefault(require("fs"));
const lodash_1 = require("lodash");
const path = __importStar(require("path"));
const xml_flow_1 = __importDefault(require("xml-flow"));
const utils = __importStar(require("./utils"));
const process_node_1 = require("./process-node");
const note_utils_1 = require("./utils/note-utils");
const loggerInfo_1 = require("./utils/loggerInfo");
const checker_functions_1 = require("./utils/templates/checker-functions");
const default_template_1 = require("./utils/templates/default-template");
const output_format_1 = require("./output-format");
const clearLogFile_1 = require("./utils/clearLogFile");
exports.defaultYarleOptions = {
    enexSources: ['notebook.enex'],
    outputDir: './mdNotes',
    keepOriginalHtml: false,
    isMetadataNeeded: false,
    isNotebookNameNeeded: false,
    isZettelkastenNeeded: false,
    plainTextNotesOnly: false,
    skipWebClips: false,
    useHashTags: true,
    nestedTags: {
        separatorInEN: '_',
        replaceSeparatorWith: '/',
        replaceSpaceWith: '-',
    },
    outputFormat: output_format_1.OutputFormat.StandardMD,
    urlEncodeFileNamesAndLinks: false,
    pathSeparator: '/',
    resourcesDir: '_resources',
    turndownOptions: {
        headingStyle: 'atx',
    },
};
exports.yarleOptions = Object.assign({}, exports.defaultYarleOptions);
const setOptions = (options) => {
    exports.yarleOptions = lodash_1.merge({}, exports.defaultYarleOptions, options);
    let template = (exports.yarleOptions.templateFile) ? fs_1.default.readFileSync(exports.yarleOptions.templateFile, 'utf-8') : default_template_1.defaultTemplate;
    template = exports.yarleOptions.currentTemplate ? exports.yarleOptions.currentTemplate : template;
    /*if (yarleOptions.templateFile) {*/
    // todo: handle file not exists error
    exports.yarleOptions.skipCreationTime = !checker_functions_1.hasCreationTimeInTemplate(template);
    exports.yarleOptions.skipLocation = !checker_functions_1.hasLocationInTemplate(template);
    exports.yarleOptions.skipSourceUrl = !checker_functions_1.hasSourceURLInTemplate(template);
    exports.yarleOptions.skipTags = !checker_functions_1.hasTagsInTemplate(template);
    exports.yarleOptions.skipUpdateTime = !checker_functions_1.hasUpdateTimeInTemplate(template);
    exports.yarleOptions.isNotebookNameNeeded = checker_functions_1.hasNotebookInTemplate(template);
    exports.yarleOptions.keepOriginalHtml = checker_functions_1.hasLinkToOriginalInTemplate(template);
    exports.yarleOptions.currentTemplate = template;
    loggerInfo_1.loggerInfo(`Current config is: ${JSON.stringify(exports.yarleOptions, null, 4)}`);
    loggerInfo_1.loggerInfo(`Path separator:${path.sep}`);
    /*}*/
};
const parseStream = async (options, enexSource) => {
    loggerInfo_1.loggerInfo(`Getting stream from ${enexSource}`);
    const stream = fs_1.default.createReadStream(enexSource);
    // const xml = new XmlStream(stream);
    let noteNumber = 0;
    let failed = 0;
    let skipped = 0;
    const notebookName = utils.getNotebookName(enexSource);
    return new Promise((resolve, reject) => {
        const logAndReject = (error) => {
            loggerInfo_1.loggerInfo(`Could not convert ${enexSource}:\n${error.message}`);
            ++failed;
            return reject();
        };
        if (!fs_1.default.existsSync(enexSource)) {
            return loggerInfo_1.loggerInfo(JSON.stringify({ name: 'NoSuchFileOrDirectory', message: 'source Enex file does not exists' }));
        }
        const xml = xml_flow_1.default(stream);
        let noteAttributes = null;
        xml.on('tag:note-attributes', (na) => {
            noteAttributes = na;
        });
        xml.on('tag:note', (note) => {
            if (options.skipWebClips && note_utils_1.isWebClip(note)) {
                ++skipped;
                loggerInfo_1.loggerInfo(`Notes skipped: ${skipped}`);
            }
            else {
                if (noteAttributes) {
                    // make sure single attributes are not collapsed
                    note['note-attributes'] = noteAttributes;
                }
                process_node_1.processNode(note, notebookName);
                ++noteNumber;
                loggerInfo_1.loggerInfo(`Notes processed: ${noteNumber}\n\n`);
            }
            noteAttributes = null;
        });
        xml.on('end', () => {
            const success = noteNumber - failed;
            const totalNotes = noteNumber + skipped;
            loggerInfo_1.loggerInfo('==========================');
            loggerInfo_1.loggerInfo(`Conversion finished: ${success} succeeded, ${skipped} skipped, ${failed} failed. Total notes: ${totalNotes}`);
            return resolve();
        });
        xml.on('error', logAndReject);
        stream.on('error', logAndReject);
    });
};
exports.parseStream = parseStream;
const dropTheRope = async (options) => {
    clearLogFile_1.clearLogFile();
    setOptions(options);
    for (const enex of options.enexSources) {
        utils.setPaths(enex);
        await exports.parseStream(options, enex);
    }
};
exports.dropTheRope = dropTheRope;
// tslint:enable:no-console
//# sourceMappingURL=yarle.js.map