import http, { IncomingMessage, ServerResponse } from "node:http";
import Router from "./router";
import { URL } from "node:url";
import querystring from "node:querystring";
import {
  Path,
  Request,
  Callback,
  AsyncCallback,
  CallbacksTemplate,
  CallbackTemplate,
} from "./types";
class AminExpress {
  router: Router = new Router();
  constructor() {
    console.log("aminexpress instanciated");
  }
  get(path: Path, callback: CallbackTemplate, ...callbacks: CallbacksTemplate) {
    this.router.get(path, callback, ...callbacks);
  }
  post(
    path: Path,
    callback: CallbackTemplate,
    ...callbacks: CallbacksTemplate
  ) {
    this.router.post(path, callback, ...callbacks);
  }
  put(path: Path, callback: CallbackTemplate, ...callbacks: CallbacksTemplate) {
    this.router.put(path, callback, ...callbacks);
  }
  delete(
    path: Path,
    callback: CallbackTemplate,
    ...callbacks: CallbacksTemplate
  ) {
    this.router.delete(path, callback, ...callbacks);
  }
  // use(callback: CallbackTemplate, ...callbacks: CallbacksTemplate) {
  //   this.router.use(callback ,callbacks);
  // }
  use(callback: CallbackTemplate, ...callbacks: CallbacksTemplate): void;
  use(
    paths: Path,
    callback: CallbackTemplate,
    ...callbacks: CallbacksTemplate
  ): void;
  use(
    pathsOrCallback: Path | CallbackTemplate,
    callbackOrCallbacks: CallbackTemplate | CallbacksTemplate,
    ...callbacks: CallbacksTemplate
  ): void {
    // console.log("typeof 1st :", typeof pathsOrCallback)
    // console.log("typeof 2nd :", typeof callbackOrCallbacks)
    // console.log("typeof 3rd :", typeof callbacks)
    if (
      typeof pathsOrCallback === "string" ||
      (Array.isArray(pathsOrCallback) &&
        typeof callbackOrCallbacks !== "undefined")
    ) {
      console.log("type of 1st was string");
      let path: Path = pathsOrCallback;
      let firstCallback: CallbackTemplate =
        callbackOrCallbacks as CallbackTemplate;
      this.router.use(path, firstCallback, ...callbacks);
    }else {
      console.log("type of 1st was not string");

      let firstCallback = pathsOrCallback as CallbackTemplate;
      let secondCallback = callbackOrCallbacks as CallbackTemplate;
      this.router.use(firstCallback,secondCallback,...callbacks);
    }
  }
  public listen(port: number, callback: () => void): void {
    const server = http.createServer(
      (req: IncomingMessage, res: ServerResponse) => {
        console.log(req.url);
        this.router.handler(req,res);
      }
    );

    server.listen(port, callback);
  }
  QueryParamsMiddleware(req: IncomingMessage, response: ServerResponse) {
    const myURL = new URL(req.headers.host + req.url!);

    let request: Request = {
      ...req,
      queryParams: querystring.parse(myURL.searchParams.toString()),
    } as Request;
    return request;
  }
}
export default function aminexpress(): AminExpress {
  return new AminExpress();
}
