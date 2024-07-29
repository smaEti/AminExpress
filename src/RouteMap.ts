import { RouteInterface } from "./types";

export class RouteMap {
  children: Record<string, RouteMap> = {};
  methods: Record<string, RouteInterface> = {};
  constructor() {}

  private hasSection(section: string): RouteMap | null {
    const searchChar = this.children[section];
    if (typeof searchChar !== "undefined") {
      return searchChar;
    }

    return null;
  }

  private addPathSection(section: string): RouteMap {
    const newSubTrie = new RouteMap();
    this.children[section] = newSubTrie;
    return newSubTrie;
  }

  search(path: string): RouteMap | null {
    let PathSections = path.split("/");
    PathSections = PathSections.filter((str) => str !== "");
    return this.searchTrie(PathSections);
  }

  private searchTrie(pathSections: string[]): RouteMap | null {
    const subTrie = this.hasSection(pathSections[0]);
    if (
      pathSections.slice(1, pathSections.length).length == 0 &&
      subTrie !== null
    )
      return subTrie;
    if (subTrie === null) {
      return null;
    }

    return subTrie.searchTrie(pathSections.slice(1, pathSections.length));
  }

  addRoute(path: string): RouteMap {
    let PathSections = path.split("/");
    PathSections = PathSections.filter((str) => str !== "");
    return this.addRouteChild(PathSections);
  }

  private addRouteChild(PathSections: string[]): RouteMap {
    if (PathSections.length == 0) return this;
    const subTrie = this.hasSection(PathSections[0]);
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
// console.log(trie.addRoute("v1/user/signin"));
// console.log(trie.addRoute("/v1/ahmad/"));
// console.log(trie.addRoute("v1/ali/signup"));
// console.log(trie.addRoute("v2/ali/signup"));
// // trie.addRouteParent("v2/ali/signup");

// console.log(trie.search("v1/user/signin"));
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
