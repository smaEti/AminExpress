import { Request, Path } from "./types";
import Middleware from "./middleware";

export default class Router {
  middleware: Middleware = new Middleware();
  get(path: Path) {}
  post(path: Path) {}
  put(path: Path) {}
  delete(path: Path) {}
  use() {}
}
