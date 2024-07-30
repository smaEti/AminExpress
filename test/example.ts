import aminexpress from "../src/aminexpress";
import { NextFunction, Request, Response } from "../src/types";
const app = aminexpress();
app.serveStatic(__dirname, "/uploads");
// path related[] middleware with multiple callbacks
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ route: "/" });
});

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
app.use((req, res, next: NextFunction) => {
  console.log("middleware first");
  next();
});
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
app.get("/v1/:id", (req: Request, res: Response, next: NextFunction) => {
  console.log(`first route /v1/${req.params!.id}`);
  // res.end("hahahahahahahahah it works")
  console.log(req.query);

  res.json({ message: "lol" });
  // res.redirect("/v2/user/akbar");
  // res.redirect("/v1/user/wer/1");1
});
app.get("/v2/user/akbar", (req: Request, res: Response, next: NextFunction) => {
  console.log("redirect request check ");
  res.end("redirected");
  next();
});
app.post(
  "/v2/user/akbar",
  (req: Request, res: Response, next: NextFunction) => {
    console.log("post request check ",req.query);
    next();
  }
);
app.put("/v2/user/akbar", (req: Request, res: Response, next: NextFunction) => {
  console.log("put request check ");
  next();
});
app.delete(
  "/v2/user/akbar",
  (req: Request, res: Response, next: NextFunction) => {
    console.log("delete request check ");
    next();
  }
);
// app.get(
//   "/v1/user/:ahmad/1/",
//   (req: Request, res: Response, next: NextFunction) => {
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
app.use((req, res, next: NextFunction) => {
  console.log("middleware after routes");
  next();
});

app.listen(3000, () => {
  console.log("server");
});
