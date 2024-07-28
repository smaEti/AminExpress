import aminexpress from "./aminexpress";
const app = aminexpress();
app.get("/")
app.listen(3000,()=>{
    console.log("server")
})