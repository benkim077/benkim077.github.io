# Tech Blog

[개인 기술 블로그](https://benkim077.github.io/) 레포지토리입니다.

## 특징

- Static Site Generation 프로세스를 직접 구현
- SEO 최적화(meta, og, json-ld)
- 필요한 기능을 직접 선정하고, 지속적으로 개선(이슈 탭 참고)

## 기술

- TypeScript
- TailwindCSS
- Pug

## 빌드/배포 프로세스

1. `/src/contents`에 포스트를 마크다운 형식으로 저장합니다.
2. `/src`의 view, markdown, image, css 파일으로 `/docs`에 정적 파일을 생성합니다.
3. Github Pages가 `/docs` 경로에 있는 정적 파일을 serving합니다.
