import aminexpress from "../src/aminexpress";
import { Request } from "../src/types";
const app = aminexpress();
// path related[] middleware with multiple callbacks

// app.use(
//   ["/v1", "/v2"],
//   (req : Request) => {
//     console.log("path related[] middleware with multiple callbacks 1",req);
//   },
//   () => {
//     console.log("path related[] middleware with multiple callbacks 2");
//   },
//   () => {
//     console.log("path related[] middleware with multiple callbacks 3");
//   }
// );
//middleware with only one callback
// app.use(async () => {
//   console.log("middleware first");
// });
// middleware with multiple callback functions
// app.use(
//   () => {
//     console.log("middleware second");
//   },
//   () => {
//     console.log("middleware second2");
//   },
//   () => {
//     console.log("middleware second3");
//   }
// );
// path related middleware with one callback
// app.use("/", () => {});
// app.get("/v1/user/1/",()=>{});
app.get("/v1/user/:ahmad/1/",(req : Request)=>{
console.log(req.params!.ahmad)
});

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
// app.use(()=>{

// },()=>{

// })
// app.router.routeMap.children["v1"].children["user"].methods["GET"].callbacks[0]()
// app.router.routeMap.children["v1"].children["user"].methods["GET"].callbacks[1]()
// console.log(app.router.routeMap.methods["GET"])

app.listen(3000, () => {
  console.log("server");
});
