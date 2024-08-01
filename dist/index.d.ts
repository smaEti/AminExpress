import { IncomingMessage, ServerResponse } from "node:http";
import { ParsedUrlQuery } from "node:querystring";

export interface Request extends IncomingMessage {
    query?: ParsedUrlQuery;
    params?: {
        [key: string]: any;
    };
}
export interface Response extends ServerResponse {
    status: (num: number) => Response;
    json: (data: object) => void;
    redirect: (path: string) => void;
}
export type NextFunction = (err?: Error) => any;
export type Path = string | string[];
export type Methods = "GET" | "POST" | "PUT" | "DELETE" | "PATCh";
export type Callback = (req: Request, res: Response, next: (err?: Error) => any) => void;
export type AsyncCallback = (req: Request, res: Response, next: NextFunction) => Promise<void>;
export type CallbackTemplate = Callback | AsyncCallback;
export type ErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => void;
export type Middleware = {
    index: number;
    path?: string;
    callbacks: CallbacksTemplate;
};
export type RouteMapAndKeyOrNull = [RouteMap, string] | [null, string];
export type StringTupleList = [string, string][];
export type CallbacksTemplate = (Callback | AsyncCallback)[];
export interface RouteInterface {
    callbacks: CallbacksTemplate;
    middlewareLastIndex: number;
}
export class RouteMap {
    children: Record<string, RouteMap>;
    methods: Record<string, RouteInterface>;
    constructor();
    private hasSection;
    private addPathSection;
    search(path: string): [RouteMap, StringTupleList] | [null, StringTupleList];
    private searchTrie;
    addRoute(path: string): RouteMap;
    private addRouteChild;
}

export class Router {
    customErrorHandler: ErrorHandler | null;
    serveStaticPathFlag: [string, string, number] | null;
    routeMap: RouteMap;
    middlewareCounter: number;
    GLOBALmiddlewares: Middleware[];
    PathRelatedMiddlewares: Middleware[];
    get(paths: Path, callback: CallbackTemplate, ...callbacks: CallbacksTemplate): void;
    post(paths: Path, callback: CallbackTemplate, ...callbacks: CallbacksTemplate): void;
    put(paths: Path, callback: CallbackTemplate, ...callbacks: CallbacksTemplate): void;
    delete(paths: Path, callback: CallbackTemplate, ...callbacks: CallbacksTemplate): void;
    use(callback: CallbackTemplate, ...callbacks: CallbacksTemplate): void;
    use(paths: Path, callback: CallbackTemplate, ...callbacks: CallbacksTemplate): void;
    handler(req: IncomingMessage, res: ServerResponse): void;
    handleQuery(req: Request): Request;
    handleUrlParameter(req: Request, params: StringTupleList): Request;
    setResponseConfigs(res: Response): Response;
    handleServerStatic(url: string, request: Request, response: Response): void;
    createRoute(method: Methods, paths: Path, callback: CallbackTemplate, callbacks: CallbacksTemplate): void;
    createRuntimeRoute(method: Methods, paths: Path, callback: CallbackTemplate, callbacks: CallbacksTemplate): void;
    setServeStaticPathFlag(fileAddress: string, url: string): void;
    setErrorHandler(callback: ErrorHandler): void;
}

  export class AminExpress {
    router: Router;
    get(
      path: Path,
      callback: CallbackTemplate,
      ...callbacks: CallbacksTemplate
    ): void;
    post(
      path: Path,
      callback: CallbackTemplate,
      ...callbacks: CallbacksTemplate
    ): void;
    put(
      path: Path,
      callback: CallbackTemplate,
      ...callbacks: CallbacksTemplate
    ): void;
    delete(
      path: Path,
      callback: CallbackTemplate,
      ...callbacks: CallbacksTemplate
    ): void;
    use(callback: CallbackTemplate, ...callbacks: CallbacksTemplate): void;
    use(callback: CallbackTemplate, ...callbacks: CallbacksTemplate): void;
    use(
      paths: Path,
      callback: CallbackTemplate,
      ...callbacks: CallbacksTemplate
    ): void;
    listen(port: number, callback: () => void): void;
    serveStatic(fileAddress: string, url: string): void;
    errorHandler(callback: ErrorHandler): void;
  }
  export default function aminexpress(): AminExpress;

