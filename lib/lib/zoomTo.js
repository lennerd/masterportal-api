"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = zoomTo;
exports.zoomToSearchResult = zoomToSearchResult;

var _Polygon = require("ol/geom/Polygon");

var _Polygon2 = _interopRequireDefault(_Polygon);

var _Point = require("ol/geom/Point");

var _Point2 = _interopRequireDefault(_Point);

var _coordsToPairs = require("./coordsToPairs");

var _coordsToPairs2 = _interopRequireDefault(_coordsToPairs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Zooms the map to a geometry.
 * @param {ol/Map} map map object to zoom
 * @param {(ol/geom/SimpleGeometry|ol/extent)} geometryOrExtent the geometry or extent to zoom to
 * @param {object} [params={}] forwarded to ol/View.fit, may e.g. specify duration of animation {@link https://openlayers.org/en/latest/apidoc/module-ol_View.html#~FitOptions}
 * @returns {void}
 */
function zoomTo(map, geometryOrExtent) {
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    map.getView().fit(geometryOrExtent, params);
}

/**
 * Zooms the map to a searchResult.
 * @param {ol/Map} map map object to zoom
 * @param {SearchResult} searchResult result from searchAddress
 * @param {object} [params={}] forwarded to ol/View.fit, may e.g. specify duration of animation {@link https://openlayers.org/en/latest/apidoc/module-ol_View.html#~FitOptions}
 * @returns {void}
 */
function zoomToSearchResult(map, searchResult) {
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var geom = void 0;

    switch (searchResult.geometry.type) {
        case "Polygon":
            geom = new _Polygon2.default([(0, _coordsToPairs2.default)(searchResult.geometry.coordinates)]);
            break;
        case "Point":
            geom = new _Point2.default(searchResult.geometry.coordinates.map(parseFloat));
            break;
        default:
            console.warn("ZoomTo for type " + searchResult.geometry.type + " not implemented.");
            return;
    }

    zoomTo(map, geom, params);
}