import aminexpress, { serveStatic } from "../src/aminexpress";
import { NextFunction, Request, Response } from "../src/types";
const app = aminexpress();
serveStatic(__dirname)
// path related[] middleware with multiple callbacks

// app.use(
//   ["/v1", "/v2"],
//   (req : Request , res : Response) => {
//     console.log("path related[] middleware with multiple callbacks 1");
//   },
//   () => {
//     console.log("path related[] middleware with multiple callbacks 2");
//   },
//   () => {
//     console.log("path related[] middleware with multiple callbacks 3");
//   }
// );
//middleware with only one callback
// app.use(async (req, res, next: NextFunction) => {
//   console.log("middleware first");
//   next();
// });
// // middleware with multiple callback functions
// app.use(
//   (req, res, next: NextFunction) => {
//     console.log("middleware second");
//     next();
//   },
//   (req, res, next: NextFunction) => {
//     console.log("middleware second2");
//     next();
//   },
//   (req, res, next: NextFunction) => {
//     console.log("middleware second3");
//     next();
//   }
// );
// path related middleware with one callback
// app.get("/v1/:id", (req: Request, res: Response, next: NextFunction) => {
//   console.log(`first route /v1/${req.params!.id}`);
//   // res.end("hahahahahahahahah it works")
//   // res.json({"message" : "lol"});
//   res.redirect("/v1/user/wer/1");
// });
// app.get("/v1/user/1/",()=>{});
// app.get(
//   "/v1/user/:ahmad/1/",
//   (req: Request, res: Response, next: NextFunction) => {
//     res.json({ message: "redirected" });
//   }
// );

// app.get(
//   ["/", "/v1"],
//   () => {
//     console.log("v1 route");
//   },
//   () => {
//     console.log("2");
//   }
// );

// console.log("global : ",app.router.GLOBALmiddlewares)
// console.log("path related :",app.router.PathRelatedMiddlewares)
// app.get(
//   "/v3",
//   (req) => {
//     console.log("LOL1");
//   },
//   () => {
//     console.log("LOL2");
//   }
// );
// console.log(app.router.routeMap.children["v1"].methods["GET"]);
// console.log(app.router.routeMap.children["v3"].methods["GET"]);

// app.post(
//   "/v1/user",
//   () => {
//     console.log("1");
//   },
//   () => {
//     console.log("2");
//   }
// );
app.use(
  () => {},
  () => {},
  () => {}
);

// app.router.routeMap.children["v1"].children["user"].methods["GET"].callbacks[0]()
// app.router.routeMap.children["v1"].children["user"].methods["GET"].callbacks[1]()
// console.log(app.router.routeMap.methods["GET"])

app.listen(3000, () => {
  console.log("server");
});
