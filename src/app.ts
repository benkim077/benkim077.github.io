import express from "express";
import aboutRouter from "./router/about";
import postsRouter from "./router/posts";

const app = express();
const port = 3000;

app.set("views", "src/views");
app.set("view engine", "pug");

app.use("/", aboutRouter);
app.use("/posts", postsRouter);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
