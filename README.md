# Amin Express (HTTP Router)

## Introduction

Welcome to **AminExpress**, a high-performance, strongly-typed HTTP routing library designed to handle large-scale applications efficiently. Leveraging the power of the Trie tree data structure, our router ensures rapid and efficient route matching, making it a perfect choice for developers aiming to build scalable and performant web applications.

## Key Features

- **Efficient Routing**: Built on a Trie tree data structure, AminExpress excels in quickly matching routes, ensuring minimal latency even as the number of routes grows.
- **Middleware Support**: Easily integrate middleware to handle tasks such as authentication, logging, and more, enhancing your application's functionality without cluttering your main logic.
- **Static File Serving**: Simplify the process of serving static files like HTML, CSS, and JavaScript with built-in support, reducing the need for additional configuration or third-party libraries.
- **Strongly Typed**: With TypeScript support, enjoy the benefits of static typing, including improved code quality, better tooling, and reduced runtime errors.

Whether you're building a small personal project or a large enterprise application, AminExpress provides the performance and flexibility needed to manage your routes effectively.

## Contribution

[link](#contributon)

## Docs

- [installation](#installation)
- [getting Started](#gettingstarted)
- [methods](#methods)
- [middleware](#middleware)
- [request](#request)
- [response](#response)
- [error handling](#error)
- [serve Static](#static)

## <a name="installation">installation</a>

```sh
 npm install aminexpress
```

## <a name="gettingstarted">getting started</a>

first you need to import the aminexpress constructor :

```Javascript
 import aminexpress from "aminexpress";
 const app = aminexpress();
```

then you can make your route (more informations on routes in [methods](#methods)) or your middlware (more info on [middleware](#middlware)):

```JavaScript
//route with get method
 app.get("/",(req : Request , res : Response , next : NextFunction)=>{
    res.end("Hello World!");
 });

 // middlware
 app.use((req : Request, res : Response, next : NextFunction)=>{
    console.log("middleware");
    next();
 })
```

in the end call the listen method for server :

```JavaScript
app.listen(PORT , ()=>{
    console.log(`server is listening on port ${PORT}`)
})
```

## <a name="methods">methods</a>

app.METHOD()

```JavaScript
app.get("your-url",callback,...[callbacks]);
```

#### supported methods :

- GET
- POST
- PUT
- DELETE

## <a name="middleware">middleware</a>

- `app.use(callback, ...[callbacks])`

  - _Accepts multiple callback functions and executes them in the defined order._

- `app.use(path, callback, ...[callbacks])`

  - _Accepts a path and multiple callback functions, executing them in the defined order for the specified path._

- `app.use([path], callback, ...[callbacks])`

  - _Accepts multiple paths and callback functions, executing them in the defined order for each specified path._

- `next()`

  - _Calls the next middleware in the defined order._

- `next(error)`
  - _If called with an error, it triggers the built-in error handler. (you can set a cutom error handler [error handling](#error))_

#### Example Usage:

```javascript
app.use((req: Request, res: Response, next: NextFunction) => {
  // Middleware logic
  next(); // Proceed to the next middleware
});

app.use((req: Request, res: Response, next: NextFunction) => {
  // Some logic that may cause an error
  if (someError) {
    next(new Error("Something went wrong")); // Trigger the error handler
  } else {
    next(); // Proceed to the next middleware
  }
});
```

## <a name="request">request</a>

#### The `Request` type extends `IncomingMessage` and includes additional objects like `query` and `params`.

#### Example:

```javascript
//you can specify the parameter variable with colon (:)

//gets id as url parameter
app.get("/user/:id", (req: Request, res: Response, next: NextFunction) => {
  console.log(req.params);
  // { id : "id-in-url" }
});

//multiple parameter
app.get(
  "/user/:user_id/profile/:profile_id",
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.params);
    // {user_id : "user_id-in-url" , profile_id : "profile_id_in_url"}
  }
);

//req.query example
app.get(
  "/user?p=123&a=31",
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.query);
    // {p : "123" , a : "31"}
  }
);
```

## <a name="response">response</a>

#### The `Response` type extends `ServerResponse<IncomingMessage>`, and includes additional methods such as `json`, `status`, and `redirect`.

#### Example:

```javascript
//res.end()
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  //sets the status code 200 and sends a string
  res.status(200).end("hello world!");
});

//res.json()
app.get("/another-route", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "hello world" });
});

// res.redirect()
app.get(
  "/another-route-2",
  (req: Request, res: Response, next: NextFunction) => {
    res.redirect("route-to-redirect");
  }
);
```

## <a name="error handling">error handling</a>

#### this library has its own error handler that you can call it with `next(err : Error)`

#### you can set custom error handler with `app.errorHandler(callback)`

#### Example:

```javascript
app.errorHandler(
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err.message);
  }
);
```

## <a name="static">serve static</a>

#### The `serveStatic` function simplifies the process of serving static files such as HTML, CSS, JavaScript, images, and other assets. This function helps deliver these files directly to the client, making it easy to build and deploy static content within your application.

#### Example:

```javascript

app.serveStatic(__dirname + "/uploads", "/uploads");

```

## Contribution

<a name ="contribution"></a>

We welcome contributions to **HTTP Router**! Whether you want to report a bug, propose a new feature, or submit a pull request, your involvement is greatly appreciated.

### How to Contribute

1. **Fork the Repository:**

   - Navigate to the [aminexpress repository](https://github.com/smaEti/AminExpress) on GitHub.
   - Click the "Fork" button at the top right of the page.

2. **Clone Your Fork:**

   - Open your terminal and clone your forked repository:
     ```sh
     git clone https://github.com/smaEti/AminExpress
     ```
   - Navigate to the project directory:
     ```sh
     cd AminExpress
     ```

3. **Create a Branch:**

   - Create a new branch for your work:
     ```sh
     git checkout -b feature-or-bugfix-description
     ```

4. **Make Changes:**

   - Implement your changes in the codebase.

5. **Commit Your Changes:**

   - Add the files you changed:
     ```sh
     git add .
     ```
   - Commit your changes with a meaningful message:
     ```sh
     git commit -m "Description of your changes"
     ```

6. **Push to GitHub:**

   - Push your changes to your forked repository:
     ```sh
     git push origin feature-or-bugfix-description
     ```

7. **Open a Pull Request:**
   - Go to the original repository and click the "Compare & pull request" button.
   - Provide a clear description of the changes you made and any relevant information.
   - Submit the pull request.

Thank you for your interest in contributing to **aminexpress**!
