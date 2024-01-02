import { Router } from "express";
import getPostList from "../../store/getPostList";
import getPost from "../../store/getPost";

const router = Router();

router.get("/", async (req, res) => {
  const posts = await getPostList("src/contents");
  res.render("posts", {
    title: "글 목록",
    description: "프론트엔드 개발에 필요한 내용을 공유합니다.",
    pageTitle: "글 목록",
    posts: posts,
  });
});

router.get("/:postId", async (req, res) => {
  await getPost(req.params.postId);
  const [meta, content] = await getPost(req.params.postId);
  res.render("post", {
    title: meta.title,
    pageTitle: meta.title,
    tags: meta.tags,
    created_at: meta.created_at,
    content,
  });
});

export { router as postsRouter };
