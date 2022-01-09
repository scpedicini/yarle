"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapSettingsToYarleOptions = void 0;
const store_1 = require("./store");
const mapSettingsToYarleOptions = () => {
    return {
        enexSources: store_1.store.get('enexSources'),
        outputDir: store_1.store.get('outputDir'),
        isMetadataNeeded: true,
        isNotebookNameNeeded: store_1.store.get('isNotebookNameNeeded'),
        isZettelkastenNeeded: store_1.store.get('isZettelkastenNeeded'),
        plainTextNotesOnly: store_1.store.get('plainTextNotesOnly'),
        skipLocation: !store_1.store.get('addLocation'),
        skipCreationTime: !store_1.store.get('addCreationTime'),
        skipUpdateTime: !store_1.store.get('addUpdateTime'),
        skipSourceUrl: !store_1.store.get('addSourceUrl'),
        skipWebClips: !store_1.store.get('addWebClips'),
        skipTags: !store_1.store.get('addTags'),
        useHashTags: store_1.store.get('useHashTags'),
        outputFormat: store_1.store.get('outputFormat'),
        skipEnexFileNameFromOutputPath: store_1.store.get('skipEnexFileNameFromOutputPath'),
        keepMDCharactersOfENNotes: store_1.store.get('keepMDCharactersOfENNotes'),
        monospaceIsCodeBlock: store_1.store.get('monospaceIsCodeBlock'),
        keepOriginalHtml: store_1.store.get('keepOriginalHtml'),
        currentTemplate: store_1.store.get('currentTemplate'),
        resourcesDir: store_1.store.get('resourcesDir'),
        nestedTags: {
            separatorInEN: store_1.store.get('nestedTags.separatorInEN'),
            replaceSeparatorWith: store_1.store.get('nestedTags.replaceSeparatorWith'),
            replaceSpaceWith: store_1.store.get('nestedTags.replaceSpaceWith'),
        },
        logseqSettings: {
            journalNotes: store_1.store.get('logseqSettings.journalNotes'),
        },
        dateFormat: store_1.store.get('dateFormat'),
        keepImageSize: store_1.store.get('keepImageSize'),
        keepOriginalAmountOfNewlines: store_1.store.get('keepOriginalAmountOfNewlines'),
        addExtensionToInternalLinks: store_1.store.get('addExtensionToInternalLinks'),
        generateNakedUrls: store_1.store.get('generateNakedUrls'),
        haveEnexLevelResources: store_1.store.get('haveEnexLevelResources'),
    };
};
exports.mapSettingsToYarleOptions = mapSettingsToYarleOptions;
//# sourceMappingURL=settingsMapper.js.map