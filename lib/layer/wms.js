"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.generateSessionId = generateSessionId;
exports.makeParams = makeParams;
exports.createLayerSource = createLayerSource;
exports.createLayer = createLayer;
exports.updateSource = updateSource;
exports.getGfiURL = getGfiURL;

var _Tile = require("ol/layer/Tile");

var _Tile2 = _interopRequireDefault(_Tile);

var _Image = require("ol/layer/Image");

var _Image2 = _interopRequireDefault(_Image);

var _TileWMS = require("ol/source/TileWMS.js");

var _TileWMS2 = _interopRequireDefault(_TileWMS);

var _ImageWMS = require("ol/source/ImageWMS.js");

var _ImageWMS2 = _interopRequireDefault(_ImageWMS);

var _rawLayerList = require("../rawLayerList");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @returns {number} random session id in range (0, 9999999) */
function generateSessionId() {
    return Math.floor(Math.random() * 9999999);
}

/**
 * Creates query parameters for webservice requests from rawLayer.
 * @param {object} rawLayer - layer specification as in services.json
 * @param {string} [rawLayer.format="image/png"] - format of images requested
 * @param {string} layers - comma-separated list of requested layers
 * @param {version} version - webservice version as string, e.g. "1.1.1"
 * @param {boolean} transparent - whether tiles from this service should have transparency where no information is available
 * @param {boolean} singleTile - whether only one tile shall be requested that fills the whole view
 * @param {(string|number)} tilesize - if singleTile is true, this is the requested tilesize
 * @returns {object} maps query parameter names to values
 */
function makeParams(rawLayer) {
    return Object.assign({
        SESSIONID: generateSessionId(),
        FORMAT: rawLayer.format || "image/png",
        LAYERS: rawLayer.layers,
        VERSION: rawLayer.version,
        TRANSPARENT: rawLayer.transparent,
        SINGLETILE: rawLayer.singleTile
    }, rawLayer.singleTile ? {} : { WIDTH: rawLayer.tilesize, HEIGHT: rawLayer.tilesize });
}

/**
 * Creates an ol/source element for the rawLayer.
 * @param {object} rawLayer - layer specification as in services.json
 * @param {string} [rawLayer.serverType] - optional servertype definition: "geoserver" or "mapserver" or "qgis"
 * @returns {(ol.source.TileWMS|ol.source.ImageWMS)} TileWMS or ImageWMS, depending on whether singleTile is true.
 */
function createLayerSource(rawLayer) {
    var params = makeParams(rawLayer);

    if (rawLayer.singleTile) {
        return new _ImageWMS2.default({
            url: rawLayer.url,
            params: params,
            serverType: rawLayer.serverType
        });
    }
    return new _TileWMS2.default({
        url: rawLayer.url,
        params: params,
        gutter: rawLayer.gutter || 0
    });
}

/**
 * Creates complete ol/Layer from rawLayer containing all required children.
 * @param {*} rawLayer - layer specification as in services.json
 * @returns {ol.Layer} Layer that can be added to map.
 */
function createLayer(rawLayer) {
    var source = createLayerSource(rawLayer),
        Layer = rawLayer.singleTile ? _Image2.default : _Tile2.default;

    return new Layer({
        source: source,
        minResolution: rawLayer.minScale,
        maxResolution: rawLayer.maxScale,
        // id passed to help identification in services.json
        id: rawLayer.id
    });
}

/**
 * Forces an update by giving a layer a new sessionID.
 * @param {ol.Layer} layer - the layer that is to be updated
 * @returns {number} the new sessionID
 */
function updateSource(layer) {
    var oldSessionId = layer.getSource().getParams().SESSIONID;
    var newSessionId = oldSessionId;

    // to avoid rolling the same ID again; never happens except in your presentation
    while (oldSessionId === newSessionId) {
        newSessionId = generateSessionId();
    }

    layer.getSource().updateParams({ SESSIONID: newSessionId });
    return newSessionId;
}

/**
 * Creates the gfiURL from clicked layer, map, and coordinate.
 * @param {ol.Layer} layer - what to get the gfiURL for
 * @param {ol.Map} map - needed for resolution/projection
 * @param {ol.coordinate} coordinate - which point to get the gfiURL for
 * @returns {(string|undefined)} the gfiURL, or undefined if it could not be constructed
 */
function getGfiURL(layer, map, coordinate) {
    var rawLayer = (0, _rawLayerList.getLayerWhere)({ Id: layer.get("id") }),
        resolution = map.getView().getResolution(),
        projection = map.getView().getProjection(),
        params = Object.assign({
        INFO_FORMAT: rawLayer && rawLayer.infoFormat || "text/xml"
    }, rawLayer && typeof rawLayer.featureCount !== "undefined" ? { FEATURE_COUNT: rawLayer.featureCount } : {});

    return layer.getSource().getFeatureInfoUrl(coordinate, resolution, projection, params);
}