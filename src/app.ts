import express from "express";

const app = express();
const port = 3000;

app.set("views", __dirname + "/views");
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("index", {
    title: "Ben의 기술 블로그",
    description: "반갑습니다. 웹 프론트엔드 개발자 Ben입니다.",
  });
});

app.get("/posts", (req, res) => {
  //dummy posts data from db
  const posts = [
    {
      title: "javascript-async",
      summary: "javascript 비동기 프로그래밍, Promise, async/await에 대해",
    },
    {
      title: "browser caching",
      summary: "브라우저 캐싱의 원리와 관련 http headers를 정리 ",
    },
    { title: "html basics", summary: "HTML의 개념과 Semantic tag에 대해" },
  ];
  res.render("posts", {
    title: "작성글 - Ben의 기술 블로그",
    description: "프론트엔드 개발에 필요한 내용을 공유합니다.",
    pageTitle: "작성글",
    posts: posts,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
