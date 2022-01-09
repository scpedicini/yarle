"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processNode = void 0;
const os_1 = require("os");
const templates_1 = require("./utils/templates/templates");
const utils_1 = require("./utils");
const yarle_1 = require("./yarle");
const process_resources_1 = require("./process-resources");
const convert_html_to_md_1 = require("./convert-html-to-md");
const convert_to_html_1 = require("./convert-to-html");
const loggerInfo_1 = require("./utils/loggerInfo");
const processNode = (note, notebookName) => {
    const dateStarted = new Date();
    loggerInfo_1.loggerInfo(os_1.EOL);
    loggerInfo_1.loggerInfo(`Conversion started at ${dateStarted}`);
    if (Array.isArray(note.content)) {
        note.content = note.content.join('');
    }
    let noteData = {
        title: note.title,
        content: note.content,
        htmlContent: note.content,
        originalContent: note.content,
    };
    // tslint:disable-next-line:no-console
    loggerInfo_1.loggerInfo(`Converting note "${noteData.title}"...`);
    try {
        if (utils_1.isComplex(note)) {
            noteData.htmlContent = process_resources_1.processResources(note);
        }
        noteData.htmlContent = process_resources_1.extractDataUrlResources(note, noteData.htmlContent);
        noteData = Object.assign(Object.assign({}, noteData), convert_html_to_md_1.convertHtml2Md(yarle_1.yarleOptions, noteData));
        noteData = Object.assign(Object.assign({}, noteData), utils_1.getMetadata(note, notebookName));
        noteData = Object.assign(Object.assign({}, noteData), utils_1.getTags(note));
        const data = templates_1.applyTemplate(noteData, yarle_1.yarleOptions);
        // tslint:disable-next-line:no-console
        // loggerInfo(`data =>\n ${JSON.stringify(data)} \n***`);
        utils_1.saveMdFile(data, note);
        if (yarle_1.yarleOptions.keepOriginalHtml) {
            convert_to_html_1.convert2Html(noteData);
            utils_1.saveHtmlFile(noteData, note);
        }
    }
    catch (e) {
        // tslint:disable-next-line:no-console
        loggerInfo_1.loggerInfo(`Failed to convert note: ${noteData.title}, ${JSON.stringify(e)}`);
    }
    // tslint:disable-next-line:no-console
    const dateFinished = new Date();
    const conversionDuration = (dateFinished.getTime() - dateStarted.getTime()) / 1000; // in seconds.
    loggerInfo_1.loggerInfo(`Conversion finished at ${dateFinished}`);
    loggerInfo_1.loggerInfo(`Note "${noteData.title}" converted successfully in ${conversionDuration} seconds.`);
};
exports.processNode = processNode;
//# sourceMappingURL=process-node.js.map