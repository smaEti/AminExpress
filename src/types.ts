import { IncomingMessage, ServerResponse } from "node:http";
import { ParsedUrlQuery } from "node:querystring";
import { RouteMap } from "./RouteMap";

export interface Request extends IncomingMessage {
  query?: ParsedUrlQuery;
  params?: { [key: string]: any };
}
export interface Response extends ServerResponse {
  status : (num : number) => Response;
  json: (data: object) => void;
  redirect: (path: string) => void;
}
export type NextFunction = (err?: Error) => any;
export type Path = string | string[];
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
export type ErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => void;
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
