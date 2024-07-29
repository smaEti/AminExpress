import { URL } from "node:url";
import querystring from "node:querystring";
const myURL = new URL(
  "https://user:pass@sub.example.com:8080/p/a/t/h?query=string&foo=bar&abc=xyz&abc=123#hash"
);
console.log(querystring.parse(myURL.searchParams.toString()));

