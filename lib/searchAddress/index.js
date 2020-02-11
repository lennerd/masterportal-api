"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getGazetteerUrl = exports.setGazetteerUrl = exports.searchTypes = exports.search = undefined;

var _search = require("./search");

var _types = require("./types");

var _gazetteerUrl = require("./gazetteerUrl");

exports.search = _search.search;
exports.searchTypes = _types.searchTypes;
exports.setGazetteerUrl = _gazetteerUrl.setGazetteerUrl;
exports.getGazetteerUrl = _gazetteerUrl.getGazetteerUrl;