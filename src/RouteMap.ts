import { RouteInterface, RouteMapAndKeyOrNull, StringTupleList } from "./types";

export class RouteMap {
  children: Record<string, RouteMap> = {};
  methods: Record<string, RouteInterface> = {};
  constructor() {}

  private hasSection(section: string): RouteMapAndKeyOrNull {
    const searchChar = this.children[section];
    let parameterSection;
    let keyOfPath: string = "";
    Object.entries(this.children).forEach(([key]) => {
      if (key.startsWith(":")) {
        parameterSection = this.children[key];
        keyOfPath = key;
      }
    });
    if (typeof searchChar !== "undefined") {
      return [searchChar, section];
    }
    if (
      typeof searchChar == "undefined" &&
      typeof parameterSection !== "undefined"
    )
      return [parameterSection, keyOfPath];
    return [null, section];
  }

  private addPathSection(section: string): RouteMap {
    const newSubTrie = new RouteMap();
    this.children[section] = newSubTrie;
    return newSubTrie;
  }

  search(
    path: string
  ): [RouteMap, StringTupleList] | [null, StringTupleList] {
    let PathSections = path.split("/");
    if (PathSections[1] == "") return [this, [["", ""]]];
    PathSections = PathSections.filter((str) => str !== "");
    const params: StringTupleList = [];
    return [this.searchTrie(PathSections, params), params];
  }

  private searchTrie(
    pathSections: string[],
    params: StringTupleList
  ): RouteMap | null {
    const [subTrie, pathOfKey]: RouteMapAndKeyOrNull =
      this.hasSection(pathSections[0]);
    if (
      pathSections.slice(1, pathSections.length).length == 0 &&
      subTrie !== null
    ) {
      params.push([pathOfKey, pathSections[0]]);
      return subTrie;
    }
    if (subTrie === null) {
      return null;
    }
    params.push([pathOfKey, pathSections[0]]);
    return subTrie.searchTrie(
      pathSections.slice(1, pathSections.length),
      params
    );
  }

  addRoute(path: string): RouteMap {
    let PathSections = path.split("/");
    PathSections = PathSections.filter((str) => str !== "");
    return this.addRouteChild(PathSections);
  }

  private addRouteChild(PathSections: string[]): RouteMap {
    if (PathSections.length == 0) return this;
    const [subTrie]: RouteMapAndKeyOrNull =
      this.hasSection(PathSections[0]);
    if (subTrie !== null) {
      return subTrie.addRouteChild(PathSections.slice(1, PathSections.length));
    } else {
      const newSubTrie = this.addPathSection(PathSections[0]);
      return newSubTrie.addRouteChild(
        PathSections.slice(1, PathSections.length)
      );
    }
  }
}
