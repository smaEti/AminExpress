"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = aminexpress;
const node_http_1 = __importDefault(require("node:http"));
const router_1 = __importDefault(require("./router"));
class AminExpress {
    constructor() {
        this.router = new router_1.default();
    }
    get(path, callback, ...callbacks) {
        this.router.get(path, callback, ...callbacks);
    }
    post(path, callback, ...callbacks) {
        this.router.post(path, callback, ...callbacks);
    }
    put(path, callback, ...callbacks) {
        this.router.put(path, callback, ...callbacks);
    }
    delete(path, callback, ...callbacks) {
        this.router.delete(path, callback, ...callbacks);
    }
    use(pathsOrCallback, callbackOrCallbacks, ...callbacks) {
        if (typeof pathsOrCallback === "string" ||
            (Array.isArray(pathsOrCallback) &&
                typeof callbackOrCallbacks !== "undefined")) {
            const path = pathsOrCallback;
            const firstCallback = callbackOrCallbacks;
            this.router.use(path, firstCallback, ...callbacks);
        }
        else {
            const firstCallback = pathsOrCallback;
            const secondCallback = callbackOrCallbacks;
            this.router.use(firstCallback, secondCallback, ...callbacks);
        }
    }
    listen(port, callback) {
        const server = node_http_1.default.createServer((req, res) => {
            this.router.handler(req, res);
        });
        server.listen(port, callback);
    }
    serveStatic(fileAddress, url) {
        this.router.setServeStaticPathFlag(fileAddress, url);
    }
    errorHandler(callback) {
        this.router.setErrorHandler(callback);
    }
}
function aminexpress() {
    return new AminExpress();
}
