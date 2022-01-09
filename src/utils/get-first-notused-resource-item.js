"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirstNotUsedResourceItem = void 0;
const getFirstNotUsedResourceItem = (itemHash) => {
    const firstUnusedItemId = Object
        .keys(itemHash)
        .filter(itemId => itemId.startsWith('any'))
        .sort()
        .find(itemId => itemHash[itemId]['alreadyUsed'] === false);
    return itemHash[firstUnusedItemId];
};
exports.getFirstNotUsedResourceItem = getFirstNotUsedResourceItem;
//# sourceMappingURL=get-first-notused-resource-item.js.map