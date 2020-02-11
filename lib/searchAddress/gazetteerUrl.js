"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setGazetteerUrl = setGazetteerUrl;
exports.getGazetteerUrl = getGazetteerUrl;

var _defaults = require("../defaults");

var _defaults2 = _interopRequireDefault(_defaults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Holds URL of gazetteer to use in search function
var gazetteerUrl = _defaults2.default.gazetteerUrl;

/**
 * Sets the gazetteerUrl to be used by the search function.
 * If parameter is falsy, url from defaults.js is kept.
 * @param {String} url url to use for searchAddress
 * @returns {void}
 */
function setGazetteerUrl(url) {
  url ? gazetteerUrl = url : null;
}

/**
 * Retrieves active gazetteer URL.
 * @returns {string} currently set gazetteer URL
 */
function getGazetteerUrl() {
  return gazetteerUrl;
}