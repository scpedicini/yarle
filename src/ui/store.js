"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
// tslint:disable-next-line:no-require-imports
const Store = require("electron-store");
const output_format_1 = require("./../output-format");
const schema = {
    keepOriginalHtml: {
        type: 'boolean',
        default: true,
    },
    enexSources: {},
    // templateFile: {type: 'string'},
    outputDir: { type: 'string' },
    // isMetadataNeeded: { type: 'boolean', default: false },
    isNotebookNameNeeded: { type: 'boolean', default: false },
    isZettelkastenNeeded: { type: 'boolean', default: false },
    plainTextNotesOnly: { type: 'boolean', default: false },
    addLocation: { type: 'boolean', default: false },
    addCreationTime: { type: 'boolean', default: false },
    addUpdateTime: { type: 'boolean', default: false },
    addSourceUrl: { type: 'boolean', default: false },
    addWebClips: { type: 'boolean', default: false },
    addTags: { type: 'boolean', default: false },
    useHashTags: { type: 'boolean', default: false },
    outputFormat: { type: 'string', default: output_format_1.OutputFormat.ObsidianMD },
    skipEnexFileNameFromOutputPath: { type: 'boolean', default: false },
    keepMDCharactersOfENNotes: { type: 'boolean', default: false },
    monospaceIsCodeBlock: { type: 'boolean', default: false },
    resourcesDir: { type: 'string', default: '_resources' },
};
exports.store = new Store({ schema, watch: true });
//# sourceMappingURL=store.js.map