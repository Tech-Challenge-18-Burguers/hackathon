"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeExtension = removeExtension;
exports.getExtension = getExtension;
function removeExtension(filename) {
    return filename.substring(0, filename.lastIndexOf('.') - 1);
}
function getExtension(filename) {
    return filename.substring(filename.lastIndexOf('.'), filename.length);
}
