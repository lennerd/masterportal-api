"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getProjection = getProjection;
exports.registerProjections = registerProjections;
exports.getProjections = getProjections;
exports.getMapProjection = getMapProjection;
exports.transform = transform;
exports.transformToMapProjection = transformToMapProjection;
exports.transformFromMapProjection = transformFromMapProjection;

var _proj = require("proj4");

var _proj2 = _interopRequireDefault(_proj);

var _proj3 = require("ol/proj.js");

var Proj = _interopRequireWildcard(_proj3);

var _proj4 = require("ol/proj/proj4.js");

var _defaults = require("./defaults");

var _defaults2 = _interopRequireDefault(_defaults);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns the proj4 projection definition for a registered name.
 * @param {string} name - projection name as written in [0] position of namedProjections
 * @returns {(object|undefined)} proj4 projection object or undefined
 */
function getProjection(name) {
    return _proj2.default.defs(name);
}

/**
 * The configured named projections and proj4 have to be registered initially.
 * @param {string[]} [namedProjections=[
        ["EPSG:25832", "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"]
    ]] - projection name, projection definition string
 * @returns {undefined}
 */
function registerProjections() {
    var namedProjections = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _defaults2.default.namedProjections;

    _proj2.default.defs(namedProjections);
    (0, _proj4.register)(_proj2.default);
    namedProjections.forEach(function (projection) {
        Proj.addProjection(Proj.get(projection[0]));
        getProjection(projection[0]).masterportal = true;
    });
}

/**
 * Returns all known projections.
 * @returns {object[]} array of projection objects with their name added
 */
function getProjections() {
    var projections = Object.keys(_proj2.default.defs).map(function (name) {
        return Object.assign(_proj2.default.defs(name), { name: name });
    });

    // return no duplicates and only the projections which are registred with masterportal=true
    return projections.filter(function (projection, index, self) {
        return index === self.indexOf(projection) && projection.masterportal === true;
    });
}

/**
 * Returns the currently active projection's name of a map's view.
 * @param {ol.Map} map - map to get projection of
 * @returns {string} active projection name of map
 */
function getMapProjection(map) {
    return map.getView().getProjection().getCode();
}

/**
 * Resolves a string to a projection object; everything else is returned as-is.
 * If a string can not be resolved, returns undefined.
 * @param {(string|object)} projection - projection name or projection
 * @returns {(object|undefined)} proj4 projection or undefined or parameter
 */
function getProj4Projection(projection) {
    return typeof projection === "string" ? getProjection(projection) : projection;
}

/**
 * Transforms a given point from a source to a target projection.
 * @param {(string|object)} sourceProjection - projection name or projection of point
 * @param {(string|object)} targetProjection - projection name or projection to project point to
 * @param {number[]} point - point to project
 * @returns {number[]|undefined} transformed point
 */
function transform(sourceProjection, targetProjection, point) {
    var source = getProj4Projection(sourceProjection),
        target = getProj4Projection(targetProjection);

    if (source && target && point) {
        return (0, _proj2.default)(source, target, point);
    }

    console.error("Cancelled coordinate transformation with invalid parameters: " + sourceProjection + "; " + targetProjection + "; " + point);
    return undefined;
}

/**
 * Projects a point to the given map.
 * @param {ol.Map} map - map to project to
 * @param {(string|object)} sourceProjection - projection name or projection of point
 * @param {number[]} point - point to project
 * @returns {number[]|undefined} new point or undefined
 */
function transformToMapProjection(map, sourceProjection, point) {
    return transform(sourceProjection, getMapProjection(map), point);
}

/**
 * Projects a point from the given map.
 * @param {ol.Map} map - map to project from, and point must be in map's projection
 * @param {(string|object)} targetProjection - projection name or projection to project to
 * @param {number[]} point - point to project
 * @returns {(number[]|undefined)} new point or undefined
 */
function transformFromMapProjection(map, targetProjection, point) {
    return transform(getMapProjection(map), targetProjection, point);
}