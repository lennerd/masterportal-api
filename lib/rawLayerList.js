"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initializeLayerList = initializeLayerList;
exports.getLayerWhere = getLayerWhere;
exports.getLayerList = getLayerList;
exports.getDisplayNamesOfFeatureAttributes = getDisplayNamesOfFeatureAttributes;

var _defaults = require("./defaults");

var _defaults2 = _interopRequireDefault(_defaults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** layerList that contains all known services.
 * @type{Array}
 * @ignore
 */
var layerList = [];

/**
 * Initializes the layer list with either an object or an URL. May be used again to override the layer list.
 * createMap will call this for you, but won't notify you of when it's done. Use this function manually with a
 * callback to know when layers can be added programmatically.
 * @param {(string|object)} [layerConf="https://geoportal-hamburg.de/lgv-config/services-internet.json"] - either the URL to fetch the services from, or the object containing the services
 * @param {function} [callback] - called with services after loaded; called with false and error on error
 * @returns {undefined} nothing, add callback to receive layerList
 */
function initializeLayerList() {
    var layerConf = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _defaults2.default.layerConf;
    var callback = arguments[1];

    if (Array.isArray(layerConf)) {
        // case: parameter was services.json contents
        layerList = layerConf;
        if (typeof callback === "function") {
            callback(layerList);
            return;
        }
        return;
    }

    // case: parameter is URL
    var Http = new XMLHttpRequest();

    Http.open("GET", layerConf);
    Http.timeout = 10000;
    Http.send();
    Http.onload = function () {
        layerList = JSON.parse(Http.responseText);
        if (typeof callback === "function") {
            return callback(layerList);
        }
        return true;
    };
    Http.onerror = function (e) {
        console.error("An error occured when trying to fetch services from '" + layerConf + "':", e);
        callback(false, e);
    };
}

/**
 * Returns the first entry in layerList matching the given searchAttributes.
 * @param {object} searchAttributes - key/value-pairs to be searched for, e.g. { typ: "WMS" } to get the first WMS
 * @returns {?object} first layer matching the searchAttributes or null if none was found
 */
function getLayerWhere(searchAttributes) {
    var keys = Object.keys(searchAttributes);

    return layerList.find(function (entry) {
        return keys.every(function (key) {
            return entry[key] === searchAttributes[key];
        });
    }) || null;
}

/** @returns {object[]} complete layerList as initialized */
function getLayerList() {
    return layerList;
}

/**
 * Returns display names map for a layer, or display name for a specific attribute.
 * @param {string} layerId - if of layer to fetch display names for
 * @param {string} [featureAttribute] - if given, only one entry of map is returned
 * @returns {?(object|string)} - map of originalName->displayName or name of featureAttribute if specified; if layer or featureAttribute not found, null
 */
function getDisplayNamesOfFeatureAttributes(layerId, featureAttribute) {
    var attributes = getLayerWhere({ id: layerId });

    if (attributes && typeof featureAttribute === "string") {
        var displayName = attributes.gfiAttributes && attributes.gfiAttributes[featureAttribute];

        return typeof displayName === "string" ? displayName : null;
    } else if (attributes) {
        return attributes.gfiAttributes || null;
    }

    return null;
}