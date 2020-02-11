"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isLayerVisibleInResolution = isLayerVisibleInResolution;
exports.getLegendURLs = getLegendURLs;
/**
 * @param {ol.Layer} layer - layer to check
 * @param {number} params - parameter object
 * @param {number} [params.resolution] - resolution to check; if not given, map is required
 * @param {object} [params.map] - map to check; if not given, resolution is required
 * @returns {boolean} whether layer is visible in given resolution
 */
function isLayerVisibleInResolution(layer, _ref) {
    var resolution = _ref.resolution,
        map = _ref.map;

    var r = typeof resolution === "undefined" ? map.getView().getResolution() : resolution;

    return layer.getMaxResolution() >= r && r >= layer.getMinResolution();
}

/**
 * Generates an array of URLs that are supposed to hold legend graphics.
 *
 * @param {*} rawLayer - layer specification as in services.json
 * @param {string} [rawLayer.layers=""] - comma separated list of service layers
 * @returns {string[]} URLs of legend graphics for the rawLayer.
 */
function getLegendURLs(_ref2) {
    var legendURL = _ref2.legendURL,
        _ref2$layers = _ref2.layers,
        layers = _ref2$layers === undefined ? "" : _ref2$layers,
        url = _ref2.url,
        typ = _ref2.typ,
        format = _ref2.format,
        version = _ref2.version;

    if (legendURL) {
        return legendURL === "ignore" ? [] : [legendURL];
    }

    return layers.split(",").filter(function (x) {
        return x;
    } /* filters empty string since it's falsy */).map(function (layerName) {
        return url + "?SERVICE=" + typ + "&REQUEST=GetLegendGraphic&FORMAT=" + (format || "image/png") + "&VERSION=" + version + "&LAYER=" + layerName;
    });
}