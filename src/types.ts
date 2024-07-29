import { IncomingMessage } from "node:http";
import { ParsedUrlQuery } from "node:querystring";

export interface Request extends IncomingMessage {
  queryParams?: ParsedUrlQuery;
}
export interface Response extends IncomingMessage {}
export type Path = string | string[];
// export type callback =
export type Methods = "GET" | "POST" | "PUT" | "DELETE" | "PATCh";
export type Callback = (req : Request ) => void;
export type AsyncCallback = (req : Request ) => Promise<void>;
export type CallbackTemplate = Callback | AsyncCallback;
export type Middleware = {
  index: number;
  path?: string;
  callbacks: CallbacksTemplate;
};
export type CallbacksTemplate = (Callback | AsyncCallback)[];
export interface RouteInterface {
  callbacks: CallbacksTemplate;
  middlewares: Middleware[];
}
