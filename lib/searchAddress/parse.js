"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.parse = parse;

var _xml2js = require("xml2js");

var _xml2js2 = _interopRequireDefault(_xml2js);

var _types = require("./types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Flattens xml2js result a little to avoid unnecessary one-element arrays.
 * NOTE currently keeping special properties ($, _) of xml2js to keep attributes.
 * @param {*} a anything
 * @returns {*} a's first element if one-element array, else a
 * @ignore
 */
function flatten(a) {
    if (Array.isArray(a) && a.length === 1) {
        return flatten(a[0]);
    }
    return a;
}

/**
 * Recursively searches an object for a key.
 * Since parsed XML tends to contain extra arrays, those are stepped into.
 * @param {(object|Array)} o object to deep-search for key
 * @param {string} key key to search for
 * @returns {*} value behind key
 * @ignore
 */
function findKey(o, key) {
    if (Array.isArray(o)) {
        return o.map(function (x) {
            return findKey(x, key);
        }).filter(function (x) {
            return x;
        })[0];
    }
    if ((typeof o === "undefined" ? "undefined" : _typeof(o)) !== "object") {
        return null;
    }
    if (typeof o[key] !== "undefined") {
        return o[key];
    }
    return Object.keys(o).map(function (oKey) {
        return findKey(o[oKey], key);
    }).filter(function (x) {
        return x;
    })[0];
}

/**
 * Simply copies over all properties it can find.
 * @param {object} entry xml2js-parsed result entry
 * @returns {object} copied and flattened properties
 * @ignore
 */
function getAllPropertiesFlat(entry) {
    var properties = {
        objectType: Object.keys(entry)[0]
    };

    Object.keys(entry[properties.objectType][0]).forEach(function (propertyName) {
        properties[propertyName] = flatten(entry[properties.objectType][0][propertyName]);
    });

    return properties;
}

/**
 * Parses result entries; uses type-specific rules to determine name/geometry.
 * @param {object} entry xml2js-parsed result entry
 * @param {string} type type string
 * @returns {SearchResult} parsed search result for districts
 * @ignore
 */
function parseEntry(entry, type) {
    var searchResult = {
        type: type,
        properties: getAllPropertiesFlat(entry)
    },
        pos = findKey(searchResult.properties, "pos")[0],
        posList = findKey(searchResult.properties, "posList")[0];

    // setting name
    switch (type) {
        case _types.searchTypes.DISTRICT:
            searchResult.name = searchResult.properties.geographicIdentifier._;
            break;
        case _types.searchTypes.STREET_KEY:
        case _types.searchTypes.STREET:
            searchResult.name = searchResult.properties.strassenname;
            break;
        case _types.searchTypes.PARCEL:
            searchResult.name = searchResult.properties.gemarkung + "/" + searchResult.properties.flurstuecksnummer;
            break;
        case _types.searchTypes.HOUSE_NUMBERS_FOR_STREET:
            // house number like "11a" as name is not very telling - use "Streetname 11a" and save "11a" separately in properties
            searchResult.properties.hausnummerkomplett = "" + searchResult.properties.hausnummer._ + (searchResult.properties.hausnummernzusatz ? searchResult.properties.hausnummernzusatz._ : "");
            searchResult.name = searchResult.properties.geographicIdentifier._.split(searchResult.properties.hausnummerkomplett)[0] + searchResult.properties.hausnummerkomplett;
            break;
        case _types.searchTypes.ADDRESS_AFFIXED:
            searchResult.name = searchResult.properties.strassenname._ + " " + searchResult.properties.hausnummer._ + (searchResult.properties.hausnummernzusatz ? searchResult.properties.hausnummernzusatz._ : "");
            break;
        case _types.searchTypes.ADDRESS_UNAFFIXED:
            searchResult.name = searchResult.properties.strassenname._ + " " + searchResult.properties.hausnummer._;
            break;
        default:
            searchResult.name = null;
            console.error("Unknown type in searchAddress.parse: '" + type + "'. Could not set name.");
            break;
    }

    // setting geometry
    switch (type) {
        case _types.searchTypes.DISTRICT:
        case _types.searchTypes.STREET_KEY:
        case _types.searchTypes.STREET:
            // favour polygon where it's available
            searchResult.geometry = {
                type: posList ? "Polygon" : "Point",
                coordinates: (posList || pos).split(" ")
            };
            break;
        case _types.searchTypes.PARCEL:
        case _types.searchTypes.HOUSE_NUMBERS_FOR_STREET:
        case _types.searchTypes.ADDRESS_AFFIXED:
        case _types.searchTypes.ADDRESS_UNAFFIXED:
            // for these, all polygon points are identical - using point is more clear
            searchResult.geometry = {
                type: "Point",
                coordinates: pos.split(" ")
            };
            break;
        default:
            searchResult.geometry = null;
            console.error("Unknown type in searchAddress.parse: '" + type + "'. Could not set geometry.");
            break;
    }

    return searchResult;
}

/**
 * Parses gazetteer xml to search objects.
 * @param {string} key internal name for query froms searchTypes
 * @param {string} xmlString gazetteer answer as xml string
 * @returns {Promise<SearchResult[]>} parsed response
 * @ignore
 */
function parse(key, xmlString) {
    return new Promise(function (resolve, reject) {
        // tag processor "stripPrefix" removes e.g. "dog:" prefix on properties
        _xml2js2.default.parseString(xmlString, { tagNameProcessors: [_xml2js2.default.processors.stripPrefix] }, function (err, source) {
            if (err) {
                reject(err);
                return;
            }

            try {
                var searchResults = source.FeatureCollection.member ? source.FeatureCollection.member.map(function (entry) {
                    return parseEntry(entry, key);
                }).sort(function (a, b) {
                    return a.name.localeCompare(b.name);
                }) : [];

                resolve(searchResults);
            } catch (e) {
                reject(e);
            }
        });
    });
}