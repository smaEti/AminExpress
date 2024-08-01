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

[link](#contribution)

## Docs

- [How it works](#howitworks)
- [installation](#installation)
- [getting Started](#gettingstarted)
- [methods](#methods)
- [middleware](#middleware)
- [request](#request)
- [response](#response)
- [error handling](#error)
- [serve Static](#static)

## How it works
<a name="howitworks"></a>

 This app is an HTTP router with built-in middleware support, similar to popular frameworks like Express.js. However, it utilizes a unique approach by implementing a trie tree data structure for efficient route handling. This README explains the inner workings of the app, including route creation, middleware assignment, and request handling.
### Trie Tree Data Structure

At the core of the app is a trie tree data structure, which organizes routes in a hierarchical manner. Each segment of a URL path is represented as an edge in the trie tree, and the end of the path is represented as a node. This structure allows for efficient route matching and middleware execution.
Route Creation

#### When a new route is defined, the app performs the following steps:

- **URL Segmentation:** The URL is split into its constituent parts (edges). For example, the URL /user/id/ali is split into three segments: user, id, and ali.

- **Node and Edge Creation:** For each segment of the URL, the app creates corresponding edges and nodes in the trie tree. If an edge or node already exists, it is reused. This prevents duplication and ensures a compact structure.
  - For /user/id/ali, the app creates or reuses the following:
    - An edge for user and a node for user.
    - An edge for id and a node for id as a child of user.
    -  An edge for ali and a node for ali as a child of id.

- Middleware and Callback Assignment: The middlewares and route-specific callbacks are assigned to the final node created for the route. Middlewares defined before the route are attached in order, followed by the route's callback.

### Request Handling

#### When a request is received, the app processes it through the following steps:

- **URL Matching:** The app traverses the trie tree using the segments of the incoming URL to find the corresponding node.
  - For example, a request to /user/ali would traverse the edges user and ali to find the node for ali.

- **Middleware Execution:** Once the target node is found, the app retrieves the list of middlewares and callbacks stored in that node.

- Callback Execution: The app executes the middlewares and callbacks in the order they were defined. Any middlewares defined after the route are also added to the list of callbacks to be executed in sequence. This ensures that each middleware processes the request in sequence before the final callback is executed.

### Example

#### Let's walk through a concrete example:

- Define Middlewares:

```Javascript

router.use((req, res, next) => {
    console.log('Middleware 1');
    next();
});

router.use((req, res, next) => {
    console.log('Middleware 2');
    next();
});
```

- Define Routes:

```Javascript

router.get('/user/ali', (req, res) => {
    res.send('Hello, Ali!');
});

router.use((req, res, next) => {
    console.log('Middleware 3');
    next();
});
```
#### Internal Trie Tree Structure:

- The trie tree will have edges and nodes for user and ali.
    The node for ali will have the middlewares and the callback assigned to it.

#### Handling a Request:

- A request to /user/ali will trigger the middlewares and the callback in order:
  - Middleware 1: Logs 'Middleware 1'.
  - Middleware 2: Logs 'Middleware 2'.
  - Callback: Sends 'Hello, Ali!' as the response.
  - Middleware 3: Logs 'Middleware 3'.

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

## <a name="error">error handling</a>

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
