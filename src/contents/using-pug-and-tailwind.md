---
slug: using-pug-and-tailwind
title: Pug와 TailwindCSS를 선택한 이유, 그리고 트러블슈팅
summary: 둘은 잘못된 만남?
tags: ["blog", "Pug", "TailwindCSS"]
created_at: 2024-01-09T14:19:35.595Z
---

> 우선 현재 블로그의 스타일링에 사용하고 있는 기술 스택을 살펴봅니다.
> 그리고 블로그를 스타일링하면서 있었던 문제들을 해결하는 과정을 정리하겠습니다.

# 기술 스택 선정 과정
## TailwindCSS
현재 메인 스타일링 도구로 TailwindCSS를 사용하고 있다. 
Tailwind는 Utility CSS Framework이다. 필요한 스타일을 태그의 class에 부착하면서 사용할 수 있다. 이런 사용성 덕분에 *변화에 대응하기 쉽다는 특징*을 갖는다. (Tailwind 방식이 주는 이점에 대해서 궁금하다면 [이 문서](https://tailwindcss.com/docs/utility-first#overview)를 살펴보세요.)
*제품 초기 단계에 디자인 변동이 잦을 것으로 생각했기에* Tailwind를 선택했다.

## Pug
Pug는 간결한 문법으로 사용할 수 있는 **템플릿 엔진**이다. 

다음 코드는 블로그의 메인 페이지를 렌더링할 때 사용하는 Pug 코드이다.

```pug
doctype html
html.bg-background-dark.text-font-white(lang="ko-KR")
  include includes/head.pug
  body
    div#wrapper
      include includes/header.pug
      main.mb-auto
        div.border-b.border-gray-400.py-1.border-gray-400
          h2.text-5xl.font-bold="소개"
          p="반갑습니다. 웹 프론트엔드 개발자 Ben입니다."
        div.pt-8
          h3.text-2xl.font-bold="SNS"
          ul
            li
              a(href="https://github.com/benkim077" target="_blank")= "Github"
      include includes/footer.pug
```

코드에서 Pug의 특징을 엿볼 수 있다.
- `<>` 와 닫는 태그 없이, indentation을 이용해 작성된 *간결한 코드*
- Emmet(`#`, `.`)을 이용한 *간결한 id, class 설정* 방식을 제공
- 다른 pug 파일을 *import 가능*
- \+ JavaScript 코드를 실행시킬 수 있다.

*HTML 파일을 기반으로 하는 EJS, mustache 같은 템플릿 엔진 보다 간결하고 빠르게 코드를 작성할 수 있을 것으로 생각하여* Pug를 선택했다.

## 둘 모두 MVP 구현에 적합
*Tailwind, Pug 둘 다 빠르게 MVP를 만들어야 하는 상황에 잘 맞는 기술*이라고 생각한다. 
그래서 둘을 사용해서 HTML, CSS를 렌더링하기로 했다.

하지만 Tailwind, Pug를 함께 사용하면서 문제점이 보이기 시작했다.

# 트러블 슈팅
## 1\. IntelliSense Extension 사용 시 추가 설정이 필요
TailwindCSS에선 다양한 편의 기능을 IDE Extension 형태로 제공한다. 
자동완성, 미리보기 기능 등을 [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)를 통해 활성화할 수 있다.
### Extension 제한 해결하기
Pug 파일도 이 Extension이 적용된다. 하지만 Emmet을 사용할 때(`div.border-b`)는 자동완성이 되지 않고, `div(class="border-b")` 이런 형식으로 코드를 작성해야 자동완성을 활용할 수 있다. *즉, 간결한 코드가 장점인 Pug을 제대로 활용할 수 없다는 점이다.* 이런 제한을 해제하기 위해서, [Tailwind / Emmet Completions 옵션](https://github.com/tailwindlabs/tailwindcss-intellisense?tab=readme-ov-file#tailwindcssemmetcompletions)을 true로 설정해야 한다.

하지만 이 설정을 활성화하면, markdown 파일에서 `.` 을 입력할 시 자동완성이 뜨는 문제가 있었다. 이를 해결하기 위해서 [Tailwind / File / Exclude 옵션](https://github.com/tailwindlabs/tailwindcss-intellisense?tab=readme-ov-file#tailwindcssfilesexclude)에 `**/*.md` 를 추가해 주었다.

이제 Pug에서 Tailwind를 사용하는 데 아무런 문제가 없다. 
### Pug와 Tailwind의 상성 평가
Pug에서 Tailwind Extension을 사용하기 위해 추가 설정을 해줘야 하는 부분이 아쉽다. HTML 파일 기반의 템플릿 엔진을 사용했다면, 아마 이런 설정이 있는 줄도 몰랐을 것이다.

*약간의 설정을 통해 Pug가 제공하는 간결한 코드의 장점은 여전히 발휘할 수 있다. 하지만 결과적으로 Pug가 Tailwind와 딱 맞는 퍼즐 조각은 아니라는 생각이 들었다. HTML 파일을 사용하는 템플릿 엔진이 Tailwind와 더 적합하다고 볼 수 있다.*

## 2\. CSS 코드 관리의 어려움
### 기존에 사용하던 방식과 한계
CSS 관련 코드가 있는 장소는 2곳이다.
- Pug 파일의 utility class
- 공통 CSS를 위한 style.css

`body, #wrapper` 등 여러 템플릿 파일에서 공통으로 사용하는 부분과 `<a>` 등 공통으로 사용되는 스타일은 style.css에 작성하고, 대부분은 utility class를 사용한다.

다만 블로그 포스트에 대한 CSS도 style.css에 포함하게 되었다. *그 이유는 포스트를 markdown으로 작성한 뒤에 HTML로 변환되기 때문이다.* Markdown을 HTML로 변환해주는 역할은 [Showdown 라이브러리](https://showdownjs.com/)가 담당한다.

#### Showdown의 역할 살펴보기

Showdown은 markdown을 입력받고, HTML을 출력한다.

```markdown
<!-- Markdown Input  -->
## 최초 구현 방식
처음에는 *SSR로 구현*된 블로그를 목표로 프로젝트를 시작했고, Express를 이용해서 서버를 구현했었습니다.
이 서버는 페이지의 html 파일을 리턴하는 웹서버입니다.

서버는 다음 순서대로 동작합니다.
1. 클라이언트로부터 요청을 받습니다. 
2. 요청받은 Path을 이용해서 템플릿 엔진이 HTML을 생성합니다.
3. .html 파일을 담아 응답합니다.
```

```html
<!-- HTML Output -->
<h4>최초 구현 방식</h4>
<p>처음에는 <em>SSR로 구현</em>된 블로그를 목표로 프로젝트를 시작했고, Express를 이용해서 서버를 구현했었습니다.
이 서버는 페이지의 html 파일을 리턴하는 웹서버입니다.</p>
<p>서버는 다음 순서대로 동작합니다.</p>
<ol>
    <li>클라이언트로부터 요청을 받습니다. </li>
    <li>요청받은 Path을 이용해서 템플릿 엔진이 HTML을 생성합니다.</li>
    <li>.html 파일을 담아 응답합니다.</li>
</ol>
```

#### Showdown의 한계

이렇게 markdown에서 생성된 HTML을 Pug에 전달하여 최종 HTML 파일을 생성하게 된다.
다만 HTML Tag만 생성하는 바람에 스타일은 전혀 없었다. 그래서 style.css 파일에 descendant selector를 이용해서 스타일을 처리하였다.

```css
/* id="post" 를 부여하고 내부 태그만 따로 스타일링해주었다. */
#post p {
  @apply my-1;
}

/* post 내부/외부 모두 사용되는 경우는 태그 선택자를 사용 */
h3 {
  @apply text-xl font-bold my-1;
}
```

하지만 *코드가 여러 군데에 맥락없이 분리*되어 CSS 코드를 찾기 어려워졌고, 요구사항에 기민하게 대응하기 어려워졌다. 구체적으로는 *Inline style, selector, utiltity class 가 혼용되어 CSS 우선순위를 파악하기 어려운 문제*가 있었고, 결국 코드가 의도대로 작동하지 않았다.

### 해결 방법
*이를 해결하기 위해 inline style, selector는 최소화하고, utility class를 최대한 활용하는 방법을 고민*하기 시작했다.
*결국 post에서 생성된 html에 utility class를 붙여야 해결될 문제*였다. 
이것을 구현하기 위해서 여러 방법들을 고민했다. 그리고 마지막 방법을 선택했다.
- ~~DOM API~~
    - 문제점 : HTML 문자열이기 때문에 사용할 수 없다.
- ~~HTML 문자열 파싱~~
    - replaceAll 함수를 이용해서 class를 부착한다.
    - 문제점
        - CSS 코드가 섞인다.
        - heading, p, ul, ol 등 모든 태그를 탐색하는 시간이 필요
- [Showdown converter extension을 이용하는 방법](https://github.com/showdownjs/showdown/wiki/Add-default-classes-for-each-HTML-element )
    - md 파일에서 html로 변경될 때 class를 붙일 수 있다.
    - 장점
        - *markdown이 형식과 내용을 함께 갖는 언어라는 측면에서 md 파일이 HTML 파일로 변경될 때 스타일 클래스가 붙어서 나오는 것은 매우 자연스러움*
        - *md > html > pug > tailwind 의 순서가 깔끔해짐*

![Markdown 파일이 HTML, CSS로 변환되는 프로세스](src/assets/images/markdown-to-html-css.png)

Showdown을 이용해서 위 그림 같은 로직을 통해 HTML, CSS가 생성할 수 있게 됐다.
Post Page의 경우 설명:
- Showdown을 사용하여 *스타일링된 부분적 HTML을 생성*한다.
- Pug는 개발자가 입력한 Template과, HTML을 입력받아 *전체 HTML을 생성*한다.
- Tailwind는 HTML을 읽어 *필요한 CSS 코드를 생성*한다.

구체적인 코드는 다음과 같다.

```ts
// 각 태그에 부착할 utility 클래스를 선언
const classMap: ClassMap = {
  h3: "text-4xl font-bold my-1",
  h4: "text-3xl font-bold my-1",
  h5: "text-2xl font-bold my-1 ",
  p: "my-1",
  hr: "border-gray-400 my-5",
  ul: "list-disc list-outside pl-8",
  ol: "list-decimal list-outside pl-8",
  strong: "text-bold",
  em: "text-bold",
  blockquote: "px-3 text-font-quote my-2 border-l-2 border-[#4d8ce7]",
  pre: "bg-[#282c35] p-3 my-2",
};

// 각 태그를 정규표현식으로 변환시키는 extensions를 선언
const bindings = Object.keys(classMap).map((key) => ({
  type: "output",
  regex: new RegExp(`<${key}\\b([^>]*)>`, "g"),
  replace: `<${key} class="${classMap[key]}" $1>`,
}));

export default function convertFromMarkdownToHtml(content: string) {
  const converter = new Showdown.Converter({
    headerLevelStart: 3,
    extensions: [...bindings], // extensions 부착
    noHeaderId: true,
  });
  return converter.makeHtml(content);
}

```

이제 위 markdown 코드를 HTML로 변경하면 다음과 같다.
utlility 클래스가 생성된 것을 확인할 수 있다.

```html
<h4 class="text-3xl font-bold my-1" >최초 구현 방식</h4>
<p class="my-1" >처음에는 <em class="text-bold" >SSR로 구현</em>된 블로그를 목표로 프로젝트를 시작했고, Express를 이용해서 서버를 구현했었습니다.
이 서버는 페이지의 html 파일을 리턴하는 웹서버입니다.</p>
<p class="my-1" >서버는 다음 순서대로 동작합니다.</p>
<ol class="list-decimal list-outside pl-8" >
    <li>클라이언트로부터 요청을 받습니다. </li>
    <li>요청받은 Path을 이용해서 템플릿 엔진이 HTML을 생성합니다.</li>
    <li>.html 파일을 담아 응답합니다.</li>
</ol>
```

### 한계점
특정 경우에 대해 이 프로세스로 해결할 수 없었다.
예를 들면 `<p>`, `<ol>`, `<ul>` 바로 뒤에 `<h>` 태그가 오는 경우에 문서의 가독성을 위해 적당한 간격이 필요했다. 
이 경우는 태그의 관계에 의한 스타일링이기 때문에, 선택자로 코딩할 수밖에 없다. 아래와 같이 처리해줬다.

```css
/* p, ol, ul 태그 바로 뒤에 h3 태그가 오는 경우는 padding top을 부여한다. */
p + h3,
ol + h3,
ul + h3 {
  @apply pt-4
}
```

# 마무리
- Pug, Tailwind를 선택한 이유, 그리고 마주한 여러 문제들에 대해 살펴봤습니다.
- 첫 번째 문제를 해결하면서 Pug, Tailwind를 함께 사용하기 위해 필요한 추가 설정들을 알아봤습니다.
- 두 번째 문제를 해결하면서 HTML, Style Code가 순차적으로 생성되는 과정을 되돌아봤습니다. 결과적으로 전체 프로세스 내에서 각 절차에 맞는 코드가 생성되도록 만들어냈습니다.

# Read More
- [Github 이슈](https://github.com/benkim077/benkim077.github.io/issues/8)에서 해결 과정을 살펴보세요.
