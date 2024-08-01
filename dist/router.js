"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importStar(require("node:fs"));
const path_1 = __importDefault(require("path"));
const RouteMap_1 = require("./RouteMap");
const node_url_1 = require("node:url");
const node_querystring_1 = __importDefault(require("node:querystring"));
class Router {
    constructor() {
        this.customErrorHandler = null;
        this.serveStaticPathFlag = null;
        this.routeMap = new RouteMap_1.RouteMap();
        this.middlewareCounter = 0;
        this.GLOBALmiddlewares = [];
        this.PathRelatedMiddlewares = [];
    }
    get(paths, callback, ...callbacks) {
        this.createRoute("GET", paths, callback, callbacks);
    }
    post(paths, callback, ...callbacks) {
        this.createRoute("POST", paths, callback, callbacks);
    }
    put(paths, callback, ...callbacks) {
        this.createRoute("PUT", paths, callback, callbacks);
    }
    delete(paths, callback, ...callbacks) {
        this.createRoute("DELETE", paths, callback, callbacks);
    }
    use(pathsOrCallback, callbackOrCallbacks, ...callbacks) {
        const isArrayPath = Array.isArray(pathsOrCallback);
        if (typeof pathsOrCallback === "string" ||
            (isArrayPath && typeof callbackOrCallbacks !== "undefined")) {
            if (isArrayPath) {
                for (let i = 0; i < pathsOrCallback.length; i++) {
                    this.PathRelatedMiddlewares.push({
                        index: this.middlewareCounter,
                        callbacks: [callbackOrCallbacks, ...callbacks],
                        path: pathsOrCallback[i][0] == "/" ? pathsOrCallback[i].slice(1, pathsOrCallback.length) : pathsOrCallback[i],
                    });
                    this.middlewareCounter++;
                }
            }
            else {
                console.log(pathsOrCallback[0] == "/");
                this.PathRelatedMiddlewares.push({
                    index: this.middlewareCounter,
                    callbacks: [callbackOrCallbacks, ...callbacks],
                    path: pathsOrCallback[0] == "/" ? pathsOrCallback.slice(1, pathsOrCallback.length) : pathsOrCallback,
                });
                this.middlewareCounter++;
            }
        }
        else {
            if (typeof callbackOrCallbacks !== "undefined") {
                this.GLOBALmiddlewares.push({
                    callbacks: [
                        pathsOrCallback,
                        callbackOrCallbacks,
                        ...callbacks,
                    ],
                    index: this.middlewareCounter,
                });
                this.middlewareCounter++;
            }
            else {
                this.GLOBALmiddlewares.push({
                    callbacks: [pathsOrCallback, ...callbacks],
                    index: this.middlewareCounter,
                });
                this.middlewareCounter++;
            }
        }
    }
    handler(req, res) {
        var _a;
        const response = this.setResponseConfigs(res);
        let request = this.handleQuery(req);
        if (this.serveStaticPathFlag) {
            if ((_a = req.url) === null || _a === void 0 ? void 0 : _a.startsWith(this.serveStaticPathFlag[1])) {
                this.handleServerStatic(request.url, request, response);
            }
        }
        const [route, params] = this.routeMap.search(req.url);
        request = this.handleUrlParameter(request, params);
        if (route == null ||
            typeof route.methods[request.method] == "undefined") {
            response.statusCode = 404;
            response.end(`Cannot ${request.method} ${request.url}`);
            return;
        }
        const stack = [];
        let callbackIndex = 0;
        stack.push(...route.methods[request.method].callbacks);
        if (this.GLOBALmiddlewares.length !== 0) {
            this.GLOBALmiddlewares.filter((middle) => middle.index >
                route.methods[request.method].middlewareLastIndex).map((middles) => {
                stack.push(...middles.callbacks);
            });
        }
        const CEH = this.customErrorHandler;
        function next(err) {
            if (err) {
                return CEH
                    ? CEH(err, request, response, next)
                    : handleError(err, request, response);
            }
            if (callbackIndex >= stack.length)
                return;
            const callback = stack[callbackIndex++];
            callback(request, response, next);
        }
        next();
    }
    handleQuery(req) {
        var _a, _b;
        const myURL = new node_url_1.URL(req.headers.host + req.url);
        req.query = node_querystring_1.default.parse(myURL.searchParams.toString());
        const indexOfQuery = (_a = req.url) === null || _a === void 0 ? void 0 : _a.indexOf("?");
        if (indexOfQuery !== -1)
            req.url = (_b = req.url) === null || _b === void 0 ? void 0 : _b.slice(0, indexOfQuery);
        return req;
    }
    handleUrlParameter(req, params) {
        req.params = {};
        Object.entries(params).forEach(([value]) => {
            if (value[0] !== value[1]) {
                req.params[value[0].slice(1)] = value[1];
            }
        });
        return req;
    }
    setResponseConfigs(res) {
        res.json = function (data) {
            res.setHeader("Content-Type", "application/json");
            res.write(JSON.stringify(data));
            res.end();
        };
        res.redirect = function (path) {
            res.writeHead(302, { Location: path });
            res.end();
        };
        res.status = function (num) {
            res.statusCode = num;
            return res;
        };
        return res;
    }
    handleServerStatic(url, request, response) {
        const ext = path_1.default.parse(url).ext;
        const map = {
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
        const fileAddress = this.serveStaticPathFlag[0] +
            request.url.slice(request.url.indexOf(this.serveStaticPathFlag[1]) +
                this.serveStaticPathFlag[1].length);
        (0, node_fs_1.open)(fileAddress, "r", (err) => {
            if (err) {
                if (err.code === "ENOENT") {
                    response.statusCode = 404;
                    response.end(`file NotFound`);
                    console.error(`${url} file does not exist`);
                    return;
                }
            }
        });
        this.createRuntimeRoute("GET", url, (_req, res) => {
            node_fs_1.default.readFile(fileAddress, function (err, data) {
                if (err) {
                    res.statusCode = 500;
                    res.end(`Error getting the file.`);
                }
                else {
                    res.setHeader("Content-type", map[ext] || "text/plain");
                    res.end(data);
                }
            });
        }, []);
    }
    createRoute(method, paths, callback, callbacks) {
        const isArray = typeof paths == "object";
        for (let i = 0; i < paths.length; i++) {
            let newRoute;
            const relatedPathmids = [];
            if (isArray) {
                newRoute = this.routeMap.addRoute(paths[i]);
                for (const middleware of this.PathRelatedMiddlewares) {
                    if (paths[i].includes(middleware.path)) {
                        relatedPathmids.push(middleware);
                    }
                }
            }
            else {
                newRoute = this.routeMap.addRoute(paths);
                for (const middleware of this.PathRelatedMiddlewares) {
                    console.log(paths, middleware.path);
                    if (paths.includes(middleware.path)) {
                        relatedPathmids.push(middleware);
                    }
                }
            }
            const middlewareCallbacks = [];
            [...relatedPathmids, ...this.GLOBALmiddlewares]
                .sort((a, b) => a.index - b.index)
                .map((item) => {
                middlewareCallbacks.push(...item.callbacks);
            });
            const sortedMiddlewares = [
                ...relatedPathmids,
                ...this.GLOBALmiddlewares,
            ].sort((a, b) => a.index - b.index);
            newRoute.methods[method] = {
                callbacks: [...middlewareCallbacks, ...[callback, ...callbacks]],
                middlewareLastIndex: sortedMiddlewares[sortedMiddlewares.length - 1]
                    ? sortedMiddlewares[sortedMiddlewares.length - 1].index
                    : -1,
            };
            if (!isArray)
                break;
        }
    }
    createRuntimeRoute(method, paths, callback, callbacks) {
        const relatedPathmids = [];
        const newRoute = this.routeMap.addRoute(paths);
        ;
        for (const middleware of this.PathRelatedMiddlewares) {
            if (paths == middleware.path) {
                relatedPathmids.push(middleware);
            }
        }
        const middlewareCallbacks = [];
        let allMiddlewares = [];
        [...relatedPathmids, ...this.GLOBALmiddlewares]
            .sort((a, b) => a.index - b.index)
            .map((item) => {
            if (item.index < this.serveStaticPathFlag[2]) {
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
    setServeStaticPathFlag(fileAddress, url) {
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
    setErrorHandler(callback) {
        this.customErrorHandler = callback;
    }
}
exports.default = Router;
function handleError(err, _req, res) {
    res.statusCode = 500;
    res.json({ error: err.message });
}
