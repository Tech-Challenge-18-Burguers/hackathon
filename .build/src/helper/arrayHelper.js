"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitArrayIntoChunks = splitArrayIntoChunks;
function splitArrayIntoChunks(array, chunkSize) {
    return array.reduce((result, item, index) => {
        const chunkIndex = Math.floor(index / chunkSize);
        if (!result[chunkIndex]) {
            result[chunkIndex] = []; // Start new group
        }
        result[chunkIndex].push(item);
        return result;
    }, []);
}
