
export function splitArrayIntoChunks(array: any, chunkSize: any) {
    return array.reduce((result: any, item: any, index: any) => {
        const chunkIndex = Math.floor(index / chunkSize);
        if (!result[chunkIndex]) {
            result[chunkIndex] = []; // Start new group
        }
        result[chunkIndex].push(item);
        return result;
    }, []);
}
