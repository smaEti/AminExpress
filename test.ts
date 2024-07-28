// import { URL } from "node:url";
// import querystring from "node:querystring";
// const myURL = new URL(
//   "https://user:pass@sub.example.com:8080/p/a/t/h?query=string&foo=bar&abc=xyz&abc=123#hash"
// );

import { Methods, RouteInterface } from "./types";

// console.log(querystring.parse(myURL.searchParams.toString()));
export class Trie {
  children: Record<string, Trie> = {};
  methods : Record<string , RouteInterface> = {};
  constructor() {}

  // hmmm
  hasSection(char: string): Trie | null {
    const searchChar = this.children[char];
    // console.log(searchChar);
    if (typeof searchChar !== "undefined") {
      return searchChar;
    }

    return null;
  }
  // hmmm
  addPathSection(section: string): Trie {
    const newSubTrie = new Trie();
    this.children[section] = newSubTrie;
    return newSubTrie;
  }
  // hmmm
  searchParent(path: string): Trie | null {
    let PathSections = path.split("/");
    PathSections = PathSections.filter(str => str !== "");
    return this.searchTrie(PathSections);
  }
  // hmmm
  private searchTrie(pathSections: string[]): Trie | null {
    const subTrie = this.hasSection(pathSections[0]);
    if(pathSections.slice(1, pathSections.length).length == 0 && subTrie !== null) return subTrie;
    // console.log(subTrie);
    if (subTrie === null) {
      return null;
    }

    return subTrie.searchTrie(pathSections.slice(1, pathSections.length));
  }
  //hmmm
  addRouteParent(path: string) {
    let PathSections = path.split("/");
    PathSections = PathSections.filter(str => str !== "");
    this.addRoute(PathSections);
  }
  //hmmm
  private addRoute(PathSections: string[]): void {
    if (PathSections.length == 0) return;
    const subTrie = this.hasSection(PathSections[0]);
    if (subTrie !== null) {
      return subTrie.addRoute(PathSections.slice(1, PathSections.length));
    } else {
      const newSubTrie = this.addPathSection(PathSections[0]);
      return newSubTrie.addRoute(PathSections.slice(1, PathSections.length));
    }
  }
}
let trie = new Trie();
trie.addRouteParent("v1/user/signin");
trie.addRouteParent("/v1/ahmad/");
// trie.addRouteParent("v1/ali/signup");
// trie.addRouteParent("v2/ali/signup");
// trie.addRouteParent("v2/ali/signup");

// console.log(trie.searchParent("v1/user/signin"));
// console.log(trie.searchParent("v1/user"));

console.log(trie.searchParent("v1/")!.methods["GET"] = {callbacks : [()=>{} ,()=>{}], middlewares : []});
console.log(trie.searchParent("v1/")!.methods["POST"] = {callbacks : [()=>{} ,()=>{}], middlewares : []});
console.log(trie.children);
