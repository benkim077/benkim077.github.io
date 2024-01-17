---
slug: 
title: 설치 가이드에서 알아보는 Tailwind CSS
summary: 
tags:
  - TailwindCSS
created_at: 
is_published: false
---

Next.js 에서 TailwindCSS, CSS Module를 사용해야 하는 이유? Tailwind는 css-in-css / css-in-js 중 무엇인가?  이런걸 조금 얘기해보는 것은 어떨까?

Tailwind가 HTML를 읽고 필요한 CSS 코드를 생성하는 과정과 생성 방식에 대해서 살펴보려고 한다. 

블로그 구현하면서 Vite 등 Bundler를 이용하지 않고, 직접 Static Files를 빌드하는 로직을 구현하였다. 이때 Tailwind가 작동하는 방식에 대해 이해할 필요가 있었고, 그 과정에서 Tailwind가 Purge 방식에서 Just In Time 방식으로 전환했다는 사실도 알게됐다. 

이 포스트에서 Tailwind가 언제, 어떻게 CSS 코드를 생성하는가에 대해서 살펴볼 것이다. Purge, JIT 방식을 비교하면서 JIT 방식의 이점을 찾아본다. 

--- 

[이전 글](https://benkim077.github.io/posts/using-pug-and-tailwind/)에서 블로그 프로젝트의 CSS Framework로 TailwindCSS를 선택한 이유에 대해 언급했었다. 또한 정적 파일 빌드 프로세스 마지막 단계에서 Tailwind가 HTML을 읽고 필요한 CSS 코드를 생성한다고 하였다.

이번 포스팅에서는 Tailwind가 수행하는 작업에 대해서 구체적으로 살펴보려고 한다. 특히 '언제', '어떻게' HTML 에서 CSS 를 생성하는지를 알아본다.

이 내용을 이해하게 되면 다음 내 과정을 이해하게 되면 다음 항목에 대해 이해할 수 있다.

- 왜 빌드 최종 순서에 Tailwind가 위치하는지, 
- Installation 방법 중 Tailwind CLI의 구체적인 동작 방식
- 다른 Installation 방법의 동작 방식을 예상 가능
- 왜 Tailwind 가 빌드 단계에서 필요한지
- 그리고 CDN을 이용해서 설치하는 것이 지양되는가
- 빌드 방식의 변화 Purge > Just In Time
- 결과적으로 Vite와 같은 번들러, 빌드 도구가 어떻게 코드를 번들링하는지

---

이번 포스팅에서는 Tailwind CSS의 [설치 가이드 문서](https://tailwindcss.com/docs/installation)에 대해서 다루려고 합니다. (이미 다양한 상황에 맞춰 가이드가 잘 작성되어 있기 때문에 설치 방법에 대해서 언급하진 않겠습니다.)

설치 가이드는 크게 4가지 방법을 제안하고 있습니다. 아마 Framework Guides에서 사용하고 있는 환경을 선택하는 방식을 가장 많이 사용하고 있을 것으로 생각됩니다. 가장 간단하면서 공식적인 방법이기 때문일 것입니다.

저는 각 설치법을 살펴보며 Tailwind가 무엇인지에 대해 개념적으로 이해해보려고 합니다. (기존에는 Tailwind를 '유틸리티 클래스를 기반으로 스타일링하는 프레임워크'라고 이해하고 있었습니다.)

이 포스트를 읽으면 알게되는 내용

- Nodejs 없이 Tailwind를 사용하는 방법
- PostCSS의 개념, Tailwind - PostCSS의 관계
- CDN 방식의 문제점과 빌드 프로세스의 필요성
- Just-In-Time 방식에 대한 이해

# Tailwind CLI
첫 번째 방법은 Tailwind CLI을 이용하는 것입니다. 

> *Node.js 없이 [standalone excutable](https://tailwindcss.com/blog/standalone-cli)로 Tailwind를 사용하고 싶다면* 이용가능한 방법

어떻게 독립적으로 실행할 수 있을까요? 링크를 따라가 봅시다.

> Tailwind는 *JavaScript로 작성된 npm 패키지*입니다. 이를 사용하려면 *Nodejs가 필요*합니다.
> 하지만 npm을 사용하지 않는 프로젝트(Rails 등)에서도 Tailwind를 사용할 수 있는 방법이 필요합니다.
> 이를 가능하게 하는 것은 Vercel의 pkg입니다. pkg는 Nodejs 설치 없이 실행가능하도록 *Nodejs 프로젝트를 실행 파일 자체에 번들링*합니다.

Nodejs 프로젝트를 실행 파일에 번들링함으로써 Nodejs 없이도 Tailwind를 사용할 수 있는 것이네요. 또한 Tailwind가 JavaScript로 작성된 npm 패키지일 뿐이라는 점도 알게 됐네요.

# Using PostCSS
두 번째 방법은 Tailwind를 PostCSS의 플러그인으로 이용하는 것입니다.

> *PostCSS 플러그인으로 Tailwind를 설치*하는 방법
> 빌드 도구(webpack, Rollup, Vite, Parcel 등)와 가장 원활하게 통합된다.

PostCSS를 간단하게 설명하자면, CSS를 파싱하고 처리 후 CSS 코드를 반환하는 JavaScript 입니다.

%% Tailwind를 플러그인으로 사용하면 PostCSS는 다음 순서로 동작하게 됩니다.

1. CSS를 Abstract Syntax Tree로 파싱한다.
2. AST를 Plugin(Tailwind)에 전달한다.
3. AST를 문자열로 변환하여 파일로 출력한다.

이 과정을 Tailwind의 작동 방식과 비교해봅시다.

1. 파일을 읽고 사용된 유틸리티 클래스를 탐색
2. 유틸리티 클래스를 선언
3. CSS 파일을 생성

각 부분에서 유사한 부분이 있음을 알 수 있습니다. %%

PostCSS 방식을 사용하면 빌드 시점에 CSS 파일을 생성하게 됩니다.

# Framework Guides
세 번째 방법인 프레임워크 가이드는 여러 인기 환경에서 Tailwind를 사용할 수 있는 방법을 제공합니다. 

대부분의 방식에서 PostCSS를 이용하고 있는 것으로 보아, 2번째 방식과 같은 방식을 사용하되 환경별로 약간씩 변형이 존재한다고 볼 수 있겠습니다.

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

![[Screenshot 2024-01-17 at 10.59.50 AM.png]]

cdn.tailwindcss.com 에서 3.4.1 파일을 가져왔음을 알 수 있습니다.
이 파일은 JavaScript 파일이고 사이즈는 111KB입니다.
앞에서 말했던 "Tailwind는 JavaScript로 작성된 패키지"라는 사실을 확인할 수 있네요.

즉, CDN에서 가져오는 것은 JavaScript 파일이고, 이 파일이 HTML 에서 클래스를 읽어 스타일을 생성해주고 있는 것입니다. 

Element 탭을 확인해보면 생성된 스타일 코드를 확인할 수 있습니다.

![[Screenshot 2024-01-17 at 11.08.08 AM.png]]*style 태그에 선언된 클래스를 받아옵니다.*

![[Screenshot 2024-01-17 at 11.09.21 AM.png]]*style 태그에 CSS 코드가 생성됩니다.*

생성된 CSS 코드의 용량은 5KB 정도입니다.

## CDN 방식을 지양해야 하는 이유

CDN 방식의 특징을 정리해봅시다.
1. 네트워크 사용량 증가
    - CDN 방식은 큰 .js 파일을 다운받습니다. 
2. 런타임에서 스타일 코드 생성 로직이 실행
    - 다운받은 .js 파일이 실행되고 결과물인 css 코드는 `<style>` 에 저장됩니다.

이런 특징으로, 우리는 CDN 사용을 지양해야 합니다.

만약 우리가 CSS 코드를 미리 생성하고 가져온다면, 훨씬 네트워크 트래픽을 감소시킬 수 있을 겁니다.

어떻게 CSS 코드를 미리 생성할 수 있을까요? 

위에서 설명한 다른 방법들을 사용하면 빌드 프로세스에서 CSS 파일을 생성해줍니다.


# 마무리
항상 설치 가이드는 무지성으로 따라가기만 했던 부분이었는데, 이번에 Tailwind CSS 문서를 주의깊게 읽어보고 정리했습니다. 

PostCSS가 무엇인지 알게 됐고, Vercel의 pkg를 접할 수 있었습니다. 또한 CDN을 지양해야 하는 이유를 눈으로 직접 확인할 수 있었습니다.

# Read More
Tailwind가 유틸리티 클래스를 탐색하는 방식에 대해 궁금하다면:
- [The way Tailwind scans your source code for classes](https://tailwindcss.com/docs/content-configuration#class-detection-in-depth)

PostCSS에 대해 궁금하다면:
- [It's Time for Everyone to Learn About PostCSS - What It Really Is; What It Really Does](https://davidtheclark.com/its-time-for-everyone-to-learn-about-postcss/)
- [Some things you may think about PostCSS... and you might be wrong](https://www.julian.io/articles/postcss.html)

Tailwind의 빌드 과정에 사용되는 Just-In-Time 전략에 대해 궁금하다면:
- [Just-In-Time: The Next Generation of Tailwind CSS](https://tailwindcss.com/blog/just-in-time-the-next-generation-of-tailwind-css)
