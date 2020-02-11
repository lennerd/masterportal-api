"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (config) {
    // user specified what to do => use that
    if (Array.isArray(config.layers)) {
        return config.layers;
    }

    // user didn't specify, layerConf is lgv services => use default for lgv services
    if (typeof config.layerConf === "undefined" || config.layerConf === _defaults2.default.layerConf) {
        return _defaults2.default.layers;
    }

    // user didn't specify, layerConf is not known => don't set anything initially
    return [];
};

var _defaults = require("../defaults");

var _defaults2 = _interopRequireDefault(_defaults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }