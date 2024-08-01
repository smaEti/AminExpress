"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = exports.RouteMap = void 0;
const aminexpress_1 = __importDefault(require("./aminexpress"));
const RouteMap_1 = require("./RouteMap");
Object.defineProperty(exports, "RouteMap", { enumerable: true, get: function () { return RouteMap_1.RouteMap; } });
const router_1 = __importDefault(require("./router"));
exports.Router = router_1.default;
exports.default = aminexpress_1.default;
