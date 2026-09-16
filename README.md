# 프론트엔드 면접 문항집

> **TL;DR** — 주니어·미들·시니어 프론트엔드 면접 문항 116개. 문항마다 핵심 답, 면접관이 볼 좋은/약한 신호, 면접관이 파고드는 꼬리질문 2~3단계와 단계별 기대 답, 그리고 답을 검증할 공식 문서 레퍼런스가 붙어 있다.
> **출처 주의** — 출제 이력 기록이 아니다. 공개 정리글에서 반복 등장하는 **주제**를 기준으로 고른 문항이고, 문항 문장과 답은 직접 썼다. [출처](#출처) 참고.
> 필터·검색·셀프 퀴즈가 되는 웹 페이지: **https://david-myeonghan.github.io/frontend-interview-kit/**

- 문항 116개 · 영역 13개
- 레벨 분포: 주니어 32 / 미들 40 / 시니어 41 / 공통 3
- 레퍼런스 링크 162개 (전부 HTTP 200 확인)
- 꼬리질문 245단계 — 문항마다 면접관이 파고드는 질문과 단계별 기대 답

## 쓰는 법

**지원자**: 페이지에서 `셀프 퀴즈`를 켜면 답이 가려진다. 소리 내어 답한 뒤 열어서 핵심 항목을 몇 개 짚었는지 센다. 내 대답이 `약한 신호`에 들어가면 그 문항의 레퍼런스부터 읽는다.

**면접관**: 레벨당 6~8문항이면 60분이 찬다. 영역을 3~4개로 좁히고 후속 질문으로 깊이를 잰다. 정답 여부보다 모르는 것을 어떻게 다루는지가 신호다.

## 구성

| 파일 | 내용 |
|---|---|
| `index.html` | 문항 데이터 + 페이지. 단일 파일, 의존성 없음. **데이터 수정은 여기서 한다** |
| `questions.json` | 기계가 읽는 문항 데이터 (생성물) |
| `README.md` | 문항 전문 (생성물) |
| `tools/export.mjs` | `index.html` → `questions.json` + `README.md` 재생성 |

```bash
node tools/export.mjs   # 문항을 고친 뒤 실행
```

## 문항

### JS 코어 (14)

#### [주니어] 클로저가 무엇이고 실무에서 어디에 쓰나?

**핵심 답**

- 함수가 선언된 렉시컬 스코프의 변수를 계속 참조하는 것. 호출이 끝나도 그 변수는 살아 있다.
- 디바운스·스로틀의 타이머 보관, once 플래그, 모듈 내부 상태 은닉, 커스텀 훅의 내부 값.
- 루프에서 `var`로 캡처하면 마지막 값 하나만 남고 `let`은 반복마다 새 바인딩을 만든다.

- ✅ **좋은 신호** — 디바운스나 이벤트 핸들러 같은 자기 코드로 설명하고, 변수 수명이 늘어난다는 점을 짚는다.
- ⚠️ **약한 신호** — "함수 안의 함수"라고만 말하고 스코프·수명 이야기가 없다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 클로저 때문에 메모리가 안 풀리는 상황을 만들어 보라.
     - 기대 답: 리스너나 인터벌 콜백이 큰 객체·DOM 을 참조한 채 해제되지 않는 경우. 해제 함수를 반환하거나 구독을 끊어야 한다는 답이 나와야 한다.
  2. 그 누수를 코드만 보고 알 수 있나? 어떻게 확인하겠나?
     - 기대 답: DevTools 힙 스냅샷 2회 비교, detached DOM 검색. 코드 리뷰만으로는 못 잡는다는 인식이 핵심.
- 📖 **레퍼런스** — [MDN Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)

#### [주니어] `==`와 `===`의 차이, `==`를 써도 되는 경우가 있나?

**핵심 답**

- `==`는 양쪽 타입을 강제 변환한 뒤 비교한다. `'' == 0`, `'0' == 0`이 모두 true.
- `null == undefined`만 true이고 다른 값과는 false여서, `x == null`은 둘을 한 번에 검사하는 관용구로 통한다.
- 그 외에는 `===`로 고정하고 필요한 변환은 명시적으로 한다.

- ✅ **좋은 신호** — 변환 규칙의 예측 불가능성을 예시로 들고 `x == null` 예외를 이유와 함께 안다.
- ⚠️ **약한 신호** — "타입까지 비교한다"로 끝. 어떤 변환이 일어나는지 예를 못 든다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. NaN 은 어떻게 비교하나?
     - 기대 답: `NaN !== NaN`. `Number.isNaN` 또는 `Object.is` 를 쓴다.
  2. `Object.is` 와 `===` 가 갈리는 값은?
     - 기대 답: `NaN`(Object.is 가 true), `+0/-0`(Object.is 가 false). 나머지는 같다.
- 📖 **레퍼런스** — [MDN Equality comparisons](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness)

#### [주니어] `var`, `let`, `const`를 호이스팅과 TDZ로 설명해 보라.

**핵심 답**

- `var`는 함수 스코프이고 선언이 끌어올려져 `undefined`로 초기화된다.
- `let/const`는 블록 스코프이며 선언 전 구간이 TDZ라 접근하면 `ReferenceError`.
- `const`는 바인딩 재할당만 막는다. 객체 내부 값은 바뀐다.

- ✅ **좋은 신호** — TDZ에서 에러가 나는 이유를 말하고 `const` 객체 변경 가능성을 구분한다.
- ⚠️ **약한 신호** — `const`를 불변(immutable)과 같은 것으로 설명한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 함수 선언과 함수 표현식의 호이스팅 차이는?
     - 기대 답: 선언문은 전체가 끌어올려져 선언 전 호출이 되고, 표현식은 변수 규칙을 따라 TDZ 또는 undefined 다.
  2. 그럼 선언 전 호출이 되는 코드를 좋은 코드로 볼 수 있나?
     - 기대 답: 실행 순서를 숨기므로 의존하지 않는다. 읽는 순서와 실행 순서를 맞추는 편이 낫다는 판단이 나와야 한다.
- 📖 **레퍼런스** — [MDN let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)

#### [미들] `setTimeout(fn,0)`, `Promise.resolve().then(fn)`, `queueMicrotask(fn)`의 실행 순서와 이유는?

**핵심 답**

- 콜 스택이 비면 마이크로태스크 큐를 **전부** 비우고, 그다음 렌더 기회, 그다음 매크로태스크 하나를 처리한다.
- 따라서 then과 queueMicrotask가 등록 순서대로 먼저, setTimeout이 마지막.
- `await` 뒤 코드도 마이크로태스크다. 마이크로태스크가 자기를 계속 생성하면 렌더가 굶어 화면이 멈춘다.

- ✅ **좋은 신호** — 순서를 맞히고 큐 구조로 설명하며, 마이크로태스크 기아 같은 실제 증상까지 연결한다.
- ⚠️ **약한 신호** — "비동기는 나중에 실행된다" 수준. 두 큐의 우선순위를 모른다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. requestAnimationFrame 은 이 순서의 어디에 들어가나?
     - 기대 답: 마이크로태스크 처리 후 렌더 단계 직전. setTimeout 보다 프레임에 정확히 붙는다.
  2. 마이크로태스크가 계속 자기를 등록하면 화면은 어떻게 되나?
     - 기대 답: 렌더 기회가 오지 않아 화면이 멈춘다(입력도 막힌다). 작업을 매크로태스크로 쪼개거나 scheduler.yield 로 양보해야 한다.
  3. 그 증상을 프로파일러에서 어떻게 식별하나?
     - 기대 답: Long Task 로 잡히고 프레임이 비어 있다. 호출 스택 상단에 같은 함수가 반복 등장한다.
- 📖 **레퍼런스** — [MDN Execution model (event loop)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)

#### [미들] `this`는 어떻게 결정되나? 콜백으로 넘기면 왜 깨지나?

**핵심 답**

- 호출 형태가 결정한다: 일반 호출(undefined/전역), 메서드 호출(점 앞 객체), `new`(새 인스턴스), `call/apply/bind`(명시).
- 화살표 함수는 호출과 무관하게 정의 시점의 `this`를 가져온다.
- 메서드를 참조만 떼어 콜백으로 넘기면 점 앞 객체가 사라져 바인딩이 유실된다 → `bind` 또는 클래스 필드 화살표.

- ✅ **좋은 신호** — 네 규칙을 우선순위로 정리하고, 화살표를 쓰면 안 되는 경우(프로토타입 메서드, `currentTarget` 접근)도 안다.
- ⚠️ **약한 신호** — "화살표 쓰면 해결"로 끝내고 왜 그런지 설명하지 못한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 클래스 필드 화살표와 생성자 bind 의 차이는?
     - 기대 답: 둘 다 인스턴스마다 함수를 새로 만든다. 프로토타입 공유가 안 되므로 인스턴스가 매우 많으면 메모리에 영향이 있다.
  2. 그래서 React 함수 컴포넌트에서는 이 문제가 왜 사라졌나?
     - 기대 답: 클래스 인스턴스가 없고 매 렌더 새 함수가 생긴다. 대신 참조 동일성 문제가 useCallback 판단으로 옮겨간다.
- 📖 **레퍼런스** — [MDN this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

#### [미들] 얕은 복사와 깊은 복사, 실무에서는 무엇을 쓰나?

**핵심 답**

- spread와 `Object.assign`은 1단만 복사한다. 중첩 객체는 참조 공유.
- 깊은 복사는 `structuredClone`이 표준(함수·DOM 노드·클래스 인스턴스는 불가). `JSON.parse(JSON.stringify())`는 `Date`·`undefined`·`NaN`·순환 참조에서 손실이 난다.
- 상태 관리에서는 전체 복사보다 바뀐 경로만 새 객체로 만드는 불변 갱신이 기본. 참조 비교로 리렌더를 가를 수 있다.

- ✅ **좋은 신호** — 복사 방식별 손실을 구체적으로 알고, 불변 갱신이 렌더 최적화와 이어진다는 점까지 말한다.
- ⚠️ **약한 신호** — 항상 JSON 왕복으로 깊은 복사한다고 답하고 손실 사례를 모른다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 거대한 상태를 매번 복사하면 생기는 비용은 어떻게 줄이나?
     - 기대 답: 바뀐 경로만 새로 만드는 구조적 공유, 또는 Immer 같은 라이브러리·불변 자료구조. 복사 범위를 좁히는 것이 답.
  2. 구조적 공유를 쓰면 참조 비교가 여전히 유효한가?
     - 기대 답: 바뀐 경로의 참조만 변하므로 유효하다. 오히려 정확해진다.
- 📖 **레퍼런스** — [MDN structuredClone](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone) · [MDN Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

#### [미들] `Promise.all / allSettled / race / any`를 각각 언제 쓰나?

**핵심 답**

- `all`: 전부 성공해야 의미 있을 때. 하나가 reject되면 즉시 실패하지만 나머지 요청이 취소되지는 않는다.
- `allSettled`: 부분 실패를 허용하는 화면(대시보드 위젯 여러 개).
- `race`: 타임아웃 경쟁. `any`: 첫 성공만 필요할 때(미러 서버).
- 취소는 Promise가 아니라 `AbortController`의 책임이다.

- ✅ **좋은 신호** — 부분 실패 UX를 기준으로 골라내고, reject 후 남은 요청 처리와 취소 수단을 구분한다.
- ⚠️ **약한 신호** — 이름별 동작만 암기해 말하고 어떤 화면에 쓸지 예를 못 든다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 요청 3개 중 2개가 실패한 화면을 어떻게 보여줄 건가?
     - 기대 답: allSettled 로 부분 성공을 표시하고 실패 위젯만 재시도 가능하게. 전체 화면 에러로 덮지 않는다.
  2. 그 재시도가 서버에 위험할 수 있나?
     - 기대 답: 멱등하지 않은 요청이면 중복 생성이 생긴다. 재시도는 조회·멱등 요청으로 제한하거나 요청 키를 쓴다.
- 📖 **레퍼런스** — [MDN Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) · [MDN Promise.allSettled](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) · [MDN AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)

#### [미들] async 함수의 에러가 조용히 사라지는 경우를 아는가?

**핵심 답**

- `await` 없이 호출하면 거부가 처리되지 않고 unhandled rejection으로 흐른다.
- `forEach`에 async 콜백을 넣으면 반환된 Promise가 버려진다 → `for...of` 또는 `Promise.all(map())`.
- `setTimeout` 콜백 내부 throw는 바깥 try/catch가 못 잡는다.
- 전역 `unhandledrejection`·`error` 핸들러로 수집해 에러 트래킹에 보낸다.

- ✅ **좋은 신호** — 직접 겪은 누락 사례를 들고 전역 핸들러·로깅까지 연결한다.
- ⚠️ **약한 신호** — try/catch만 있으면 된다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 이벤트 핸들러 안에서 실패한 요청을 사용자에게 어떻게 알리나?
     - 기대 답: 해당 컨트롤 근처에 상태를 표시하고 재시도 경로를 준다. 토스트만 띄우고 상태를 되돌리지 않으면 UI 가 거짓말한다.
  2. 에러를 트래킹에 보낼 때 무엇을 함께 담나?
     - 기대 답: 요청 URL·상태 코드·요청 id, 사용자 흐름(breadcrumb), 릴리스 버전. 개인정보는 제외.
- 📖 **레퍼런스** — [MDN unhandledrejection](https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event) · [MDN Array.forEach 주의](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)

#### [시니어] `WeakMap`이나 `WeakRef`를 실제로 써야 했던 상황이 있나?

**핵심 답**

- 객체를 키로 부가 정보를 붙이되 그 객체의 수명을 늘리고 싶지 않을 때(DOM 노드별 메타데이터, 인스턴스별 캐시).
- 강한 참조 Map에 DOM을 담으면 노드가 제거돼도 회수되지 않는다(detached DOM 누수).
- `WeakRef`/`FinalizationRegistry`는 회수 시점을 보장하지 않으므로 정리 로직의 유일한 수단으로 쓰면 안 된다.

- ✅ **좋은 신호** — 누수 관측 경험과 함께 말하고 파이널라이저의 비결정성을 스스로 경고한다.
- ⚠️ **약한 신호** — "가비지 컬렉션되는 Map"이라는 정의만 말한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. detached DOM 누수를 DevTools 에서 어떻게 확인했나?
     - 기대 답: 힙 스냅샷에서 Detached 노드 검색, retainer 체인으로 붙잡은 코드 지점을 찾는다.
  2. WeakMap 으로 바꾸면 그 노드가 즉시 회수되나?
     - 기대 답: 즉시는 아니다. GC 시점에 달렸고 다른 강한 참조가 없어야 한다.
  3. FinalizationRegistry 로 정리 로직을 맡겨도 되나?
     - 기대 답: 안 된다. 호출 보장·시점 보장이 없어 명시적 해제 경로가 따로 있어야 한다.
- 📖 **레퍼런스** — [MDN WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) · [Chrome DevTools 메모리 문제](https://developer.chrome.com/docs/devtools/memory-problems)

#### [주니어] 원시 타입과 참조 타입은 할당·전달에서 어떻게 다르나?

**핵심 답**

- 원시 타입(number·string·boolean·null·undefined·symbol·bigint)은 값이 복사된다. 참조 타입(객체·배열·함수)은 주소가 복사된다.
- 그래서 함수 인자로 넘긴 객체를 안에서 수정하면 밖에서도 바뀐다.
- 동등 비교도 다르다. 객체는 내용이 같아도 참조가 다르면 `===`가 false.

- ✅ **좋은 신호** — 함수 인자 수정 사례로 설명하고 참조 비교 결과까지 말한다.
- ⚠️ **약한 신호** — 타입 목록만 외워 나열한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 의도치 않은 공유 수정을 막으려면 어떻게 하나?
     - 기대 답: 경계에서 복사하거나 불변 갱신 규칙을 지킨다. 함수가 인자를 변경하지 않는다는 계약을 명시.
  2. 복사 비용이 큰 경우는?
     - 기대 답: 깊은 구조는 구조적 공유로. 전량 복사가 기본값이 되면 성능 문제로 돌아온다.
- 📖 **레퍼런스** — [MDN 데이터 타입과 구조](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures)

#### [주니어] `null`과 `undefined`를 어떻게 구분해 쓰나?

**핵심 답**

- `undefined`는 '아직 값이 없음'(선언만 된 변수, 없는 속성, 반환값 없는 함수).
- `null`은 '비어 있음을 명시적으로 넣은 값'.
- `typeof null`은 `"object"`다(초기 구현의 버그가 표준으로 굳은 것). 기본값 판정은 `??`로.

- ✅ **좋은 신호** — API 응답에서 두 값을 구분해 다뤄 본 경험을 말한다.
- ⚠️ **약한 신호** — 둘이 같은 것이라고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 서버가 값을 안 보낼 때 어느 쪽으로 표현하는 게 좋을까?
     - 기대 답: API 계약에서 하나로 고정한다. 대개 필드 생략(undefined)과 명시적 null 을 다른 의미로 쓰면 혼란이 커진다.
  2. `??` 와 `||` 를 어느 쪽에 써야 하나?
     - 기대 답: 0·빈 문자열이 유효값이면 반드시 `??`. `||` 는 그 값을 덮어쓴다.
- 📖 **레퍼런스** — [MDN null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null)

#### [주니어] 옵셔널 체이닝(`?.`)과 널 병합(`??`)은 무엇을 막아 주나?

**핵심 답**

- `?.`는 중간 값이 `null/undefined`일 때 접근을 멈추고 `undefined`를 반환한다 — `Cannot read properties of undefined` 방지.
- `??`는 `null/undefined`일 때만 기본값을 쓴다. `||`는 `0`·`''`·`false`도 기본값으로 덮어써 버그를 만든다.
- 남용은 위험하다. 값이 없으면 안 되는 자리에서 조용히 넘기면 원인 파악이 늦어진다.

- ✅ **좋은 신호** — `||`와 `??`의 차이를 `0` 사례로 설명하고 남용 위험도 말한다.
- ⚠️ **약한 신호** — 에러가 안 나게 하는 문법이라고만 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 필수 값이 비었는데 `?.` 로 가려지고 있다면 어떻게 찾나?
     - 기대 답: 경계에서 스키마 검증으로 실패를 드러내고 로그를 남긴다. 옵셔널 체이닝은 표시 로직에만.
  2. 그럼 어디에는 `?.` 를 쓰는 게 맞나?
     - 기대 답: 실제로 없을 수 있는 값(선택 필드·아직 로드 안 된 참조)에만.
- 📖 **레퍼런스** — [MDN 옵셔널 체이닝](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) · [MDN 널 병합](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)

#### [주니어] `map/filter/reduce`와 `for` 루프는 어떤 기준으로 고르나?

**핵심 답**

- 변환은 `map`, 선별은 `filter`, 하나로 접는 것은 `reduce` — 의도가 이름으로 드러난다.
- 중간 탈출(`break`)이나 복잡한 상태 누적은 `for...of`가 읽기 쉽다. `reduce` 안에 로직을 몰아넣으면 가독성이 무너진다.
- 체인은 배열을 여러 번 순회한다. 수만 건 이상이면 한 번의 루프로 합치는 것이 실측상 유리할 수 있다.

- ✅ **좋은 신호** — 가독성 기준을 먼저 대고 성능은 규모를 조건으로 붙인다.
- ⚠️ **약한 신호** — 고차 함수가 항상 더 좋다 또는 항상 더 느리다고 단정한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. reduce 로 객체를 누적할 때 흔한 실수는?
     - 기대 답: 매 회 스프레드로 새 객체를 만들어 O(n²) 가 된다. 누적 객체를 직접 변경하거나 Map 을 쓴다.
  2. 체인이 길어져 읽기 어려우면?
     - 기대 답: 중간 이름을 붙여 단계를 드러내거나 한 번의 루프로 합친다. 가독성 기준으로 판단.
- 📖 **레퍼런스** — [MDN Array.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)

#### [주니어] `preventDefault`와 `stopPropagation`은 각각 무엇을 막나?

**핵심 답**

- `preventDefault`는 브라우저 기본 동작(폼 제출, 링크 이동, 체크박스 토글)을 막는다. 전파는 계속된다.
- `stopPropagation`은 상위로의 전파를 막는다. 기본 동작은 그대로 일어난다.
- 둘을 혼동하면 '폼이 계속 새로고침된다' 또는 '바깥 클릭 닫기가 안 먹는다'가 된다.

- ✅ **좋은 신호** — 두 축(기본 동작 / 전파)을 분명히 나누고 각각의 증상을 예로 든다.
- ⚠️ **약한 신호** — 둘을 같이 호출하는 습관만 있고 차이를 설명하지 못한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 스크롤 성능 때문에 passive 리스너를 쓰면 preventDefault 는 어떻게 되나?
     - 기대 답: 무시된다(경고). 기본 동작을 막아야 하면 passive 를 쓸 수 없다.
  2. 그럼 터치 제스처에서 스크롤만 막으려면?
     - 기대 답: CSS touch-action 으로 선언적으로 제한한다. JS 로 막는 것보다 성능이 좋다.
- 📖 **레퍼런스** — [MDN preventDefault](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) · [MDN stopPropagation](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation)

### 브라우저·렌더링 (6)

#### [미들] 브라우저가 HTML을 받아 화면을 그리기까지의 단계를 설명하라.

**핵심 답**

- 파싱으로 DOM, CSS로 CSSOM → 스타일 계산 → 레이아웃 → 페인트 → 컴포지트.
- `<script>`는 파서를 멈춘다. `defer`는 문서 파싱 후 순서대로, `async`는 받는 즉시 순서 없이 실행.
- CSS는 렌더 블로킹이라 위치·용량이 첫 페인트를 좌우한다. 웹폰트는 텍스트 표시 시점을 미룬다.

- ✅ **좋은 신호** — 단계를 순서대로 말하고 각 단계의 병목을 짚는다.
- ⚠️ **약한 신호** — 단계 이름만 외워 나열하고 스크립트·CSS의 블로킹을 모른다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 첫 화면을 빠르게 하려면 이 파이프라인의 어디를 건드리겠나?
     - 기대 답: 서버 응답(TTFB), 렌더 블로킹 CSS·JS 축소, LCP 자원 우선순위. 측정 후 지배 구간부터.
  2. defer 와 async 를 잘못 쓰면 어떤 버그가 나나?
     - 기대 답: async 는 순서 보장이 없어 의존 스크립트가 먼저 실행되면 깨진다. 의존 관계가 있으면 defer 나 모듈을 쓴다.
- 📖 **레퍼런스** — [MDN Critical rendering path](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path) · [MDN script defer/async](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script)

#### [미들] reflow와 repaint의 차이, 무엇이 더 비싸고 무엇이 유발하나?

**핵심 답**

- 레이아웃(reflow)은 크기·위치 재계산이라 가장 비싸다. 페인트는 픽셀 채우기, 컴포지트는 레이어 합성.
- `width/top/font-size`는 레이아웃, `color/background`는 페인트, `transform/opacity`는 컴포지트만 건드린다.
- 레이아웃 값을 읽고(`offsetHeight`) 바로 쓰는 것을 반복하면 프레임마다 강제 동기 레이아웃이 발생한다(layout thrashing) → 읽기와 쓰기를 분리한다.

- ✅ **좋은 신호** — 애니메이션을 transform/opacity로 옮긴 경험, thrashing을 프로파일러로 확인한 경험을 말한다.
- ⚠️ **약한 신호** — 두 용어의 사전적 정의만 말하고 어떤 속성이 무엇을 유발하는지 모른다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. will-change 를 남용하면 어떤 대가가 있나?
     - 기대 답: 레이어가 상시 유지되어 GPU 메모리를 먹고, 모바일에서 오히려 느려진다. 애니메이션 직전에만 켜는 것이 원칙.
  2. transform 애니메이션인데도 프레임이 떨어지면 무엇을 보나?
     - 기대 답: 페인트 영역 크기, 레이어 승격 여부, 같은 프레임의 JS 작업(레이아웃 강제 읽기)과 큰 DOM.
- 📖 **레퍼런스** — [web.dev 렌더링 성능](https://web.dev/articles/rendering-performance) · [web.dev layout thrashing](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing)

#### [주니어] 이벤트 버블링·캡처링과 이벤트 위임을 설명하라.

**핵심 답**

- 캡처(위→아래) → 타깃 → 버블(아래→위) 3단계. `addEventListener`의 세 번째 인자로 캡처 단계에 등록.
- 위임은 상위 노드 하나에서 `event.target`으로 판별하는 방식. 동적으로 늘어나는 목록에 유리하고 리스너 수를 줄인다.
- `stopPropagation`은 외부 클릭 닫기·분석 수집 같은 다른 기능을 조용히 깨뜨린다. 스크롤·터치 리스너는 `passive:true`.

- ✅ **좋은 신호** — 위임의 이점을 리스너 수·동적 노드로 설명하고 stopPropagation의 부작용을 안다.
- ⚠️ **약한 신호** — 버블링 방향만 말하고 위임을 코드로 설명하지 못한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. target 과 currentTarget 이 다른 경우는?
     - 기대 답: 위임 구조에서 target 은 실제 클릭된 자식, currentTarget 은 리스너가 붙은 상위 노드.
  2. 위임 핸들러가 SVG 아이콘 클릭을 못 잡으면 원인은?
     - 기대 답: target 이 내부 도형 노드라 선택자 매칭이 실패한다. closest 로 올려 판별해야 한다.
- 📖 **레퍼런스** — [MDN 이벤트 버블링과 캡처](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling)

#### [미들] 프론트엔드 메모리 누수의 흔한 원인 네 가지와 확인 방법은?

**핵심 답**

- 해제하지 않은 이벤트 리스너·타이머·구독(SPA 라우팅 전환 시 특히).
- 무한히 커지는 전역 캐시·배열.
- 큰 객체나 DOM 노드를 붙잡은 클로저 → detached DOM.
- 확인은 DevTools Memory의 힙 스냅샷 2회 비교(동작 전/후), Detached 노드 검색, 성능 탭의 JS heap 우상향 추세.

- ✅ **좋은 신호** — 측정 절차를 먼저 말하고 원인을 추정이 아닌 스냅샷으로 좁혀 본 경험이 있다.
- ⚠️ **약한 신호** — "클로저 때문"이라고만 하고 확인 방법이 없다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 장시간 켜 두는 앱에서 누수를 회귀 없이 감시할 방법은?
     - 기대 답: 주요 흐름 반복 후 힙 크기를 계측하는 자동 시나리오, 배포별 메모리 지표 추적. 사용자 세션 길이별 분포도 본다.
  2. 라우팅 전환마다 구독이 남는지 자동으로 잡을 수 있나?
     - 기대 답: 개발 모드에서 구독 수를 계측·단정하는 테스트, StrictMode 이중 마운트, 린트로 클린업 누락 검출.
- 📖 **레퍼런스** — [Chrome DevTools 메모리 문제 진단](https://developer.chrome.com/docs/devtools/memory-problems)

#### [미들] `requestAnimationFrame`과 `setTimeout`의 차이는?

**핵심 답**

- rAF는 다음 프레임 직전에 호출돼 화면 주기와 동기화된다. 배경 탭에서는 멈춘다.
- setTimeout은 최소 지연·타이머 드리프트가 있고 프레임과 어긋나 끊김을 만든다.
- 프레임 예산은 60fps에서 약 16ms. 긴 작업은 쪼개 프레임을 넘기지 않게 한다.

- ✅ **좋은 신호** — 프레임 예산 수치를 알고 애니메이션과 폴링을 구분해 도구를 고른다.
- ⚠️ **약한 신호** — 둘 다 비동기 타이머라고만 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 120Hz 화면에서는 무엇이 달라지나?
     - 기대 답: 프레임 예산이 약 8ms 로 줄어 같은 코드가 더 쉽게 프레임을 놓친다. rAF 기반이면 자동으로 주기에 맞춰진다.
  2. 시간 기반 애니메이션을 프레임 수로 계산하면 무엇이 깨지나?
     - 기대 답: 주사율에 따라 속도가 달라진다. 경과 시간(delta) 기준으로 계산해야 한다.
- 📖 **레퍼런스** — [MDN requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)

#### [시니어] 메인 스레드를 막는 무거운 연산을 어떻게 옮기나?

**핵심 답**

- Web Worker로 이전. 구조화 복제 비용이 있으므로 큰 버퍼는 transferable(`ArrayBuffer`)로 넘긴다.
- 계산 자체가 무거우면 WebAssembly, GPU 활용 가능한 작업은 WebGL/WebGPU.
- 옮길 수 없으면 청크로 쪼개고 `scheduler.yield`로 입력에 양보해 INP를 지킨다. 50ms 넘는 작업은 Long Task로 계측된다.

- ✅ **좋은 신호** — 복제 비용과 워커 경계 설계(메시지 프로토콜·취소)를 함께 말한다.
- ⚠️ **약한 신호** — "워커 쓰면 된다"로 끝나고 데이터 전달 비용을 고려하지 않는다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 워커 도입 후 오히려 느려졌다면 어디를 보겠나?
     - 기대 답: 메시지 직렬화(구조화 복제) 비용과 왕복 횟수. 큰 데이터는 transferable 로 넘기고 호출을 묶는다.
  2. 워커에서 실패했을 때 UI 는 어떻게 되나?
     - 기대 답: 에러 채널을 정의하고 타임아웃·취소를 두어야 한다. 무응답이면 화면이 영구 로딩으로 남는다.
  3. 그 무거운 연산을 서버로 옮기는 선택은 언제 더 나은가?
     - 기대 답: 입력·출력이 작고 기기 성능 분산이 큰 경우. 반대로 네트워크 왕복이 지배하면 클라이언트가 낫다.
- 📖 **레퍼런스** — [MDN Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) · [web.dev 긴 작업 쪼개기](https://web.dev/articles/optimize-long-tasks) · [MDN scheduler.yield](https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/yield)

### CSS·레이아웃 (9)

#### [주니어] 박스 모델과 `box-sizing`을 설명하라.

**핵심 답**

- 기본 `content-box`는 width가 콘텐츠만 의미해 padding·border가 더해진다.
- `border-box`로 리셋하면 지정한 width가 최종 너비가 되어 레이아웃 계산이 예측 가능해진다.
- 수직 마진은 인접 요소 간 병합된다(margin collapse). flex·grid 컨테이너 안에서는 병합되지 않는다.

- ✅ **좋은 신호** — border-box 리셋 이유를 계산 예측성으로 설명하고 마진 병합까지 안다.
- ⚠️ **약한 신호** — 용어만 말하고 왜 리셋하는지 모른다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 마진 병합을 막는 방법 두 가지는?
     - 기대 답: 부모에 padding·border 를 주거나 BFC 를 만들거나, flex·grid 컨테이너로 바꾼다.
  2. 병합을 막는 대신 gap 으로 간격을 주면 무엇이 좋아지나?
     - 기대 답: 간격이 요소가 아니라 레이아웃 소유가 되어 중복·상쇄가 사라진다.
- 📖 **레퍼런스** — [MDN box-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing) · [MDN 마진 병합](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_model/Mastering_margin_collapsing)

#### [미들] `z-index`를 올렸는데 요소가 위로 안 올라온다. 무엇을 보나?

**핵심 답**

- 쌓임 맥락(stacking context)을 먼저 본다. `position`+z-index, `transform`, `opacity<1`, `filter`, `will-change`, `contain` 등이 새 맥락을 만든다.
- 자식은 부모 맥락을 벗어날 수 없다. 부모가 낮으면 자식 z-index 9999도 무의미.
- 해결은 DOM 위치를 바꾸거나 포털로 최상위에 렌더, 그리고 레이어 값을 토큰으로 관리.

- ✅ **좋은 신호** — 맥락 생성 조건을 알고 포털 같은 구조적 해법을 제시한다.
- ⚠️ **약한 신호** — 값을 더 올려 본다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 드롭다운이 overflow:hidden 부모에 잘린다면?
     - 기대 답: 포털로 상위에 렌더하거나 앵커 기반 팝오버 API 를 쓴다. z-index 만으로는 해결되지 않는다.
  2. 포털로 옮기면 새로 생기는 문제는?
     - 기대 답: 포커스 순서·스크롤 동기·바깥 클릭 판정, 그리고 접근성 연결(aria-controls·labelledby).
- 📖 **레퍼런스** — [MDN 쌓임 맥락](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Stacking_context)

#### [미들] flex와 grid를 어떤 기준으로 고르나?

**핵심 답**

- flex는 한 축의 콘텐츠 흐름·정렬, grid는 두 축의 명시적 트랙 배치.
- flex 아이템이 안 줄어드는 대표 원인은 `min-width:auto`. `min-width:0`이나 `overflow:hidden`이 필요하다.
- grid는 겹침 레이어, `grid-template-areas` 재배치, `minmax`+`auto-fit`으로 열 수 자동 조절에 강하다.

- ✅ **좋은 신호** — 1축/2축 기준을 대고 실제로 겪은 축소·넘침 문제를 원인까지 설명한다.
- ⚠️ **약한 신호** — "grid가 더 좋다" 같은 선호만 말한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 400px 화면에서 카드 3열을 어떻게 접겠나?
     - 기대 답: grid 의 auto-fit + minmax 로 열 수를 콘텐츠 폭이 결정하게 한다. 미디어 쿼리 없이도 접힌다.
  2. 카드 안 긴 텍스트가 넘치면?
     - 기대 답: min-width:0 과 overflow-wrap 을 함께. flex 자식 기본 min-width:auto 가 원인이라는 답이 나와야 한다.
- 📖 **레퍼런스** — [MDN flexbox 기본](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox) · [MDN grid 기본](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout)

#### [미들] `position: sticky`가 동작하지 않는 흔한 원인은?

**핵심 답**

- 조상 중 하나에 `overflow: hidden/auto/scroll`이 있어 스크롤 컨테이너가 바뀐 경우.
- 임계 방향 값(`top` 등)을 지정하지 않은 경우.
- 부모 높이가 콘텐츠와 같아 고정될 여유 구간이 없는 경우.
- 표 헤더는 `thead th`에 걸고 `border-collapse` 영향을 확인한다.

- ✅ **좋은 신호** — 조상 overflow를 1순위로 의심하고 DevTools로 확인하는 절차를 말한다.
- ⚠️ **약한 신호** — 브라우저 버그로 돌린다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 모바일 상단 바가 겹칠 때 safe-area 는 어떻게 처리하나?
     - 기대 답: env(safe-area-inset-top) 을 고정 요소의 padding 에 더한다. 뷰포트 메타에 viewport-fit=cover 가 필요하다.
  2. sticky 헤더와 스크롤 앵커링이 충돌하면?
     - 기대 답: scroll-margin-top 으로 앵커 위치를 보정한다. 헤더 높이를 변수로 두고 공유한다.
- 📖 **레퍼런스** — [MDN position](https://developer.mozilla.org/en-US/docs/Web/CSS/position)

#### [주니어] 요소를 가로·세로 중앙에 두는 방법을 여러 개 말해 보라.

**핵심 답**

- 부모에 `display:flex; place-items:center` 또는 grid + `place-content:center`.
- `position:absolute; inset:0; margin:auto`, 또는 `top:50%; left:50%; translate:-50% -50%`(크기를 몰라도 된다).
- 텍스트 한 줄은 `line-height`로도 되지만 다중 행에서 깨진다.

- ✅ **좋은 신호** — 부모 높이를 모르는 경우, 스크롤이 생기는 경우 등 제약별로 고른다.
- ⚠️ **약한 신호** — 한 가지만 알고 왜 다른 상황에서 깨지는지 모른다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 뷰포트 높이를 100vh 로 잡으면 모바일에서 왜 잘리나?
     - 기대 답: 주소창 포함 높이로 계산돼 실제 보이는 영역보다 크다. dvh/svh 또는 100% 기반으로 바꾼다.
  2. 키보드가 올라올 때 입력창을 어떻게 보이게 하나?
     - 기대 답: visualViewport 이벤트로 보정하거나 스크롤 인투 뷰. 고정 하단 바는 키보드와 겹치기 쉽다.
- 📖 **레퍼런스** — [MDN grid 정렬](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout)

#### [시니어] 디자인 토큰과 CSS 커스텀 프로퍼티로 다크 모드를 설계한다면?

**핵심 답**

- 토큰 전량을 기본 `:root`에 선언하고 다크에서는 **토큰만** 재정의한다.
- 컴포넌트는 리터럴 색을 쓰지 않고 토큰만 참조한다. 미디어 쿼리 안에만 정의된 색은 조건이 어긋난 상태에서 미정의가 되어 대비 사고를 만든다.
- 사용자의 명시적 토글과 시스템 설정 두 축을 모두 다루려면 속성 선택자와 `prefers-color-scheme`을 겹쳐 우선순위를 정한다.
- 의미 색(성공·경고·위험)은 브랜드 액센트와 분리하고 대비는 WCAG 기준으로 검증한다.

- ✅ **좋은 신호** — 토큰 계층(원시→의미→컴포넌트)을 구분하고 대비 검증·QA 방법까지 말한다.
- ⚠️ **약한 신호** — 클래스 `.dark`를 붙여 색을 각 컴포넌트에서 덮는다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 이미 색이 하드코딩된 레거시를 어떻게 토큰으로 옮기겠나?
     - 기대 답: 색 사용 인벤토리를 뽑아 빈도순으로 의미 토큰에 매핑하고, 신규 코드부터 토큰 강제 후 기존을 코드모드로 치환.
  2. 옮기는 중에 두 체계가 공존하면 무엇을 보장해야 하나?
     - 기대 답: 대비 회귀가 없어야 한다. 시각 회귀 테스트와 대비 검사를 게이트로 둔다.
  3. 다크 모드 전환 시 이미지·차트는 어떻게 처리하나?
     - 기대 답: 차트 색은 토큰 참조, 사진은 밝기 보정 대신 배경 대비 조정. SVG 는 currentColor 활용.
- 📖 **레퍼런스** — [MDN 커스텀 프로퍼티](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) · [MDN prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) · [WCAG 명도 대비](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)

#### [주니어] CSS 명시도(specificity)는 어떻게 계산되고 `!important`는 언제 쓰나?

**핵심 답**

- 인라인 > id > 클래스·속성·의사클래스 > 타입·의사요소 순 가중치. 같은 명시도면 나중 선언이 이긴다.
- 명시도 전쟁은 구조 문제의 증상이다. 중첩 선택자를 줄이고 클래스 한 겹으로 맞춘다.
- `!important`는 서드파티 스타일을 덮을 때처럼 제어권이 없는 경우로 제한한다. 남기면 다음 사람이 또 `!important`를 쓴다.

- ✅ **좋은 신호** — 가중치 순서를 말하고 명시도 문제를 구조로 푸는 방향을 제시한다.
- ⚠️ **약한 신호** — 안 먹히면 `!important`를 붙인다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. :where() 가 명시도에 미치는 영향은?
     - 기대 답: 명시도가 0 이 되어 덮어쓰기 쉬운 기본 스타일을 만들 수 있다. 리셋·라이브러리 기본값에 유용.
  2. 캐스케이드 레이어(@layer)는 어떤 문제를 푸나?
     - 기대 답: 출처 순서를 명시적으로 정해 명시도 경쟁 없이 우선순위를 관리한다.
- 📖 **레퍼런스** — [MDN 명시도](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Specificity)

#### [주니어] `display`의 block, inline, inline-block, none 차이는?

**핵심 답**

- block은 한 줄 전체를 차지하고 width·height·수직 마진이 적용된다.
- inline은 콘텐츠 폭만 차지하고 width·height와 수직 마진이 무시된다.
- inline-block은 줄 안에 놓이지만 크기 지정이 된다.
- `none`은 레이아웃에서 제거된다(접근성 트리에서도 사라짐). 숨기되 낭독은 남기려면 시각적 숨김 기법을 쓴다.

- ✅ **좋은 신호** — inline에서 height가 안 먹는 이유를 설명하고 `none`과 `visibility`를 구분한다.
- ⚠️ **약한 신호** — 셋을 비슷한 것으로 설명한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 스크린리더에만 읽히는 텍스트는 어떻게 만드나?
     - 기대 답: 시각적 숨김 유틸(1px 클리핑)로 화면에서만 감춘다. display:none 이나 visibility:hidden 은 낭독도 막는다.
  2. 반대로 장식용 요소를 보조기기에서만 감추려면?
     - 기대 답: aria-hidden="true". 단 포커스 가능한 요소에는 쓰면 안 된다.
- 📖 **레퍼런스** — [MDN display](https://developer.mozilla.org/en-US/docs/Web/CSS/display)

#### [주니어] `px`, `rem`, `em`, `%`, `vw`를 각각 언제 쓰나?

**핵심 답**

- `rem`은 루트 폰트 크기 기준이라 사용자의 글자 크기 설정을 따른다 — 타이포·간격 기본 단위로 적합.
- `em`은 해당 요소 폰트 기준이라 컴포넌트 내부 비례(아이콘·패딩)에 쓴다. 중첩되면 누적된다.
- `%`는 부모 기준, `vw/vh`는 뷰포트 기준이라 반응형에 쓰지만 모바일 주소창 변화·확대 시 문제가 생긴다.
- `px`는 테두리처럼 확대와 무관해야 하는 곳에.

- ✅ **좋은 신호** — 접근성(사용자 글자 크기)을 이유로 rem을 고르는 근거를 댄다.
- ⚠️ **약한 신호** — 모든 값을 px로 고정한다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 글자 크기만 키운 사용자의 화면에서 레이아웃이 깨지지 않게 하려면?
     - 기대 답: 고정 높이·px 폰트를 피하고 rem 기반 간격, 내용에 따라 늘어나는 컨테이너. 200% 확대 테스트로 검증.
  2. 최소 폰트 크기를 px 로 고정하면 무엇이 문제인가?
     - 기대 답: 사용자 설정을 무시해 접근성 요건을 위반할 수 있다.
- 📖 **레퍼런스** — [MDN CSS 값과 단위](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Values_and_units)

### 네트워크·HTTP (10)

#### [미들] 정적 자산과 HTML의 캐시 헤더를 어떻게 설정하나?

**핵심 답**

- 콘텐츠 해시가 붙은 JS/CSS/이미지: `Cache-Control: public, max-age=31536000, immutable`.
- HTML 엔트리: `no-cache`로 매번 검증. 그래야 새 배포가 즉시 반영된다.
- `ETag`/`Last-Modified`로 조건부 요청 → 304. `stale-while-revalidate`로 체감 지연 제거.
- 브라우저 캐시와 CDN 캐시를 구분하고(`s-maxage`) 배포 시 무효화 대상을 정한다.

- ✅ **좋은 신호** — 해시 파일명과 HTML 정책을 짝으로 설명하고 배포 후 구버전이 남는 사고를 예로 든다.
- ⚠️ **약한 신호** — 모든 응답에 긴 max-age를 준다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 배포 직후 사용자가 구버전 청크를 요청해 실패하면 어떻게 처리하나?
     - 기대 답: 청크 로드 실패를 감지해 새로고침을 안내하거나 자동 재시도. 옛 청크를 일정 기간 서버에 남긴다.
  2. 자동 새로고침이 위험한 경우는?
     - 기대 답: 작성 중 데이터가 있으면 날아간다. 저장 후 안내 또는 다음 안전 지점에서 적용한다.
- 📖 **레퍼런스** — [MDN HTTP 캐싱](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching) · [MDN Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control) · [MDN ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/ETag)

#### [미들] CORS preflight는 언제 발생하고 어떻게 줄이나?

**핵심 답**

- 단순 요청(GET/HEAD/POST + 허용된 헤더 + 특정 `Content-Type`)을 벗어나면 `OPTIONS`가 먼저 간다. 커스텀 헤더 하나, `application/json`도 트리거.
- 줄이려면 `Access-Control-Max-Age`로 캐시, 불필요한 커스텀 헤더 제거, 같은 오리진 프록시.
- `credentials: include`면 `Access-Control-Allow-Origin: *`가 불가하고 정확한 오리진과 `Allow-Credentials`가 필요하다.
- CORS는 브라우저 규칙이다. 서버가 막는 게 아니라서 curl은 통과한다.

- ✅ **좋은 신호** — 브라우저만의 규칙이라는 점을 분명히 하고, 실패 응답과 CORS 오류를 구분해 디버깅한 경험이 있다.
- ⚠️ **약한 신호** — 프록시로 우회했다는 말만 하고 발생 조건을 설명하지 못한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 같은 요청이 curl 은 되는데 브라우저만 실패하면 무엇부터 보나?
     - 기대 답: 응답 헤더의 Allow-Origin·Allow-Credentials 와 preflight 응답, 그리고 실제 상태 코드. CORS 는 브라우저 규칙이다.
  2. preflight 는 통과했는데 본 요청이 막히면?
     - 기대 답: 본 응답에도 CORS 헤더가 있어야 한다. 프록시·CDN 이 헤더를 지우는 경우도 본다.
- 📖 **레퍼런스** — [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)

#### [미들] 액세스 토큰을 `localStorage`에 저장해도 되나?

**핵심 답**

- XSS가 한 번이라도 성립하면 즉시 탈취된다. 스크립트가 읽을 수 있기 때문.
- 기본 대안은 `HttpOnly; Secure; SameSite` 쿠키 + CSRF 대비. 또는 토큰을 메모리에만 두고 새로고침 시 리프레시로 복구.
- 액세스 토큰은 짧게, 리프레시는 회전(rotation)과 재사용 감지. 로그아웃 시 서버 측 무효화 경로가 있어야 한다.

- ✅ **좋은 신호** — 위협 모델(XSS vs CSRF)을 나눠 설명하고 팀이 고른 절충과 이유를 말한다.
- ⚠️ **약한 신호** — "localStorage가 편해서 쓴다" 또는 "쿠키는 무조건 안전"이라고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 여러 탭에서 토큰 갱신이 동시에 일어나면?
     - 기대 답: 한 탭만 갱신하도록 잠금(BroadcastChannel·Web Lock)하고 결과를 공유. 아니면 회전 토큰이 서로를 무효화한다.
  2. 갱신 중 들어온 요청들은 어떻게 처리하나?
     - 기대 답: 큐에 모아 갱신 완료 후 재시도. 실패 시 일괄 로그아웃 경로를 정의한다.
- 📖 **레퍼런스** — [OWASP 세션 관리 치트시트](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) · [MDN Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie)

#### [시니어] 실시간 기능에 polling, SSE, WebSocket 중 무엇을 고르나?

**핵심 답**

- 저빈도 갱신·단순 인프라: 폴링(또는 조건부 요청). 구현·운영 비용이 가장 낮다.
- 서버→클라 단방향 스트림: SSE. 일반 HTTP를 타서 프록시·자동 재연결이 쉽다. LLM 토큰 스트리밍이 대표 사례.
- 양방향 저지연: WebSocket. 대신 프록시·로드밸런서 설정, 스케일아웃(팬아웃), 하트비트·재연결·백오프를 직접 설계해야 한다.
- 공통 과제는 재연결 중 유실 보정(서버 시퀀스·재동기 요청)이다.

- ✅ **좋은 신호** — 기능 요구가 아니라 운영 비용과 유실 보정을 근거로 든다.
- ⚠️ **약한 신호** — WebSocket이 항상 최신이고 좋다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 연결이 30초 끊겼다가 붙으면 화면 상태를 어떻게 맞추나?
     - 기대 답: 서버 시퀀스·마지막 이벤트 id 로 재동기 요청, 큰 공백이면 전체 스냅샷 재조회.
  2. 재접속 폭주(thundering herd)는 어떻게 막나?
     - 기대 답: 지터를 넣은 지수 백오프와 최대 동시 재연결 제한.
  3. WebSocket 을 여러 인스턴스로 스케일아웃할 때 필요한 것은?
     - 기대 답: 메시지 브로커 기반 팬아웃, 세션 어피니티 또는 상태 외부화, 하트비트로 죽은 연결 정리.
- 📖 **레퍼런스** — [MDN Server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events) · [MDN WebSockets API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

#### [주니어] 쿠키의 `SameSite` 세 값은 어떤 차이가 있나?

**핵심 답**

- `Strict`: 크로스 사이트 요청에 전혀 안 붙는다(외부 링크로 진입하면 로그아웃처럼 보인다).
- `Lax`: 최상위 내비게이션 GET에만 붙는다. 다수 브라우저의 기본값.
- `None`: 항상 붙지만 `Secure` 필수. 서드파티 컨텍스트(임베드·결제 위젯)에서 필요.
- `Domain`/`Path`와 서브도메인 공유 범위도 함께 본다.

- ✅ **좋은 신호** — 세 값의 사용자 체감 차이를 예로 들고 Secure 요건을 안다.
- ⚠️ **약한 신호** — 이름만 나열한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. iframe 안에서 로그인 상태가 유지되지 않는 원인은?
     - 기대 답: 서드파티 컨텍스트라 SameSite=None; Secure 아닌 쿠키가 차단된다. 저장소 파티셔닝도 원인.
  2. 그럼 임베드 환경에서 어떤 대안이 있나?
     - 기대 답: 팝업·리다이렉트 방식 인증, Storage Access API, 또는 부모 도메인 하위 경로로 배치.
- 📖 **레퍼런스** — [web.dev SameSite 쿠키 설명](https://web.dev/articles/samesite-cookies-explained) · [MDN Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie)

#### [주니어] 주소창에 URL을 입력하면 화면이 뜨기까지 무슨 일이 일어나나?

**핵심 답**

- 도메인 → DNS 조회로 IP, TCP 연결(HTTPS면 TLS 핸드셰이크), HTTP 요청·응답.
- 받은 HTML을 파싱하며 하위 자원(CSS·JS·이미지)을 추가 요청하고, DOM·CSSOM을 만들어 레이아웃·페인트.
- 중간에 캐시(브라우저·CDN), 리다이렉트, 서비스워커가 끼어들 수 있다.

- ✅ **좋은 신호** — 네트워크 구간과 렌더 구간을 나눠 말하고 캐시 개입 지점을 안다.
- ⚠️ **약한 신호** — "요청하면 응답이 온다" 수준으로 끝낸다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 이 과정에서 첫 화면이 늦어지는 지점은 어디라고 보나?
     - 기대 답: 측정에 따라 다르다. TTFB·렌더 블로킹 자원·LCP 자원 로드·하이드레이션 중 지배 구간을 지목해야 한다.
  2. 같은 페이지를 두 번째로 열면 무엇이 달라지나?
     - 기대 답: 캐시로 네트워크 구간이 줄고 JS 파싱·실행이 남는다. HTML 은 매번 검증하도록 설정한다.
- 📖 **레퍼런스** — [MDN 인터넷은 어떻게 동작하나](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work) · [MDN DNS](https://developer.mozilla.org/en-US/docs/Glossary/DNS)

#### [주니어] GET과 POST의 차이를 말해 보라.

**핵심 답**

- GET은 조회용이고 안전(safe)·멱등하다. 파라미터가 URL에 남아 로그·히스토리·캐시에 기록된다.
- POST는 상태를 바꾸는 요청이고 멱등하지 않다. 본문으로 데이터를 보낸다.
- 따라서 상태 변경을 GET으로 두면 프리페치·크롤러·재방문이 의도치 않게 실행시킬 수 있다.
- 민감 값은 GET 쿼리스트링에 넣지 않는다.

- ✅ **좋은 신호** — 안전·멱등 개념으로 설명하고 GET으로 상태를 바꾸면 안 되는 이유를 든다.
- ⚠️ **약한 신호** — "POST가 더 안전하다"고만 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. PUT 과 PATCH 는 어떤 기준으로 나누나?
     - 기대 답: PUT 은 전체 교체(멱등), PATCH 는 부분 변경. 부분 변경에 PUT 을 쓰면 빠진 필드가 지워진다.
  2. 멱등이 왜 프론트에 중요한가?
     - 기대 답: 재시도 안전성이 달라진다. 비멱등 요청은 중복 생성 위험이 있어 요청 키가 필요하다.
- 📖 **레퍼런스** — [MDN GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/GET) · [MDN POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/POST)

#### [주니어] 자주 마주치는 HTTP 상태 코드를 설명하라.

**핵심 답**

- 2xx 성공(200, 201, 204), 3xx 리다이렉트(301 영구·302/307 임시, 304 캐시 유효).
- 4xx 클라이언트(400 요청 형식, 401 인증 없음, 403 권한 없음, 404 없음, 409 충돌, 429 과다 요청).
- 5xx 서버(500, 502, 503, 504).
- 프론트에서 중요한 갈림길은 401(재인증)과 403(권한)·429(백오프 재시도) 처리 분기.

- ✅ **좋은 신호** — 401/403 구분과 429 백오프 같은 클라이언트 대응까지 말한다.
- ⚠️ **약한 신호** — 숫자 의미만 외워 말하고 화면 처리와 연결하지 못한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 401 이 반복될 때 무한 리프레시 루프를 어떻게 막나?
     - 기대 답: 갱신 1회 실패 시 로그아웃, 갱신 요청 자체는 인터셉터 재시도 대상에서 제외, 동시 요청은 큐로 묶는다.
  2. 403 은 어떻게 다르게 처리하나?
     - 기대 답: 재인증으로 해결되지 않는다. 권한 안내 화면으로 보내고 재시도하지 않는다.
- 📖 **레퍼런스** — [MDN HTTP 상태 코드](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)

#### [주니어] 쿠키, `localStorage`, `sessionStorage`의 차이는?

**핵심 답**

- 쿠키는 요청마다 자동 전송되고 서버가 읽는다. 용량이 작고 `HttpOnly`로 스크립트 접근을 막을 수 있다.
- `localStorage`는 만료 없이 남고, `sessionStorage`는 탭을 닫으면 사라진다. 둘 다 스크립트가 읽으므로 XSS에 노출된다.
- 동기 API라 큰 데이터를 쓰면 메인 스레드를 막는다. 구조화된 대용량은 IndexedDB.

- ✅ **좋은 신호** — 전송 여부·수명·보안 노출 세 축으로 나누고 저장 대상별로 고른다.
- ⚠️ **약한 신호** — "편한 대로 localStorage"라고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 자동 로그인 유지를 어디에 저장할 건가?
     - 기대 답: 가능하면 HttpOnly 쿠키(리프레시)로 두고 액세스 토큰은 메모리. localStorage 는 XSS 노출을 감수하는 선택이다.
  2. 로그아웃 시 무엇을 같이 지워야 하나?
     - 기대 답: 캐시된 서버 데이터와 로컬 저장 상태, 열린 구독. 다음 사용자가 이전 데이터를 보는 사고를 막는다.
- 📖 **레퍼런스** — [MDN Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) · [MDN Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie)

#### [시니어] 서비스워커와 오프라인 지원을 도입할 때 함정은?

**핵심 답**

- 서비스워커는 배포 후에도 옛 버전이 계속 서빙될 수 있다. 버전·활성화 전략(skipWaiting, 클라이언트 갱신 안내)을 먼저 정한다.
- 캐시 전략을 자원별로 나눈다: 앱 셸은 캐시 우선, API 응답은 네트워크 우선 또는 stale-while-revalidate, 인증 응답은 캐시 금지.
- 범위(scope)와 오래된 캐시 정리를 설계하지 않으면 저장소가 계속 커지고 디버깅이 어려워진다.
- 오프라인 쓰기는 큐잉 + 복귀 시 동기화 + 충돌 규칙이 필요하다.

- ✅ **좋은 신호** — 업데이트 게이트와 자원별 캐시 정책을 나눠 말하고 사고 경험을 든다.
- ⚠️ **약한 신호** — PWA 플러그인을 켰다는 설명에서 멈춘다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 사용자가 옛 버전에 갇혔다면 어떻게 강제로 올리나?
     - 기대 답: 새 워커 활성화 신호를 받아 사용자에게 갱신을 안내하거나 안전 지점에서 자동 적용. 강제 skipWaiting 은 열린 탭을 깨뜨릴 수 있다.
  2. 오프라인 캐시가 인증 응답을 담아 버리면?
     - 기대 답: 다른 사용자에게 노출될 수 있다. 인증 응답은 캐시 금지, 로그아웃 시 캐시 삭제.
- 📖 **레퍼런스** — [MDN Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) · [web.dev 서비스워커 캐시 전략](https://web.dev/articles/service-workers-cache-storage)

### 보안 (6)

#### [미들] XSS의 종류와 실질적인 방어를 설명하라.

**핵심 답**

- 저장형(서버에 남아 모든 사용자에게), 반사형(요청 파라미터가 그대로 출력), DOM 기반(클라이언트가 위험한 싱크에 직접 넣음).
- 방어의 본질은 출력 컨텍스트별 인코딩이다. HTML 본문·속성·URL·인라인 JS가 각각 다른 처리를 요구한다.
- 프레임워크 기본 이스케이프를 유지하고 `innerHTML`·`dangerouslySetInnerHTML`은 금지하거나 sanitizer를 거친다.
- 사용자 입력 URL은 스킴 검증(`javascript:` 차단). CSP는 2차 방어선.

- ✅ **좋은 신호** — 위험 싱크 목록을 알고, 입력 필터링이 아니라 출력 인코딩이 본질이라고 말한다.
- ⚠️ **약한 신호** — "입력값을 필터링한다"로 끝낸다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 마크다운 렌더링 기능을 안전하게 만들려면?
     - 기대 답: 허용 목록 기반 sanitizer 를 서버·클라 양쪽에 적용하고 raw HTML 허용을 끈다. 링크 스킴 검증까지.
  2. sanitizer 를 통과하는 공격이 있나?
     - 기대 답: 설정 오류(허용 태그·속성 과다), mXSS, SVG·MathML 경로. 라이브러리 업데이트와 CSP 2차 방어가 필요하다.
  3. CSP 가 있으면 sanitizer 를 빼도 되나?
     - 기대 답: 안 된다. CSP 는 실행 차단이고 DOM 오염 자체는 막지 못한다.
- 📖 **레퍼런스** — [OWASP XSS 방어 치트시트](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) · [OWASP DOM XSS 치트시트](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html)

#### [시니어] CSP를 실제로 도입하는 순서와 함정은?

**핵심 답**

- `Content-Security-Policy-Report-Only`로 시작해 위반 리포트를 수집한다.
- 인라인 스크립트·스타일을 nonce/hash로 대체하고 서드파티 출처를 목록화한다. `unsafe-inline`이 남으면 효과가 크게 준다.
- 외부 자원(폰트·이미지·XHR 대상)까지 지시어별로 빠짐없이 열거해야 한다. 누락은 무성 실패로 나타난다.
- 리포트 엔드포인트와 대시보드를 먼저 준비하고 단계적으로 강제 전환한다.

- ✅ **좋은 신호** — report-only 단계와 무성 실패의 관측 문제를 짚고 서드파티 협상 비용을 언급한다.
- ⚠️ **약한 신호** — 헤더 한 줄 추가하면 된다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. CSP 도입 후 특정 위젯이 조용히 멈췄다면 어떻게 찾나?
     - 기대 답: violation 리포트와 콘솔 위반 로그를 대조한다. report-only 로 되돌려 차단 대상을 식별.
  2. nonce 방식을 쓰면 정적 호스팅에서 문제가 되나?
     - 기대 답: 요청마다 nonce 를 새로 발급해야 하므로 정적 캐시와 충돌한다. hash 방식이나 엣지에서 주입을 고려.
- 📖 **레퍼런스** — [MDN CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) · [web.dev strict CSP](https://web.dev/articles/csp)

#### [미들] `SameSite=Lax`가 기본인 시대에 CSRF 방어가 여전히 필요한가?

**핵심 답**

- 필요하다. 최상위 POST 내비게이션, 서브도메인 공격, 구형 클라이언트, 쿠키 이외 인증 경로가 남는다.
- 이중 제출 쿠키나 서버 저장 CSRF 토큰, 그리고 `Origin`/`Sec-Fetch-Site` 검증을 조합한다.
- 상태를 바꾸는 요청을 GET으로 두지 않는 것이 기본 전제.

- ✅ **좋은 신호** — SameSite를 완전한 방어로 보지 않고 남는 경로를 구체적으로 든다.
- ⚠️ **약한 신호** — "요즘은 브라우저가 막아 준다"로 끝낸다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 공용 API 에 CORS 와 CSRF 방어를 함께 두면 무엇이 충돌하나?
     - 기대 답: credentials 기반이면 와일드카드 오리진을 못 쓰고, 토큰 헤더를 추가하면 preflight 가 늘어난다. 정책을 오리진별로 명시해야 한다.
  2. 쿠키 대신 Authorization 헤더면 CSRF 를 신경 안 써도 되나?
     - 기대 답: 자동 전송이 없어 위험은 크게 준다. 대신 XSS 노출과 토큰 저장 문제가 커진다.
- 📖 **레퍼런스** — [OWASP CSRF 방어 치트시트](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

#### [시니어] 서드파티 스크립트와 의존성을 어떤 기준으로 통제하나?

**핵심 답**

- 서드파티 태그는 같은 오리진 권한으로 실행된다. 토큰·DOM·입력값 전부 접근 가능.
- 통제 수단: CSP 출처 화이트리스트, SRI, 샌드박스 iframe 격리, 태그 매니저 승인 절차.
- 의존성은 lockfile 고정, 자동 업데이트 PR + CI 검증, 빌드 스크립트 실행 최소화, 번들 증가 감시.
- HTML5 보안 치트시트의 `target=_blank`·`postMessage`·스토리지 항목도 점검 목록.

- ✅ **좋은 신호** — 공급망 위험을 브라우저 권한 모델로 설명하고 승인 절차 같은 조직적 장치를 든다.
- ⚠️ **약한 신호** — "신뢰할 수 있는 라이브러리만 쓴다"로 끝낸다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 광고·분석 스크립트가 INP 를 악화시킨다면 어떻게 협상하나?
     - 기대 답: 영향 수치를 측정해 보여 주고 로드 시점 지연·샘플링·대체 수집으로 제안. 제거 여부는 사업 판단.
  2. 서드파티 태그가 전체 화면을 깨뜨릴 위험은 어떻게 격리하나?
     - 기대 답: iframe·워커 격리, 지연 로드, 실패 시 무시하는 경계. CSP·SRI 로 변조 차단.
- 📖 **레퍼런스** — [OWASP HTML5 보안 치트시트](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html) · [MDN CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)

#### [시니어] 브라우저 앱의 인증 흐름을 어떻게 설계하나?

**핵심 답**

- 브라우저는 비밀을 지킬 수 없다. Authorization Code + PKCE를 쓰고 implicit 흐름은 쓰지 않는다.
- 액세스 토큰은 짧게, 리프레시는 회전과 재사용 감지. 저장은 XSS 노출을 기준으로 판단(가능하면 `HttpOnly` 쿠키 + CSRF 방어).
- 다중 탭 갱신 경합, 만료 중 요청 큐잉, 로그아웃 시 서버 측 무효화를 설계한다.
- 임베드·서드파티 컨텍스트에서는 쿠키 정책(`SameSite`·파티셔닝)이 흐름을 바꾼다.

- ✅ **좋은 신호** — PKCE 채택 이유와 토큰 수명·회전 정책을 말하고 다중 탭 경합까지 다룬다.
- ⚠️ **약한 신호** — 프레임워크 라이브러리를 붙였다는 설명에서 멈춘다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 리프레시 토큰이 탈취됐다고 판단되면 무엇을 하나?
     - 기대 답: 해당 세션 계열 전체 무효화(회전 재사용 감지), 사용자 알림, 영향 범위 조사. 토큰만 재발급하면 공격자도 함께 갱신된다.
  2. 탈취를 탐지할 신호는 무엇을 보나?
     - 기대 답: 같은 리프레시 토큰의 재사용, 기기·지역 급변, 비정상 갱신 빈도.
  3. SPA 에서 implicit 흐름을 아직 쓰면 무엇이 위험한가?
     - 기대 답: 토큰이 URL 에 노출되고 히스토리·리퍼러로 유출된다. Authorization Code + PKCE 로 옮긴다.
- 📖 **레퍼런스** — [RFC 7636 — PKCE](https://datatracker.ietf.org/doc/html/rfc7636) · [OAuth 2.0 for Browser-Based Apps](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps) · [OWASP 세션 관리](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

#### [시니어] iframe이나 위젯과 `postMessage`로 통신할 때 무엇을 검증하나?

**핵심 답**

- 수신 측은 `event.origin`을 화이트리스트와 대조하고, 메시지 스키마를 검증한다. 검증 없는 `postMessage` 핸들러는 크로스 오리진 침입 경로다.
- 송신 측은 대상 오리진을 `"*"`가 아닌 정확한 값으로 지정한다.
- 임베드 쪽 신뢰 경계를 문서화하고, 위젯에 권한을 넘길 때는 sandbox 속성과 권한 정책으로 좁힌다.

- ✅ **좋은 신호** — origin·스키마 이중 검증을 말하고 `"*"` 사용의 위험을 안다.
- ⚠️ **약한 신호** — 메시지를 받으면 바로 처리한다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 위젯이 부모의 쿠키·스토리지에 접근하려 하면 어떻게 막나?
     - 기대 답: 다른 오리진 iframe 으로 격리하고 sandbox·permissions 정책으로 좁힌다. 같은 오리진에 넣으면 막을 방법이 없다.
  2. 위젯에 데이터를 넘겨야 하면 어떻게 하나?
     - 기대 답: postMessage 로 최소 데이터만, 스키마 검증과 오리진 확인. 토큰은 넘기지 않고 서버 간 교환으로 대체.
- 📖 **레퍼런스** — [MDN postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) · [OWASP HTML5 보안](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html)

### React (17)

#### [주니어] 컴포넌트는 언제 리렌더되나?

**핵심 답**

- 자기 state 변경, 부모의 리렌더, 구독한 context 값 변경, `key` 변경(이 경우 언마운트 후 재마운트).
- props가 같더라도 부모가 렌더되면 자식 함수는 다시 호출된다. `memo`로 끊을 수 있다.
- 렌더(가상 트리 계산)와 커밋(실제 DOM 변경)은 다르다. 리렌더가 곧 DOM 조작은 아니다.

- ✅ **좋은 신호** — 렌더와 커밋을 구분하고 리렌더 자체가 항상 성능 문제는 아니라고 말한다.
- ⚠️ **약한 신호** — state가 바뀔 때만 리렌더된다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 불필요한 리렌더를 어떻게 확인하나?
     - 기대 답: React DevTools Profiler 로 렌더 원인(props·state·context)을 보고 하이라이트로 범위를 본다.
  2. 리렌더가 많아도 문제 없는 경우는?
     - 기대 답: 커밋 비용이 작고 프레임 예산 안이면 문제 아니다. 지표(INP·프레임)로 판단한다는 답이 좋다.
- 📖 **레퍼런스** — [react.dev Render and Commit](https://react.dev/learn/render-and-commit) · [react.dev memo](https://react.dev/reference/react/memo)

#### [주니어] 리스트 `key`에 배열 인덱스를 쓰면 무엇이 깨지나?

**핵심 답**

- 항목을 삭제·정렬·앞에 삽입하면 인덱스가 다른 항목을 가리켜 입력값·포커스·애니메이션 상태가 어긋난다.
- 최악은 잘못된 재사용으로 사용자 입력이 다른 행에 붙는 것.
- 안정적인 서버 id를 쓰고, 없으면 생성 시점에 부여한 로컬 id를 쓴다. 정적 목록에선 인덱스도 무해하다.

- ✅ **좋은 신호** — 어떤 조작에서 깨지는지 시나리오로 말하고 인덱스가 괜찮은 조건도 구분한다.
- ⚠️ **약한 신호** — "key는 유일해야 한다"만 반복한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. key 를 일부러 바꿔 상태를 초기화하는 기법은 언제 쓰나?
     - 기대 답: 다른 대상으로 전환될 때 내부 state 를 리셋해야 할 때(상세 화면 id 변경, 폼 초기화).
  2. 그 방식의 대가는?
     - 기대 답: 해당 서브트리가 언마운트·재마운트되어 이펙트가 다시 돌고 애니메이션·스크롤이 초기화된다.
- 📖 **레퍼런스** — [react.dev 리스트 렌더링](https://react.dev/learn/rendering-lists) · [react.dev 상태 보존·초기화](https://react.dev/learn/preserving-and-resetting-state)

#### [미들] `useEffect` 의존성 배열을 비우면 어떤 문제가 생기고 클린업은 언제 필요한가?

**핵심 답**

- 빈 배열은 최초 값에 고정된 클로저를 남긴다(stale closure). 이후 변경된 state·props를 못 본다.
- 구독·타이머·이벤트 리스너·`AbortController`는 반드시 클린업. 없으면 중복 구독·누수, 언마운트 후 setState.
- StrictMode의 개발 이중 실행이 멱등하지 않은 이펙트를 드러낸다.
- 파생 값 계산이나 이벤트 대응은 이펙트가 아니라 렌더 중 계산이나 핸들러가 맞다.

- ✅ **좋은 신호** — 이펙트가 필요 없는 경우를 스스로 구분하고, 린트 경고를 억제하는 대신 구조를 바꾼다.
- ⚠️ **약한 신호** — 의존성 경고를 `eslint-disable`로 끄는 것이 관행이라고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 요청이 겹칠 때 오래된 응답이 나중에 도착하면 어떻게 막나?
     - 기대 답: AbortController 로 취소하거나 요청 토큰·시퀀스를 비교해 마지막 것만 반영한다.
  2. 클린업에서 취소했는데도 setState 경고가 나면?
     - 기대 답: 취소된 fetch 의 reject 처리 누락이거나 다른 비동기 경로가 남아 있다. 모든 경로에 가드가 필요하다.
  3. 이 로직을 매 컴포넌트에 쓰는 대신 어떻게 걷어내나?
     - 기대 답: 데이터 페칭 계층(쿼리 라이브러리)으로 올려 취소·중복 제거·캐시를 한곳에서 처리한다.
- 📖 **레퍼런스** — [react.dev You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) · [react.dev useEffect](https://react.dev/reference/react/useEffect)

#### [미들] `useMemo`/`useCallback`은 언제 쓰고 언제 빼나?

**핵심 답**

- 써야 할 때: 실제로 비싼 계산, 그리고 참조 동일성이 소비자에게 의미 있을 때(`memo` 자식의 props, 훅의 의존성).
- 기본은 쓰지 않는 것. 비교 비용·메모리·코드 복잡도가 붙고 의존성이 틀리면 버그가 된다.
- 순서는 측정 먼저. 프로파일러에서 렌더 시간과 원인을 확인하고 지점을 고른다.

- ✅ **좋은 신호** — 측정 후 적용 원칙을 말하고 참조 동일성이 필요한 지점을 구체적으로 든다.
- ⚠️ **약한 신호** — 모든 함수와 값을 감싸는 것이 최적화라고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. React Compiler 가 있다면 이 판단이 어떻게 달라지나?
     - 기대 답: 수동 메모이제이션 필요가 줄어 기본은 쓰지 않는 쪽으로 더 기운다. 다만 비싼 계산과 외부 참조 안정성은 여전히 사람이 본다.
  2. 그럼 지금 코드에서 memo 를 걷어낼 기준은?
     - 기대 답: 프로파일러로 효과가 없다고 측정된 것부터. 의존성 오류 위험을 줄이는 이득도 함께 계산한다.
- 📖 **레퍼런스** — [react.dev useMemo](https://react.dev/reference/react/useMemo) · [react.dev useCallback](https://react.dev/reference/react/useCallback)

#### [미들] Context에 전역 상태를 넣었더니 앱 전체가 리렌더된다. 어떻게 푸나?

**핵심 답**

- Provider value가 매 렌더 새 객체면 모든 소비자가 리렌더된다 → 값 메모이제이션.
- 자주 바뀌는 값과 거의 안 바뀌는 값을 분리해 Context를 쪼갠다(상태/디스패치 분리).
- 부분 구독이 필요하면 selector 기반 스토어로 옮긴다. 새 참조를 반환하는 selector는 무한 루프를 만들 수 있어 얕은 비교를 함께 쓴다.
- memo 경계를 두어 트리 전파를 끊는다.

- ✅ **좋은 신호** — Context의 구조적 한계(부분 구독 불가)를 알고 도구를 바꿀 근거를 댄다.
- ⚠️ **약한 신호** — Context를 모든 상태의 기본 저장소로 쓰면서 성능 문제를 `memo` 남발로 덮는다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 스토어로 옮긴 뒤에도 느리다면 어디를 보나?
     - 기대 답: selector 가 새 참조를 반환하는지, 구독 범위가 과도한지, 렌더 자체(리스트 길이·무거운 자식)인지.
  2. 새 참조 selector 는 어떤 증상으로 드러나나?
     - 기대 답: 매 렌더 리렌더 또는 무한 루프. 얕은 비교나 원시값 단위 구독으로 고친다.
- 📖 **레퍼런스** — [react.dev Reducer와 Context 확장](https://react.dev/learn/scaling-up-with-reducer-and-context)

#### [미들] 서버 상태와 클라이언트 상태를 왜 나누나?

**핵심 답**

- 서버 데이터는 사본이다. 캐시 수명·재검증·무효화·경합이 본질 문제이고 이를 전용 도구가 다룬다.
- 서버 응답을 전역 스토어에 복사하면 두 개의 진실이 생겨 동기화 코드가 계속 늘어난다.
- UI 상태(열림/선택/입력 중)는 가장 가까운 곳에, 공유·복원이 필요한 상태는 URL에.

- ✅ **좋은 신호** — 동기화 비용을 이유로 들고 URL을 상태 저장소로 쓰는 판단 기준을 말한다.
- ⚠️ **약한 신호** — 전역 스토어 하나에 다 넣는 것이 일관성이라고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 목록을 수정한 뒤 상세 화면이 옛 값을 보이면 무엇을 고치나?
     - 기대 답: 두 화면이 같은 캐시 키를 공유하지 않는 문제. 응답으로 캐시를 갱신하거나 관련 키를 무효화.
  2. 전량 무효화로 해결하면 무엇이 나빠지나?
     - 기대 답: 리페치 폭증과 깜빡임. 필요한 범위만 갱신하는 키 설계가 답.
- 📖 **레퍼런스** — [TanStack Query 쿼리 키](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys) · [react.dev 상태 관리](https://react.dev/learn/managing-state)

#### [시니어] 상태를 어디에 둘지 결정하는 기준이 있나?

**핵심 답**

- 사용 범위를 최소로: 로컬 → 리프팅 → 컨텍스트/스토어 순으로만 올린다.
- 공유·새로고침 복원·딥링크가 필요하면 URL(쿼리스트링·경로).
- 서버 데이터는 캐시 계층. 사용자 편의(마지막 탭·접힘)는 로컬 스토리지, 단 없어도 화면이 정상 동작해야 한다.
- 기기 간 유지·감사 필요는 서버 저장. 기준은 '누가 읽고, 얼마나 오래 살아야 하나'다.

- ✅ **좋은 신호** — 수명과 독자 기준으로 계층을 나누고 잘못 둔 상태를 옮긴 경험을 든다.
- ⚠️ **약한 신호** — 습관적으로 전역 또는 습관적으로 로컬이라 답하고 기준이 없다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 필터 조건을 URL 에 넣었을 때 생기는 부작용은?
     - 기대 답: 히스토리 오염(입력마다 push), 공유 시 권한 없는 조건 노출, URL 길이 제한. replace 와 디바운스로 완화.
  2. 그럼 어떤 상태는 URL 에 넣지 않나?
     - 기대 답: 일시적 UI 상태(열림·호버), 민감 값, 복원 의미 없는 입력 중간값.
- 📖 **레퍼런스** — [react.dev 상태 관리](https://react.dev/learn/managing-state)

#### [시니어] SSR 하이드레이션 미스매치는 왜 생기고 어떻게 다루나?

**핵심 답**

- 서버와 클라이언트가 다른 결과를 만들 때: `Date.now()`·랜덤·로케일·`window` 의존·저장소 값·A/B 분기.
- 경고를 억제하는 대신 클라이언트 전용 부분을 마운트 이후 렌더로 분리하거나 서버에서 값을 내려 준다.
- 미스매치는 트리 재생성으로 이어질 수 있어 성능·깜빡임 문제로 나타난다.
- 스트리밍·Suspense 경계를 잘라 실패 범위와 첫 페인트를 제어한다.

- ✅ **좋은 신호** — 원인 목록을 알고 억제 플래그 남용을 경계하며 경계 설계까지 말한다.
- ⚠️ **약한 신호** — `suppressHydrationWarning`으로 해결한다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 로그인 상태에 따라 헤더가 다르면 어떻게 서버 렌더하나?
     - 기대 답: 요청의 쿠키로 서버에서 확정해 렌더하거나, 개인화 영역만 클라이언트 경계로 분리. 캐시 키에 인증 상태를 반영해야 한다.
  2. CDN 캐시와 개인화가 충돌하면?
     - 기대 답: 공개 셸은 캐시, 개인화는 별도 요청 또는 엣지에서 조립. Vary 헤더 남용은 히트율을 죽인다.
  3. 스트리밍을 쓰면 인증 실패는 어디서 처리하나?
     - 기대 답: 셸 이전에 판정해 리다이렉트한다. 스트림 시작 후에는 상태 코드를 바꿀 수 없다.
- 📖 **레퍼런스** — [react.dev hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot)

#### [미들] StrictMode가 개발에서 이펙트를 두 번 실행하는 이유는?

**핵심 답**

- 마운트→언마운트→재마운트에 견디는지 검증하기 위한 의도된 동작. 프로덕션에는 없다.
- 클린업이 없거나 멱등하지 않은 이펙트(중복 구독, 카운터 증가, 중복 전송)가 여기서 드러난다.
- 끄는 것이 아니라 이펙트를 고치는 것이 답.

- ✅ **좋은 신호** — 드러난 결함을 고친 경험을 말한다.
- ⚠️ **약한 신호** — 버그로 보고 StrictMode를 제거한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 분석 이벤트가 두 번 전송된다면 어떻게 고치나?
     - 기대 답: 이펙트를 멱등하게 만들거나 전송 계층에서 중복 제거 키를 쓴다. StrictMode 를 끄는 것은 답이 아니다.
  2. 프로덕션에서도 중복이 나면 원인은?
     - 기대 답: 이중 마운트가 아니라 라우팅 재진입·재시도·다중 리스너. 전송 로그로 발생 경로를 특정한다.
- 📖 **레퍼런스** — [react.dev StrictMode](https://react.dev/reference/react/StrictMode)

#### [미들] `ref`를 쓰는 것이 정당한 경우는?

**핵심 답**

- 포커스·스크롤·측정·미디어 제어, 서드파티 라이브러리 인스턴스 보관, 렌더에 반영되지 않아야 하는 최신값 보관.
- 화면에 나타나야 하는 값은 state. ref로 우회하면 UI와 데이터가 어긋난다.
- 렌더 중 ref를 읽고 쓰는 것은 금지. 레이아웃 측정은 커밋 이후.

- ✅ **좋은 신호** — state와 ref의 경계를 '렌더에 반영되어야 하는가'로 가른다.
- ⚠️ **약한 신호** — 리렌더를 피하려고 상태를 ref에 넣는다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 자식 DOM 을 부모가 제어해야 한다면 어떤 API 를 쓰나?
     - 기대 답: 자식이 ref 를 받아 필요한 동작만 노출하는 명령형 핸들. DOM 전체를 노출하지 않는 편이 낫다.
  2. 그 명령형 경로가 늘어나면 어떤 신호인가?
     - 기대 답: 상태 소유권이 잘못 배치된 신호. 선언적 props 로 표현 가능한지 다시 본다.
- 📖 **레퍼런스** — [react.dev ref로 값 참조](https://react.dev/learn/referencing-values-with-refs)

#### [시니어] React 19에서 폼 제출과 낙관적 UI를 어떤 API로 구성하나?

**핵심 답**

- Actions: `<form action={fn}>`와 `useActionState`로 제출 중 상태·에러를 프레임워크가 관리한다.
- `useOptimistic`으로 요청 진행 중 임시 값을 보여 주고, 실패 시 자동으로 되돌린다.
- `use()`로 Promise·Context를 렌더에서 읽고 Suspense 경계와 붙인다.
- PropTypes는 폐기됐다. 컴포넌트 계약은 TypeScript로 표현하는 것이 표준.

- ✅ **좋은 신호** — 수동 `isSubmitting` 상태를 왜 줄일 수 있는지 설명하고 실패 롤백까지 다룬다.
- ⚠️ **약한 신호** — 버전 이름만 알고 어떤 문제를 대체하는지 말하지 못한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 서버 컴포넌트 경계에서 이벤트 핸들러를 어디에 둬야 하나?
     - 기대 답: 클라이언트 컴포넌트 안. 함수는 경계를 넘지 못하므로 상호작용 잎만 클라이언트로 내린다.
  2. useOptimistic 을 썼는데 실패 후 값이 남아 있으면?
     - 기대 답: 서버 응답·에러로 상태를 확정하지 않은 것. 액션 완료 시점에 재조정이 일어나게 해야 한다.
  3. 폼을 Actions 로 옮기면 검증은 어디서 하나?
     - 기대 답: 서버에서 최종 검증하고 결과를 상태로 돌려준다. 클라이언트 검증은 UX 용 선행 검사.
- 📖 **레퍼런스** — [react.dev React 19 릴리스](https://react.dev/blog/2024/12/05/react-19) · [react.dev useOptimistic](https://react.dev/reference/react/useOptimistic) · [react.dev use()](https://react.dev/reference/react/use) · [react.dev form](https://react.dev/reference/react-dom/components/form)

#### [시니어] 서버 컴포넌트와 클라이언트 컴포넌트의 경계를 어떻게 잡나?

**핵심 답**

- 기본은 서버. 상태·이벤트·브라우저 API가 필요한 잎(leaf)만 클라이언트로 내린다.
- 경계를 넘는 props는 직렬화 가능해야 한다. 함수·클래스 인스턴스는 못 넘긴다.
- 데이터 페칭을 서버로 올리면 클라이언트 번들과 워터폴이 줄지만, 상호작용 많은 화면은 오히려 경계가 늘어 복잡해진다.
- 선택 근거는 번들 크기·지연·팀의 운영 역량이다.

- ✅ **좋은 신호** — 직렬화 제약과 워터폴을 함께 말하고 도입하지 않을 근거도 댄다.
- ⚠️ **약한 신호** — "최신이니까 전부 서버 컴포넌트로"라고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 서버 컴포넌트에서 인증 실패를 어떻게 화면에 전달하나?
     - 기대 답: 렌더 전에 판정해 리다이렉트하거나 에러 경계로 전달. 클라이언트로 토큰을 흘리지 않는다.
  2. 경계가 많아져 props 직렬화가 번거로우면 무엇을 다시 보나?
     - 기대 답: 경계 위치가 잘못됐다는 신호. 데이터 로딩을 상위로 올리고 상호작용 단위를 다시 자른다.
- 📖 **레퍼런스** — [react.dev 서버 컴포넌트](https://react.dev/reference/rsc/server-components)

#### [주니어] props와 state의 차이는?

**핵심 답**

- props는 부모가 내려 주는 읽기 전용 입력. 자식이 바꾸면 안 된다.
- state는 컴포넌트가 소유하고 바꾸는 값이며, 변경이 리렌더를 일으킨다.
- 같은 값을 두 곳에서 각각 state로 들고 있으면 어긋난다 → 공통 부모로 올리거나(리프팅) 단일 소유자를 정한다.

- ✅ **좋은 신호** — 소유권 개념으로 설명하고 중복 상태가 만드는 버그를 예로 든다.
- ⚠️ **약한 신호** — props를 직접 수정하려 한 경험을 문제로 인식하지 못한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 자식이 부모 값을 바꿔야 하면 어떻게 하나?
     - 기대 답: 부모가 콜백을 내려 주고 상태는 부모가 소유(리프팅). 자식은 이벤트만 알린다.
  2. 여러 자식이 같은 값을 공유하면 어디에 두나?
     - 기대 답: 가장 가까운 공통 부모. 그 부모가 너무 멀면 컨텍스트나 스토어를 검토한다.
- 📖 **레퍼런스** — [react.dev props 전달](https://react.dev/learn/passing-props-to-a-component) · [react.dev state](https://react.dev/learn/state-a-components-memory)

#### [주니어] 가상 DOM은 왜 쓰나? 항상 더 빠른가?

**핵심 답**

- 직접 DOM 조작보다 빠른 것이 요점이 아니다. '상태 → 화면'을 선언적으로 쓰게 하고, 변경 부분만 골라 커밋해 주는 것이 요점.
- 재조정은 트리를 비교해 최소 변경을 계산한다. `key`가 이 비교의 기준이다.
- 수작업으로 최적화한 DOM 조작보다 느릴 수 있다. 대신 예측 가능한 코드와 유지 비용을 얻는다.

- ✅ **좋은 신호** — "빠르다"가 아니라 선언적 모델과 유지 비용으로 설명한다.
- ⚠️ **약한 신호** — 가상 DOM이 항상 더 빠르다고 단정한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 재조정을 방해해 성능을 떨어뜨리는 코드 패턴은?
     - 기대 답: 불안정한 key, 렌더 중 새 컴포넌트 타입 생성, 매 렌더 새 참조 props, 거대한 단일 컴포넌트.
  2. 렌더 함수 안에서 컴포넌트를 정의하면 무슨 일이 나나?
     - 기대 답: 매 렌더 새 타입이 되어 서브트리가 언마운트·재마운트되고 상태가 날아간다.
- 📖 **레퍼런스** — [react.dev 렌더와 커밋](https://react.dev/learn/render-and-commit) · [React 재조정(legacy 문서)](https://legacy.reactjs.org/docs/reconciliation.html)

#### [주니어] 제어 컴포넌트와 비제어 컴포넌트의 차이는?

**핵심 답**

- 제어: 입력값을 state가 소유하고 `value`+`onChange`로 매 타이핑마다 렌더. 검증·포맷팅·연동이 쉽다.
- 비제어: DOM이 값을 소유하고 필요할 때 ref나 폼 데이터로 읽는다. 렌더가 적고 큰 폼에 유리.
- `value`를 주면서 `onChange`를 빼면 값이 고정되어 '입력이 안 되는' 증상이 난다.

- ✅ **좋은 신호** — 폼 크기·검증 요구로 선택 기준을 대고 흔한 실수를 안다.
- ⚠️ **약한 신호** — 항상 제어 컴포넌트가 정답이라고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 입력마다 렌더되는 큰 폼의 성능을 어떻게 개선하나?
     - 기대 답: 필드 단위 구독(비제어 + 폼 라이브러리)이나 렌더 범위 분리. 값 전체를 상위 state 하나에 두지 않는다.
  2. 검증은 언제 실행하나?
     - 기대 답: 블러·제출 시 기본, 실시간 검증은 디바운스. 매 키 입력 전체 검증은 비용이 크다.
- 📖 **레퍼런스** — [react.dev input](https://react.dev/reference/react-dom/components/input) · [react.dev 상태 공유](https://react.dev/learn/sharing-state-between-components)

#### [주니어] 조건부 렌더링에서 `0`이 화면에 찍히는 이유는?

**핵심 답**

- `{count && <Badge/>}`에서 `count`가 `0`이면 `&&`가 `0`을 반환하고 React는 숫자 `0`을 렌더한다.
- `false`·`null`·`undefined`는 렌더되지 않지만 `0`과 `NaN`은 렌더된다.
- 해결은 명시적 비교(`count > 0 ? … : null`) 또는 `Boolean(count) &&`.

- ✅ **좋은 신호** — falsy 값별 렌더 여부를 구분하고 명시적 조건으로 고친다.
- ⚠️ **약한 신호** — 원인을 모른 채 삼항으로 바꿔 우연히 해결했다고 말한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 빈 배열일 때 빈 상태 UI 를 어떻게 처리하나?
     - 기대 답: 길이를 명시적으로 검사해 빈 상태 컴포넌트를 렌더한다. 로딩·에러·빈 상태를 구분해야 한다.
  2. 로딩과 빈 상태를 구분하지 않으면 어떤 버그로 보이나?
     - 기대 답: 데이터가 없다고 잘못 안내하거나 깜빡임이 난다. 상태 기계로 명시하는 편이 안전하다.
- 📖 **레퍼런스** — [react.dev 조건부 렌더링](https://react.dev/learn/conditional-rendering)

#### [시니어] 동시성 렌더링(`useTransition`·Suspense)이 실제로 해결하는 문제는?

**핵심 답**

- 긴 렌더가 입력을 막는 문제. 비긴급 업데이트를 전환으로 표시하면 타이핑·클릭이 먼저 처리된다.
- Suspense 경계로 로딩 단위를 UI 구조에 맞춰 잘라 폭포수 스피너를 줄인다.
- 공짜가 아니다. 경계 설계가 틀리면 깜빡임·중복 요청·상태 되돌림이 생긴다.
- 측정 지표는 INP와 상호작용 후 첫 페인트다.

- ✅ **좋은 신호** — 어떤 상호작용이 좋아졌는지 지표로 말하고 경계 설계 실패 사례도 든다.
- ⚠️ **약한 신호** — 최신 API라서 쓴다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 전환 중에도 사용자에게 진행 상태를 어떻게 알리나?
     - 기대 답: isPending 으로 대상 컨트롤에 지연 표시, 전체 화면 스피너로 덮지 않는다.
  2. Suspense 경계를 잘못 두면 어떤 증상이 나나?
     - 기대 답: 넓은 영역이 사라졌다 나타나는 깜빡임, 스크롤 점프. 경계를 로딩 단위와 맞춰 좁힌다.
- 📖 **레퍼런스** — [react.dev useTransition](https://react.dev/reference/react/useTransition) · [react.dev Suspense](https://react.dev/reference/react/Suspense)

### 상태·데이터 (4)

#### [미들] 낙관적 업데이트를 안전하게 만드는 조건은?

**핵심 답**

- 적용 전 스냅샷을 잡아 실패 시 롤백하고 사용자에게 실패를 알린다.
- 서버 응답으로 최종 재조정(서버가 부여한 id·시각·정렬키).
- 연속 조작의 경합: 마지막 요청만 반영하거나 순차 큐로 직렬화. 재시도는 서버가 멱등해야 안전하다.
- 되돌릴 수 없는 작업(결제·삭제)에는 쓰지 않는다.

- ✅ **좋은 신호** — 롤백·재조정·경합·멱등 네 가지를 모두 말하고 쓰지 않을 경우도 구분한다.
- ⚠️ **약한 신호** — UI를 먼저 바꾸고 요청을 보낸다는 설명에서 멈춘다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 오프라인에서 쌓인 변경을 복귀 후 어떻게 반영하나?
     - 기대 답: 변경을 큐에 저장하고 순서대로 재생, 서버 버전 충돌 시 병합 규칙 적용. 요청 키로 중복을 막는다.
  2. 큐 재생 중 일부가 실패하면?
     - 기대 답: 이후 항목의 전제가 깨질 수 있어 중단하고 사용자에게 알린다. 자동 스킵은 데이터 불일치를 만든다.
- 📖 **레퍼런스** — [TanStack Query 낙관적 업데이트](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates) · [react.dev useOptimistic](https://react.dev/reference/react/useOptimistic)

#### [시니어] 서버 데이터 캐시 무효화를 어떻게 설계했나?

**핵심 답**

- 키 설계가 먼저다. 엔티티 + 파라미터(필터·페이지)를 계층 키로 두어 부분 무효화가 가능하게 한다.
- 변경 후 전량 무효화는 단순하지만 대량 리페치를 부른다. 응답으로 캐시를 직접 갱신(write-through)하고 필요한 범위만 무효화.
- 창 포커스·재연결·주기 재검증 정책, 목록↔상세 간 일관성 규칙을 정한다.
- 결정 근거는 요청 수와 화면 일관성의 균형이며 실측으로 조정한다.

- ✅ **좋은 신호** — 키 계층과 write-through를 구분해 쓰고 무효화 비용을 수치로 관찰한 경험이 있다.
- ⚠️ **약한 신호** — "수정 후 전부 invalidate"만 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 여러 탭이 열려 있을 때 캐시를 어떻게 맞추나?
     - 기대 답: BroadcastChannel 로 무효화 신호를 전파하거나 포커스 시 재검증. 탭마다 다른 값을 보이면 신뢰가 깨진다.
  2. 실시간 갱신이 필요한 화면은 캐시 정책을 어떻게 바꾸나?
     - 기대 답: 구독 기반으로 밀어 넣고 캐시는 그 결과를 받는 저장소로 둔다. 폴링 주기를 줄이는 것은 비용만 늘린다.
- 📖 **레퍼런스** — [TanStack Query 무효화](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation) · [TanStack Query 쿼리 키](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)

#### [미들] 무한 스크롤 목록에서 항목 하나를 수정하면 캐시를 어떻게 다루나?

**핵심 답**

- 페이지 단위 캐시라면 해당 페이지 안의 항목만 갱신하거나, 엔티티를 정규화해 단일 소스로 둔다.
- 정렬 기준이 바뀌는 수정은 커서가 흔들려 중복·누락이 생긴다 → 서버 커서 기준 재동기 또는 목록 리셋.
- 삭제는 오프셋 페이징에서 항목 밀림을 유발한다(커서 페이징 선호).

- ✅ **좋은 신호** — 커서와 오프셋 페이징의 차이를 알고 중복·누락 시나리오를 예로 든다.
- ⚠️ **약한 신호** — 목록 전체를 다시 불러오면 된다고만 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 스크롤 위치를 유지하면서 목록을 갱신하려면?
     - 기대 답: 항목 키를 안정적으로 두고 위쪽 삽입 시 높이 보정. 가상화라면 앵커 항목 기준으로 오프셋을 재계산.
  2. 커서 페이징에서 항목이 삭제되면 커서는 유효한가?
     - 기대 답: 커서 기준 값이 사라지면 서버가 다음 유효 지점으로 보정해야 한다. 클라이언트는 중복·누락 판정 로직을 둔다.
- 📖 **레퍼런스** — [TanStack Query 무한 쿼리](https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries)

#### [시니어] 오프라인 우선이나 동시 편집에서 충돌을 어떻게 다루나?

**핵심 답**

- 서버 최신 우선(last-write-wins)은 단순하지만 사용자 작업을 소리 없이 날린다. 무엇을 잃어도 되는지 먼저 정한다.
- 버전·타임스탬프 기반 낙관적 락으로 충돌을 감지하고 사용자에게 병합 선택을 준다.
- 텍스트·목록 동시 편집은 연산 기반 병합(CRDT·OT)이 적합하다. 대신 상태 크기·디버깅 난도가 오른다.
- 어떤 방식이든 복원 시 감사 축(수정 시각)이 뒤로 되감기지 않게 해야 한다. 되감기면 이후 델타 동기화가 영구히 어긋난다.

- ✅ **좋은 신호** — 데이터 손실 허용선을 먼저 정하고 감지·병합·감사 축까지 설계한다.
- ⚠️ **약한 신호** — 마지막 저장이 이긴다고만 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 충돌 UI 를 어떻게 보여 주는 게 사용자에게 덜 위험한가?
     - 기대 답: 양쪽 값을 나란히 보여 선택하게 하고 기본값은 사용자 편집 보존. 조용한 자동 병합은 신뢰를 깬다.
  2. CRDT 를 도입하면 디버깅이 어려워지는 이유는?
     - 기대 답: 상태가 연산 이력으로 표현돼 스냅샷만으로 원인 추적이 안 된다. 이력 조회 도구가 필요하다.
- 📖 **레퍼런스** — [CRDT 개요](https://crdt.tech/) · [Yjs 문서](https://docs.yjs.dev/)

### TypeScript (4)

#### [주니어] `any` 대신 `unknown`을 쓰라는 이유는?

**핵심 답**

- `unknown`은 사용 전 좁히기를 강제한다. 검사 없이는 어떤 연산도 허용되지 않는다.
- `any`는 전파된다. 한 지점에서 끄면 그 값이 닿는 모든 곳의 검사가 사라진다.
- 외부 입력(JSON·이벤트·서드파티)은 `unknown`으로 받아 타입 가드나 스키마로 좁힌다.

- ✅ **좋은 신호** — 전파 문제를 설명하고 좁히는 수단을 함께 든다.
- ⚠️ **약한 신호** — 둘이 비슷하다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 타입 가드 함수는 어떻게 쓰나?
     - 기대 답: `x is T` 반환 타입으로 좁힘을 컴파일러에 알린다. 내부 검사가 실제로 그 조건을 보장해야 한다.
  2. 타입 가드가 거짓말을 하면 무엇이 무너지나?
     - 기대 답: 단언과 같아진다. 스키마 파싱으로 검증과 타입을 한 출처에서 만드는 편이 안전하다.
- 📖 **레퍼런스** — [TS 핸드북 Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html) · [TS 핸드북 Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

#### [미들] `as` 단언이 위험한 이유와 대안은?

**핵심 답**

- 단언은 런타임 검증이 아니다. 컴파일러가 잡아 줄 회귀를 침묵시킨다.
- 대안: 타입 가드, 판별 유니온, 제네릭, 스키마 파싱, 그리고 `satisfies`로 초과·누락 검사를 유지.
- `as const`는 리터럴 보존 목적이라 성격이 다르다.
- 테스트 스텁에서 부분 객체가 필요하면 부분 타입 + 조립으로 풀고 통째 단언을 피한다.

- ✅ **좋은 신호** — 어떤 회귀가 숨는지 사례로 말하고 `satisfies`를 구분해 쓴다.
- ⚠️ **약한 신호** — 타입 에러가 나면 일단 `as`로 막는다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. API 응답 타입이 실제와 다르다면 어디서 막아야 하나?
     - 기대 답: 경계에서 스키마 파싱. 내부 깊은 곳에서 방어 코드를 흩뿌리면 원인 추적이 불가능해진다.
  2. 서버 스펙이 자주 바뀌면 어떻게 계약을 지키나?
     - 기대 답: OpenAPI 등에서 타입 생성 + CI 대조, 변경은 Parallel Change 로 단계 이행.
- 📖 **레퍼런스** — [TS 4.9 satisfies](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html) · [TS 핸드북 Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

#### [미들] 구조적 타이핑이 만드는 함정은?

**핵심 답**

- 모양이 같으면 호환된다. 서로 다른 의미의 문자열 id가 교차 대입돼도 컴파일은 통과한다.
- 초과 속성 검사는 객체 리터럴에만 적용돼, 변수를 거치면 여분 속성이 조용히 통과한다.
- 구분이 필요하면 branded/nominal 타입(태그 필드나 심볼)으로 식별자를 분리한다.

- ✅ **좋은 신호** — id 혼동 같은 실제 사고를 들고 branded 타입을 도입한 경험이 있다.
- ⚠️ **약한 신호** — 덕 타이핑이라는 용어만 말한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 단위나 좌표계가 다른 숫자를 타입으로 어떻게 막나?
     - 기대 답: branded 타입으로 분리하고 변환 함수만 통과하게 한다. 치아 번호·픽셀/밀리미터 같은 실무 예가 좋다.
  2. branded 타입이 과하다는 반론에는?
     - 기대 답: 경계와 식별자에만 적용한다. 전면 적용은 비용이 크다는 균형 감각이 필요하다.
- 📖 **레퍼런스** — [TS 타입 호환성](https://www.typescriptlang.org/docs/handbook/type-compatibility.html) · [Nominal typing 패턴](https://basarat.gitbook.io/typescript/main-1/nominaltyping)

#### [시니어] 런타임 경계에서 타입을 어떻게 보장하나?

**핵심 답**

- 경계(네트워크·스토리지·postMessage·URL 파라미터)에서 한 번 파싱하고, 내부는 파싱된 타입만 신뢰한다.
- 스키마 정의를 단일 출처로 두고 타입을 파생한다. 생성된 타입을 다시 별칭으로 재수출하면 원본과 어긋난다.
- 파싱 실패 처리(폴백·에러 보고)를 설계해야 한다. 성능을 이유로 검증을 수동 체크로 대체하면 누락 회귀가 생긴다.
- 서버 스펙(OpenAPI)에서 클라이언트 타입을 생성해 계약을 CI로 검증한다.

- ✅ **좋은 신호** — 경계 1회 파싱 원칙과 실패 경로를 말하고 검증 제거로 사고를 본 경험을 든다.
- ⚠️ **약한 신호** — 타입이 있으니 런타임 검증은 필요 없다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 스키마 검증 비용이 실제로 문제라면 어떻게 줄이나?
     - 기대 답: 측정 먼저. 큰 배열은 부분 검증·샘플링, 스키마 컴파일 캐시, 핫 경로만 예외 처리하고 근거를 남긴다.
  2. 검증을 빼고 나중에 사고가 나면 어떻게 되돌리나?
     - 기대 답: 제거 지점을 플래그로 두고 지표를 감시한다. 과거에 검증 제거가 회귀를 만든 사례를 아는지도 신호.
- 📖 **레퍼런스** — [Zod 스키마 검증](https://zod.dev/) · [TS 제네릭](https://www.typescriptlang.org/docs/handbook/2/generics.html)

### 성능 (11)

#### [미들] Core Web Vitals 세 지표와 합격선은?

**핵심 답**

- LCP 2.5초 이하, INP 200ms 이하, CLS 0.1 이하.
- 판정은 실사용자(field) 데이터의 75퍼센타일이며 모바일·데스크톱을 나눠 본다.
- 실험실(Lighthouse) 점수와 필드 값은 다르다. 개선 판단은 필드 분포로 한다.

- ✅ **좋은 신호** — 수치와 75퍼센타일 기준을 정확히 말하고 lab/field 차이를 구분한다.
- ⚠️ **약한 신호** — Lighthouse 점수 90점 같은 지표만 말한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 필드 데이터는 어떻게 수집했나?
     - 기대 답: web-vitals 라이브러리로 사용자 브라우저에서 수집해 자체 수집기에 전송, 또는 CrUX. 분포(p75)로 본다.
  2. 수집 자체가 성능에 영향을 주지 않게 하려면?
     - 기대 답: 전송은 sendBeacon, 샘플링과 배치. 페이지 이탈 시점에 보낸다.
  3. 세그먼트를 어떻게 쪼개 보나?
     - 기대 답: 기기·네트워크·지역·라우트별. 평균 하나로는 악화 구간이 숨는다.
- 📖 **레퍼런스** — [web.dev Web Vitals](https://web.dev/articles/vitals) · [web.dev 임계값 정의](https://web.dev/articles/defining-core-web-vitals-thresholds) · [web.dev lab vs field](https://web.dev/articles/lab-and-field-data-differences)

#### [미들] LCP가 느릴 때 점검 순서를 말해 보라.

**핵심 답**

- LCP는 TTFB → 리소스 로드 지연 → 리소스 로드 시간 → 렌더 지연 네 구간으로 쪼개 본다.
- 히어로 이미지에 `fetchpriority="high"`, `preload`를 주고 지연 로딩을 걸지 않는다.
- 렌더 블로킹 CSS·폰트 축소, 서버 응답 캐시, 이미지 포맷·해상도 축소.
- 클라이언트 렌더에서는 하이드레이션·데이터 페치 워터폴이 렌더 지연으로 잡힌다.

- ✅ **좋은 신호** — 네 구간 분해로 병목을 지목하고 측정 도구(필드 어트리뷰션)를 든다.
- ⚠️ **약한 신호** — 이미지 압축만 말한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. LCP 요소가 매 화면마다 다르면 무엇을 기준으로 개선하나?
     - 기대 답: 라우트별로 LCP 요소를 식별해 상위 트래픽 화면부터. 공통 원인(폰트·셸 렌더)이 있으면 그걸 먼저.
  2. preload 를 많이 걸면 왜 역효과가 나나?
     - 기대 답: 대역폭 경쟁으로 정작 중요한 자원이 늦어진다. 우선순위는 소수에만 부여한다.
- 📖 **레퍼런스** — [web.dev LCP](https://web.dev/articles/lcp) · [web.dev LCP 최적화](https://web.dev/articles/optimize-lcp) · [web.dev fetchpriority](https://web.dev/articles/fetch-priority)

#### [미들] 번들이 커졌을 때 실제로 무엇을 하나?

**핵심 답**

- 먼저 분석. 번들 시각화 도구로 무엇이 큰지 확인하고 중복 의존성(버전 두 개)을 찾는다.
- 전체 import(유틸 라이브러리 통째, 아이콘 세트), moment류 로케일 포함 여부 점검.
- 라우트·모달·에디터 단위 code splitting과 지연 로드. 초기 경로에 필요한 것만 남긴다.
- 예산(budget)을 CI에 걸어 회귀를 막는다.

- ✅ **좋은 신호** — 측정 → 원인 → 분할 → 회귀 감시 순서로 말하고 수치를 든다.
- ⚠️ **약한 신호** — "lazy import를 쓴다"만 답하고 무엇이 큰지 모른다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 코드 분할을 늘렸는데 체감이 더 나빠졌다면 왜인가?
     - 기대 답: 요청 폭발과 순차 로딩 워터폴, 공통 청크 중복. 라우트 진입 시 필요한 청크를 미리 받게 조정한다.
  2. 분할 경계를 무엇으로 정하나?
     - 기대 답: 변경 빈도와 진입 경로. 공통 라이브러리와 기능 코드를 섞으면 캐시 히트율이 떨어진다.
- 📖 **레퍼런스** — [web.dev 코드 분할](https://web.dev/articles/reduce-javascript-payloads-with-code-splitting) · [web.dev 성능 예산](https://web.dev/articles/performance-budgets-101)

#### [시니어] 성능 개선을 어떻게 증명하나?

**핵심 답**

- 먼저 측정. 필드 RUM 분포(p75)와 대상 사용자 세그먼트를 정한다.
- 가설은 하나씩. 전후 조건을 동일하게 맞추고 저사양 기기·저속 네트워크 프로파일로 재현한다.
- Long Task·INP 어트리뷰션으로 원인 지점을 특정한다.
- 회귀 감시: 성능 예산, CI 측정, 배포와 지표를 연결한 알림.

- ✅ **좋은 신호** — 수치와 분포로 말하고 회귀 감시까지 설계한다.
- ⚠️ **약한 신호** — 체감이 빨라졌다고 말하고 근거가 없다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 개선 후 p75 는 좋아졌는데 p95 가 나빠졌다면?
     - 기대 답: 저사양·저속 구간이 악화됐을 가능성. 세그먼트로 분해하고 해당 조건에서 재현해 원인을 찾는다.
  2. 회귀를 막을 장치는 무엇을 두나?
     - 기대 답: 성능 예산과 CI 측정, 배포별 필드 지표 알림. 수치 없는 합의는 유지되지 않는다.
- 📖 **레퍼런스** — [web.dev INP 최적화](https://web.dev/articles/optimize-inp) · [MDN Long Task API](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongTaskTiming) · [web.dev 성능 예산](https://web.dev/articles/performance-budgets-101)

#### [미들] 1만 행 목록을 렌더해야 한다면?

**핵심 답**

- 윈도잉(가상 스크롤)으로 보이는 범위만 DOM에 유지한다.
- 행 컴포넌트 memo, 안정 key, 셀 계산 캐시로 스크롤 중 작업을 줄인다.
- 트레이드오프: 검색(Ctrl+F)·접근성·스크롤 앵커링이 약해진다. 가변 높이는 측정 비용이 든다.
- 대안은 페이징이나 서버 집계. 사용자가 실제로 무엇을 찾는지가 선택 기준.

- ✅ **좋은 신호** — 윈도잉의 대가를 알고 페이징 대안과 비교한다.
- ⚠️ **약한 신호** — 라이브러리 이름만 말한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 행 높이가 콘텐츠마다 다르면 어떻게 처리하나?
     - 기대 답: 측정 기반 가변 높이 가상화(측정 캐시)나 추정 높이 + 보정. 스크롤 점프를 줄이는 것이 핵심.
  2. 가상화 때문에 검색·접근성이 나빠지는 문제는?
     - 기대 답: 브라우저 검색이 안 되고 스크린리더 탐색이 끊긴다. 페이징 제공이나 전체 보기 옵션으로 보완.
- 📖 **레퍼런스** — [web.dev 긴 목록 가상화](https://web.dev/articles/virtualize-long-lists-react-window)

#### [주니어] 이미지 최적화의 기본은?

**핵심 답**

- 표시 크기에 맞는 해상도 제공(`srcset`/`sizes`), AVIF·WebP 같은 최신 포맷.
- 화면 밖 이미지는 `loading="lazy"`, 첫 화면 LCP 이미지는 지연 로딩을 걸지 않는다.
- `width`/`height` 또는 `aspect-ratio`를 지정해 CLS를 막는다.

- ✅ **좋은 신호** — LCP 이미지 예외를 알고 CLS 방지까지 말한다.
- ⚠️ **약한 신호** — 모든 이미지에 lazy를 붙인다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. CDN 리사이즈와 빌드 타임 리사이즈의 차이는?
     - 기대 답: CDN 은 요청 기반이라 조합이 유연하고 캐시 워밍이 필요하다. 빌드 타임은 예측 가능하지만 조합 수만큼 산출물이 늘어난다.
  2. LCP 이미지를 언제 preload 하나?
     - 기대 답: 첫 화면에서 확정적으로 보이는 이미지만. 라우트별 다르면 서버 렌더에서 힌트를 내려 준다.
- 📖 **레퍼런스** — [MDN img (srcset·loading)](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img) · [web.dev 반응형 이미지](https://web.dev/articles/serve-responsive-images) · [web.dev CLS](https://web.dev/articles/cls)

#### [미들] 웹폰트 때문에 생기는 깜빡임과 레이아웃 이동을 어떻게 다루나?

**핵심 답**

- `font-display`로 정책 선택: `swap`은 폴백 먼저(이동 발생), `optional`은 첫 방문에 폴백 유지.
- 핵심 폰트는 `preload`, 서브셋으로 용량 축소, 가변 폰트로 파일 수 감소.
- 폴백 폰트 메트릭을 맞춰(`size-adjust`, `ascent-override`) 교체 시 이동을 줄인다.

- ✅ **좋은 신호** — 정책별 트레이드오프를 말하고 메트릭 정렬까지 안다.
- ⚠️ **약한 신호** — "폰트를 preload한다"만 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 브랜드 폰트가 필수인데 CLS 가 기준을 넘으면?
     - 기대 답: 폴백 메트릭 정렬(size-adjust)과 preload, 필요하면 font-display: optional 로 첫 방문 교체를 포기한다.
  2. 가변 폰트로 바꾸면 무엇이 좋아지나?
     - 기대 답: 파일 수·용량이 줄고 굵기 전환이 자연스럽다. 대신 단일 파일이 커서 서브셋이 중요하다.
- 📖 **레퍼런스** — [MDN font-display](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display) · [web.dev 웹폰트 로딩 최적화](https://web.dev/articles/optimize-webfont-loading)

#### [주니어] SPA의 첫 화면이 느린 이유와 개선 방향은?

**핵심 답**

- 클라이언트 렌더는 HTML이 비어 있고, JS 다운로드·파싱·실행 후에야 데이터 요청이 시작된다(워터폴).
- 개선은 서버 렌더·사전 렌더로 첫 화면 HTML을 먼저 주기, 초기 번들 축소, 데이터 프리페치, 중요한 자원 우선순위 지정.
- 반대로 페이지 이동은 SPA가 빠르다. 렌더링 방식은 첫 방문과 이후 이동의 트레이드오프로 고른다.

- ✅ **좋은 신호** — 워터폴 구조로 원인을 설명하고 첫 방문 vs 재방문 트레이드오프를 말한다.
- ⚠️ **약한 신호** — "React라서 느리다"로 끝낸다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 서버 렌더를 도입하면 새로 생기는 문제는?
     - 기대 답: 하이드레이션 미스매치, 서버 전용 API 접근, 캐시·개인화 설계, 운영 비용과 관측 대상 증가.
  2. 그럼 서버 렌더가 이득이 없는 화면은?
     - 기대 답: 로그인 후 상호작용 중심 화면. 첫 화면 지표가 사업 지표와 무관한 내부 도구도 해당.
- 📖 **레퍼런스** — [web.dev 렌더링 전략 비교](https://web.dev/articles/rendering-on-the-web)

#### [시니어] INP가 나쁠 때 어느 구간을 어떻게 좁히나?

**핵심 답**

- INP는 입력 지연 / 처리 시간 / 표현 지연 세 구간으로 쪼갠다. 어느 구간이 지배하는지에 따라 처방이 다르다.
- 입력 지연은 실행 중인 긴 작업 때문 → 작업 쪼개기, 서드파티 스크립트 시점 조정.
- 처리 시간은 핸들러·렌더 비용 → 상태 변경 배치, 비긴급 업데이트를 전환(transition)으로 내리기.
- 표현 지연은 거대한 DOM·복잡한 레이아웃 → 가상화, `content-visibility`, 레이아웃 단순화.

- ✅ **좋은 신호** — 구간 분해로 원인을 지목하고 필드 어트리뷰션 데이터를 쓴다.
- ⚠️ **약한 신호** — 메모이제이션을 추가하는 것으로 답을 끝낸다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 입력 직후 무거운 화면 전환이 필요하면 어떻게 체감을 지키나?
     - 기대 답: 입력 반응(즉시 피드백)을 먼저 커밋하고 무거운 갱신은 전환으로 내린다. 스켈레톤으로 진행을 알린다.
  2. 전환을 썼는데도 INP 가 안 좋아지면?
     - 기대 답: 핸들러 자체가 무겁거나 표현 지연(거대한 DOM)이 지배한다. 구간 분해로 다시 측정.
- 📖 **레퍼런스** — [web.dev INP](https://web.dev/articles/inp) · [web.dev INP 최적화](https://web.dev/articles/optimize-inp) · [react.dev useTransition](https://react.dev/reference/react/useTransition)

#### [시니어] 대용량 파일 업로드를 어떻게 설계하나?

**핵심 답**

- 파일을 청크로 잘라(`Blob.slice`) 병렬 업로드하고, 실패 청크만 재시도·재개한다.
- 진행률·취소는 `AbortController`로. 메인 스레드를 막지 않도록 해시·압축은 워커에서.
- 서버와 합의할 것: 청크 크기, 세션 만료, 중복 방지 키(멱등), 완료 시 병합 확인.
- 네트워크 변동에 맞춘 동시성 조절과 이어받기 지점 저장이 실사용 품질을 결정한다.

- ✅ **좋은 신호** — 재개·멱등·동시성 조절을 함께 말하고 실측 수치를 든다.
- ⚠️ **약한 신호** — `FormData`로 한 번에 보낸다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 업로드 중 탭이 닫히면 어떻게 이어받나?
     - 기대 답: 업로드 세션 id 와 완료 청크 목록을 로컬에 저장하고 재진입 시 서버에 상태를 물어 남은 청크만 보낸다.
  2. 동시 업로드 수는 어떻게 정하나?
     - 기대 답: 네트워크 상태에 따라 적응적으로. 고정 값은 저속 회선에서 전체를 느리게 만든다.
- 📖 **레퍼런스** — [MDN Blob.slice](https://developer.mozilla.org/en-US/docs/Web/API/Blob/slice) · [MDN File API](https://developer.mozilla.org/en-US/docs/Web/API/File_API) · [MDN AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)

#### [시니어] HTTP/2·HTTP/3 시대에 번들 전략은 어떻게 달라졌나?

**핵심 답**

- 다중화로 요청 수 자체의 비용이 줄어 스프라이트·과도한 인라인 같은 옛 우회가 필요 없어졌다.
- 대신 과도한 분할은 의존 그래프 요청 폭발과 캐시 히트율 저하를 만든다. 청크 경계는 변경 빈도(공통 라이브러리 vs 기능 코드)로 정한다.
- 우선순위·프리로드가 더 중요해졌다. 중요한 자원을 먼저 받게 순서를 지정한다.
- 결정은 필드 지표로 검증한다. 이론적 라운드트립 계산만으로 고르지 않는다.

- ✅ **좋은 신호** — 분할의 상한을 캐시 히트율과 요청 그래프로 설명한다.
- ⚠️ **약한 신호** — "HTTP/2면 많이 쪼개도 된다"로 끝낸다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 공통 청크를 어떻게 갈라 캐시 수명을 늘리겠나?
     - 기대 답: 변경 빈도별로 분리(프레임워크·공용 라이브러리·앱 공통), 해시 파일명으로 장기 캐시.
  2. 청크를 나눴는데 캐시 히트가 낮으면 원인은?
     - 기대 답: 공통 청크에 자주 바뀌는 코드가 섞여 있다. 의존 그래프로 실제 포함물을 확인한다.
- 📖 **레퍼런스** — [web.dev HTTP/2 성능](https://web.dev/articles/performance-http2) · [web.dev fetchpriority](https://web.dev/articles/fetch-priority)

### 테스트 (5)

#### [미들] 무엇을 유닛으로, 무엇을 e2e로 테스트하나?

**핵심 답**

- 순수 로직·경계 조건은 유닛. 컴포넌트+스토어+네트워크 모킹의 통합 테스트가 비용 대비 신뢰가 가장 높다.
- e2e는 핵심 사용자 흐름 소수(로그인·결제·저장)로 제한한다. 느리고 깨지기 쉬워서.
- 기준은 '이 테스트가 깨질 때 실제 사용자 문제가 있었는가'.

- ✅ **좋은 신호** — 비용·신뢰 균형으로 설명하고 자기 프로젝트의 배치를 수치로 말한다.
- ⚠️ **약한 신호** — 커버리지 숫자를 목표로 제시한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 커버리지 80% 인데 장애가 났다면 무엇을 바꾸겠나?
     - 기대 답: 무엇을 검증하는지로 방향 전환. 핵심 흐름 통합 테스트와 장애 재발 방지 테스트를 추가하고 커버리지 목표는 내린다.
  2. 그 장애를 막을 테스트는 어느 계층이었을까?
     - 기대 답: 대개 경계 통합(네트워크·권한·상태 전이). 순수 유닛으로는 안 잡히는 종류라는 판단이 필요하다.
- 📖 **레퍼런스** — [Testing Trophy (Kent C. Dodds)](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications) · [Practical Test Pyramid (Fowler)](https://martinfowler.com/articles/practical-test-pyramid.html)

#### [미들] Testing Library의 쿼리 우선순위와 그 이유는?

**핵심 답**

- 접근성 기준 쿼리 우선: `getByRole` → `getByLabelText` → `getByText` → 마지막 수단으로 `getByTestId`.
- 사용자가 화면을 인식하는 방식과 같은 축으로 찾아야 테스트가 구현 변경에 견딘다. 부수적으로 접근성 결함도 드러난다.
- 클래스명·DOM 구조에 의존하면 리팩터마다 깨진다.

- ✅ **좋은 신호** — 우선순위를 순서대로 말하고 접근성 검증 효과를 언급한다.
- ⚠️ **약한 신호** — testid가 가장 안정적이라고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. role 로 못 찾는 커스텀 위젯은 어떻게 테스트하나?
     - 기대 답: 먼저 접근성 속성을 붙여 실제 사용자도 찾을 수 있게 고친다. 그게 불가하면 testid 를 쓰고 이유를 남긴다.
  2. 그 원칙이 테스트 속도를 해치면?
     - 기대 답: 쿼리 비용보다 유지 비용이 크다. 병목이면 렌더 범위를 줄이는 쪽으로 해결한다.
- 📖 **레퍼런스** — [Testing Library 쿼리 우선순위](https://testing-library.com/docs/queries/about/) · [Testing Library 원칙](https://testing-library.com/docs/guiding-principles)

#### [시니어] flaky 테스트의 원인 top과 처방은?

**핵심 답**

- 고정 `sleep`과 시간·애니메이션 의존 → 조건 기반 대기(자동 재시도 assertion).
- 테스트 간 상태 공유(DB·스토리지·로그인 세션) → 테스트별 격리와 시드 데이터.
- 순서 의존·병렬 자원 충돌(같은 포트·같은 계정) → 워커별 자원 분리.
- 네트워크 실물 의존 → 경계 모킹. 재시도는 은폐 수단이 아니라 관측 장치로 쓰고 실패율을 추적한다.

- ✅ **좋은 신호** — 원인별 처방을 짝지어 말하고 재시도를 측정과 함께 다룬다.
- ⚠️ **약한 신호** — 재시도 횟수를 늘려 해결했다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. CI 에서만 깨지고 로컬에서 재현되지 않으면 무엇부터 보나?
     - 기대 답: 병렬 자원 충돌·시드 데이터·타임존·머신 성능 차이. CI 와 같은 조건(컨테이너·워커 수)으로 재현한다.
  2. 재시도를 켜는 것이 왜 위험한가?
     - 기대 답: 불안정 원인을 숨겨 실패율이 지표에서 사라진다. 재시도는 계측과 함께, 기한을 두고 쓴다.
- 📖 **레퍼런스** — [Playwright 재시도·flaky](https://playwright.dev/docs/test-retries)

#### [미들] 모킹은 어디까지 해야 하나?

**핵심 답**

- 네트워크 경계에서 모킹(요청 인터셉트)하면 앱 내부 구조를 바꿔도 테스트가 살아남는다.
- 내부 모듈을 모킹하면 리팩터마다 깨지고, 실제로는 깨진 코드가 통과하는 가짜 green이 생긴다.
- 시간·랜덤·기기 API는 제어 가능한 대체물로 고정한다.

- ✅ **좋은 신호** — 경계 모킹과 내부 모킹의 결과 차이를 경험으로 설명한다.
- ⚠️ **약한 신호** — 편의상 전부 모킹한다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 모킹한 응답이 실제 서버 스펙과 달라지는 것을 어떻게 막나?
     - 기대 답: 스펙에서 모킹 픽스처를 생성하거나 계약 테스트로 대조. 손으로 쓴 픽스처는 필연적으로 낡는다.
  2. 계약 테스트를 둘 여력이 없으면?
     - 기대 답: 핵심 엔드포인트만 실제 서버로 스모크 검증. 전면 e2e 보다 값이 싸다.
- 📖 **레퍼런스** — [MSW 철학(경계 모킹)](https://mswjs.io/docs/philosophy)

#### [시니어] 릴리스 게이트를 어떻게 설계하나?

**핵심 답**

- 게이트는 '무엇을 막을 것인가'로 정의한다. 모든 테스트를 차단 조건으로 걸면 배포가 멈추고 우회 문화가 생긴다.
- 차단: 핵심 흐름 e2e, 타입·빌드, 보안 스캔. 경고: 커버리지·성능 예산 근접·advisory 린트.
- 불안정한 테스트는 차단 목록에서 빼고 실패율을 추적해 고친 뒤 되돌린다.
- 배포 후 관측(에러율·핵심 지표)과 자동 롤백 조건까지가 게이트의 일부.

- ✅ **좋은 신호** — 차단/경고를 나눈 기준과 우회 문화 방지책을 말한다.
- ⚠️ **약한 신호** — CI 전부 초록이어야 배포한다는 원칙만 반복한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 급한 핫픽스는 게이트를 어떻게 통과시키나?
     - 기대 답: 축약 경로를 미리 정의한다(핵심 스모크만 + 사후 보완, 승인자 명시). 임시 우회를 그때그때 만들면 관행이 된다.
  2. 우회 경로가 남용되는지 어떻게 보나?
     - 기대 답: 우회 사용 건수와 사후 보완 이행률을 계측한다.
- 📖 **레퍼런스** — [Playwright 재시도·flaky](https://playwright.dev/docs/test-retries) · [web.dev 성능 예산](https://web.dev/articles/performance-budgets-101)

### 빌드·툴링 (7)

#### [미들] tree shaking이 안 먹는 이유는?

**핵심 답**

- CJS 모듈은 정적 분석이 어렵다. ESM이어야 제거가 가능하다.
- `package.json`의 `sideEffects` 설정 누락 또는 실제 사이드이펙트(전역 등록, CSS import).
- 배럴 파일(`export *`)로 모듈 전체가 참조되어 남는 경우.
- 프로덕션 모드(minify·DCE)로 빌드하지 않은 경우.

- ✅ **좋은 신호** — 원인을 나열하고 번들 분석으로 확인한 경험을 말한다.
- ⚠️ **약한 신호** — 번들러가 알아서 해 준다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 배럴 파일을 없애면 어떤 부작용이 있나?
     - 기대 답: import 경로가 길어지고 공개 API 경계가 흐려진다. 공개 진입점만 배럴로 남기고 내부는 직접 경로를 쓴다.
  2. tree shaking 이 되는지 어떻게 확인하나?
     - 기대 답: 번들 분석으로 최종 산출물에 남았는지 본다. 이론이 아니라 산출물로 판정.
- 📖 **레퍼런스** — [webpack tree shaking](https://webpack.js.org/guides/tree-shaking/)

#### [미들] ESM과 CJS가 섞여 생기는 문제는?

**핵심 답**

- named export interop 차이로 `import { x }`가 실패하거나 default에 감싸여 들어온다.
- 같은 패키지가 두 형식으로 동시에 번들되는 dual package hazard → 인스턴스·전역 상태가 두 개.
- `exports` 조건부 필드 해석이 번들러·런타임마다 달라 SSR과 브라우저가 다른 파일을 집는다.

- ✅ **좋은 신호** — 실제 디버깅 절차(어느 파일이 해석됐는지 확인)를 말한다.
- ⚠️ **약한 신호** — 에러 메시지만 기억하고 원인 구조를 모른다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. SSR 에서만 깨지는 라이브러리를 어떻게 처리했나?
     - 기대 답: 브라우저 전용 API 접근을 마운트 이후로 미루거나 동적 로드. exports 조건과 번들러 해석을 확인한다.
  2. dual package hazard 는 어떤 증상으로 드러나나?
     - 기대 답: 싱글턴이 두 개가 되어 컨텍스트·전역 상태가 어긋난다. 번들에 같은 패키지가 두 번 들어간다.
- 📖 **레퍼런스** — [Node.js packages(exports·interop)](https://nodejs.org/api/packages.html)

#### [시니어] 모노레포에서 의존 경계를 어떻게 강제하나?

**핵심 답**

- 태그·경로 기반 규칙을 린트로 강제해 허용된 방향만 import 가능하게 한다.
- 순환 의존 방지: 상위 배럴 import 금지, 모듈 내부는 상대 경로, 외부는 alias.
- 변경 영향 그래프로 영향받은 프로젝트만 빌드·테스트하고 캐시를 공유한다.
- 규칙 없는 공유 레이어는 결국 모든 것이 모든 것에 의존하는 상태로 수렴한다.

- ✅ **좋은 신호** — 규칙을 도구로 강제한 경험과 CI 시간 변화 수치를 말한다.
- ⚠️ **약한 신호** — 리뷰에서 주의시킨다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 경계 규칙 때문에 개발이 느려진다는 반발에 어떻게 답하나?
     - 기대 답: 규칙이 막은 실제 사고·순환 의존 사례와 CI 시간 개선 수치를 제시한다. 예외 경로(승인 절차)를 열어 둔다.
  2. 규칙을 우회하는 코드가 계속 생기면?
     - 기대 답: 규칙이 현실과 안 맞는 신호. 경계를 다시 자르거나 공유 레이어를 신설하는 쪽이 낫다.
- 📖 **레퍼런스** — [Nx 모듈 경계 강제](https://nx.dev/features/enforce-module-boundaries)

#### [미들] 프로덕션 에러를 어떻게 읽을 수 있게 만드나?

**핵심 답**

- 난독화된 스택은 소스맵을 에러 트래킹 서비스에 업로드해 복원한다. 소스맵은 공개 배포하지 않는다.
- 릴리스 버전을 스택과 함께 태깅해 어느 배포에서 난 에러인지 구분한다.
- 브라우저·기기·사용자 흐름(breadcrumb)을 함께 수집하고, 전역 `error`·`unhandledrejection`을 연결한다.

- ✅ **좋은 신호** — 릴리스 태깅과 소스맵 비공개 운영을 함께 말한다.
- ⚠️ **약한 신호** — 콘솔 로그를 본다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 에러가 특정 배포 이후 급증했다면 무엇부터 보나?
     - 기대 답: 릴리스 태깅으로 버전별 발생률 비교, 해당 diff 와 스택 복원. 롤백 여부를 먼저 판단한다.
  2. 소스맵을 공개 배포하면 무엇이 위험한가?
     - 기대 답: 코드 구조·내부 로직이 노출된다. 업로드는 하되 공개 경로에서는 제거한다.
- 📖 **레퍼런스** — [소스맵 업로드 운영(Sentry)](https://docs.sentry.io/platforms/javascript/sourcemaps/)

#### [주니어] `dependencies`와 `devDependencies`를 나누는 이유, lockfile은 왜 커밋하나?

**핵심 답**

- 런타임에 필요한 것만 `dependencies`. 빌드·테스트 도구는 `devDependencies`로 두어 배포 산출물과 설치 시간을 줄인다.
- lockfile은 전이 의존성까지 버전을 고정한다. 커밋하지 않으면 사람마다·CI마다 다른 버전이 설치돼 재현되지 않는 버그가 생긴다.
- lockfile은 손으로 편집하지 않는다. 충돌 시 재생성한다.

- ✅ **좋은 신호** — 재현성을 이유로 대고 lockfile 충돌 처리 방식을 안다.
- ⚠️ **약한 신호** — 둘의 차이를 형식적으로만 말하고 배포 영향을 모른다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 의존성 버전 범위(^, ~)는 어떻게 관리하나?
     - 기대 답: lockfile 로 고정하고 갱신은 자동 PR + CI 검증. 라이브러리 배포용 패키지는 범위를 넓게, 앱은 좁게.
  2. 의존성 자동 갱신이 위험해지는 지점은?
     - 기대 답: 빌드 스크립트 실행과 전이 의존성 교체. 승인 절차와 변경 로그 확인이 필요하다.
- 📖 **레퍼런스** — [npm package.json](https://docs.npmjs.com/cli/v10/configuring-npm/package-json) · [npm package-lock.json](https://docs.npmjs.com/cli/v10/configuring-npm/package-lock-json)

#### [시니어] 브라우저 지원 정책과 폴리필 전략을 어떻게 정하나?

**핵심 답**

- 지원 대상은 감정이 아니라 사용 데이터(실사용자 브라우저 분포)로 정하고 `browserslist` 같은 단일 출처에 적는다.
- 널리 지원되는 기능(baseline)은 폴리필 없이 쓰고, 나머지는 기능 탐지 + 필요한 사용자에게만 폴리필을 준다.
- 전체 사용자에게 레거시 번들을 주는 설정은 다수에게 손해다. 모던·레거시 분리 배포를 고려한다.
- 정책은 주기적으로 재검토하고, 지원 종료를 공지·계측과 함께 진행한다.

- ✅ **좋은 신호** — 데이터 기반 기준과 폴리필 전달 경로를 구분해 말한다.
- ⚠️ **약한 신호** — 가능한 모든 브라우저를 지원한다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 구형 브라우저 사용자가 1% 면 어떤 결정을 제안하나?
     - 기대 답: 사업 영향(매출·역할)을 확인한 뒤 지원 종료 또는 축소 기능 제공. 1% 를 위해 나머지에 레거시 번들을 주지 않는다.
  2. 지원 종료를 어떻게 진행하나?
     - 기대 답: 사전 공지·안내 페이지·계측으로 잔존 확인 후 단계적 차단.
- 📖 **레퍼런스** — [web.dev Baseline](https://web.dev/baseline) · [browserslist](https://github.com/browserslist/browserslist)

#### [시니어] 기능 플래그를 어떻게 운영하나?

**핵심 답**

- 종류를 구분한다: 릴리스 토글(단기), 실험(A/B), 운영 킬스위치, 권한 플래그. 수명과 소유자가 다르다.
- 단기 토글에 제거 기한과 담당자를 붙이지 않으면 분기 조합이 폭발해 테스트 불가 상태가 된다.
- 플래그 상태를 관측(어느 사용자에게 켜졌는지)하지 않으면 장애 원인 추적이 불가능하다.
- 클라이언트 평가는 깜빡임(FOUC)과 지표 왜곡을 만든다. 첫 페인트 전에 값을 확정할 경로가 필요하다.

- ✅ **좋은 신호** — 종류별 수명 관리와 깜빡임 문제까지 다루고 정리 경험을 든다.
- ⚠️ **약한 신호** — 플래그를 많이 두면 안전하다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 실험 플래그가 CLS 를 악화시킨다면 어떻게 고치나?
     - 기대 답: 첫 페인트 전에 변형을 확정(서버·엣지에서 결정)하거나 공간을 미리 확보. 클라이언트 지연 적용이 원인.
  2. 플래그 조합이 많아 테스트가 불가능해지면?
     - 기대 답: 동시 활성 플래그 상한과 제거 기한을 정책으로 둔다. 조합 폭발은 관리 실패의 증상.
- 📖 **레퍼런스** — [Martin Fowler — Feature Toggles](https://martinfowler.com/articles/feature-toggles.html) · [web.dev CLS](https://web.dev/articles/cls)

### 접근성 (6)

#### [주니어] 버튼을 `div`로 만들면 무엇을 잃나?

**핵심 답**

- 키보드 포커스, Enter/Space 활성화, 스크린리더의 role·상태 전달, 비활성 처리.
- 대체하려면 `role="button"`, `tabindex="0"`, 키 핸들러, `aria-disabled`를 전부 직접 구현해야 한다.
- 네이티브 요소를 쓰는 것이 언제나 더 싸다.

- ✅ **좋은 신호** — 잃는 항목을 구체적으로 나열하고 네이티브 우선 원칙을 말한다.
- ⚠️ **약한 신호** — "클릭은 되니까 괜찮다"고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 링크와 버튼은 어떤 기준으로 나누나?
     - 기대 답: 이동은 링크(주소가 생긴다), 동작은 버튼. 새 탭·북마크가 의미 있으면 링크다.
  2. div 로 만든 버튼을 고칠 수 없다면 최소 무엇을 해야 하나?
     - 기대 답: role=button, tabindex=0, Enter/Space 처리, 비활성 상태 전달. 포커스 표시도 직접 준다.
- 📖 **레퍼런스** — [MDN ARIA 기법](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Techniques) · [ARIA APG 키보드 인터페이스](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)

#### [미들] 모달 접근성 체크리스트를 말해 보라.

**핵심 답**

- 열릴 때 포커스를 모달 안으로 이동, 내부에 포커스 트랩, 닫을 때 원래 트리거로 복귀.
- Esc로 닫기, `role="dialog"` + `aria-modal="true"` + `aria-labelledby`.
- 배경 스크롤 잠금, 배경 콘텐츠를 보조기기에서 감추기.
- 실제 스크린리더와 키보드만으로 검증.

- ✅ **좋은 신호** — 포커스 복귀와 배경 처리까지 포함하고 실제 검증 방법을 말한다.
- ⚠️ **약한 신호** — 오버레이 클릭으로 닫히는지만 확인한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 모달 안에 또 다른 팝업이 열리면 포커스는 어떻게 관리하나?
     - 기대 답: 스택으로 관리해 최상위만 트랩하고 닫힐 때 직전 레이어로 복귀한다.
  2. 모달을 여는 순간 스크린리더가 배경을 읽으면?
     - 기대 답: 배경에 aria-hidden 또는 inert 를 적용한다. aria-modal 만으로는 구현체마다 다르다.
- 📖 **레퍼런스** — [ARIA APG Dialog 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

#### [미들] ARIA를 쓰는 것이 오히려 나쁜 경우는?

**핵심 답**

- ARIA의 첫 규칙은 '가능하면 ARIA를 쓰지 마라'. 네이티브 시맨틱이 항상 우선.
- 잘못된 role은 접근성 트리를 덮어써 원래 의미를 파괴한다.
- `aria-label`과 보이는 텍스트가 어긋나면 음성 제어 사용자가 조작할 수 없다. 라벨 중복 낭독도 흔한 결함.
- `aria-hidden`을 포커스 가능한 요소에 걸면 키보드로는 닿지만 낭독되지 않는 상태가 된다.

- ✅ **좋은 신호** — 첫 규칙을 알고 잘못된 role의 부작용을 예로 든다.
- ⚠️ **약한 신호** — ARIA를 많이 붙이면 접근성이 좋아진다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 디자인 시스템에서 접근성 회귀를 어떻게 막나?
     - 기대 답: 컴포넌트 단위 접근성 테스트와 키보드 시나리오를 릴리스 게이트에 넣는다. 자동 검사는 일부만 잡는다.
  2. 자동 검사가 못 잡는 대표 결함은?
     - 기대 답: 포커스 순서·라벨 의미·상태 변화 알림(live region), 색만으로 정보 전달.
- 📖 **레퍼런스** — [MDN ARIA 기법](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Techniques) · [MDN ARIA Roles 참조](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles)

#### [주니어] 이미지의 `alt`는 언제 비우고 언제 채우나?

**핵심 답**

- 정보를 전달하는 이미지는 그 정보를 문장으로 쓴다. 파일명·"이미지" 같은 말은 쓰지 않는다.
- 순수 장식 이미지는 `alt=""`로 비워 보조기기가 건너뛰게 한다. 속성을 아예 빼면 파일명을 읽는다.
- 링크·버튼 안의 유일한 콘텐츠가 이미지면 `alt`가 그 컨트롤의 이름이 된다.
- 차트처럼 복잡한 이미지는 짧은 `alt` + 본문 설명·표로 보완한다.

- ✅ **좋은 신호** — 장식과 정보를 구분하고 빈 alt와 누락의 차이를 안다.
- ⚠️ **약한 신호** — 모든 이미지에 같은 규칙(넣거나 안 넣거나)을 적용한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 아이콘 버튼의 접근 가능한 이름은 어떻게 주나?
     - 기대 답: 시각적으로 숨긴 텍스트나 aria-label. 툴팁만 있으면 이름이 없다.
  2. 그 이름을 무엇으로 쓰는 게 좋나?
     - 기대 답: 동작을 그대로. "편집" 같은 동사. 아이콘 모양("연필")을 설명하지 않는다.
- 📖 **레퍼런스** — [MDN img alt](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#alt) · [MDN 시맨틱](https://developer.mozilla.org/en-US/docs/Glossary/Semantics)

#### [주니어] 시맨틱 HTML을 왜 쓰나?

**핵심 답**

- 보조기기가 구조(제목·목록·랜드마크)를 읽어 탐색할 수 있다. `div` 뿐이면 건너뛸 지점이 없다.
- 기본 동작을 공짜로 얻는다: 버튼의 키보드 활성화, 폼 라벨 연결, 링크의 새 탭 열기.
- 검색엔진·리더 모드·번역기 같은 기계 독자도 같은 구조를 쓴다.

- ✅ **좋은 신호** — 접근성과 기본 동작 두 축으로 설명하고 랜드마크 예를 든다.
- ⚠️ **약한 신호** — SEO에 좋다는 말만 한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 제목 레벨을 디자인 크기 때문에 건너뛰면 무엇이 문제인가?
     - 기대 답: 보조기기의 제목 탐색 구조가 깨진다. 레벨은 구조로 정하고 크기는 CSS 로 맞춘다.
  2. 한 페이지에 h1 이 여러 개면?
     - 기대 답: 섹셔닝 요소 안이면 허용되지만 실제 구현체 지원이 고르지 않다. 주제 제목 하나를 h1 으로 두는 편이 안전하다.
- 📖 **레퍼런스** — [MDN 시맨틱](https://developer.mozilla.org/en-US/docs/Glossary/Semantics)

#### [시니어] 접근성을 조직 차원에서 어떻게 정착시키나?

**핵심 답**

- 기준을 명시한다(WCAG 2.2 AA 등). '접근성 좋게'는 실행 가능한 요구가 아니다.
- 단계: 현황 감사 → 공용 컴포넌트부터 수정 → 신규 코드 게이트(자동 검사 + 키보드·스크린리더 체크리스트) → 정기 회귀.
- 자동 검사로는 일부만 잡힌다. 실제 보조기기 테스트와 담당자 교육이 필요하다.
- 법적 요구와 사용자 영향으로 우선순위를 정하고, 개선 지표를 공개한다.

- ✅ **좋은 신호** — 자동 검사의 한계를 알고 게이트·교육·측정을 함께 설계한다.
- ⚠️ **약한 신호** — 린트 플러그인 도입으로 끝낸다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 디자인 단계에서 접근성 문제를 미리 걸러내려면?
     - 기대 답: 대비·포커스 순서·라벨·오류 표현을 디자인 리뷰 체크리스트로. 컴포넌트에 접근성 규격을 문서화한다.
  2. 교육을 했는데도 회귀가 계속되면?
     - 기대 답: 게이트가 없기 때문이다. 자동 검사와 리뷰 기준을 강제 경로에 넣는다.
- 📖 **레퍼런스** — [W3C WAI 계획과 관리](https://www.w3.org/WAI/planning-and-managing/) · [WCAG 명도 대비](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)

### 아키텍처·협업 (17)

#### [시니어] 파괴적 변경을 여러 배포에 걸쳐 어떻게 나누나?

**핵심 답**

- Parallel Change(Expand → Migrate → Contract): 새 형태를 추가하고, 소비자를 옮기고, 마지막에 옛 형태를 제거한다.
- 무중단·블루그린 배포에서는 구·신 버전이 일시 공존하므로 이 순서가 선택이 아니라 필수다.
- 각 단계는 단독 롤백이 가능해야 한다. 양쪽 쓰기·읽기 플래그로 경계를 만든다.
- 정리(Contract) 단계에 담당자와 기한을 붙이지 않으면 영구 부채가 된다.

- ✅ **좋은 신호** — 공존 구간을 전제로 단계를 설계하고 롤백 단위를 말한다.
- ⚠️ **약한 신호** — 한 번에 바꾸고 배포 순서로 맞춘다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 소비자가 사내 다른 팀이면 Contract 단계를 어떻게 진행하나?
     - 기대 답: 사용 계측으로 남은 소비자를 확인하고 기한·대체 경로를 공지, 마지막에 제거. 사용량 0 을 근거로 삼는다.
  2. 기한이 지나도 남아 있으면?
     - 기대 답: 차단 대신 경고 후 단계적 제한. 제거 책임자와 재협상 기록을 남긴다.
- 📖 **레퍼런스** — [Martin Fowler — ParallelChange](https://martinfowler.com/bliki/ParallelChange.html)

#### [시니어] 컴포넌트 경계를 어디서 자르나?

**핵심 답**

- 같이 바뀌는 것끼리 묶고, 다른 이유로 바뀌는 것은 가른다(변경 이유 단위 응집).
- 분리 신호: props 폭발, 불리언 난립, 내부 분기 다수, 재사용마다 예외 추가.
- 상태 소유권을 먼저 정하고 그 경계에 컴포넌트를 맞춘다.
- 공용화는 세 번째 사례부터. 두 사례로 추상화하면 잘못된 추상이 남는다.

- ✅ **좋은 신호** — 판단 기준을 변경 이유와 상태 소유권으로 대고 되돌린 경험도 말한다.
- ⚠️ **약한 신호** — "재사용할 수 있게 작게 만든다"만 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 공용 컴포넌트가 앱마다 다르게 쓰여야 한다면?
     - 기대 답: 변형을 props 로 늘리기보다 합성(컴포지션)으로 열어 둔다. 불리언 난립은 분해 신호.
  2. 그래도 분기가 계속 늘면?
     - 기대 답: 공용화를 되돌리는 결정도 선택지다. 두 개의 구현이 하나의 잘못된 추상보다 낫다.
- 📖 **레퍼런스** — [react.dev 상태 관리·구조](https://react.dev/learn/managing-state)

#### [시니어] 프론트엔드 장애를 어떻게 관측하나?

**핵심 답**

- 에러 트래킹(소스맵·릴리스 태깅), 필드 성능(RUM), 사용자 흐름 이벤트, 그리고 배포 시점과 지표를 연결한 알림.
- 이벤트 이름·속성 규칙을 정해 두지 않으면 데이터가 남아도 질문에 답할 수 없다.
- 실패 경로에 로그를 먼저 심는다(요청 실패, 재시도, 빈 상태). 성공 경로만 계측하면 장애가 안 보인다.
- 페이지 이탈 시 전송은 `sendBeacon`으로.

- ✅ **좋은 신호** — 관측 항목을 답해야 할 질문에서 역산하고 명명 규칙을 언급한다.
- ⚠️ **약한 신호** — 에러 트래킹 도구 설치로 끝낸다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 사용자 제보만 있고 로그가 없는 장애는 어떻게 추적하나?
     - 기대 답: 재현 조건 수집 후 해당 경로에 계측을 먼저 심는다. 세션 리플레이·실패 경로 로그가 다음 발생을 잡게 한다.
  2. 관측을 늘릴 때 비용·프라이버시는 어떻게 다루나?
     - 기대 답: 샘플링과 필드 마스킹, 보존 기간 정책. 무엇을 수집하는지 문서화한다.
- 📖 **레퍼런스** — [MDN sendBeacon](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon) · [Sentry 소스맵](https://docs.sentry.io/platforms/javascript/sourcemaps/)

#### [시니어] 실시간 피드나 AI 채팅 화면을 설계한다면 무엇을 먼저 정하나?

**핵심 답**

- 전송 방식(SSE vs WebSocket)과 유실·재연결 보정 규칙.
- 스트리밍 토큰을 화면에 붙일 때 렌더 빈도 제어(프레임당 1회 배치), 긴 대화는 가상화.
- 중단·재생성·부분 실패 UX, 그리고 낙관적 사용자 메시지 표시와 서버 확정 사이의 재조정.
- 비용·레이트 리밋 처리, 재연결 시 스트림 재개 지점.

- ✅ **좋은 신호** — 스트리밍 렌더 비용과 유실 보정을 함께 말하고 취소 경로를 설계한다.
- ⚠️ **약한 신호** — 토큰을 받는 대로 setState한다고만 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 스트리밍 중 사용자가 탭을 떠났다면 어떻게 처리하나?
     - 기대 답: 백그라운드에서 계속 받을지 중단할지 정책을 정한다. 중단 시 서버 측 생성도 취소해 비용을 막는다.
  2. 토큰이 초당 수십 개 올 때 렌더를 어떻게 억제하나?
     - 기대 답: 프레임당 한 번 배치 렌더, 긴 대화는 가상화. 문자 단위 setState 는 INP 를 망친다.
  3. 재생성·중단 후 대화 이력 일관성은 어떻게 지키나?
     - 기대 답: 서버가 메시지 상태 기계를 소유하고 클라이언트는 그 스냅샷을 따른다.
- 📖 **레퍼런스** — [MDN Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) · [MDN EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) · [web.dev 긴 작업 쪼개기](https://web.dev/articles/optimize-long-tasks)

#### [시니어] 기술 부채 정리나 리팩터를 어떻게 설득했나?

**핵심 답**

- 수치로 말한다: 리드타임, 버그 재발률, 번들 크기, p75 지표, 온보딩 시간.
- 크게 한 번이 아니라 기능 작업에 얹어 작게 쪼갠 계획으로 제안한다.
- 리스크와 롤백 계획을 함께 제시하고, 끝난 뒤 같은 지표를 다시 측정해 보고한다.

- ✅ **좋은 신호** — 승인받은 실제 사례와 사후 측정을 말한다.
- ⚠️ **약한 신호** — 코드가 더럽다는 주관적 표현만 쓴다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 설득이 실패했을 때 어떻게 했나?
     - 기대 답: 결정과 근거를 기록하고, 기능 작업에 얹어 점진 개선. 재논의 조건(지표 악화 기준)을 남긴다.
  2. 그 기록이 나중에 실제로 쓰였나?
     - 기대 답: 지표가 예측대로 악화됐을 때 재승인 근거가 된다. 결과를 추적했는지가 신호.
- 📖 **레퍼런스** — [web.dev 성능 예산](https://web.dev/articles/performance-budgets-101)

#### [시니어] 코드 리뷰에서 무엇을 막고 무엇을 넘기나?

**핵심 답**

- 막는다: 정확성·보안·데이터 손실·공개 계약 변경·롤백 불가 설계.
- 자동화한다: 포맷·네이밍 규칙·린트 가능한 규칙은 사람이 지적하지 않는다.
- 제안은 근거와 비용을 함께. 취향 논쟁은 팀 규칙으로 승격시켜 끝낸다.
- 라운드를 뭉쳐 왕복을 줄이고, 차단 항목과 선택 항목을 라벨로 구분한다.

- ✅ **좋은 신호** — 차단 기준을 명시하고 자동화로 옮긴 경험을 든다.
- ⚠️ **약한 신호** — 모든 지적을 동일한 무게로 남긴다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 의견이 갈려 합의가 안 될 때 어떻게 끝내나?
     - 기대 답: 되돌릴 수 있는 결정이면 시도 후 측정, 되돌리기 어려우면 결정권자와 기준을 정해 종결하고 기록한다.
  2. 리뷰가 계속 길어지는 팀에는 무엇을 제안하나?
     - 기대 답: 차단 기준 명문화, 스타일 자동화, 라운드 묶기. 리뷰 지연 시간을 지표로 본다.
- 📖 **레퍼런스** — [Testing Library 원칙(리뷰 기준 예)](https://testing-library.com/docs/guiding-principles)

#### [공통] 최근 가장 어려웠던 버그와 원인을 확정한 과정을 말해 보라.

**핵심 답**

- 재현 확보 → 가설 하나씩 측정 → 범인 변경 지점 특정(bisect·로그 대조) → 근본 원인 수정 → 재발 방지 테스트.
- 증상 수정과 근본 수정을 구분해 말하는지가 핵심 신호.
- 막다른 길과 틀린 가설을 솔직히 말하는 것이 감점이 아니다.

- ✅ **좋은 신호** — 측정 근거(로그·프로파일·커밋)를 들고 왜 그 결론인지 설명한다.
- ⚠️ **약한 신호** — "결국 캐시 문제였다" 같은 결론만 말하고 확정 과정이 없다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 같은 종류의 버그가 다시 나지 않게 무엇을 바꿨나?
     - 기대 답: 재발 방지 테스트, 계측 추가, 그리고 구조 변경(타입·경계). 문서만 남기면 반복된다.
  2. 원인 확정을 어떻게 증명했나?
     - 기대 답: 해당 변경을 되돌리면 증상이 사라지는 A/B, 또는 로그·프로파일의 직접 증거.
- 📖 **레퍼런스** — [Chrome DevTools 성능 프로파일링](https://developer.chrome.com/docs/devtools/performance)

#### [공통] 기획·디자인과 의견이 충돌했을 때 어떻게 했나?

**핵심 답**

- 요구의 배경(무엇을 해결하려는지)을 먼저 확인한다.
- 대안을 비용과 함께 제시한다: 구현 기간, 성능·접근성 영향, 유지 비용.
- 결정 기준을 사용자 영향으로 옮기고, 결정과 근거를 문서에 남긴다.

- ✅ **좋은 신호** — 관철 여부와 무관하게 판단 기준과 기록을 말한다.
- ⚠️ **약한 신호** — 기술적으로 불가능하다고 답해 끝냈다고 말한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 결정이 나중에 틀렸다고 판명되면 어떻게 되돌렸나?
     - 기대 답: 되돌린 경로와 근거를 기록하고 영향 범위를 공지. 비난 없이 판단 기준을 갱신한다.
  2. 그 과정에서 사용자 피해는 어떻게 줄였나?
     - 기대 답: 플래그·단계 배포로 노출을 제한하고 복구를 먼저 했는지가 신호.
- 📖 **레퍼런스** — [Martin Fowler — ParallelChange](https://martinfowler.com/bliki/ParallelChange.html)

#### [공통] 추정이 크게 틀린 경험이 있나?

**핵심 답**

- 불확실성을 분해했는지: 모르는 부분은 스파이크로 먼저 줄인다.
- 중간 보고 지점을 두어 틀린 추정을 빨리 드러낸다.
- 마감이 고정이면 범위를 협상한다. 품질을 조용히 깎는 선택은 나중에 더 비싸다.

- ✅ **좋은 신호** — 틀린 원인을 구조적으로 설명하고 이후 방식이 바뀐 점을 든다.
- ⚠️ **약한 신호** — 운이 나빴다거나 요구가 자주 바뀌었다는 설명에서 멈춘다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 지금 같은 일을 다시 추정하면 무엇을 다르게 하나?
     - 기대 답: 불확실 구간을 스파이크로 먼저 줄이고 범위를 쪼갠다. 버퍼가 아니라 범위 협상으로 다룬다.
  2. 중간 보고 지점은 어떻게 정하나?
     - 기대 답: 가장 위험한 가정이 검증되는 시점. 일정 절반 같은 형식적 지점이 아니다.
- 📖 **레퍼런스** — [Practical Test Pyramid(리스크 기반 판단 예)](https://martinfowler.com/articles/practical-test-pyramid.html)

#### [시니어] CSR·SSR·SSG·ISR·스트리밍 중 무엇을 어떤 근거로 고르나?

**핵심 답**

- 콘텐츠 성질로 먼저 가른다: 공개·정적이면 사전 렌더(SSG/ISR), 사용자별·실시간이면 서버 렌더 또는 클라이언트 페치.
- SEO·첫 화면 지표(LCP)가 중요하면 서버에서 HTML을 주고, 상호작용이 지배하면 클라이언트 중심이 단순하다.
- 스트리밍은 느린 데이터 구간만 늦게 채워 첫 바이트를 살린다. 대신 캐시·에러 경계가 복잡해진다.
- 운영 비용(서버·캐시 무효화·관측)을 함께 계산해야 한다.

- ✅ **좋은 신호** — 화면 단위로 전략을 섞고 각 선택의 운영 비용을 말한다.
- ⚠️ **약한 신호** — 프레임워크 기본값을 그대로 쓴 이유를 설명하지 못한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 같은 앱에서 전략이 화면마다 다르면 캐시 정책은 어떻게 통일하나?
     - 기대 답: 자원 종류별 규칙(HTML·데이터·정적 자산)을 한 표로 정하고 라우트별 예외만 문서화. 무효화 트리거를 배포 파이프라인에 연결한다.
  2. 스트리밍을 CDN 캐시와 함께 쓸 수 있나?
     - 기대 답: 개인화 구간이 있으면 캐시 단위를 셸로 제한한다. 전체 응답 캐시는 불가.
- 📖 **레퍼런스** — [web.dev 렌더링 전략 비교](https://web.dev/articles/rendering-on-the-web)

#### [시니어] 마이크로 프론트엔드를 도입할지 어떻게 판단하나?

**핵심 답**

- 조직 문제(팀별 독립 배포·다른 릴리스 주기)가 있을 때만 값어치가 있다. 코드 재사용을 위한 선택이 아니다.
- 대가: 중복 의존성으로 커지는 번들, 런타임 통합 복잡도, 디자인·인증·라우팅 일관성 유지 비용, 관측 분산.
- 경계는 도메인 단위로 자르고 공유 계약(인증 토큰·이벤트·디자인 토큰)을 명시한다.
- 단일 팀이면 모노레포 + 모듈 경계 규칙이 대개 더 낫다.

- ✅ **좋은 신호** — 조직 조건을 전제로 제시하고 도입하지 않을 근거까지 말한다.
- ⚠️ **약한 신호** — 확장성 있어 보인다는 이유로 도입한다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 두 마이크로 프론트엔드가 같은 라이브러리의 다른 버전을 쓰면?
     - 기대 답: 중복 로드로 번들이 커지고 싱글턴(스타일·상태·라우터)이 충돌한다. 공유 의존성 계약과 버전 정책이 필요하다.
  2. 그 계약을 강제할 수단은?
     - 기대 답: 런타임 공유 설정과 CI 버전 검사. 합의만으로는 유지되지 않는다.
- 📖 **레퍼런스** — [Martin Fowler — Micro Frontends](https://martinfowler.com/articles/micro-frontends.html) · [Nx 모듈 경계](https://nx.dev/features/enforce-module-boundaries)

#### [시니어] 레거시 화면을 점진적으로 교체하는 전략을 말해 보라.

**핵심 답**

- Strangler Fig: 새 구현을 옆에 세우고 라우트·기능 단위로 트래픽을 옮긴 뒤 옛 코드를 제거한다.
- 경계에 어댑터를 두어 양쪽이 같은 데이터·인증을 쓰게 하고, 되돌릴 수 있는 단위로 나눈다.
- 신규 코드는 새 규칙만 따르게 하고(그린필드 룰), 기계적 변환은 코드모드로 처리한다.
- 전환 지표(트래픽 비율·에러율·성능)를 정해 두지 않으면 두 시스템이 영구 공존한다.

- ✅ **좋은 신호** — 전환 지표와 제거 시점을 함께 설계하고 실제 이관 경험을 든다.
- ⚠️ **약한 신호** — 전면 재작성을 기본 계획으로 제시한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 이관 중 두 화면의 동작이 달라 사용자 혼란이 생기면?
     - 기대 답: 차이를 목록화해 의도된 변경과 결함을 구분하고, 의도된 변경은 공지·안내. 결함은 이관 중단 기준으로 둔다.
  2. 옛 화면으로 되돌릴 수 있게 유지하는 비용은 어떻게 정당화하나?
     - 기대 답: 롤백 경로가 곧 이관 속도를 올린다. 제거 시점을 미리 못 박아 영구 이중 유지비를 막는다.
- 📖 **레퍼런스** — [Martin Fowler — Strangler Fig](https://martinfowler.com/bliki/StranglerFigApplication.html) · [Martin Fowler — ParallelChange](https://martinfowler.com/bliki/ParallelChange.html)

#### [시니어] 기술 결정을 어떻게 기록하고 되돌리나?

**핵심 답**

- ADR(결정 기록): 맥락, 고려한 대안, 결정, 결과를 짧게 남긴다. 코드 리뷰가 아니라 결정의 근거가 남는 것이 핵심.
- 검토 시점(예: 6개월 후 이 가정이 유효한가)과 폐기 조건을 함께 적는다.
- 되돌릴 때는 새 ADR로 이전 것을 superseded 처리한다. 기록을 지우지 않는다.
- 코드에는 결정 경로를 가리키는 최소한의 breadcrumb만 남긴다.

- ✅ **좋은 신호** — 폐기 조건까지 적는다고 말하고 실제로 뒤집은 결정 사례를 든다.
- ⚠️ **약한 신호** — 문서화는 위키에 다 적는다고만 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 기록이 없는 과거 결정의 이유를 어떻게 복원하나?
     - 기대 답: 커밋·PR·이슈 추적으로 맥락을 재구성하고 관련자 인터뷰. 복원한 내용을 새 ADR 로 남긴다.
  2. 복원에 실패하면 어떻게 진행하나?
     - 기대 답: 현재 요건 기준으로 재결정하고 위험을 명시. 알 수 없는 제약이 있을 수 있어 단계적으로 바꾼다.
- 📖 **레퍼런스** — [Architecture Decision Records](https://adr.github.io/)

#### [시니어] 디자인 시스템을 여러 앱에 운영할 때 무엇이 어려운가?

**핵심 답**

- 파괴적 변경 전파: 버전 고정 + 마이그레이션 가이드 + 코드모드, 그리고 Parallel Change로 구·신 공존 구간을 만든다.
- 토큰 계층(원시→의미→컴포넌트)을 정하고 앱이 원시 값을 직접 쓰지 못하게 막는다.
- 채택률·이탈(로컬 오버라이드) 계측이 없으면 시스템이 실제로 쓰이는지 알 수 없다.
- 접근성 회귀는 컴포넌트 단위 테스트와 릴리스 게이트로 막는다.

- ✅ **좋은 신호** — 전파 전략과 채택 계측을 함께 말하고 조직 합의 절차를 든다.
- ⚠️ **약한 신호** — 컴포넌트 목록을 늘리는 것을 성과로 제시한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 특정 앱이 계속 오버라이드로 우회한다면 어떻게 하나?
     - 기대 답: 오버라이드 내용을 수집해 시스템에 흡수할지 판단한다. 반복 우회는 시스템의 요구 누락 신호.
  2. 파괴적 변경을 여러 앱에 어떻게 전파하나?
     - 기대 답: 메이저 버전 + 마이그레이션 가이드 + 코드모드, 구·신 공존 기간. 앱별 채택 현황을 계측한다.
- 📖 **레퍼런스** — [Design Tokens 포맷(W3C CG)](https://tr.designtokens.org/format/) · [MDN 커스텀 프로퍼티](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

#### [시니어] 프론트엔드 i18n을 어떻게 설계하나?

**핵심 답**

- 문자열 연결로 문장을 만들지 않는다. 복수형·성별·어순은 언어마다 달라 ICU 메시지 형식과 `Intl` API로 처리한다.
- 키 규칙과 소스 언어를 단일 출처로 두고, 번역 누락은 빌드·CI에서 잡는다(폴백은 있지만 조용히 넘기지 않는다).
- 번역 번들은 언어별 코드 분할로 로드하고, 날짜·숫자·통화는 `Intl`에 맡긴다.
- RTL은 논리 속성(`margin-inline-start`)과 아이콘 반전 규칙으로 대응한다.

- ✅ **좋은 신호** — 복수형·어순 문제를 예로 들고 누락 검출을 CI에 넣은 경험을 말한다.
- ⚠️ **약한 신호** — 문자열 치환만으로 충분하다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 같은 문구가 화면마다 다른 번역이 필요하면 키를 어떻게 설계하나?
     - 기대 답: 맥락을 키에 포함(화면·역할 단위)하고 번역자에게 설명 주석을 준다. 문구 텍스트 자체를 키로 쓰면 충돌한다.
  2. 번역 누락을 배포 전에 어떻게 막나?
     - 기대 답: CI 에서 키 대조·빈 값 검출. 폴백은 두되 조용히 넘기지 않고 리포트.
  3. RTL 전환에서 자주 깨지는 것은?
     - 기대 답: 방향 고정 여백·아이콘·차트 축. 논리 속성으로 바꾸고 RTL 스냅샷을 본다.
- 📖 **레퍼런스** — [MDN Intl.PluralRules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules)

#### [시니어] 장애가 났을 때 롤백 판단과 사후 분석을 어떻게 하나?

**핵심 답**

- 먼저 영향 범위·복구 우선. 원인 파악보다 사용자 복구가 앞선다(롤백 또는 플래그 차단).
- 롤백 가능한 단위로 배포를 설계해 두었는지가 이 순간에 드러난다. 데이터 스키마가 앞서 나갔으면 못 되돌린다.
- 사후 분석은 비난 없이, 타임라인·감지 시점·복구 시점·재발 방지 항목(담당자·기한)으로 남긴다.
- 감지가 사용자 제보였다면 관측 항목을 늘리는 것이 첫 액션.

- ✅ **좋은 신호** — 복구 우선 원칙과 롤백 가능 설계를 연결하고 실제 타임라인을 말한다.
- ⚠️ **약한 신호** — 원인부터 찾겠다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 배포 직후 지표 악화를 자동으로 감지하려면?
     - 기대 답: 배포 버전별 에러율·핵심 전환 지표 비교와 임계 알림. 카나리 단계에서 비교하는 것이 가장 싸다.
  2. 자동 롤백 조건을 어떻게 정하나?
     - 기대 답: 되돌려도 안전한 변경에만 적용하고 임계·관측 창을 명시. 데이터 마이그레이션이 얽히면 수동 판단.
- 📖 **레퍼런스** — [Google SRE — 사후 분석 문화](https://sre.google/sre-book/postmortem-culture/) · [Martin Fowler — Feature Toggles](https://martinfowler.com/articles/feature-toggles.html)

#### [시니어] 팀 규모가 커질 때 코드 소유권과 온보딩을 어떻게 설계하나?

**핵심 답**

- 소유권을 경로 단위로 명시(CODEOWNERS)해 리뷰 책임이 흐려지지 않게 한다.
- 지식이 한 사람에게 고이면 병목이다. 페어·순환 리뷰·문서화된 결정(ADR)으로 분산한다.
- 온보딩 지표는 '첫 배포까지 걸린 시간'. 환경 구축 자동화와 대표 작업 목록으로 줄인다.
- 규칙은 사람이 아니라 도구로 강제한다(린트·경계 규칙·CI 게이트).

- ✅ **좋은 신호** — 측정 가능한 온보딩 지표를 대고 병목 분산 방법을 말한다.
- ⚠️ **약한 신호** — 문서를 더 쓰자는 답으로 끝낸다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 소유자가 없는 공용 코드는 어떻게 관리하나?
     - 기대 답: 임시라도 소유 팀을 지정하고 변경 규칙(리뷰 2인·테스트 필수)을 둔다. 무소유는 곧 방치다.
  2. 온보딩 첫 배포까지 시간을 줄이려면 무엇부터 고치나?
     - 기대 답: 환경 구축 자동화와 대표 작업 목록. 문서보다 실행 가능한 스크립트가 효과가 크다.
- 📖 **레퍼런스** — [GitHub CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) · [Architecture Decision Records](https://adr.github.io/)

## 출처

**이 문항집은 출제 이력 기록이 아니다.** 공개된 면접 질문 정리글에서 반복해 등장하는 주제를 교차 확인해 문항을 골랐고, 문항 문장과 답·판별 기준은 직접 썼다. 어느 회사가 어떤 표현으로 출제했는지는 대조하지 않았다.

아래 링크는 **주제 선정에 참고한 글**이다. 그중 면접 회고 글만 작성자 본인이 받은 질문이라고 밝힌 1차 자료이고, 나머지는 큐레이션 글이다. 각 문항에 달린 **레퍼런스**는 성격이 다르다 — 답 내용이 공식 문서와 맞는지 검증한 링크이며 출제 근거가 아니다 (MDN · web.dev · react.dev · TypeScript 핸드북 · OWASP · W3C ARIA APG/WCAG · TanStack Query · Testing Library · Playwright · webpack · Node.js · Nx · Martin Fowler · Sentry).

- [Frontend Developer Interview Questions in 2026 — OnlyFrontendJobs](https://www.onlyfrontendjobs.com/blog/frontend-developer-interview-questions-2026)
- [Frontend Developer Interview Questions 2026 — KORE1](https://www.kore1.com/frontend-developer-interview-questions/)
- [Deep JavaScript Interview Guide for 2025–2026 — Code With Seb](https://www.codewithseb.com/blog/deep-javascript-interview-guide-for-2025%E2%80%932026)
- [30 Senior Frontend Engineer Interview Questions for 2026 — Verve AI](https://www.vervecopilot.com/blog/senior-frontend-engineer-interview-questions)
- [카카오 출신 개발자가 정리한 프론트엔드 기술 면접 질문 TOP 20 — zero-base](https://zero-base.co.kr/event/media_insight_contents_FE_frontend_tech_Interview)
- [프론트엔드 기술 면접 질문 (한국어 모음집)](https://frontend-interview-question.vercel.app/)
- [3년차 프론트엔드 면접 질문 회고 (velog) — 본인이 받은 질문이라 밝힌 1차 자료](https://velog.io/@qnrjs42/23.10-24.01-3%EB%85%84%EC%B0%A8-%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%EB%A9%B4%EC%A0%91-%EB%95%8C-%EB%B0%9B%EC%95%98%EB%8D%98-%EC%A7%88%EB%AC%B8%EA%B3%BC-%EB%8A%90%EB%82%80-%EC%A0%90-react)
- [프론트엔드 기술 면접 질문 리스트 (velog)](https://velog.io/@doheek2/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%EA%B8%B0%EC%88%A0-%EB%A9%B4%EC%A0%91-%EC%A7%88%EB%AC%B8-%EB%A6%AC%EC%8A%A4%ED%8A%B8)
- [프론트엔드 기술 면접 질문 정리 — hyunwoo.dev](https://www.chahyunwoo.dev/blog/frontend-technical-interview)
- [프론트엔드 면접 질문 리스트 (Browser) — dev and dev](https://joontae-kim.github.io/2020/10/26/interview-question-fe/)
- [How the Core Web Vitals metrics thresholds were defined — web.dev](https://web.dev/articles/defining-core-web-vitals-thresholds)

## 라이선스

문서·문항: CC BY 4.0. 레퍼런스로 링크한 외부 문서는 각 저작자의 라이선스를 따른다.
