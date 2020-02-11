"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defaults = require("../defaults");

var _defaults2 = _interopRequireDefault(_defaults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Sets the configured background image to the div the map is to be rendered in.
 * @param {object} [config={}] - user configuration
 * @param {string} [config.target] - id of map div
 * @param {string} [config.backgroundImage] - image URL to set; "" means none, undefined means default
 * @returns {undefined}
 */
function setBackgroundImage() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        backgroundImage = _ref.backgroundImage,
        target = _ref.target;

    var div = document.getElementById(target || _defaults2.default.target);

    if (div) {
        var urlString = "url(" + (
        // keep "" as explicit none
        typeof backgroundImage === "string" ? backgroundImage : _defaults2.default.backgroundImage) + ")";

        div.style.backgroundImage = urlString;
    }
}

exports.default = setBackgroundImage;