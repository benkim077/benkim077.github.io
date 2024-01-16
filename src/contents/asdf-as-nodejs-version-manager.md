---
slug: asdf-as-nodejs-version-manager
title: nvm에서 asdf로 갈아탔습니다
summary: asdf의 장점은 무엇일까요?
tags: ["asdf", "nodejs", "yarn"]
created_at: 2024-01-11T10:19:37.725Z
is_published: true
---

여러 Nodejs 버전을 사용할 때 nvm으로 쉽게 버전을 변경할 수 있습니다. 

그러나 nvm을 사용하며 불편함을 느껴왔었고, 이번에 asdf로 변경했습니다. 

nvm 대비 asdf의 강점을 알아봅니다. 그리고 asdf와 nodejs, yarn을 설치하는 방법을 알아봅니다.

# Nodejs 버전 관리 툴
## nvm
최근까지 **Nodejs 버전 관리 툴**로 [nvm](https://github.com/nvm-sh/nvm)을 사용했었다.

nvm은 다수의 Node 버전을 설치하고 `nvm use 20.10.0` 명령어로 특정 버전을 선택해서 사용할 수 있는 기능을 제공한다. 프로젝트 마다 Node 버전이 다르기 때문에 반드시 필요한 툴이다.

하지만 *불편한 점*도 있었다. 특히 프로젝트에 접근할 때 마다 버전이 자동으로 바뀌지 않아 매번 버전을 설정해줘야 해서 귀찮은 면이 있다. `.nvmrc` 파일에 버전을 명시해두면 `nvm use` 명령어로 명시된 버전을 바로 사용할 수 있지만, 여전히 매번 명령어를 입력해줘야 하니 귀찮음은 여전하다. 

그래서 Nodejs 버전 관리 툴을 nvm 에서 asdf 로 전환하려고 한다.

(이 불편함을 [shell script를 통해 해결하는 방법](https://stackoverflow.com/questions/23556330/run-nvm-use-automatically-every-time-theres-a-nvmrc-file-on-the-directory) 도 있다.)
## asdf
[asdf](https://asdf-vm.com/)는 *다양한 개발 툴의 버전을 관리*할 수 있도록 하는 multi runtime version manager이다. Nodejs 버전을 관리할 수 있을 뿐만 아니라, *다양한 언어, 환경을 지원*한다. Elixir, Node.js, Ruby, 그 외 커뮤니티 플러그인들이 존재한다. (지원 목록은 asdf 문서 / Plugins 에서 확인할 수 있다.)

### asdf의 장점
- (파편화된 API, $PATH 설정 등) *개별 버전 매니징 툴을 사용하는 불편함 대신 단일 API, 단일 config 파일을 통해 편의성을 제공*
    - `.tool-versions` 파일 하나에 버전 정보를 모아서 정리
    - *Plugin 방식*을 사용해서 다양한 환경을 공통 API로 조작
- global, local을 구분하여 설정 가능하고, *자동으로 `.tool-versions` 파일을 읽고 버전을 설정*

asdf 사용하면 자동으로 설정값을 불러오기 때문에, 불편함에서 벗어날 수 있다.
# asdf, nodejs 설치
[asdf의 getting started 문서](https://asdf-vm.com/guide/getting-started.html#getting-started)에서 환경에 맞는 다양한 설치 방법을 제공한다. (asdf는 현재 Windows OS는 지원하지 않는다.)

문서를 따라가면 asdf 설치, nodejs 플러그인 설치 그리고 global, local 버전 설정까지 완료할 수 있다.

# Yarn plugin 설치
원래 Yarn을 사용하기 위해서 `corepack enable` 명령어를 사용해야 한다. 그러나 asdf에선 [asdf-yarn 플러그인](https://github.com/twuni/asdf-yarn)을 통해 yarn을 설치해야 한다.
   
추가로, Yarn berry(v2)를 이용하기 위해선 프로젝트에 yarn을 설치하고 [`yarn set version` 명령어](https://yarnpkg.com/cli/set/version)를 통해 버전을 변경해야 한다.

## 이슈 발생
> 해당 이슈는 특정 yarn 버전을 설치할 경우 발생할 수 있는 이슈입니다. 

asdf-yarn 플러그인을 설치하고 `asdf install yarn latest` 명령어를 통해 yarn 최신 버전을 설치하려 했다. 하지만 다음 로그가 뜨면서 설치되지 않았다.

```
gpg: key XXXXXXXXXXXX: "Yarn Packaging <yarn@dan.cx>" not changed
gpg: Total number processed: 1
gpg:              unchanged: 1
gpg: no valid OpenPGP data found.
gpg: the signature could not be verified.
Please remember that the signature file (.sig or .asc)
should be the first file given on the command line.
```

### gpg란 무엇인가? 
asdf 문서에서 nodejs를 설치할 때 필요한 dependency를 설치할 때, gpg를 설치했었다. (`brew install gpg gawk`) 

이것이 왜 필요한가?

다양한 패키지를 관리하는 Package Manager는 각 패키지의 보안 서명을 확인해야 한다. **패키지 보안 서명**은 보안 장치로써, *권한 없는 주체가 패키지를 수정하지 못하도록* 한다. gpg는 패키지 보안 서명을 확인하는 역할을 한다.

npm은 node에서 사용하는 패키지들을 관리하는 툴이다. 각 패키지의 보안 서명을 확인하기 위해서 gpg를 사용하는 것이다.

## 해결
어쨌든 gpg 관련 이슈를 해결하기 위해서 검색을 해봤는데, [Yarn 최신 버전의 warning 이슈](https://github.com/twuni/asdf-yarn/issues/33)를 발견할 수 있었다. 결국 특정 버전(v1.22.20, v1.22.21)의 이슈이므로, 비교적 최근 버전인 1.22.19 버전은 설치가 가능했다.

*이제 asdf를 이용해서 nodejs, yarn의 버전을 자유롭게 변경할 수 있다!*

# 정리
- nvm을 사용하면서 여러 불편함이 있어 asdf로 이사했습니다.
- asdf는 단일 API / config 및 자동 버전 설정이라는 장점이 있습니다.
- asdf는 plugin 기반으로 동작합니다. node, yarn 플러그인을 설치했습니다.
- 특정 yarn 버전에서 발생할 수 있는 패키지 보안 서명 이슈에 대해 알아봤습니다.
- 이제 asdf로 nodejs, yarn 버전을 자유롭게 변경할 수 있습니다.
