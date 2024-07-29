import { RouteInterface } from "./types";

export class RouteMap {
  children: Record<string, RouteMap> = {};
  methods: Record<string, RouteInterface> = {};
  constructor() {}

  private hasSection(section: string): [RouteMap, string] | [null, string] {
    const searchChar = this.children[section];
    let parameterSection;
    let keyOfPath: string = "";
    Object.entries(this.children).forEach(([key, value]) => {
      // console.log(`${key}:`,value);
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
  ): [RouteMap, [string, string][]] | [null, [string, string][]] {
    let PathSections = path.split("/");
    PathSections = PathSections.filter((str) => str !== "");
    let params: [string, string][] = [];
    return [this.searchTrie(PathSections, params), params];
  }

  private searchTrie(
    pathSections: string[],
    params: [string, string][]
  ): RouteMap | null {
    const [subTrie, pathOfKey]: [RouteMap, string] | [null, string] =
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
    const [subTrie, pathOfKey]: [RouteMap, string] | [null, string] =
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
// let trie = new RouteMap();
// trie.addRoute("v1/:user/signin");
// trie.addRoute("/v1/ahmad/");
// console.log(trie.addRoute("v1/ali/signup"));
// console.log(trie.addRoute("v2/ali/signup"));
// // trie.addRouteParent("v2/ali/signup");

// console.log(trie.search("v1/46531"));
// console.log(trie.search("v1/user"));

// console.log(
//   (trie.addRoute("/")!.methods["GET"] = {
//     callbacks: [async () => {}, () => {}],
//     middlewares: [],
//   })
// );
// trie.search("v1/")!.methods["POST"] = {callbacks : [()=>{} ,()=>{}], middlewares : []};
// trie.search("v1/")!.methods["GET"] = {callbacks : [()=>{} ,()=>{}], middlewares : []};
// console.log(trie.search("v1/")!.methods);

// console.log(trie.children);
