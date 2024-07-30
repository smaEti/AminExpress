import {
  Request,
  Path,
  CallbackTemplate,
  CallbacksTemplate,
  Methods,
  Middleware,
  Response,
} from "./types";
import { RouteMap } from "./RouteMap";
import { URL } from "node:url";
import querystring from "node:querystring";
import { IncomingMessage, ServerResponse } from "node:http";
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
  handler(req: IncomingMessage, res: ServerResponse) {
    
    let response = this.setResponseConfigs(res);
    let request = this.handleQuery(req);
    const [route, params] = this.routeMap.search(req.url as string);
    request = this.handleUrlParameter(request, params);
    if (route == null) {
      res.statusCode = 404;
      res.end(`Cannot ${request.method} ${request.url}`);
      return;
    }
    let stack: CallbacksTemplate = [];
    let callbackIndex = 0;
    stack.push(...route.methods[request.method as string].callbacks);
    this.GLOBALmiddlewares.filter(
      (middle) =>
        middle.index >
        route.methods[request.method as string].middlewares[
          route.methods[request.method as string].middlewares.length - 1
        ].index
    ).map((middles) => {
      stack.push(...middles.callbacks);
    });
    function next(err?: Error) {
      if (err) {
        return handleError(err, request, response, next);
      }

      if (callbackIndex >= stack.length) return;

      const callback = stack[callbackIndex++];
      callback(request, response, next);
    }

    next();
  }
  handleQuery(req: Request): Request {
    const myURL = new URL(req.headers.host + req.url!);
    req.query = querystring.parse(myURL.searchParams.toString());
    return req;
  }
  handleUrlParameter(req: Request, params: [string, string][]): Request {
    req.params = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value[0] !== value[1]) {
        req.params![value[0].slice(1)] = value[1];
      }
    });
    return req;
  }
  setResponseConfigs(res : ServerResponse) : Response{
    let newRes  : Response = {...res,
      json : function(data  : object  ){
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(data))
        res.end()
      },
      redirect : function(path : string){
        res.writeHead(302, {'Location':  path});
        res.end()
      }
    } as Response;
    return newRes;
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
      let middlewareCallbacks: CallbacksTemplate = [];
      [...relatedPathmids, ...this.GLOBALmiddlewares]
        .sort((a, b) => a.index - b.index)
        .map((item) => {
          middlewareCallbacks.push(...item.callbacks);
        });
      newRoute.methods[method] = {
        callbacks: [...middlewareCallbacks, ...[callback, ...callbacks]],
        middlewares: [...relatedPathmids, ...this.GLOBALmiddlewares].sort(
          (a, b) => a.index - b.index
        ),
      };
      if (!isArray) break;
    }
  }
}
function handleError(
  err: Error,
  req: Request,
  res: Response,
  next: (err?: Error) => any
) {
  throw new Error("Function not implemented.");
}
