"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = coordsToPairs;
/**
 * Parses stramed coordinates to pairs of coordinates.
 * @param {(string[]|number[])} coordinates - flat coordinates where two following belong together
 * @returns {Array.<number[]>} array of coordinate pairs
 */
function coordsToPairs(coordinates) {
    var floatCoords = coordinates.map(parseFloat),
        result = [];

    while (floatCoords.length) {
        result.push(floatCoords.splice(0, 2));
    }

    return result;
}