import { IncomingMessage, ServerResponse } from "node:http";
import { ParsedUrlQuery } from "node:querystring";

export interface Request extends IncomingMessage {
  query?: ParsedUrlQuery;
  params?: { [key: string]: any };
}
export interface Response extends ServerResponse {

  json: (data: object) => void;
  redirect: (path: string) => void;
}
export type NextFunction = (err?: Error) => any;
export type Path = string | string[];
// export type callback =
export type Methods = "GET" | "POST" | "PUT" | "DELETE" | "PATCh";
export type Callback = (
  req: Request,
  res: Response,
  next: (err?: Error) => any
) => void;
export type AsyncCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;
export type CallbackTemplate = Callback | AsyncCallback;
export type Middleware = {
  index: number;
  path?: string;
  callbacks: CallbacksTemplate;
};
export type CallbacksTemplate = (Callback | AsyncCallback)[];
export interface RouteInterface {
  callbacks: CallbacksTemplate;
  middlewareLastIndex: number;
}
