"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.encode = encode;
exports.getIdQuery = getIdQuery;
exports.searchGazetteer = searchGazetteer;

var _gazetteerUrl = require("./gazetteerUrl");

var _types = require("./types");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// query-string snippet
var featureQuery = "?service=WFS&request=GetFeature&version=2.0.0";

/**
 * Encodes given string(s) to be usable as URI component.
 * @param {(string[]|string)} v value(s) to encode
 * @returns {(string[]|string)} encoded value(s)
 * @ignore
 */
function encode(v) {
    return Array.isArray(v) ? v.map(encodeURIComponent) : encodeURIComponent(v);
}

/**
 * Builds the part of the url query where a stored query is addressed by id.
 * @param {string} key internal name for query froms searchTypes
 * @param {(string[]|string)} v string for single-value queries, string[] for multi-value queries, strings in order of appearance in URL
 * @returns {string} URL query part like "&StoryQuery_ID=queryName&param=value"
 * @ignore
 */
function getIdQuery(key, v) {
    var _searchTypes$STREET$s;

    return (_searchTypes$STREET$s = {}, _defineProperty(_searchTypes$STREET$s, _types.searchTypes.STREET, function (encodedValue) {
        return "&StoredQuery_ID=findeStrasse&strassenname=" + encodedValue;
    }), _defineProperty(_searchTypes$STREET$s, _types.searchTypes.DISTRICT, function (encodedValue) {
        return "&StoredQuery_ID=findeStadtteil&stadtteilname=" + encodedValue;
    }), _defineProperty(_searchTypes$STREET$s, _types.searchTypes.PARCEL, function (encodedValue) {
        return "&StoredQuery_ID=Flurstueck&gemarkung=" + encodedValue[0] + "&flurstuecksnummer=" + encodedValue[1];
    }), _defineProperty(_searchTypes$STREET$s, _types.searchTypes.STREET_KEY, function (encodedValue) {
        return "&StoredQuery_ID=findeStrassenSchluessel&strassenschluessel=" + encodedValue;
    }), _defineProperty(_searchTypes$STREET$s, _types.searchTypes.ADDRESS_AFFIXED, function (encodedValue) {
        return "&StoredQuery_ID=AdresseMitZusatz&strassenname=" + encodedValue[0] + "&hausnummer=" + encodedValue[1] + "&zusatz=" + encodedValue[2];
    }), _defineProperty(_searchTypes$STREET$s, _types.searchTypes.ADDRESS_UNAFFIXED, function (encodedValue) {
        return "&StoredQuery_ID=AdresseOhneZusatz&strassenname=" + encodedValue[0] + "&hausnummer=" + encodedValue[1];
    }), _defineProperty(_searchTypes$STREET$s, _types.searchTypes.HOUSE_NUMBERS_FOR_STREET, function (encodedValue) {
        return "&StoredQuery_ID=HausnummernZuStrasse&strassenname=" + encodedValue;
    }), _searchTypes$STREET$s)[key](encode(v));
}

/**
 * Retrieves xml text for a gazetteer search.
 * @param {string} key internal name for query froms searchTypes
 * @param {(string[]|string)} value value to search for
 * @returns {Promise<string>} xhr response text
 * @ignore
 */
function searchGazetteer(key, value) {
    return new Promise(function (resolve, reject) {
        var url = (0, _gazetteerUrl.getGazetteerUrl)() + featureQuery + getIdQuery(key, value),
            xhr = new XMLHttpRequest();

        xhr.onload = function () {
            return resolve(xhr.responseText);
        };
        xhr.onerror = function (e) {
            return reject(e);
        };
        xhr.open("GET", url);
        xhr.timeout = 6000;
        xhr.send();
    });
}