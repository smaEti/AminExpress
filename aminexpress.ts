import http, { IncomingMessage, ServerResponse } from "node:http";
import Router from "./router";
import { URL } from "node:url";
import querystring from "node:querystring";
import { Path, Request } from "./types";
class AminExpress {
  router: Router = new Router();
  constructor() {
    console.log("aminexpress instanciated");
  }
  get(path: Path) {
    this.router.get(path);
  }
  post(path: Path) {
    this.router.post(path);
  }
  put(path: Path) {
    this.router.put(path);
  }
  delete(path: Path) {
    this.router.delete(path);
  }
  use() {
    this.router.use()
  }
  public listen(port: number, callback: () => void): void {
    const server = http.createServer(
      (req: IncomingMessage, res: ServerResponse) => {
        //   this.middleware.executeMiddlewares(req, res, () => {
        //     this.router.handle(req, res);
        //   });
        console.log(req.url)
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
