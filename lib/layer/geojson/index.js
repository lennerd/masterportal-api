"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setCustomStyles = undefined;
exports.createLayerSource = createLayerSource;
exports.createLayer = createLayer;
exports.updateSource = updateSource;
exports.setFeatureStyle = setFeatureStyle;
exports.hideAllFeatures = hideAllFeatures;
exports.showAllFeatures = showAllFeatures;
exports.showFeaturesById = showFeaturesById;

var _Vector = require("ol/layer/Vector");

var _Vector2 = _interopRequireDefault(_Vector);

var _Vector3 = require("ol/source/Vector");

var _Vector4 = _interopRequireDefault(_Vector3);

var _GeoJSON = require("ol/format/GeoJSON.js");

var _GeoJSON2 = _interopRequireDefault(_GeoJSON);

var _style = require("./style");

var _style2 = _interopRequireDefault(_style);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// forward import to export
exports.setCustomStyles = _style.setCustomStyles;

/**
 * onAddFeature function for source that ensures a feature has an id.
 * If feature has no id, the ol_uid is set to feature.id.
 * @param {object} param - parameter object
 * @param {ol.Feature} param.feature - openlayers feature added to source
 * @returns {undefined}
 * @ignore
 */

function onAddFeature(_ref) {
    var feature = _ref.feature;

    if (typeof feature.getId() === "undefined") {
        feature.setId(feature.ol_uid);
    }
}

/**
 * Creates the VectorSource for a GeoJSON layer. It will ensure each feature has the field id set to use with the other exported geojson functions.
 * @param {object} rawLayer - rawLayer as specified in services.json
 * @param {string} [rawLayer.url] - url to fetch geojson from; if no rawLayer.features given, this is required
 * @param {object} [rawLayer.features] - if features are transmitted via rawLayer, they will be used instead of requesting an URL
 * @param {ol.Map} [map] - map the geojson is to be projected on; if rawLayer.features given, this is used to infer the target projection
 * @returns {ol.source.Vector} created VectorSource
 */
function createLayerSource(_ref2, map) {
    var features = _ref2.features,
        url = _ref2.url;

    var parser = new _GeoJSON2.default(),
        source = new _Vector4.default(features ? {} : { format: parser, url: url });

    source.on("addfeature", onAddFeature);

    // if features given directly, add them here _after_ source has eventListener for "addfeature"
    if (features) {
        var options = map ? { featureProjection: map.getView().getProjection() } : {},
            parsedFeatures = parser.readFeatures(features, options);

        source.addFeatures(parsedFeatures);
    }

    return source;
}

/**
 * Creates a layer for GeoJSON.
 * @param {object} rawLayer - rawLayer as specified in services.json
 * @param {object} [param={}] - parameter object
 * @param {ol.Map} [param.map] - map the geojson is to be projected on
 * @param {ol.Style} [param.layerStyle] - optional style; if not given, default styling (modifiable by setCustomStyles) is used
 * @returns {ol.layer.Vector} Layer with id and source specified in rawLayer
 */
function createLayer(rawLayer) {
    var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        map = _ref3.map,
        layerStyle = _ref3.layerStyle;

    return new _Vector2.default({
        id: rawLayer.id,
        source: createLayerSource(rawLayer, map),
        style: layerStyle || _style2.default
    });
}

/**
 * GeoJSON layer with an URL will be reloaded. All other layers will be refreshed.
 * @param {ol.layer.Vector} layer - GeoJSON layer to update
 * @returns {undefined}
 */
function updateSource(layer) {
    // openlayers named this "refresh", but it also means "reload" if an URL is set
    layer.getSource().refresh();
}

/**
 * Sets a style to all given features.
 * @param {ol.Feature[]} features - openlayers features to be styled
 * @param {ol.style.Style~StyleLike} featureStyle - style, array of styles, or style function
 * @returns {undefined}
 */
function setFeatureStyle(features, featureStyle) {
    features.forEach(function (feature) {
        return feature.setStyle(featureStyle);
    });
}

/**
 * @param {ol.Layer} layer - layer to hide all features of
 * @returns {undefined}
 */
function hideAllFeatures(layer) {
    // () => null is the "do not display" function for openlayers (overriding VectorLayer styles)
    setFeatureStyle(layer.getSource().getFeatures(), function () {
        return null;
    });
}

/**
 * @param {ol.Layer} layer - layer to show all features of
 * @returns {undefined}
 */
function showAllFeatures(layer) {
    // if feature has undefined style, openlayers will check containing VectorLayer for styles
    setFeatureStyle(layer.getSource().getFeatures(), undefined);
}

/**
 * @param {ol.Layer} layer - layer to show some features of
 * @param {string[]} featureIdList - list of feature.id to show
 * @returns {undefined}
 */
function showFeaturesById(layer, featureIdList) {
    var features = layer.getSource().getFeatures().filter(function (feature) {
        return featureIdList.indexOf(feature.getId()) >= 0;
    });

    hideAllFeatures(layer);
    setFeatureStyle(features, undefined);
}