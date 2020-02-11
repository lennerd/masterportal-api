"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createMap = createMap;

var _ol = require("ol");

var _interaction = require("ol/interaction.js");

var _setBackgroundImage = require("./lib/setBackgroundImage");

var _setBackgroundImage2 = _interopRequireDefault(_setBackgroundImage);

var _getInitialLayers = require("./lib/getInitialLayers");

var _getInitialLayers2 = _interopRequireDefault(_getInitialLayers);

var _defaults = require("./defaults");

var _defaults2 = _interopRequireDefault(_defaults);

var _wms = require("./layer/wms");

var wms = _interopRequireWildcard(_wms);

var _geojson = require("./layer/geojson");

var geojson = _interopRequireWildcard(_geojson);

var _mapView = require("./mapView");

var _rawLayerList = require("./rawLayerList");

var _crs = require("./crs");

var _searchAddress = require("./searchAddress");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * lookup for layer constructors
 * @ignore
 */
var layerBuilderMap = {
    wms: wms,
    geojson: geojson
},
    originalAddLayer = _ol.PluggableMap.prototype.addLayer;

/**
 * Adds a layer to the map, or adds a layer to the map by id.
 * This id is looked up within the array of all known services.
 *
 * Make sure services have been loaded with a callback on createMap
 * if you request the services from the internet.
 *
 * This function is available on all ol/Map instances.
 * @param {(string|ol/Layer)} layerOrId - if of layer to add to map
 * @param {object} [params] - optional parameter object
 * @param {boolean} [params.visibility=true] - whether added layer is initially visible
 * @param {Number} [params.transparency=0] - how visible the layer is initially
 * @returns {?ol.Layer} added layer
 */
function addLayer(layerOrId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { visibility: true, transparency: 0 };

    var layer, layerBuilder;

    // if parameter is id, create and add layer with masterportalAPI mechanisms
    if (typeof layerOrId === "string") {
        var rawLayer = (0, _rawLayerList.getLayerWhere)({ id: layerOrId });

        if (!rawLayer) {
            console.error("Layer with id '" + layerOrId + "' not found. No layer added to map.");
            return null;
        }
        layerBuilder = layerBuilderMap[rawLayer.typ.toLowerCase()];
        if (!layerBuilder) {
            console.error("Layer with id '" + layerOrId + "' has unknown type '" + rawLayer.typ + "'. No layer added to map.");
            return null;
        }

        layer = layerBuilder.createLayer(rawLayer, { map: this });
        layer.setVisible(typeof params.visibility === "boolean" ? params.visibility : true);
        layer.setOpacity(typeof params.transparency === "number" ? (100 - params.transparency) / 100 : 1);
        originalAddLayer.call(this, layer);
        return layer;
    }

    // else use original function
    return originalAddLayer.call(this, layerOrId);
}

_ol.PluggableMap.prototype.addLayer = addLayer;

/**
 * Creates an openlayers map according to configuration. Does not set many default values itself, but uses function that do.
 * Check the called functions for default values, or [the defaults file]{@link ./defaults.js}.
 * @param {object} [config] - configuration object - falls back to defaults if none given
 * @param {string} [config.target="map"] - div id to render map to
 * @param {string} [config.backgroundImage] - background image for map; "" to use none
 * @param {string} [config.epsg] - CRS to use
 * @param {number[]} [config.extent] - extent to use
 * @param {Array.<{resolution: number, scale: number, zoomLevel: number}>} [config.options] - zoom level definition
 * @param {Array.<string[]>} [config.options] - each sub-array has two values: projection name, and projection description
 * @param {number} [config.startResolution] - initial resolution
 * @param {number[]} [config.startCenter] - initial position
 * @param {(string|object)} [config.layerConf] - services registry or URL thereof
 * @param {string} [config.gazetteerUrl] - url of gazetteer to use in searchAddress
 * @param {object} [params={}] - parameter object
 * @param {object} [params.mapParams] - additional parameter object that is spread into the ol.Map constructor object
 * @param {function} [params.callback] - optional callback for layer list loading
 * @returns {object} map object from ol
 */
function createMap() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _defaults2.default;

    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        mapParams = _ref.mapParams,
        callback = _ref.callback;

    (0, _crs.registerProjections)(config.namedProjections);
    (0, _setBackgroundImage2.default)(config);
    (0, _searchAddress.setGazetteerUrl)(config.gazetteerUrl);
    var map = new _ol.Map(Object.assign({
        target: config.target || _defaults2.default.target,
        interactions: (0, _interaction.defaults)({ altShiftDragRotate: false, pinchRotate: false }),
        controls: [],
        view: (0, _mapView.createMapView)(config)
    }, mapParams));

    // extend callback to load configured initial layers
    (0, _rawLayerList.initializeLayerList)(config.layerConf, function (param, error) {
        (0, _getInitialLayers2.default)(config).forEach(function (layer) {
            return map.addLayer(layer.id, layer);
        });

        if (typeof callback === "function") {
            return callback(param, error);
        }

        return null;
    });

    return map;
}