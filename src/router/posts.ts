import { Router } from "express";
import getPostList from "../store/getPostList";

const postsRouter = Router();

postsRouter.get("/", async (req, res) => {
  const posts = await getPostList("src/contents");
  res.render("posts", {
    title: "작성글 - Ben의 기술 블로그",
    description: "프론트엔드 개발에 필요한 내용을 공유합니다.",
    pageTitle: "작성글",
    posts: posts,
  });
});

export default postsRouter;
