"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setCustomStyles = setCustomStyles;

var _style = require("ol/style.js");

var _marker = require("../../../public/marker.svg");

var _marker2 = _interopRequireDefault(_marker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var customStyles = {};

/**
 * Allows setting custom styles. When available, they will be used.
 * @param {object.<string, ol.Style>} styles - lookup from feature's geometry type (Point, LineString, ...) to style
 * @returns {undefined}
 */
function setCustomStyles(styles) {
    customStyles = styles;
}

// // // STYLE PARTS
var marker = new _style.Icon({
    src: _marker2.default,
    // center bottom of marker 📍 is intended to show the spot
    anchor: [0.5, 1]
}),
    stroke = new _style.Stroke({
    width: 2,
    color: "#005CA9"
}),
    fill = new _style.Fill({
    color: "#005CA915"
}),


// // // STYLES
pointStyle = new _style.Style({ image: marker }),
    lineStyle = new _style.Style({ stroke: stroke }),
    polygonStyle = new _style.Style({ stroke: stroke, fill: fill }),
    circleStyle = new _style.Style({ stroke: stroke, fill: fill }),
    geometryCollectionStyle = new _style.Style({ stroke: stroke, fill: fill, image: marker }),


// // // DEFAULT STYLE LOOKUP
defaultStyles = {
    Point: pointStyle,
    LineString: lineStyle,
    MultiLineString: lineStyle,
    MultiPoint: pointStyle,
    MultiPolygon: polygonStyle,
    Polygon: polygonStyle,
    GeometryCollection: geometryCollectionStyle,
    Circle: circleStyle
};

/**
 * Style function according to https://openlayers.org/en/latest/apidoc/module-ol_style_Style.html#~StyleFunction.
 * Will use custom values first, if set, and fall back on holes in definition.
 * @param {ol.Feature} feature - to be styled
 * @returns {ol.Style} style for feature
 * @ignore
 */
function style(feature) {
    var type = feature.getGeometry().getType();

    return customStyles[type] || defaultStyles[type];
}

exports.default = style;