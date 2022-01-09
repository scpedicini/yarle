"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWebClip = exports.isComplex = exports.getNoteContent = void 0;
const getNoteContent = (note) => {
    return note.content;
};
exports.getNoteContent = getNoteContent;
const isComplex = (note) => {
    return note.resource ? true : false;
};
exports.isComplex = isComplex;
const isWebClip = (note) => {
    return note['note-attributes'] && (note['note-attributes']['source-application'] === 'webclipper.evernote' ||
        note['note-attributes']['source'] === 'web.clip7');
};
exports.isWebClip = isWebClip;
//# sourceMappingURL=note-utils.js.map