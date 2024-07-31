import {
  Request,
  Path,
  CallbackTemplate,
  CallbacksTemplate,
  Methods,
  Middleware,
  Response,
  NextFunction,
} from "./types";
import fs, { open } from "node:fs";
const path = require("path");
import { RouteMap } from "./RouteMap";
import { URL } from "node:url";
import querystring from "node:querystring";
import { IncomingMessage, ServerResponse } from "node:http";
export default class Router {
  serveStaticPathFlag: [string, string, number] | null = null;
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
    let response = this.setResponseConfigs(res as Response);
    let request = this.handleQuery(req);
    // TODO : middlewares
    if (this.serveStaticPathFlag) {
      if (req.url?.startsWith(this.serveStaticPathFlag[1])) {
        this.handleServerStatic(request.url!, request, response);
      }
    }
    const [route, params] = this.routeMap.search(req.url as string);
    request = this.handleUrlParameter(request, params);
    if (
      route == null ||
      typeof route.methods[request.method as string] == "undefined"
    ) {
      response.statusCode = 404;
      response.end(`Cannot ${request.method} ${request.url}`);
      return;
    }
    let stack: CallbacksTemplate = [];
    let callbackIndex = 0;
    stack.push(...route.methods[request.method as string].callbacks);
    if (this.GLOBALmiddlewares.length !== 0) {
      this.GLOBALmiddlewares.filter(
        (middle) =>
          middle.index >
          route.methods[request.method as string].middlewareLastIndex
      ).map((middles) => {
        stack.push(...middles.callbacks);
      });
    }
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
    let indexOfQuery = req.url?.indexOf("?");
    if (indexOfQuery !== -1) req.url = req.url?.slice(0, indexOfQuery);
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
  setResponseConfigs(res: Response): Response {
    res.json = function (data: object) {
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify(data));
      res.end();
    };
    res.redirect = function (path: string) {
      res.writeHead(302, { Location: path });
      res.end();
    };

    return res;
  }
  handleServerStatic(url: string, request: Request, response: Response) {
    const ext: string = path.parse(url).ext;
    interface StringKeyValue {
      [key: string]: string;
    }
    const map: StringKeyValue = {
      ".ico": "image/x-icon",
      ".html": "text/html",
      ".js": "text/javascript",
      ".ts": "text/typescript",
      ".json": "application/json",
      ".css": "text/css",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".wav": "audio/wav",
      ".mp3": "audio/mpeg",
      ".svg": "image/svg+xml",
      ".pdf": "application/pdf",
      ".doc": "application/msword",
    };
    const fileAddress =
      this.serveStaticPathFlag![0] +
      request.url!.slice(
        request.url!.indexOf(this.serveStaticPathFlag![1]) +
          this.serveStaticPathFlag![1].length
      );
    open(fileAddress, "r", (err, fd) => {
      if (err) {
        if (err.code === "ENOENT") {
          response.statusCode = 404;
          response.end(`file NotFound`);
          console.error(`${url} file does not exist`);
          return;
        }
      }
    });

    this.createRuntimeRoute(
      "GET",
      url,
      (req: Request, res: Response, next: NextFunction) => {
        fs.readFile(fileAddress, function (err, data) {
          if (err) {
            response.statusCode = 500;
            response.end(`Error getting the file.`);
          } else {
            response.setHeader("Content-type", map[ext] || "text/plain");
            response.end(data);
          }
        });
      },
      []
    );
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
      let sortedMiddlewares = [
        ...relatedPathmids,
        ...this.GLOBALmiddlewares,
      ].sort((a, b) => a.index - b.index);
      newRoute.methods[method] = {
        callbacks: [...middlewareCallbacks, ...[callback, ...callbacks]],
        middlewareLastIndex: sortedMiddlewares[sortedMiddlewares.length - 1]
          ? sortedMiddlewares[sortedMiddlewares.length - 1].index
          : -1,
      };
      if (!isArray) break;
    }
  }
  createRuntimeRoute(
    method: Methods,
    paths: Path,
    callback: CallbackTemplate,
    callbacks: CallbacksTemplate
  ) {
    let newRoute: RouteMap;
    let relatedPathmids = [];
    newRoute = this.routeMap.addRoute(paths as string);
    for (const middleware of this.PathRelatedMiddlewares) {
      if ((paths as string) == middleware.path) {
        relatedPathmids.push(middleware);
      }
    }
    let middlewareCallbacks: CallbacksTemplate = [];
    let allMiddlewares: Middleware[] = [];

    [...relatedPathmids, ...this.GLOBALmiddlewares]
      .sort((a, b) => a.index - b.index)
      .map((item) => {
        if (item.index < this.serveStaticPathFlag![2]) {
          middlewareCallbacks.push(...item.callbacks);
          allMiddlewares.push(item);
        }
      });
    allMiddlewares = allMiddlewares.sort((a, b) => a.index - b.index);

    newRoute.methods[method] = {
      callbacks: [...middlewareCallbacks, ...[callback, ...callbacks]],
      middlewareLastIndex: allMiddlewares[allMiddlewares.length - 1]
        ? allMiddlewares[allMiddlewares.length - 1].index
        : -1,
    };
  }
  setServeStaticPathFlag(fileAddress: string, url: string) {
    const allMiddlewares = [
      ...this.PathRelatedMiddlewares,
      ...this.GLOBALmiddlewares,
    ].sort((a, b) => a.index - b.index);
    let max;
    if (allMiddlewares[allMiddlewares.length - 1])
      max = allMiddlewares[allMiddlewares.length - 1].index;
    else {
      max = 0;
    }
    this.serveStaticPathFlag = [fileAddress, url, max + 1];
    this.middlewareCounter++;
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
