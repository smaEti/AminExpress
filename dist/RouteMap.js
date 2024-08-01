"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteMap = void 0;
class RouteMap {
    constructor() {
        this.children = {};
        this.methods = {};
    }
    hasSection(section) {
        const searchChar = this.children[section];
        let parameterSection;
        let keyOfPath = "";
        Object.entries(this.children).forEach(([key, value]) => {
            if (key.startsWith(":")) {
                parameterSection = this.children[key];
                keyOfPath = key;
            }
        });
        if (typeof searchChar !== "undefined") {
            return [searchChar, section];
        }
        if (typeof searchChar == "undefined" &&
            typeof parameterSection !== "undefined")
            return [parameterSection, keyOfPath];
        return [null, section];
    }
    addPathSection(section) {
        const newSubTrie = new RouteMap();
        this.children[section] = newSubTrie;
        return newSubTrie;
    }
    search(path) {
        let PathSections = path.split("/");
        if (PathSections[1] == "")
            return [this, [["", ""]]];
        PathSections = PathSections.filter((str) => str !== "");
        let params = [];
        return [this.searchTrie(PathSections, params), params];
    }
    searchTrie(pathSections, params) {
        const [subTrie, pathOfKey] = this.hasSection(pathSections[0]);
        if (pathSections.slice(1, pathSections.length).length == 0 &&
            subTrie !== null) {
            params.push([pathOfKey, pathSections[0]]);
            return subTrie;
        }
        if (subTrie === null) {
            return null;
        }
        params.push([pathOfKey, pathSections[0]]);
        return subTrie.searchTrie(pathSections.slice(1, pathSections.length), params);
    }
    addRoute(path) {
        let PathSections = path.split("/");
        PathSections = PathSections.filter((str) => str !== "");
        return this.addRouteChild(PathSections);
    }
    addRouteChild(PathSections) {
        if (PathSections.length == 0)
            return this;
        const [subTrie, pathOfKey] = this.hasSection(PathSections[0]);
        if (subTrie !== null) {
            return subTrie.addRouteChild(PathSections.slice(1, PathSections.length));
        }
        else {
            const newSubTrie = this.addPathSection(PathSections[0]);
            return newSubTrie.addRouteChild(PathSections.slice(1, PathSections.length));
        }
    }
}
exports.RouteMap = RouteMap;
