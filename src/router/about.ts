import { Router } from "express";

const aboutRouter = Router();

aboutRouter.get("/", (req, res) => {
  res.render("index", {
    title: "Ben의 기술 블로그",
    description: "반갑습니다. 웹 프론트엔드 개발자 Ben입니다.",
  });
});

export default aboutRouter;
