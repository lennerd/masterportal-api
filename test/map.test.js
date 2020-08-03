import {PluggableMap, Map} from "ol";
import TileLayer from "ol/layer/Tile";
import {createMap} from "../src/map";
import {initializeLayerList} from "../src/rawLayerList.js";
import {registerProjections} from "../src/crs.js";
import setBackgroundImage from "../src/lib/setBackgroundImage.js";
import {createMapView} from "../src/mapView";
import defaults from "../src/defaults";

/*
 * This test is mocking a lot to check what functions are called with.
 * createMap logic is mostly calling other functions.
 */
jest.mock("ol");
jest.mock("../src/rawLayerList.js", () => {
    const original = require.requireActual("../src/rawLayerList.js");

    original.getLayerWhere = ({id}) => ({
        exists: {
            typ: "doesntExist"
        },
        works: {
            typ: "WMS"
        }
    })[id];
    original.initializeLayerList = jest.fn();
    return original;
});
jest.mock("../src/crs.js");
jest.mock("../src/lib/setBackgroundImage.js");
jest.mock("../src/mapView.js");

describe("map.js", function () {
    describe("createMap", function () {
        it("calls all initialization functions", function () {
            const callback = jest.fn();

            createMap(defaults, {callback});
            expect(initializeLayerList).toHaveBeenCalledWith(defaults.layerConf, expect.any(Function));
            expect(registerProjections).toHaveBeenCalledWith(defaults.namedProjections);
            expect(setBackgroundImage).toHaveBeenCalledWith(defaults);
        });

        it("creates a MapView", function () {
            createMap(defaults);
            expect(createMapView).toHaveBeenCalledWith(defaults);
        });

        it("creates and returns a Map object from openlayers with optional additional params", function () {
            const ret = createMap(defaults, {mapParams: {test: 1}});

            expect(Map.mock.calls[Map.mock.calls.length - 1][0].test).toBe(1);
            expect(ret).toBeInstanceOf(Map);
        });
    });

    // NOTE: loading map.js monkey patches PluggableMap.prototype.addLayer - testing result here
    describe("addLayer", function () {
        it("logs an error for unknown ids", function () {
            console.error = jest.fn();
            const consoleError = console.error,
                result = PluggableMap.prototype.addLayer("999999999999999");

            expect(console.error).toHaveBeenCalled();
            expect(result).toBeNull();
            console.error = consoleError;
        });

        it("logs an error for unknown types", function () {
            console.error = jest.fn();
            const consoleError = console.error,
                result = PluggableMap.prototype.addLayer("exists");

            expect(result).toBeNull();
            expect(console.error).toHaveBeenCalledWith("Layer with id 'exists' has unknown type 'doesntExist'. No layer added to map.");
            console.error = consoleError;
        });

        it("creates existing layers that have a known builder", function () {
            const result = PluggableMap.prototype.addLayer("works");

            expect(result).toBeInstanceOf(TileLayer);
        });

        it("sets visibility and transparency", function () {
            const result1 = PluggableMap.prototype.addLayer("works"),
                result2 = PluggableMap.prototype.addLayer("works", {}),
                result3 = PluggableMap.prototype.addLayer("works", {visibility: false}),
                result4 = PluggableMap.prototype.addLayer("works", {transparency: 50}),
                result5 = PluggableMap.prototype.addLayer("works", {visibility: false, transparency: 20});

            expect(result1.getOpacity()).toBe(1);
            expect(result1.getVisible()).toBe(true);

            expect(result2.getOpacity()).toBe(1);
            expect(result2.getVisible()).toBe(true);

            expect(result3.getOpacity()).toBe(1);
            expect(result3.getVisible()).toBe(false);

            expect(result4.getOpacity()).toBe(0.5);
            expect(result4.getVisible()).toBe(true);

            expect(result5.getOpacity()).toBe(0.8);
            expect(result5.getVisible()).toBe(false);
        });
    });
});
