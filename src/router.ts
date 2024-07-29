import {
  Request,
  Path,
  Callback,
  AsyncCallback,
  CallbackTemplate,
  CallbacksTemplate,
  Methods,
  Middleware,
} from "./types";
import { RouteMap } from "./RouteMap";
import { IncomingMessage, ServerResponse } from "http";
import { URL } from "node:url";
import querystring from "node:querystring";
export default class Router {
  routeMap: RouteMap = new RouteMap();
  middlewareCounter: number = 0;
  GLOBALmiddlewares: Middleware[] = [];
  PathRelatedMiddlewares: Middleware[] = [];
  get(
    paths: Path,
    callback: CallbackTemplate,
    ...callbacks: CallbacksTemplate
  ) {
    this.createRoute("GET", paths, callback, callbacks);
  }

  post(
    paths: Path,
    callback: CallbackTemplate,
    ...callbacks: CallbacksTemplate
  ) {
    this.createRoute("POST", paths, callback, callbacks);
  }
  put(
    paths: Path,
    callback: CallbackTemplate,
    ...callbacks: CallbacksTemplate
  ) {
    this.createRoute("PUT", paths, callback, callbacks);
  }
  delete(
    paths: Path,
    callback: CallbackTemplate,
    ...callbacks: CallbacksTemplate
  ) {
    this.createRoute("DELETE", paths, callback, callbacks);
  }
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
    const isArrayPath = Array.isArray(pathsOrCallback);
    if (
      typeof pathsOrCallback === "string" ||
      (isArrayPath && typeof callbackOrCallbacks !== "undefined")
    ) {
      if (isArrayPath) {
        for (let i = 0; i < pathsOrCallback.length; i++) {
          this.PathRelatedMiddlewares.push({
            index: this.middlewareCounter,
            callbacks: [callbackOrCallbacks as CallbackTemplate, ...callbacks],
            path: pathsOrCallback[i] as string,
          });
          this.middlewareCounter++;
        }
      } else {
        this.PathRelatedMiddlewares.push({
          index: this.middlewareCounter,
          callbacks: [callbackOrCallbacks as CallbackTemplate, ...callbacks],
          path: pathsOrCallback as string,
        });
        this.middlewareCounter++;
      }
    } else {
      if (typeof callbackOrCallbacks !== "undefined") {
        this.GLOBALmiddlewares.push({
          callbacks: [
            pathsOrCallback as CallbackTemplate,
            callbackOrCallbacks as CallbackTemplate,
            ...callbacks,
          ],
          index: this.middlewareCounter,
        });
        this.middlewareCounter++;
      } else {
        this.GLOBALmiddlewares.push({
          callbacks: [pathsOrCallback as CallbackTemplate, ...callbacks],
          index: this.middlewareCounter,
        });
        this.middlewareCounter++;
      }
    }
  }
  handler(req: Request, res: ServerResponse) {
    req = this.handleQuery(req);
    // res.statusCode = 500;
    // res.end()
    // console.log(req.headers.host +  req.url!);
    const [route, params] = this.routeMap.search(req.url as string);
    req = this.handleUrlParameter(req,params);
    // TODO : if route null handle error 404 not found
    if (route == null) return;
    // console.log(route.methods[req.method as string])
    for (
      let i = 0;
      i < route.methods[req.method as string].middlewares.length;
      i++
    ) {
      for (
        let j = 0;
        j < route.methods[req.method as string].middlewares[i].callbacks.length;
        j++
      ) {
        route.methods[req.method as string].middlewares[i].callbacks[j](req);
        //TODO : only sends request
      }
    }
    for (
      let i = 0;
      i < route.methods[req.method as string].callbacks.length;
      i++
    ) {
      route.methods[req.method as string].callbacks[i](req);
      //TODO : only sends request
    }
  }
  handleQuery(req: Request): Request {
    const myURL = new URL(req.headers.host + req.url!);
    req.query = querystring.parse(myURL.searchParams.toString());
    return req;
  }
  handleUrlParameter(
    req: Request,
    params: [string, string][]
  ) : Request {
    req.params = {};
    Object.entries(params).forEach(([key, value]) => {
      // console.log(`${key}:`,value);
      if (value[0] !== value[1] ) {
        req.params![value[0].slice(1)] = value[1];
      }
    });
    // temp.map((param)=>{
    //   param.key = param.key.slice(1);
    // })
    // return temp;
    return req;
  }
  createRoute(
    method: Methods,
    paths: Path,
    callback: CallbackTemplate,
    callbacks: CallbacksTemplate
  ) {
    let isArray = typeof paths == "object";
    for (let i = 0; i < paths.length; i++) {
      let newRoute: RouteMap;
      let relatedPathmids = [];
      if (isArray) {
        newRoute = this.routeMap.addRoute(paths[i]);
        for (const middleware of this.PathRelatedMiddlewares) {
          if ((paths[i] as string) == middleware.path) {
            relatedPathmids.push(middleware);
          }
        }
      } else {
        newRoute = this.routeMap.addRoute(paths as string);
        for (const middleware of this.PathRelatedMiddlewares) {
          if ((paths as string) == middleware.path) {
            relatedPathmids.push(middleware);
          }
        }
      }
      newRoute.methods[method] = {
        callbacks: [callback, ...callbacks],
        middlewares: [...relatedPathmids, ...this.GLOBALmiddlewares].sort(
          (a, b) => a.index - b.index
        ),
      };
      if (!isArray) break;
    }
  }
}
