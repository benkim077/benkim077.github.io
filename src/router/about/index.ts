import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("index", {
    description: "반갑습니다. 웹 프론트엔드 개발자 Ben입니다.",
  });
});

export { router as aboutRouter };
