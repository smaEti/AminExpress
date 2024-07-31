import http, { IncomingMessage, ServerResponse } from "node:http";
import Router from "./router";

import {
  Path,
  CallbacksTemplate,
  CallbackTemplate,
} from "./types";
class AminExpress {
  router: Router = new Router();
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
    if (
      typeof pathsOrCallback === "string" ||
      (Array.isArray(pathsOrCallback) &&
        typeof callbackOrCallbacks !== "undefined")
    ) {
      let path: Path = pathsOrCallback;
      let firstCallback: CallbackTemplate =
        callbackOrCallbacks as CallbackTemplate;
      this.router.use(path, firstCallback, ...callbacks);
    } else {
      let firstCallback = pathsOrCallback as CallbackTemplate;
      let secondCallback = callbackOrCallbacks as CallbackTemplate;
      this.router.use(firstCallback, secondCallback, ...callbacks);
    }
  }
  public listen(port: number, callback: () => void): void {
    const server = http.createServer(
      (req: IncomingMessage, res: ServerResponse) => {
        this.router.handler(req, res);
      }
    );

    server.listen(port, callback);
  }
  serveStatic(fileAddress: string,url : string) {

    this.router.setServeStaticPathFlag(fileAddress,url);
  }
}
export default function aminexpress(): AminExpress {
  return new AminExpress();
}
