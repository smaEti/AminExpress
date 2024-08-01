import http , { IncomingMessage, ServerResponse } from "node:http";
import Router from "./router";

import {
  Path,
  CallbacksTemplate,
  CallbackTemplate,
  ErrorHandler,
} from "./types";
class AminExpress {
  private router: Router = new Router();
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
      const path: Path = pathsOrCallback;
      const firstCallback: CallbackTemplate =
        callbackOrCallbacks as CallbackTemplate;
      this.router.use(path, firstCallback, ...callbacks);
    } else {
      const firstCallback = pathsOrCallback as CallbackTemplate;
      const secondCallback = callbackOrCallbacks as CallbackTemplate;
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
  errorHandler(callback : ErrorHandler){
    this.router.setErrorHandler(callback);
  }
}
export default function aminexpress(): AminExpress {
  return new AminExpress();
}
