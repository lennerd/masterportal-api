"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.crs = exports.search = exports.rawLayerList = exports.setGazetteerUrl = exports.setBackgroundImage = exports.layerLib = exports.geojson = exports.wms = exports.createMapView = exports.createMap = undefined;

var _map = require("./map");

var _mapView = require("./mapView");

var _crs = require("./crs");

var crs = _interopRequireWildcard(_crs);

var _rawLayerList = require("./rawLayerList");

var rawLayerList = _interopRequireWildcard(_rawLayerList);

var _wms = require("./layer/wms");

var wms = _interopRequireWildcard(_wms);

var _geojson = require("./layer/geojson");

var geojson = _interopRequireWildcard(_geojson);

var _lib = require("./layer/lib");

var layerLib = _interopRequireWildcard(_lib);

var _searchAddress = require("./searchAddress");

var _setBackgroundImage = require("./lib/setBackgroundImage");

var _setBackgroundImage2 = _interopRequireDefault(_setBackgroundImage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.createMap = _map.createMap;
exports.createMapView = _mapView.createMapView;
exports.wms = wms;
exports.geojson = geojson;
exports.layerLib = layerLib;
exports.setBackgroundImage = _setBackgroundImage2.default;
exports.setGazetteerUrl = _searchAddress.setGazetteerUrl;
exports.rawLayerList = rawLayerList;
exports.search = _searchAddress.search;
exports.crs = crs;