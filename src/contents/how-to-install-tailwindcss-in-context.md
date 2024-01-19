---
slug: how-to-install-tailwindcss-in-context
title: 상황에 맞게 TailwindCSS를 설치하는 방법
summary: Tailwind 설치 가이드를 살펴봅시다
tags:
  - TailwindCSS
  - PostCSS
created_at: 2024-01-19T02:46:57.621Z
is_published: true
---

이번 포스팅에서는 Tailwind CSS의 [설치 가이드 문서](https://tailwindcss.com/docs/installation)에 대해서 다루려고 합니다. 

설치 가이드는 크게 4가지 방법을 제안하고 있습니다. 각 방법에 대해 구체적으로 살펴보면서, 어떤 방법을 선택하는게 좋을지 알아보겠습니다. 
이 포스트가 상황별 설치법 가이드가 될 수 있었으면 좋겠네요.
(이미 다양한 상황에 맞춰 가이드가 잘 작성되어 있기 때문에 구체적인 설치 방법에 대해서 언급하진 않겠습니다.)

> 포스트를 통해 얻을 수 있는 것
> 
> 1. PostCSS의 개념, Tailwind 빌드 로직에 대한 이해
> 2. Nodejs 없이 Tailwind를 사용하는 방법
> 3. CDN 방식의 문제점과 빌드 프로세스의 필요성을 이해
> 4. 본인의 상황에 맞게 Tailwind를 설치할 수 있는 능력

각 방법의 설명 순서는 임의로 진행합니다. 
# Framework Guides
처음으로 살펴볼 방식은 '프레임워크 가이드'입니다. 여러 인기 환경에서 Tailwind를 사용할 수 있는 방법을 제공합니다. 
가장 간단하면서 공식적인 방법이기 때문에 Vite, CRA, Next.js 등 대부분의 환경에서 이 가이드를 따라가면 쉽게 설치가 가능합니다.

각 환경에서 사용하고 있는 방식을 잠시 살펴봅시다. 대부분의 환경에서 다음 순서를 따릅니다.

1. 의존성을 설치합니다. `npm install -D tailwindcss postcss autoprefixer`
2. Config를 설정합니다. 

*대부분의 환경에서 PostCSS를 이용하고 있는 것으로 보아, 다음에 살펴볼 방식인 'Using PostCSS'과 같은 방식을 사용하는 것을 알 수 있습니다.*

그러면 PostCSS를 이용하는 방식을 살펴봅시다.
# Using PostCSS

> *PostCSS 플러그인으로 Tailwind를 설치*하는 방법
> 빌드 도구(webpack, Rollup, Vite, Parcel 등)와 가장 원활하게 통합된다.

"PostCSS의 플러그인 Tailwind"가 무슨 의미일까요? 
이를 이해하기 위해 잠시 PostCSS에 대해 알아봅시다.

간단하게 설명하자면, *PostCSS는 CSS를 파싱하고 처리 후 CSS 코드를 반환하는 JavaScript*입니다.
PostCSS는 다음 순서로 동작하게 됩니다.

1. CSS를 Abstract Syntax Tree로 *파싱*
2. AST를 *Plugin에 전달*
    - Plugin은 *임의의 작업*을 수행합니다.
3. AST를 문자열로 변환하여 파일로 *출력*

*Tailwind는 AST를 전달받고 임의의 작업을 수행한 후 CSS 파일을 출력할 것이라고 예상*할 수 있습니다. 
이를 참고해서 PostCSS의 플러그인으로써 Tailwind의 작동 방식을 살펴봅시다.
## Tailwind 작동 방식

예시 코드와 함께 Tailwind의 작동 방식을 살펴보겠습니다. 
(프로젝트 세팅은 [깃허브](https://github.com/benkim077/tailwind-parsing)를 참고하세요.)

1. 파일을 읽고 사용된 유틸리티 클래스를 *탐색(파싱)* 합니다.

1.1 HTML 에서 사용된 tailwind 클래스를 탐색

```html
<!-- index.html -->
<head>
    <link href="./style.css" rel="stylesheet" />
</head>
<body>
    <!-- text-3xl font-bold 클래스를 찾았습니다. -->
    <h1 class="text-3xl font-bold">Hello world!</h1> 
    <button>draw underline</button>
    <script src="./main.js"></script>
</body>
```

1.2 JavaScript 에서 사용된 tailwind 클래스를 탐색

```js
// main.js
const heading = document.querySelector("h1");
const button = document.querySelector("button");
button.onclick = attachClass;

function attachClass() {
    // underline 클래스를 찾았습니다.
    heading.classList.add("underline");
}
```

2. 탐색한 *클래스를 선언(임의의 작업)* 합니다.
3. CSS 파일을 *생성(출력)* 합니다.

```css
/* style.css */

/* index.html에서 가져온 클래스 */
.text-3xl {
    font-size: 1.875rem;
    line-height: 2.25rem;
}

.font-bold {
    font-weight: 700;
}

/* main.js에서 가져온 클래스 */
.underline {
    text-decoration-line: underline;
}
```

CSS 결과물을 잘 출력한 모습입니다.
재밌는 것은 HTML 파일 뿐만 아니라, JavaScript 파일을 읽으며 클래스를 찾아왔네요. (Tailwind가 유틸리티 클래스를 탐색하는 방법이 궁금하다면 [링크](https://tailwindcss.com/docs/content-configuration#class-detection-in-depth)를 참고하세요)

결론:
**PostCSS 방식을 사용하면, 사용된 Tailwind 클래스를 포함하는 작은 크기의 css 파일을 빌드 시점에 생성할 수 있습니다.**

# Tailwind CLI
세 번째 방법은 Tailwind CLI을 이용하는 것입니다. 

> *Node.js 없이 [standalone excutable](https://tailwindcss.com/blog/standalone-cli)로 Tailwind를 사용하고 싶다면* 이용가능한 방법

어떻게 독립적으로 실행할 수 있을까요? 링크의 내용을 살펴봅시다.

> Tailwind는 *JavaScript로 작성된 npm 패키지*입니다. 이를 사용하려면 *Nodejs가 필요*합니다.
> 하지만 npm을 사용하지 않는 프로젝트에서도 Tailwind를 사용할 수 있는 방법이 필요합니다.
> 이를 가능하게 하는 것은 Vercel의 pkg입니다. pkg는 Nodejs 설치 없이 실행가능하도록 *Nodejs 프로젝트를 실행 파일 자체에 번들링*합니다.

Nodejs 프로젝트를 실행 파일에 번들링함으로써 Nodejs 없이도 Tailwind를 사용할 수 있는 것이네요. 신기합니다. 한편 Tailwind가 JavaScript로 작성된 npm 패키지일 뿐이라는 점도 알게 됐네요.

결론:
**Nodejs를 사용하지 않는 프로젝트라면 Tailwind CLI 방식을 사용**하면 되겠습니다.
# Play CDN
마지막 설치 방법으로 CDN을 이용할 수 있습니다.

> 빌드 과정 없이 브라우저에서 Tailwind를 바로 사용할 수 있는 방법
> Development 목적으로 사용되도록 설계, production용으로 최고의 선택은 아니다.

왜 이 방식을 production 용으로 사용하면 안 될까요?

## CDN 방식 직접 사용해보기

직접 확인해봅시다. 간단한 HTML 코드에 Tailwind CDN을 추가합니다. 

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- CDN 추가 -->
    <script src="https://cdn.tailwindcss.com"></script>
    <title>Document</title>
  </head>
  <body>
    <!-- Tailwind 클래스 부착 -->
    <h1 class="text-3xl font-bold underline">Hello world!</h1>
  </body>
</html>
```

이제 이 코드를 브라우저에서 실행시키고 네트워크 탭을 확인해봅시다.

![3.4.1 파일을 다운받았다.](/assets/images/download-tailwind-from-cdn.png)*3.4.1 파일을 다운받았습니다.*

cdn.tailwindcss.com 에서 3.4.1 파일을 가져왔음을 알 수 있습니다.
- JavaScript 파일
    - 앞에서 말했던 "Tailwind는 JavaScript로 작성된 패키지"라는 사실을 확인할 수 있네요.
- 큰 용량의 파일 (111KB)

정리하면 CDN에서 가져오는 것은 JavaScript 파일이고, 이 스크립트가 HTML 에서 클래스를 읽어 스타일을 생성해주고 있는 것입니다. Element 탭을 확인해보면 생성된 스타일 코드를 확인할 수 있습니다.

![클래스가 선언된 모습](/assets/images/class-made-by-tailwind.png)*`<style>` 태그에 선언된 클래스를 받아옵니다.*

![style 태그에 생성된 코드](/assets/images/generated-code-in-the-style-tag.png)*`<style>` 태그에 CSS 코드가 생성됐네요.*

이렇게 생성된 CSS 코드의 용량은 5KB 정도입니다. 또한 style 코드 하단부에 유틸리티 클래스가 선언됐음을 확인할 수 있습니다. 

(참고: CDN을 사용하면 HTML에 포함된 script를 읽고 클래스를 미리 생성할 수 없습니다. PostCSS에서 사용한 코드처럼 `classList.add`로 클래스를 부착하면 변경된 HTML을 읽고 런타임에서 CSS 클래스를 생성합니다. 이를 통해 CDN의 Tailwind는 `--watch` 옵션으로 실행되는 것을 알 수 있네요.)

## CDN 방식을 지양해야 하는 이유

CDN 방식의 특징을 정리해봅시다.
1. 네트워크 사용량 증가
    - CDN 방식은 큰 .js 파일(111KB)을 다운받습니다. 
    - *완성된 CSS 파일만 다운받는다면 5KB에 그칩니다.*
1. 런타임에서 스타일 코드 생성 로직이 실행
    - 다운받은 .js 파일이 실행되고 결과물인 CSS 코드는 `<style>` 에 저장됩니다.
    - *빌드 타임에 미리 CSS 코드를 생성한다면 더 빠르게 렌더링이 가능합니다.*

결론:
**이런 특징 때문에 프로덕션 환경에서 CDN 사용을 지양해야 합니다.** 위에서 설명한 다른 방법들을 사용하면 빌드 프로세스에서 미리 CSS 파일을 생성해주기 때문에 네트워크 트래픽을 감소시킬 수 있을 겁니다.

# 마무리
항상 설치 가이드는 무지성으로 따라가기만 했던 부분이었는데, 이번에 Tailwind CSS 문서를 주의깊게 읽어보고 정리해봤습니다.

PostCSS가 무엇인지 알게 됐고, Vercel의 pkg 같은 기술이 있다는 것을 접할 수 있었습니다. 또한 CDN을 지양해야 하는 이유를 눈으로 직접 확인할 수 있었습니다.

# Read More

PostCSS에 대해 궁금하다면:
- [It's Time for Everyone to Learn About PostCSS - What It Really Is; What It Really Does](https://davidtheclark.com/its-time-for-everyone-to-learn-about-postcss/)
- [Some things you may think about PostCSS... and you might be wrong](https://www.julian.io/articles/postcss.html)
