import { IncomingMessage } from "node:http";
import { ParsedUrlQuery } from "node:querystring";

export interface Request extends IncomingMessage {
  queryParams?: ParsedUrlQuery;
}
export type Path = string | string[];
// export type callback = 
export type Methods = "GET" | "POST" | "PUT" | "DELETE" | "PUT" ;
export interface RouteInterface {
    callbacks : Function[] | Function,
    middlewares : Function[] | Function,
}
