# 프론트엔드 면접 문항집

> **TL;DR** — 주니어·미들·시니어 프론트엔드 면접 문항 76개. 문항마다 핵심 답, 면접관이 볼 좋은/약한 신호, 후속 질문, 그리고 답을 검증할 공식 문서 레퍼런스가 붙어 있다.
> 필터·검색·셀프 퀴즈가 되는 웹 페이지: **https://david-myeonghan.github.io/frontend-interview-kit/**

- 문항 76개 · 영역 13개
- 레벨 분포: 주니어 12 / 미들 40 / 시니어 21 / 공통 3
- 레퍼런스 링크 111개 (전부 HTTP 200 확인)

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

### JS 코어 (9)

#### [주니어] 클로저가 무엇이고 실무에서 어디에 쓰나?

**핵심 답**

- 함수가 선언된 렉시컬 스코프의 변수를 계속 참조하는 것. 호출이 끝나도 그 변수는 살아 있다.
- 디바운스·스로틀의 타이머 보관, once 플래그, 모듈 내부 상태 은닉, 커스텀 훅의 내부 값.
- 루프에서 `var`로 캡처하면 마지막 값 하나만 남고 `let`은 반복마다 새 바인딩을 만든다.

- ✅ **좋은 신호** — 디바운스나 이벤트 핸들러 같은 자기 코드로 설명하고, 변수 수명이 늘어난다는 점을 짚는다.
- ⚠️ **약한 신호** — "함수 안의 함수"라고만 말하고 스코프·수명 이야기가 없다.
- ↪️ **후속 질문** — 클로저 때문에 메모리가 안 풀리는 상황을 만들어 보라.
- 📖 **레퍼런스** — [MDN Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)

#### [주니어] `==`와 `===`의 차이, `==`를 써도 되는 경우가 있나?

**핵심 답**

- `==`는 양쪽 타입을 강제 변환한 뒤 비교한다. `'' == 0`, `'0' == 0`이 모두 true.
- `null == undefined`만 true이고 다른 값과는 false여서, `x == null`은 둘을 한 번에 검사하는 관용구로 통한다.
- 그 외에는 `===`로 고정하고 필요한 변환은 명시적으로 한다.

- ✅ **좋은 신호** — 변환 규칙의 예측 불가능성을 예시로 들고 `x == null` 예외를 이유와 함께 안다.
- ⚠️ **약한 신호** — "타입까지 비교한다"로 끝. 어떤 변환이 일어나는지 예를 못 든다.
- ↪️ **후속 질문** — `NaN`은 어떻게 비교하나?
- 📖 **레퍼런스** — [MDN Equality comparisons](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness)

#### [주니어] `var`, `let`, `const`를 호이스팅과 TDZ로 설명해 보라.

**핵심 답**

- `var`는 함수 스코프이고 선언이 끌어올려져 `undefined`로 초기화된다.
- `let/const`는 블록 스코프이며 선언 전 구간이 TDZ라 접근하면 `ReferenceError`.
- `const`는 바인딩 재할당만 막는다. 객체 내부 값은 바뀐다.

- ✅ **좋은 신호** — TDZ에서 에러가 나는 이유를 말하고 `const` 객체 변경 가능성을 구분한다.
- ⚠️ **약한 신호** — `const`를 불변(immutable)과 같은 것으로 설명한다.
- ↪️ **후속 질문** — 함수 선언과 함수 표현식의 호이스팅 차이는?
- 📖 **레퍼런스** — [MDN let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)

#### [미들] `setTimeout(fn,0)`, `Promise.resolve().then(fn)`, `queueMicrotask(fn)`의 실행 순서와 이유는?

**핵심 답**

- 콜 스택이 비면 마이크로태스크 큐를 **전부** 비우고, 그다음 렌더 기회, 그다음 매크로태스크 하나를 처리한다.
- 따라서 then과 queueMicrotask가 등록 순서대로 먼저, setTimeout이 마지막.
- `await` 뒤 코드도 마이크로태스크다. 마이크로태스크가 자기를 계속 생성하면 렌더가 굶어 화면이 멈춘다.

- ✅ **좋은 신호** — 순서를 맞히고 큐 구조로 설명하며, 마이크로태스크 기아 같은 실제 증상까지 연결한다.
- ⚠️ **약한 신호** — "비동기는 나중에 실행된다" 수준. 두 큐의 우선순위를 모른다.
- ↪️ **후속 질문** — `requestAnimationFrame`은 이 순서의 어디에 들어가나?
- 📖 **레퍼런스** — [MDN Execution model (event loop)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)

#### [미들] `this`는 어떻게 결정되나? 콜백으로 넘기면 왜 깨지나?

**핵심 답**

- 호출 형태가 결정한다: 일반 호출(undefined/전역), 메서드 호출(점 앞 객체), `new`(새 인스턴스), `call/apply/bind`(명시).
- 화살표 함수는 호출과 무관하게 정의 시점의 `this`를 가져온다.
- 메서드를 참조만 떼어 콜백으로 넘기면 점 앞 객체가 사라져 바인딩이 유실된다 → `bind` 또는 클래스 필드 화살표.

- ✅ **좋은 신호** — 네 규칙을 우선순위로 정리하고, 화살표를 쓰면 안 되는 경우(프로토타입 메서드, `currentTarget` 접근)도 안다.
- ⚠️ **약한 신호** — "화살표 쓰면 해결"로 끝내고 왜 그런지 설명하지 못한다.
- ↪️ **후속 질문** — 클래스 필드 화살표와 생성자 bind의 차이(인스턴스별 함수 생성)는?
- 📖 **레퍼런스** — [MDN this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

#### [미들] 얕은 복사와 깊은 복사, 실무에서는 무엇을 쓰나?

**핵심 답**

- spread와 `Object.assign`은 1단만 복사한다. 중첩 객체는 참조 공유.
- 깊은 복사는 `structuredClone`이 표준(함수·DOM 노드·클래스 인스턴스는 불가). `JSON.parse(JSON.stringify())`는 `Date`·`undefined`·`NaN`·순환 참조에서 손실이 난다.
- 상태 관리에서는 전체 복사보다 바뀐 경로만 새 객체로 만드는 불변 갱신이 기본. 참조 비교로 리렌더를 가를 수 있다.

- ✅ **좋은 신호** — 복사 방식별 손실을 구체적으로 알고, 불변 갱신이 렌더 최적화와 이어진다는 점까지 말한다.
- ⚠️ **약한 신호** — 항상 JSON 왕복으로 깊은 복사한다고 답하고 손실 사례를 모른다.
- ↪️ **후속 질문** — 거대한 상태를 매번 복사하면 생기는 비용은 어떻게 줄이나?
- 📖 **레퍼런스** — [MDN structuredClone](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone) · [MDN Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

#### [미들] `Promise.all / allSettled / race / any`를 각각 언제 쓰나?

**핵심 답**

- `all`: 전부 성공해야 의미 있을 때. 하나가 reject되면 즉시 실패하지만 나머지 요청이 취소되지는 않는다.
- `allSettled`: 부분 실패를 허용하는 화면(대시보드 위젯 여러 개).
- `race`: 타임아웃 경쟁. `any`: 첫 성공만 필요할 때(미러 서버).
- 취소는 Promise가 아니라 `AbortController`의 책임이다.

- ✅ **좋은 신호** — 부분 실패 UX를 기준으로 골라내고, reject 후 남은 요청 처리와 취소 수단을 구분한다.
- ⚠️ **약한 신호** — 이름별 동작만 암기해 말하고 어떤 화면에 쓸지 예를 못 든다.
- ↪️ **후속 질문** — 요청 3개 중 2개가 실패한 화면을 어떻게 보여줄 건가?
- 📖 **레퍼런스** — [MDN Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) · [MDN Promise.allSettled](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) · [MDN AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)

#### [미들] async 함수의 에러가 조용히 사라지는 경우를 아는가?

**핵심 답**

- `await` 없이 호출하면 거부가 처리되지 않고 unhandled rejection으로 흐른다.
- `forEach`에 async 콜백을 넣으면 반환된 Promise가 버려진다 → `for...of` 또는 `Promise.all(map())`.
- `setTimeout` 콜백 내부 throw는 바깥 try/catch가 못 잡는다.
- 전역 `unhandledrejection`·`error` 핸들러로 수집해 에러 트래킹에 보낸다.

- ✅ **좋은 신호** — 직접 겪은 누락 사례를 들고 전역 핸들러·로깅까지 연결한다.
- ⚠️ **약한 신호** — try/catch만 있으면 된다고 답한다.
- ↪️ **후속 질문** — 이벤트 핸들러 안에서 실패한 요청을 사용자에게 어떻게 알리나?
- 📖 **레퍼런스** — [MDN unhandledrejection](https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event) · [MDN Array.forEach 주의](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)

#### [시니어] `WeakMap`이나 `WeakRef`를 실제로 써야 했던 상황이 있나?

**핵심 답**

- 객체를 키로 부가 정보를 붙이되 그 객체의 수명을 늘리고 싶지 않을 때(DOM 노드별 메타데이터, 인스턴스별 캐시).
- 강한 참조 Map에 DOM을 담으면 노드가 제거돼도 회수되지 않는다(detached DOM 누수).
- `WeakRef`/`FinalizationRegistry`는 회수 시점을 보장하지 않으므로 정리 로직의 유일한 수단으로 쓰면 안 된다.

- ✅ **좋은 신호** — 누수 관측 경험과 함께 말하고 파이널라이저의 비결정성을 스스로 경고한다.
- ⚠️ **약한 신호** — "가비지 컬렉션되는 Map"이라는 정의만 말한다.
- ↪️ **후속 질문** — detached DOM 누수를 DevTools에서 어떻게 확인했나?
- 📖 **레퍼런스** — [MDN WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) · [Chrome DevTools 메모리 문제](https://developer.chrome.com/docs/devtools/memory-problems)

### 브라우저·렌더링 (6)

#### [미들] 브라우저가 HTML을 받아 화면을 그리기까지의 단계를 설명하라.

**핵심 답**

- 파싱으로 DOM, CSS로 CSSOM → 스타일 계산 → 레이아웃 → 페인트 → 컴포지트.
- `<script>`는 파서를 멈춘다. `defer`는 문서 파싱 후 순서대로, `async`는 받는 즉시 순서 없이 실행.
- CSS는 렌더 블로킹이라 위치·용량이 첫 페인트를 좌우한다. 웹폰트는 텍스트 표시 시점을 미룬다.

- ✅ **좋은 신호** — 단계를 순서대로 말하고 각 단계의 병목을 짚는다.
- ⚠️ **약한 신호** — 단계 이름만 외워 나열하고 스크립트·CSS의 블로킹을 모른다.
- ↪️ **후속 질문** — 첫 화면을 빠르게 하려면 이 파이프라인의 어디를 건드리겠나?
- 📖 **레퍼런스** — [MDN Critical rendering path](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path) · [MDN script defer/async](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script)

#### [미들] reflow와 repaint의 차이, 무엇이 더 비싸고 무엇이 유발하나?

**핵심 답**

- 레이아웃(reflow)은 크기·위치 재계산이라 가장 비싸다. 페인트는 픽셀 채우기, 컴포지트는 레이어 합성.
- `width/top/font-size`는 레이아웃, `color/background`는 페인트, `transform/opacity`는 컴포지트만 건드린다.
- 레이아웃 값을 읽고(`offsetHeight`) 바로 쓰는 것을 반복하면 프레임마다 강제 동기 레이아웃이 발생한다(layout thrashing) → 읽기와 쓰기를 분리한다.

- ✅ **좋은 신호** — 애니메이션을 transform/opacity로 옮긴 경험, thrashing을 프로파일러로 확인한 경험을 말한다.
- ⚠️ **약한 신호** — 두 용어의 사전적 정의만 말하고 어떤 속성이 무엇을 유발하는지 모른다.
- ↪️ **후속 질문** — `will-change`를 남용하면 어떤 대가가 있나?
- 📖 **레퍼런스** — [web.dev 렌더링 성능](https://web.dev/articles/rendering-performance) · [web.dev layout thrashing](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing)

#### [주니어] 이벤트 버블링·캡처링과 이벤트 위임을 설명하라.

**핵심 답**

- 캡처(위→아래) → 타깃 → 버블(아래→위) 3단계. `addEventListener`의 세 번째 인자로 캡처 단계에 등록.
- 위임은 상위 노드 하나에서 `event.target`으로 판별하는 방식. 동적으로 늘어나는 목록에 유리하고 리스너 수를 줄인다.
- `stopPropagation`은 외부 클릭 닫기·분석 수집 같은 다른 기능을 조용히 깨뜨린다. 스크롤·터치 리스너는 `passive:true`.

- ✅ **좋은 신호** — 위임의 이점을 리스너 수·동적 노드로 설명하고 stopPropagation의 부작용을 안다.
- ⚠️ **약한 신호** — 버블링 방향만 말하고 위임을 코드로 설명하지 못한다.
- ↪️ **후속 질문** — `target`과 `currentTarget`이 다른 경우는?
- 📖 **레퍼런스** — [MDN 이벤트 버블링과 캡처](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling)

#### [미들] 프론트엔드 메모리 누수의 흔한 원인 네 가지와 확인 방법은?

**핵심 답**

- 해제하지 않은 이벤트 리스너·타이머·구독(SPA 라우팅 전환 시 특히).
- 무한히 커지는 전역 캐시·배열.
- 큰 객체나 DOM 노드를 붙잡은 클로저 → detached DOM.
- 확인은 DevTools Memory의 힙 스냅샷 2회 비교(동작 전/후), Detached 노드 검색, 성능 탭의 JS heap 우상향 추세.

- ✅ **좋은 신호** — 측정 절차를 먼저 말하고 원인을 추정이 아닌 스냅샷으로 좁혀 본 경험이 있다.
- ⚠️ **약한 신호** — "클로저 때문"이라고만 하고 확인 방법이 없다.
- ↪️ **후속 질문** — 장시간 켜 두는 앱에서 누수를 회귀 없이 감시할 방법은?
- 📖 **레퍼런스** — [Chrome DevTools 메모리 문제 진단](https://developer.chrome.com/docs/devtools/memory-problems)

#### [미들] `requestAnimationFrame`과 `setTimeout`의 차이는?

**핵심 답**

- rAF는 다음 프레임 직전에 호출돼 화면 주기와 동기화된다. 배경 탭에서는 멈춘다.
- setTimeout은 최소 지연·타이머 드리프트가 있고 프레임과 어긋나 끊김을 만든다.
- 프레임 예산은 60fps에서 약 16ms. 긴 작업은 쪼개 프레임을 넘기지 않게 한다.

- ✅ **좋은 신호** — 프레임 예산 수치를 알고 애니메이션과 폴링을 구분해 도구를 고른다.
- ⚠️ **약한 신호** — 둘 다 비동기 타이머라고만 답한다.
- ↪️ **후속 질문** — 120Hz 화면에서는 무엇이 달라지나?
- 📖 **레퍼런스** — [MDN requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)

#### [시니어] 메인 스레드를 막는 무거운 연산을 어떻게 옮기나?

**핵심 답**

- Web Worker로 이전. 구조화 복제 비용이 있으므로 큰 버퍼는 transferable(`ArrayBuffer`)로 넘긴다.
- 계산 자체가 무거우면 WebAssembly, GPU 활용 가능한 작업은 WebGL/WebGPU.
- 옮길 수 없으면 청크로 쪼개고 `scheduler.yield`로 입력에 양보해 INP를 지킨다. 50ms 넘는 작업은 Long Task로 계측된다.

- ✅ **좋은 신호** — 복제 비용과 워커 경계 설계(메시지 프로토콜·취소)를 함께 말한다.
- ⚠️ **약한 신호** — "워커 쓰면 된다"로 끝나고 데이터 전달 비용을 고려하지 않는다.
- ↪️ **후속 질문** — 워커 도입 후 오히려 느려졌다면 어디를 보겠나?
- 📖 **레퍼런스** — [MDN Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) · [web.dev 긴 작업 쪼개기](https://web.dev/articles/optimize-long-tasks) · [MDN scheduler.yield](https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/yield)

### CSS·레이아웃 (6)

#### [주니어] 박스 모델과 `box-sizing`을 설명하라.

**핵심 답**

- 기본 `content-box`는 width가 콘텐츠만 의미해 padding·border가 더해진다.
- `border-box`로 리셋하면 지정한 width가 최종 너비가 되어 레이아웃 계산이 예측 가능해진다.
- 수직 마진은 인접 요소 간 병합된다(margin collapse). flex·grid 컨테이너 안에서는 병합되지 않는다.

- ✅ **좋은 신호** — border-box 리셋 이유를 계산 예측성으로 설명하고 마진 병합까지 안다.
- ⚠️ **약한 신호** — 용어만 말하고 왜 리셋하는지 모른다.
- ↪️ **후속 질문** — 마진 병합을 막는 방법 두 가지는?
- 📖 **레퍼런스** — [MDN box-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing) · [MDN 마진 병합](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_model/Mastering_margin_collapsing)

#### [미들] `z-index`를 올렸는데 요소가 위로 안 올라온다. 무엇을 보나?

**핵심 답**

- 쌓임 맥락(stacking context)을 먼저 본다. `position`+z-index, `transform`, `opacity<1`, `filter`, `will-change`, `contain` 등이 새 맥락을 만든다.
- 자식은 부모 맥락을 벗어날 수 없다. 부모가 낮으면 자식 z-index 9999도 무의미.
- 해결은 DOM 위치를 바꾸거나 포털로 최상위에 렌더, 그리고 레이어 값을 토큰으로 관리.

- ✅ **좋은 신호** — 맥락 생성 조건을 알고 포털 같은 구조적 해법을 제시한다.
- ⚠️ **약한 신호** — 값을 더 올려 본다고 답한다.
- ↪️ **후속 질문** — 드롭다운이 `overflow:hidden` 부모에 잘린다면?
- 📖 **레퍼런스** — [MDN 쌓임 맥락](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Stacking_context)

#### [미들] flex와 grid를 어떤 기준으로 고르나?

**핵심 답**

- flex는 한 축의 콘텐츠 흐름·정렬, grid는 두 축의 명시적 트랙 배치.
- flex 아이템이 안 줄어드는 대표 원인은 `min-width:auto`. `min-width:0`이나 `overflow:hidden`이 필요하다.
- grid는 겹침 레이어, `grid-template-areas` 재배치, `minmax`+`auto-fit`으로 열 수 자동 조절에 강하다.

- ✅ **좋은 신호** — 1축/2축 기준을 대고 실제로 겪은 축소·넘침 문제를 원인까지 설명한다.
- ⚠️ **약한 신호** — "grid가 더 좋다" 같은 선호만 말한다.
- ↪️ **후속 질문** — 400px 화면에서 카드 3열을 어떻게 접겠나?
- 📖 **레퍼런스** — [MDN flexbox 기본](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox) · [MDN grid 기본](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout)

#### [미들] `position: sticky`가 동작하지 않는 흔한 원인은?

**핵심 답**

- 조상 중 하나에 `overflow: hidden/auto/scroll`이 있어 스크롤 컨테이너가 바뀐 경우.
- 임계 방향 값(`top` 등)을 지정하지 않은 경우.
- 부모 높이가 콘텐츠와 같아 고정될 여유 구간이 없는 경우.
- 표 헤더는 `thead th`에 걸고 `border-collapse` 영향을 확인한다.

- ✅ **좋은 신호** — 조상 overflow를 1순위로 의심하고 DevTools로 확인하는 절차를 말한다.
- ⚠️ **약한 신호** — 브라우저 버그로 돌린다.
- ↪️ **후속 질문** — 모바일 상단 바가 겹칠 때 safe-area는 어떻게 처리하나?
- 📖 **레퍼런스** — [MDN position](https://developer.mozilla.org/en-US/docs/Web/CSS/position)

#### [주니어] 요소를 가로·세로 중앙에 두는 방법을 여러 개 말해 보라.

**핵심 답**

- 부모에 `display:flex; place-items:center` 또는 grid + `place-content:center`.
- `position:absolute; inset:0; margin:auto`, 또는 `top:50%; left:50%; translate:-50% -50%`(크기를 몰라도 된다).
- 텍스트 한 줄은 `line-height`로도 되지만 다중 행에서 깨진다.

- ✅ **좋은 신호** — 부모 높이를 모르는 경우, 스크롤이 생기는 경우 등 제약별로 고른다.
- ⚠️ **약한 신호** — 한 가지만 알고 왜 다른 상황에서 깨지는지 모른다.
- ↪️ **후속 질문** — 뷰포트 높이를 `100vh`로 잡으면 모바일에서 왜 잘리나?
- 📖 **레퍼런스** — [MDN grid 정렬](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout)

#### [시니어] 디자인 토큰과 CSS 커스텀 프로퍼티로 다크 모드를 설계한다면?

**핵심 답**

- 토큰 전량을 기본 `:root`에 선언하고 다크에서는 **토큰만** 재정의한다.
- 컴포넌트는 리터럴 색을 쓰지 않고 토큰만 참조한다. 미디어 쿼리 안에만 정의된 색은 조건이 어긋난 상태에서 미정의가 되어 대비 사고를 만든다.
- 사용자의 명시적 토글과 시스템 설정 두 축을 모두 다루려면 속성 선택자와 `prefers-color-scheme`을 겹쳐 우선순위를 정한다.
- 의미 색(성공·경고·위험)은 브랜드 액센트와 분리하고 대비는 WCAG 기준으로 검증한다.

- ✅ **좋은 신호** — 토큰 계층(원시→의미→컴포넌트)을 구분하고 대비 검증·QA 방법까지 말한다.
- ⚠️ **약한 신호** — 클래스 `.dark`를 붙여 색을 각 컴포넌트에서 덮는다고 답한다.
- ↪️ **후속 질문** — 이미 색이 하드코딩된 레거시를 어떻게 토큰으로 옮기겠나?
- 📖 **레퍼런스** — [MDN 커스텀 프로퍼티](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) · [MDN prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) · [WCAG 명도 대비](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)

### 네트워크·HTTP (5)

#### [미들] 정적 자산과 HTML의 캐시 헤더를 어떻게 설정하나?

**핵심 답**

- 콘텐츠 해시가 붙은 JS/CSS/이미지: `Cache-Control: public, max-age=31536000, immutable`.
- HTML 엔트리: `no-cache`로 매번 검증. 그래야 새 배포가 즉시 반영된다.
- `ETag`/`Last-Modified`로 조건부 요청 → 304. `stale-while-revalidate`로 체감 지연 제거.
- 브라우저 캐시와 CDN 캐시를 구분하고(`s-maxage`) 배포 시 무효화 대상을 정한다.

- ✅ **좋은 신호** — 해시 파일명과 HTML 정책을 짝으로 설명하고 배포 후 구버전이 남는 사고를 예로 든다.
- ⚠️ **약한 신호** — 모든 응답에 긴 max-age를 준다고 답한다.
- ↪️ **후속 질문** — 배포 직후 사용자가 구버전 청크를 요청해 실패하면 어떻게 처리하나?
- 📖 **레퍼런스** — [MDN HTTP 캐싱](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching) · [MDN Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control) · [MDN ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/ETag)

#### [미들] CORS preflight는 언제 발생하고 어떻게 줄이나?

**핵심 답**

- 단순 요청(GET/HEAD/POST + 허용된 헤더 + 특정 `Content-Type`)을 벗어나면 `OPTIONS`가 먼저 간다. 커스텀 헤더 하나, `application/json`도 트리거.
- 줄이려면 `Access-Control-Max-Age`로 캐시, 불필요한 커스텀 헤더 제거, 같은 오리진 프록시.
- `credentials: include`면 `Access-Control-Allow-Origin: *`가 불가하고 정확한 오리진과 `Allow-Credentials`가 필요하다.
- CORS는 브라우저 규칙이다. 서버가 막는 게 아니라서 curl은 통과한다.

- ✅ **좋은 신호** — 브라우저만의 규칙이라는 점을 분명히 하고, 실패 응답과 CORS 오류를 구분해 디버깅한 경험이 있다.
- ⚠️ **약한 신호** — 프록시로 우회했다는 말만 하고 발생 조건을 설명하지 못한다.
- ↪️ **후속 질문** — 같은 요청이 curl은 되는데 브라우저만 실패하면 무엇부터 보나?
- 📖 **레퍼런스** — [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)

#### [미들] 액세스 토큰을 `localStorage`에 저장해도 되나?

**핵심 답**

- XSS가 한 번이라도 성립하면 즉시 탈취된다. 스크립트가 읽을 수 있기 때문.
- 기본 대안은 `HttpOnly; Secure; SameSite` 쿠키 + CSRF 대비. 또는 토큰을 메모리에만 두고 새로고침 시 리프레시로 복구.
- 액세스 토큰은 짧게, 리프레시는 회전(rotation)과 재사용 감지. 로그아웃 시 서버 측 무효화 경로가 있어야 한다.

- ✅ **좋은 신호** — 위협 모델(XSS vs CSRF)을 나눠 설명하고 팀이 고른 절충과 이유를 말한다.
- ⚠️ **약한 신호** — "localStorage가 편해서 쓴다" 또는 "쿠키는 무조건 안전"이라고 답한다.
- ↪️ **후속 질문** — 여러 탭에서 토큰 갱신이 동시에 일어나면?
- 📖 **레퍼런스** — [OWASP 세션 관리 치트시트](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) · [MDN Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie)

#### [시니어] 실시간 기능에 polling, SSE, WebSocket 중 무엇을 고르나?

**핵심 답**

- 저빈도 갱신·단순 인프라: 폴링(또는 조건부 요청). 구현·운영 비용이 가장 낮다.
- 서버→클라 단방향 스트림: SSE. 일반 HTTP를 타서 프록시·자동 재연결이 쉽다. LLM 토큰 스트리밍이 대표 사례.
- 양방향 저지연: WebSocket. 대신 프록시·로드밸런서 설정, 스케일아웃(팬아웃), 하트비트·재연결·백오프를 직접 설계해야 한다.
- 공통 과제는 재연결 중 유실 보정(서버 시퀀스·재동기 요청)이다.

- ✅ **좋은 신호** — 기능 요구가 아니라 운영 비용과 유실 보정을 근거로 든다.
- ⚠️ **약한 신호** — WebSocket이 항상 최신이고 좋다고 답한다.
- ↪️ **후속 질문** — 연결이 30초 끊겼다가 붙으면 화면 상태를 어떻게 맞추나?
- 📖 **레퍼런스** — [MDN Server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events) · [MDN WebSockets API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

#### [주니어] 쿠키의 `SameSite` 세 값은 어떤 차이가 있나?

**핵심 답**

- `Strict`: 크로스 사이트 요청에 전혀 안 붙는다(외부 링크로 진입하면 로그아웃처럼 보인다).
- `Lax`: 최상위 내비게이션 GET에만 붙는다. 다수 브라우저의 기본값.
- `None`: 항상 붙지만 `Secure` 필수. 서드파티 컨텍스트(임베드·결제 위젯)에서 필요.
- `Domain`/`Path`와 서브도메인 공유 범위도 함께 본다.

- ✅ **좋은 신호** — 세 값의 사용자 체감 차이를 예로 들고 Secure 요건을 안다.
- ⚠️ **약한 신호** — 이름만 나열한다.
- ↪️ **후속 질문** — iframe 안에서 로그인 상태가 유지되지 않는 원인은?
- 📖 **레퍼런스** — [web.dev SameSite 쿠키 설명](https://web.dev/articles/samesite-cookies-explained) · [MDN Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie)

### 보안 (4)

#### [미들] XSS의 종류와 실질적인 방어를 설명하라.

**핵심 답**

- 저장형(서버에 남아 모든 사용자에게), 반사형(요청 파라미터가 그대로 출력), DOM 기반(클라이언트가 위험한 싱크에 직접 넣음).
- 방어의 본질은 출력 컨텍스트별 인코딩이다. HTML 본문·속성·URL·인라인 JS가 각각 다른 처리를 요구한다.
- 프레임워크 기본 이스케이프를 유지하고 `innerHTML`·`dangerouslySetInnerHTML`은 금지하거나 sanitizer를 거친다.
- 사용자 입력 URL은 스킴 검증(`javascript:` 차단). CSP는 2차 방어선.

- ✅ **좋은 신호** — 위험 싱크 목록을 알고, 입력 필터링이 아니라 출력 인코딩이 본질이라고 말한다.
- ⚠️ **약한 신호** — "입력값을 필터링한다"로 끝낸다.
- ↪️ **후속 질문** — 마크다운 렌더링 기능을 안전하게 만들려면?
- 📖 **레퍼런스** — [OWASP XSS 방어 치트시트](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) · [OWASP DOM XSS 치트시트](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html)

#### [시니어] CSP를 실제로 도입하는 순서와 함정은?

**핵심 답**

- `Content-Security-Policy-Report-Only`로 시작해 위반 리포트를 수집한다.
- 인라인 스크립트·스타일을 nonce/hash로 대체하고 서드파티 출처를 목록화한다. `unsafe-inline`이 남으면 효과가 크게 준다.
- 외부 자원(폰트·이미지·XHR 대상)까지 지시어별로 빠짐없이 열거해야 한다. 누락은 무성 실패로 나타난다.
- 리포트 엔드포인트와 대시보드를 먼저 준비하고 단계적으로 강제 전환한다.

- ✅ **좋은 신호** — report-only 단계와 무성 실패의 관측 문제를 짚고 서드파티 협상 비용을 언급한다.
- ⚠️ **약한 신호** — 헤더 한 줄 추가하면 된다고 답한다.
- ↪️ **후속 질문** — CSP 도입 후 특정 위젯이 조용히 멈췄다면 어떻게 찾나?
- 📖 **레퍼런스** — [MDN CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) · [web.dev strict CSP](https://web.dev/articles/csp)

#### [미들] `SameSite=Lax`가 기본인 시대에 CSRF 방어가 여전히 필요한가?

**핵심 답**

- 필요하다. 최상위 POST 내비게이션, 서브도메인 공격, 구형 클라이언트, 쿠키 이외 인증 경로가 남는다.
- 이중 제출 쿠키나 서버 저장 CSRF 토큰, 그리고 `Origin`/`Sec-Fetch-Site` 검증을 조합한다.
- 상태를 바꾸는 요청을 GET으로 두지 않는 것이 기본 전제.

- ✅ **좋은 신호** — SameSite를 완전한 방어로 보지 않고 남는 경로를 구체적으로 든다.
- ⚠️ **약한 신호** — "요즘은 브라우저가 막아 준다"로 끝낸다.
- ↪️ **후속 질문** — 공용 API에 CORS와 CSRF 방어를 함께 두면 무엇이 충돌하나?
- 📖 **레퍼런스** — [OWASP CSRF 방어 치트시트](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

#### [시니어] 서드파티 스크립트와 의존성을 어떤 기준으로 통제하나?

**핵심 답**

- 서드파티 태그는 같은 오리진 권한으로 실행된다. 토큰·DOM·입력값 전부 접근 가능.
- 통제 수단: CSP 출처 화이트리스트, SRI, 샌드박스 iframe 격리, 태그 매니저 승인 절차.
- 의존성은 lockfile 고정, 자동 업데이트 PR + CI 검증, 빌드 스크립트 실행 최소화, 번들 증가 감시.
- HTML5 보안 치트시트의 `target=_blank`·`postMessage`·스토리지 항목도 점검 목록.

- ✅ **좋은 신호** — 공급망 위험을 브라우저 권한 모델로 설명하고 승인 절차 같은 조직적 장치를 든다.
- ⚠️ **약한 신호** — "신뢰할 수 있는 라이브러리만 쓴다"로 끝낸다.
- ↪️ **후속 질문** — 광고·분석 스크립트가 INP를 악화시킨다면 어떻게 협상하나?
- 📖 **레퍼런스** — [OWASP HTML5 보안 치트시트](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html) · [MDN CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)

### React (12)

#### [주니어] 컴포넌트는 언제 리렌더되나?

**핵심 답**

- 자기 state 변경, 부모의 리렌더, 구독한 context 값 변경, `key` 변경(이 경우 언마운트 후 재마운트).
- props가 같더라도 부모가 렌더되면 자식 함수는 다시 호출된다. `memo`로 끊을 수 있다.
- 렌더(가상 트리 계산)와 커밋(실제 DOM 변경)은 다르다. 리렌더가 곧 DOM 조작은 아니다.

- ✅ **좋은 신호** — 렌더와 커밋을 구분하고 리렌더 자체가 항상 성능 문제는 아니라고 말한다.
- ⚠️ **약한 신호** — state가 바뀔 때만 리렌더된다고 답한다.
- ↪️ **후속 질문** — 불필요한 리렌더를 어떻게 확인하나?
- 📖 **레퍼런스** — [react.dev Render and Commit](https://react.dev/learn/render-and-commit) · [react.dev memo](https://react.dev/reference/react/memo)

#### [주니어] 리스트 `key`에 배열 인덱스를 쓰면 무엇이 깨지나?

**핵심 답**

- 항목을 삭제·정렬·앞에 삽입하면 인덱스가 다른 항목을 가리켜 입력값·포커스·애니메이션 상태가 어긋난다.
- 최악은 잘못된 재사용으로 사용자 입력이 다른 행에 붙는 것.
- 안정적인 서버 id를 쓰고, 없으면 생성 시점에 부여한 로컬 id를 쓴다. 정적 목록에선 인덱스도 무해하다.

- ✅ **좋은 신호** — 어떤 조작에서 깨지는지 시나리오로 말하고 인덱스가 괜찮은 조건도 구분한다.
- ⚠️ **약한 신호** — "key는 유일해야 한다"만 반복한다.
- ↪️ **후속 질문** — `key`를 일부러 바꿔 상태를 초기화하는 기법은 언제 쓰나?
- 📖 **레퍼런스** — [react.dev 리스트 렌더링](https://react.dev/learn/rendering-lists) · [react.dev 상태 보존·초기화](https://react.dev/learn/preserving-and-resetting-state)

#### [미들] `useEffect` 의존성 배열을 비우면 어떤 문제가 생기고 클린업은 언제 필요한가?

**핵심 답**

- 빈 배열은 최초 값에 고정된 클로저를 남긴다(stale closure). 이후 변경된 state·props를 못 본다.
- 구독·타이머·이벤트 리스너·`AbortController`는 반드시 클린업. 없으면 중복 구독·누수, 언마운트 후 setState.
- StrictMode의 개발 이중 실행이 멱등하지 않은 이펙트를 드러낸다.
- 파생 값 계산이나 이벤트 대응은 이펙트가 아니라 렌더 중 계산이나 핸들러가 맞다.

- ✅ **좋은 신호** — 이펙트가 필요 없는 경우를 스스로 구분하고, 린트 경고를 억제하는 대신 구조를 바꾼다.
- ⚠️ **약한 신호** — 의존성 경고를 `eslint-disable`로 끄는 것이 관행이라고 답한다.
- ↪️ **후속 질문** — 요청이 겹칠 때 오래된 응답이 나중에 도착하면 어떻게 막나?
- 📖 **레퍼런스** — [react.dev You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) · [react.dev useEffect](https://react.dev/reference/react/useEffect)

#### [미들] `useMemo`/`useCallback`은 언제 쓰고 언제 빼나?

**핵심 답**

- 써야 할 때: 실제로 비싼 계산, 그리고 참조 동일성이 소비자에게 의미 있을 때(`memo` 자식의 props, 훅의 의존성).
- 기본은 쓰지 않는 것. 비교 비용·메모리·코드 복잡도가 붙고 의존성이 틀리면 버그가 된다.
- 순서는 측정 먼저. 프로파일러에서 렌더 시간과 원인을 확인하고 지점을 고른다.

- ✅ **좋은 신호** — 측정 후 적용 원칙을 말하고 참조 동일성이 필요한 지점을 구체적으로 든다.
- ⚠️ **약한 신호** — 모든 함수와 값을 감싸는 것이 최적화라고 답한다.
- ↪️ **후속 질문** — React Compiler가 있다면 이 판단이 어떻게 달라지나?
- 📖 **레퍼런스** — [react.dev useMemo](https://react.dev/reference/react/useMemo) · [react.dev useCallback](https://react.dev/reference/react/useCallback)

#### [미들] Context에 전역 상태를 넣었더니 앱 전체가 리렌더된다. 어떻게 푸나?

**핵심 답**

- Provider value가 매 렌더 새 객체면 모든 소비자가 리렌더된다 → 값 메모이제이션.
- 자주 바뀌는 값과 거의 안 바뀌는 값을 분리해 Context를 쪼갠다(상태/디스패치 분리).
- 부분 구독이 필요하면 selector 기반 스토어로 옮긴다. 새 참조를 반환하는 selector는 무한 루프를 만들 수 있어 얕은 비교를 함께 쓴다.
- memo 경계를 두어 트리 전파를 끊는다.

- ✅ **좋은 신호** — Context의 구조적 한계(부분 구독 불가)를 알고 도구를 바꿀 근거를 댄다.
- ⚠️ **약한 신호** — Context를 모든 상태의 기본 저장소로 쓰면서 성능 문제를 `memo` 남발로 덮는다.
- ↪️ **후속 질문** — 스토어로 옮긴 뒤에도 느리다면 어디를 보나?
- 📖 **레퍼런스** — [react.dev Reducer와 Context 확장](https://react.dev/learn/scaling-up-with-reducer-and-context)

#### [미들] 서버 상태와 클라이언트 상태를 왜 나누나?

**핵심 답**

- 서버 데이터는 사본이다. 캐시 수명·재검증·무효화·경합이 본질 문제이고 이를 전용 도구가 다룬다.
- 서버 응답을 전역 스토어에 복사하면 두 개의 진실이 생겨 동기화 코드가 계속 늘어난다.
- UI 상태(열림/선택/입력 중)는 가장 가까운 곳에, 공유·복원이 필요한 상태는 URL에.

- ✅ **좋은 신호** — 동기화 비용을 이유로 들고 URL을 상태 저장소로 쓰는 판단 기준을 말한다.
- ⚠️ **약한 신호** — 전역 스토어 하나에 다 넣는 것이 일관성이라고 답한다.
- ↪️ **후속 질문** — 목록을 수정한 뒤 상세 화면이 옛 값을 보이면 무엇을 고치나?
- 📖 **레퍼런스** — [TanStack Query 쿼리 키](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys) · [react.dev 상태 관리](https://react.dev/learn/managing-state)

#### [시니어] 상태를 어디에 둘지 결정하는 기준이 있나?

**핵심 답**

- 사용 범위를 최소로: 로컬 → 리프팅 → 컨텍스트/스토어 순으로만 올린다.
- 공유·새로고침 복원·딥링크가 필요하면 URL(쿼리스트링·경로).
- 서버 데이터는 캐시 계층. 사용자 편의(마지막 탭·접힘)는 로컬 스토리지, 단 없어도 화면이 정상 동작해야 한다.
- 기기 간 유지·감사 필요는 서버 저장. 기준은 '누가 읽고, 얼마나 오래 살아야 하나'다.

- ✅ **좋은 신호** — 수명과 독자 기준으로 계층을 나누고 잘못 둔 상태를 옮긴 경험을 든다.
- ⚠️ **약한 신호** — 습관적으로 전역 또는 습관적으로 로컬이라 답하고 기준이 없다.
- ↪️ **후속 질문** — 필터 조건을 URL에 넣었을 때 생기는 부작용은?
- 📖 **레퍼런스** — [react.dev 상태 관리](https://react.dev/learn/managing-state)

#### [시니어] SSR 하이드레이션 미스매치는 왜 생기고 어떻게 다루나?

**핵심 답**

- 서버와 클라이언트가 다른 결과를 만들 때: `Date.now()`·랜덤·로케일·`window` 의존·저장소 값·A/B 분기.
- 경고를 억제하는 대신 클라이언트 전용 부분을 마운트 이후 렌더로 분리하거나 서버에서 값을 내려 준다.
- 미스매치는 트리 재생성으로 이어질 수 있어 성능·깜빡임 문제로 나타난다.
- 스트리밍·Suspense 경계를 잘라 실패 범위와 첫 페인트를 제어한다.

- ✅ **좋은 신호** — 원인 목록을 알고 억제 플래그 남용을 경계하며 경계 설계까지 말한다.
- ⚠️ **약한 신호** — `suppressHydrationWarning`으로 해결한다고 답한다.
- ↪️ **후속 질문** — 로그인 상태에 따라 헤더가 다르면 어떻게 서버 렌더하나?
- 📖 **레퍼런스** — [react.dev hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot)

#### [미들] StrictMode가 개발에서 이펙트를 두 번 실행하는 이유는?

**핵심 답**

- 마운트→언마운트→재마운트에 견디는지 검증하기 위한 의도된 동작. 프로덕션에는 없다.
- 클린업이 없거나 멱등하지 않은 이펙트(중복 구독, 카운터 증가, 중복 전송)가 여기서 드러난다.
- 끄는 것이 아니라 이펙트를 고치는 것이 답.

- ✅ **좋은 신호** — 드러난 결함을 고친 경험을 말한다.
- ⚠️ **약한 신호** — 버그로 보고 StrictMode를 제거한다.
- ↪️ **후속 질문** — 분석 이벤트가 두 번 전송된다면 어떻게 고치나?
- 📖 **레퍼런스** — [react.dev StrictMode](https://react.dev/reference/react/StrictMode)

#### [미들] `ref`를 쓰는 것이 정당한 경우는?

**핵심 답**

- 포커스·스크롤·측정·미디어 제어, 서드파티 라이브러리 인스턴스 보관, 렌더에 반영되지 않아야 하는 최신값 보관.
- 화면에 나타나야 하는 값은 state. ref로 우회하면 UI와 데이터가 어긋난다.
- 렌더 중 ref를 읽고 쓰는 것은 금지. 레이아웃 측정은 커밋 이후.

- ✅ **좋은 신호** — state와 ref의 경계를 '렌더에 반영되어야 하는가'로 가른다.
- ⚠️ **약한 신호** — 리렌더를 피하려고 상태를 ref에 넣는다.
- ↪️ **후속 질문** — 자식 DOM을 부모가 제어해야 한다면 어떤 API를 쓰나?
- 📖 **레퍼런스** — [react.dev ref로 값 참조](https://react.dev/learn/referencing-values-with-refs)

#### [시니어] React 19에서 폼 제출과 낙관적 UI를 어떤 API로 구성하나?

**핵심 답**

- Actions: `<form action={fn}>`와 `useActionState`로 제출 중 상태·에러를 프레임워크가 관리한다.
- `useOptimistic`으로 요청 진행 중 임시 값을 보여 주고, 실패 시 자동으로 되돌린다.
- `use()`로 Promise·Context를 렌더에서 읽고 Suspense 경계와 붙인다.
- PropTypes는 폐기됐다. 컴포넌트 계약은 TypeScript로 표현하는 것이 표준.

- ✅ **좋은 신호** — 수동 `isSubmitting` 상태를 왜 줄일 수 있는지 설명하고 실패 롤백까지 다룬다.
- ⚠️ **약한 신호** — 버전 이름만 알고 어떤 문제를 대체하는지 말하지 못한다.
- ↪️ **후속 질문** — 서버 컴포넌트 경계에서 이벤트 핸들러를 어디에 둬야 하나?
- 📖 **레퍼런스** — [react.dev React 19 릴리스](https://react.dev/blog/2024/12/05/react-19) · [react.dev useOptimistic](https://react.dev/reference/react/useOptimistic) · [react.dev use()](https://react.dev/reference/react/use) · [react.dev form](https://react.dev/reference/react-dom/components/form)

#### [시니어] 서버 컴포넌트와 클라이언트 컴포넌트의 경계를 어떻게 잡나?

**핵심 답**

- 기본은 서버. 상태·이벤트·브라우저 API가 필요한 잎(leaf)만 클라이언트로 내린다.
- 경계를 넘는 props는 직렬화 가능해야 한다. 함수·클래스 인스턴스는 못 넘긴다.
- 데이터 페칭을 서버로 올리면 클라이언트 번들과 워터폴이 줄지만, 상호작용 많은 화면은 오히려 경계가 늘어 복잡해진다.
- 선택 근거는 번들 크기·지연·팀의 운영 역량이다.

- ✅ **좋은 신호** — 직렬화 제약과 워터폴을 함께 말하고 도입하지 않을 근거도 댄다.
- ⚠️ **약한 신호** — "최신이니까 전부 서버 컴포넌트로"라고 답한다.
- ↪️ **후속 질문** — 서버 컴포넌트에서 인증 실패를 어떻게 화면에 전달하나?
- 📖 **레퍼런스** — [react.dev 서버 컴포넌트](https://react.dev/reference/rsc/server-components)

### 상태·데이터 (3)

#### [미들] 낙관적 업데이트를 안전하게 만드는 조건은?

**핵심 답**

- 적용 전 스냅샷을 잡아 실패 시 롤백하고 사용자에게 실패를 알린다.
- 서버 응답으로 최종 재조정(서버가 부여한 id·시각·정렬키).
- 연속 조작의 경합: 마지막 요청만 반영하거나 순차 큐로 직렬화. 재시도는 서버가 멱등해야 안전하다.
- 되돌릴 수 없는 작업(결제·삭제)에는 쓰지 않는다.

- ✅ **좋은 신호** — 롤백·재조정·경합·멱등 네 가지를 모두 말하고 쓰지 않을 경우도 구분한다.
- ⚠️ **약한 신호** — UI를 먼저 바꾸고 요청을 보낸다는 설명에서 멈춘다.
- ↪️ **후속 질문** — 오프라인에서 쌓인 변경을 복귀 후 어떻게 반영하나?
- 📖 **레퍼런스** — [TanStack Query 낙관적 업데이트](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates) · [react.dev useOptimistic](https://react.dev/reference/react/useOptimistic)

#### [시니어] 서버 데이터 캐시 무효화를 어떻게 설계했나?

**핵심 답**

- 키 설계가 먼저다. 엔티티 + 파라미터(필터·페이지)를 계층 키로 두어 부분 무효화가 가능하게 한다.
- 변경 후 전량 무효화는 단순하지만 대량 리페치를 부른다. 응답으로 캐시를 직접 갱신(write-through)하고 필요한 범위만 무효화.
- 창 포커스·재연결·주기 재검증 정책, 목록↔상세 간 일관성 규칙을 정한다.
- 결정 근거는 요청 수와 화면 일관성의 균형이며 실측으로 조정한다.

- ✅ **좋은 신호** — 키 계층과 write-through를 구분해 쓰고 무효화 비용을 수치로 관찰한 경험이 있다.
- ⚠️ **약한 신호** — "수정 후 전부 invalidate"만 답한다.
- ↪️ **후속 질문** — 여러 탭이 열려 있을 때 캐시를 어떻게 맞추나?
- 📖 **레퍼런스** — [TanStack Query 무효화](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation) · [TanStack Query 쿼리 키](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)

#### [미들] 무한 스크롤 목록에서 항목 하나를 수정하면 캐시를 어떻게 다루나?

**핵심 답**

- 페이지 단위 캐시라면 해당 페이지 안의 항목만 갱신하거나, 엔티티를 정규화해 단일 소스로 둔다.
- 정렬 기준이 바뀌는 수정은 커서가 흔들려 중복·누락이 생긴다 → 서버 커서 기준 재동기 또는 목록 리셋.
- 삭제는 오프셋 페이징에서 항목 밀림을 유발한다(커서 페이징 선호).

- ✅ **좋은 신호** — 커서와 오프셋 페이징의 차이를 알고 중복·누락 시나리오를 예로 든다.
- ⚠️ **약한 신호** — 목록 전체를 다시 불러오면 된다고만 답한다.
- ↪️ **후속 질문** — 스크롤 위치를 유지하면서 목록을 갱신하려면?
- 📖 **레퍼런스** — [TanStack Query 무한 쿼리](https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries)

### TypeScript (4)

#### [주니어] `any` 대신 `unknown`을 쓰라는 이유는?

**핵심 답**

- `unknown`은 사용 전 좁히기를 강제한다. 검사 없이는 어떤 연산도 허용되지 않는다.
- `any`는 전파된다. 한 지점에서 끄면 그 값이 닿는 모든 곳의 검사가 사라진다.
- 외부 입력(JSON·이벤트·서드파티)은 `unknown`으로 받아 타입 가드나 스키마로 좁힌다.

- ✅ **좋은 신호** — 전파 문제를 설명하고 좁히는 수단을 함께 든다.
- ⚠️ **약한 신호** — 둘이 비슷하다고 답한다.
- ↪️ **후속 질문** — 타입 가드 함수는 어떻게 쓰나?
- 📖 **레퍼런스** — [TS 핸드북 Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html) · [TS 핸드북 Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

#### [미들] `as` 단언이 위험한 이유와 대안은?

**핵심 답**

- 단언은 런타임 검증이 아니다. 컴파일러가 잡아 줄 회귀를 침묵시킨다.
- 대안: 타입 가드, 판별 유니온, 제네릭, 스키마 파싱, 그리고 `satisfies`로 초과·누락 검사를 유지.
- `as const`는 리터럴 보존 목적이라 성격이 다르다.
- 테스트 스텁에서 부분 객체가 필요하면 부분 타입 + 조립으로 풀고 통째 단언을 피한다.

- ✅ **좋은 신호** — 어떤 회귀가 숨는지 사례로 말하고 `satisfies`를 구분해 쓴다.
- ⚠️ **약한 신호** — 타입 에러가 나면 일단 `as`로 막는다고 답한다.
- ↪️ **후속 질문** — API 응답 타입이 실제와 다르다면 어디서 막아야 하나?
- 📖 **레퍼런스** — [TS 4.9 satisfies](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html) · [TS 핸드북 Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

#### [미들] 구조적 타이핑이 만드는 함정은?

**핵심 답**

- 모양이 같으면 호환된다. 서로 다른 의미의 문자열 id가 교차 대입돼도 컴파일은 통과한다.
- 초과 속성 검사는 객체 리터럴에만 적용돼, 변수를 거치면 여분 속성이 조용히 통과한다.
- 구분이 필요하면 branded/nominal 타입(태그 필드나 심볼)으로 식별자를 분리한다.

- ✅ **좋은 신호** — id 혼동 같은 실제 사고를 들고 branded 타입을 도입한 경험이 있다.
- ⚠️ **약한 신호** — 덕 타이핑이라는 용어만 말한다.
- ↪️ **후속 질문** — 단위나 좌표계가 다른 숫자를 타입으로 어떻게 막나?
- 📖 **레퍼런스** — [TS 타입 호환성](https://www.typescriptlang.org/docs/handbook/type-compatibility.html) · [Nominal typing 패턴](https://basarat.gitbook.io/typescript/main-1/nominaltyping)

#### [시니어] 런타임 경계에서 타입을 어떻게 보장하나?

**핵심 답**

- 경계(네트워크·스토리지·postMessage·URL 파라미터)에서 한 번 파싱하고, 내부는 파싱된 타입만 신뢰한다.
- 스키마 정의를 단일 출처로 두고 타입을 파생한다. 생성된 타입을 다시 별칭으로 재수출하면 원본과 어긋난다.
- 파싱 실패 처리(폴백·에러 보고)를 설계해야 한다. 성능을 이유로 검증을 수동 체크로 대체하면 누락 회귀가 생긴다.
- 서버 스펙(OpenAPI)에서 클라이언트 타입을 생성해 계약을 CI로 검증한다.

- ✅ **좋은 신호** — 경계 1회 파싱 원칙과 실패 경로를 말하고 검증 제거로 사고를 본 경험을 든다.
- ⚠️ **약한 신호** — 타입이 있으니 런타임 검증은 필요 없다고 답한다.
- ↪️ **후속 질문** — 스키마 검증 비용이 실제로 문제라면 어떻게 줄이나?
- 📖 **레퍼런스** — [Zod 스키마 검증](https://zod.dev/) · [TS 제네릭](https://www.typescriptlang.org/docs/handbook/2/generics.html)

### 성능 (7)

#### [미들] Core Web Vitals 세 지표와 합격선은?

**핵심 답**

- LCP 2.5초 이하, INP 200ms 이하, CLS 0.1 이하.
- 판정은 실사용자(field) 데이터의 75퍼센타일이며 모바일·데스크톱을 나눠 본다.
- 실험실(Lighthouse) 점수와 필드 값은 다르다. 개선 판단은 필드 분포로 한다.

- ✅ **좋은 신호** — 수치와 75퍼센타일 기준을 정확히 말하고 lab/field 차이를 구분한다.
- ⚠️ **약한 신호** — Lighthouse 점수 90점 같은 지표만 말한다.
- ↪️ **후속 질문** — 필드 데이터는 어떻게 수집했나?
- 📖 **레퍼런스** — [web.dev Web Vitals](https://web.dev/articles/vitals) · [web.dev 임계값 정의](https://web.dev/articles/defining-core-web-vitals-thresholds) · [web.dev lab vs field](https://web.dev/articles/lab-and-field-data-differences)

#### [미들] LCP가 느릴 때 점검 순서를 말해 보라.

**핵심 답**

- LCP는 TTFB → 리소스 로드 지연 → 리소스 로드 시간 → 렌더 지연 네 구간으로 쪼개 본다.
- 히어로 이미지에 `fetchpriority="high"`, `preload`를 주고 지연 로딩을 걸지 않는다.
- 렌더 블로킹 CSS·폰트 축소, 서버 응답 캐시, 이미지 포맷·해상도 축소.
- 클라이언트 렌더에서는 하이드레이션·데이터 페치 워터폴이 렌더 지연으로 잡힌다.

- ✅ **좋은 신호** — 네 구간 분해로 병목을 지목하고 측정 도구(필드 어트리뷰션)를 든다.
- ⚠️ **약한 신호** — 이미지 압축만 말한다.
- ↪️ **후속 질문** — LCP 요소가 매 화면마다 다르면 무엇을 기준으로 개선하나?
- 📖 **레퍼런스** — [web.dev LCP](https://web.dev/articles/lcp) · [web.dev LCP 최적화](https://web.dev/articles/optimize-lcp) · [web.dev fetchpriority](https://web.dev/articles/fetch-priority)

#### [미들] 번들이 커졌을 때 실제로 무엇을 하나?

**핵심 답**

- 먼저 분석. 번들 시각화 도구로 무엇이 큰지 확인하고 중복 의존성(버전 두 개)을 찾는다.
- 전체 import(유틸 라이브러리 통째, 아이콘 세트), moment류 로케일 포함 여부 점검.
- 라우트·모달·에디터 단위 code splitting과 지연 로드. 초기 경로에 필요한 것만 남긴다.
- 예산(budget)을 CI에 걸어 회귀를 막는다.

- ✅ **좋은 신호** — 측정 → 원인 → 분할 → 회귀 감시 순서로 말하고 수치를 든다.
- ⚠️ **약한 신호** — "lazy import를 쓴다"만 답하고 무엇이 큰지 모른다.
- ↪️ **후속 질문** — 코드 분할을 늘렸는데 체감이 더 나빠졌다면 왜인가?
- 📖 **레퍼런스** — [web.dev 코드 분할](https://web.dev/articles/reduce-javascript-payloads-with-code-splitting) · [web.dev 성능 예산](https://web.dev/articles/performance-budgets-101)

#### [시니어] 성능 개선을 어떻게 증명하나?

**핵심 답**

- 먼저 측정. 필드 RUM 분포(p75)와 대상 사용자 세그먼트를 정한다.
- 가설은 하나씩. 전후 조건을 동일하게 맞추고 저사양 기기·저속 네트워크 프로파일로 재현한다.
- Long Task·INP 어트리뷰션으로 원인 지점을 특정한다.
- 회귀 감시: 성능 예산, CI 측정, 배포와 지표를 연결한 알림.

- ✅ **좋은 신호** — 수치와 분포로 말하고 회귀 감시까지 설계한다.
- ⚠️ **약한 신호** — 체감이 빨라졌다고 말하고 근거가 없다.
- ↪️ **후속 질문** — 개선 후 p75는 좋아졌는데 p95가 나빠졌다면?
- 📖 **레퍼런스** — [web.dev INP 최적화](https://web.dev/articles/optimize-inp) · [MDN Long Task API](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongTaskTiming) · [web.dev 성능 예산](https://web.dev/articles/performance-budgets-101)

#### [미들] 1만 행 목록을 렌더해야 한다면?

**핵심 답**

- 윈도잉(가상 스크롤)으로 보이는 범위만 DOM에 유지한다.
- 행 컴포넌트 memo, 안정 key, 셀 계산 캐시로 스크롤 중 작업을 줄인다.
- 트레이드오프: 검색(Ctrl+F)·접근성·스크롤 앵커링이 약해진다. 가변 높이는 측정 비용이 든다.
- 대안은 페이징이나 서버 집계. 사용자가 실제로 무엇을 찾는지가 선택 기준.

- ✅ **좋은 신호** — 윈도잉의 대가를 알고 페이징 대안과 비교한다.
- ⚠️ **약한 신호** — 라이브러리 이름만 말한다.
- ↪️ **후속 질문** — 행 높이가 콘텐츠마다 다르면 어떻게 처리하나?
- 📖 **레퍼런스** — [web.dev 긴 목록 가상화](https://web.dev/articles/virtualize-long-lists-react-window)

#### [주니어] 이미지 최적화의 기본은?

**핵심 답**

- 표시 크기에 맞는 해상도 제공(`srcset`/`sizes`), AVIF·WebP 같은 최신 포맷.
- 화면 밖 이미지는 `loading="lazy"`, 첫 화면 LCP 이미지는 지연 로딩을 걸지 않는다.
- `width`/`height` 또는 `aspect-ratio`를 지정해 CLS를 막는다.

- ✅ **좋은 신호** — LCP 이미지 예외를 알고 CLS 방지까지 말한다.
- ⚠️ **약한 신호** — 모든 이미지에 lazy를 붙인다고 답한다.
- ↪️ **후속 질문** — CDN 리사이즈와 빌드 타임 리사이즈의 차이는?
- 📖 **레퍼런스** — [MDN img (srcset·loading)](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img) · [web.dev 반응형 이미지](https://web.dev/articles/serve-responsive-images) · [web.dev CLS](https://web.dev/articles/cls)

#### [미들] 웹폰트 때문에 생기는 깜빡임과 레이아웃 이동을 어떻게 다루나?

**핵심 답**

- `font-display`로 정책 선택: `swap`은 폴백 먼저(이동 발생), `optional`은 첫 방문에 폴백 유지.
- 핵심 폰트는 `preload`, 서브셋으로 용량 축소, 가변 폰트로 파일 수 감소.
- 폴백 폰트 메트릭을 맞춰(`size-adjust`, `ascent-override`) 교체 시 이동을 줄인다.

- ✅ **좋은 신호** — 정책별 트레이드오프를 말하고 메트릭 정렬까지 안다.
- ⚠️ **약한 신호** — "폰트를 preload한다"만 답한다.
- ↪️ **후속 질문** — 브랜드 폰트가 필수인데 CLS가 기준을 넘으면?
- 📖 **레퍼런스** — [MDN font-display](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display) · [web.dev 웹폰트 로딩 최적화](https://web.dev/articles/optimize-webfont-loading)

### 테스트 (4)

#### [미들] 무엇을 유닛으로, 무엇을 e2e로 테스트하나?

**핵심 답**

- 순수 로직·경계 조건은 유닛. 컴포넌트+스토어+네트워크 모킹의 통합 테스트가 비용 대비 신뢰가 가장 높다.
- e2e는 핵심 사용자 흐름 소수(로그인·결제·저장)로 제한한다. 느리고 깨지기 쉬워서.
- 기준은 '이 테스트가 깨질 때 실제 사용자 문제가 있었는가'.

- ✅ **좋은 신호** — 비용·신뢰 균형으로 설명하고 자기 프로젝트의 배치를 수치로 말한다.
- ⚠️ **약한 신호** — 커버리지 숫자를 목표로 제시한다.
- ↪️ **후속 질문** — 커버리지 80%인데 장애가 났다면 무엇을 바꾸겠나?
- 📖 **레퍼런스** — [Testing Trophy (Kent C. Dodds)](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications) · [Practical Test Pyramid (Fowler)](https://martinfowler.com/articles/practical-test-pyramid.html)

#### [미들] Testing Library의 쿼리 우선순위와 그 이유는?

**핵심 답**

- 접근성 기준 쿼리 우선: `getByRole` → `getByLabelText` → `getByText` → 마지막 수단으로 `getByTestId`.
- 사용자가 화면을 인식하는 방식과 같은 축으로 찾아야 테스트가 구현 변경에 견딘다. 부수적으로 접근성 결함도 드러난다.
- 클래스명·DOM 구조에 의존하면 리팩터마다 깨진다.

- ✅ **좋은 신호** — 우선순위를 순서대로 말하고 접근성 검증 효과를 언급한다.
- ⚠️ **약한 신호** — testid가 가장 안정적이라고 답한다.
- ↪️ **후속 질문** — role로 못 찾는 커스텀 위젯은 어떻게 테스트하나?
- 📖 **레퍼런스** — [Testing Library 쿼리 우선순위](https://testing-library.com/docs/queries/about/) · [Testing Library 원칙](https://testing-library.com/docs/guiding-principles)

#### [시니어] flaky 테스트의 원인 top과 처방은?

**핵심 답**

- 고정 `sleep`과 시간·애니메이션 의존 → 조건 기반 대기(자동 재시도 assertion).
- 테스트 간 상태 공유(DB·스토리지·로그인 세션) → 테스트별 격리와 시드 데이터.
- 순서 의존·병렬 자원 충돌(같은 포트·같은 계정) → 워커별 자원 분리.
- 네트워크 실물 의존 → 경계 모킹. 재시도는 은폐 수단이 아니라 관측 장치로 쓰고 실패율을 추적한다.

- ✅ **좋은 신호** — 원인별 처방을 짝지어 말하고 재시도를 측정과 함께 다룬다.
- ⚠️ **약한 신호** — 재시도 횟수를 늘려 해결했다고 답한다.
- ↪️ **후속 질문** — CI에서만 깨지고 로컬에서 재현되지 않으면 무엇부터 보나?
- 📖 **레퍼런스** — [Playwright 재시도·flaky](https://playwright.dev/docs/test-retries)

#### [미들] 모킹은 어디까지 해야 하나?

**핵심 답**

- 네트워크 경계에서 모킹(요청 인터셉트)하면 앱 내부 구조를 바꿔도 테스트가 살아남는다.
- 내부 모듈을 모킹하면 리팩터마다 깨지고, 실제로는 깨진 코드가 통과하는 가짜 green이 생긴다.
- 시간·랜덤·기기 API는 제어 가능한 대체물로 고정한다.

- ✅ **좋은 신호** — 경계 모킹과 내부 모킹의 결과 차이를 경험으로 설명한다.
- ⚠️ **약한 신호** — 편의상 전부 모킹한다고 답한다.
- ↪️ **후속 질문** — 모킹한 응답이 실제 서버 스펙과 달라지는 것을 어떻게 막나?
- 📖 **레퍼런스** — [MSW 철학(경계 모킹)](https://mswjs.io/docs/philosophy)

### 빌드·툴링 (4)

#### [미들] tree shaking이 안 먹는 이유는?

**핵심 답**

- CJS 모듈은 정적 분석이 어렵다. ESM이어야 제거가 가능하다.
- `package.json`의 `sideEffects` 설정 누락 또는 실제 사이드이펙트(전역 등록, CSS import).
- 배럴 파일(`export *`)로 모듈 전체가 참조되어 남는 경우.
- 프로덕션 모드(minify·DCE)로 빌드하지 않은 경우.

- ✅ **좋은 신호** — 원인을 나열하고 번들 분석으로 확인한 경험을 말한다.
- ⚠️ **약한 신호** — 번들러가 알아서 해 준다고 답한다.
- ↪️ **후속 질문** — 배럴 파일을 없애면 어떤 부작용이 있나?
- 📖 **레퍼런스** — [webpack tree shaking](https://webpack.js.org/guides/tree-shaking/)

#### [미들] ESM과 CJS가 섞여 생기는 문제는?

**핵심 답**

- named export interop 차이로 `import { x }`가 실패하거나 default에 감싸여 들어온다.
- 같은 패키지가 두 형식으로 동시에 번들되는 dual package hazard → 인스턴스·전역 상태가 두 개.
- `exports` 조건부 필드 해석이 번들러·런타임마다 달라 SSR과 브라우저가 다른 파일을 집는다.

- ✅ **좋은 신호** — 실제 디버깅 절차(어느 파일이 해석됐는지 확인)를 말한다.
- ⚠️ **약한 신호** — 에러 메시지만 기억하고 원인 구조를 모른다.
- ↪️ **후속 질문** — SSR에서만 깨지는 라이브러리를 어떻게 처리했나?
- 📖 **레퍼런스** — [Node.js packages(exports·interop)](https://nodejs.org/api/packages.html)

#### [시니어] 모노레포에서 의존 경계를 어떻게 강제하나?

**핵심 답**

- 태그·경로 기반 규칙을 린트로 강제해 허용된 방향만 import 가능하게 한다.
- 순환 의존 방지: 상위 배럴 import 금지, 모듈 내부는 상대 경로, 외부는 alias.
- 변경 영향 그래프로 영향받은 프로젝트만 빌드·테스트하고 캐시를 공유한다.
- 규칙 없는 공유 레이어는 결국 모든 것이 모든 것에 의존하는 상태로 수렴한다.

- ✅ **좋은 신호** — 규칙을 도구로 강제한 경험과 CI 시간 변화 수치를 말한다.
- ⚠️ **약한 신호** — 리뷰에서 주의시킨다고 답한다.
- ↪️ **후속 질문** — 경계 규칙 때문에 개발이 느려진다는 반발에 어떻게 답하나?
- 📖 **레퍼런스** — [Nx 모듈 경계 강제](https://nx.dev/features/enforce-module-boundaries)

#### [미들] 프로덕션 에러를 어떻게 읽을 수 있게 만드나?

**핵심 답**

- 난독화된 스택은 소스맵을 에러 트래킹 서비스에 업로드해 복원한다. 소스맵은 공개 배포하지 않는다.
- 릴리스 버전을 스택과 함께 태깅해 어느 배포에서 난 에러인지 구분한다.
- 브라우저·기기·사용자 흐름(breadcrumb)을 함께 수집하고, 전역 `error`·`unhandledrejection`을 연결한다.

- ✅ **좋은 신호** — 릴리스 태깅과 소스맵 비공개 운영을 함께 말한다.
- ⚠️ **약한 신호** — 콘솔 로그를 본다고 답한다.
- ↪️ **후속 질문** — 에러가 특정 배포 이후 급증했다면 무엇부터 보나?
- 📖 **레퍼런스** — [소스맵 업로드 운영(Sentry)](https://docs.sentry.io/platforms/javascript/sourcemaps/)

### 접근성 (3)

#### [주니어] 버튼을 `div`로 만들면 무엇을 잃나?

**핵심 답**

- 키보드 포커스, Enter/Space 활성화, 스크린리더의 role·상태 전달, 비활성 처리.
- 대체하려면 `role="button"`, `tabindex="0"`, 키 핸들러, `aria-disabled`를 전부 직접 구현해야 한다.
- 네이티브 요소를 쓰는 것이 언제나 더 싸다.

- ✅ **좋은 신호** — 잃는 항목을 구체적으로 나열하고 네이티브 우선 원칙을 말한다.
- ⚠️ **약한 신호** — "클릭은 되니까 괜찮다"고 답한다.
- ↪️ **후속 질문** — 링크와 버튼은 어떤 기준으로 나누나?
- 📖 **레퍼런스** — [MDN ARIA 기법](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Techniques) · [ARIA APG 키보드 인터페이스](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)

#### [미들] 모달 접근성 체크리스트를 말해 보라.

**핵심 답**

- 열릴 때 포커스를 모달 안으로 이동, 내부에 포커스 트랩, 닫을 때 원래 트리거로 복귀.
- Esc로 닫기, `role="dialog"` + `aria-modal="true"` + `aria-labelledby`.
- 배경 스크롤 잠금, 배경 콘텐츠를 보조기기에서 감추기.
- 실제 스크린리더와 키보드만으로 검증.

- ✅ **좋은 신호** — 포커스 복귀와 배경 처리까지 포함하고 실제 검증 방법을 말한다.
- ⚠️ **약한 신호** — 오버레이 클릭으로 닫히는지만 확인한다.
- ↪️ **후속 질문** — 모달 안에 또 다른 팝업이 열리면 포커스는 어떻게 관리하나?
- 📖 **레퍼런스** — [ARIA APG Dialog 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

#### [미들] ARIA를 쓰는 것이 오히려 나쁜 경우는?

**핵심 답**

- ARIA의 첫 규칙은 '가능하면 ARIA를 쓰지 마라'. 네이티브 시맨틱이 항상 우선.
- 잘못된 role은 접근성 트리를 덮어써 원래 의미를 파괴한다.
- `aria-label`과 보이는 텍스트가 어긋나면 음성 제어 사용자가 조작할 수 없다. 라벨 중복 낭독도 흔한 결함.
- `aria-hidden`을 포커스 가능한 요소에 걸면 키보드로는 닿지만 낭독되지 않는 상태가 된다.

- ✅ **좋은 신호** — 첫 규칙을 알고 잘못된 role의 부작용을 예로 든다.
- ⚠️ **약한 신호** — ARIA를 많이 붙이면 접근성이 좋아진다고 답한다.
- ↪️ **후속 질문** — 디자인 시스템에서 접근성 회귀를 어떻게 막나?
- 📖 **레퍼런스** — [MDN ARIA 기법](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Techniques) · [MDN ARIA Roles 참조](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles)

### 아키텍처·협업 (9)

#### [시니어] 파괴적 변경을 여러 배포에 걸쳐 어떻게 나누나?

**핵심 답**

- Parallel Change(Expand → Migrate → Contract): 새 형태를 추가하고, 소비자를 옮기고, 마지막에 옛 형태를 제거한다.
- 무중단·블루그린 배포에서는 구·신 버전이 일시 공존하므로 이 순서가 선택이 아니라 필수다.
- 각 단계는 단독 롤백이 가능해야 한다. 양쪽 쓰기·읽기 플래그로 경계를 만든다.
- 정리(Contract) 단계에 담당자와 기한을 붙이지 않으면 영구 부채가 된다.

- ✅ **좋은 신호** — 공존 구간을 전제로 단계를 설계하고 롤백 단위를 말한다.
- ⚠️ **약한 신호** — 한 번에 바꾸고 배포 순서로 맞춘다고 답한다.
- ↪️ **후속 질문** — 소비자가 사내 다른 팀이면 Contract 단계를 어떻게 진행하나?
- 📖 **레퍼런스** — [Martin Fowler — ParallelChange](https://martinfowler.com/bliki/ParallelChange.html)

#### [시니어] 컴포넌트 경계를 어디서 자르나?

**핵심 답**

- 같이 바뀌는 것끼리 묶고, 다른 이유로 바뀌는 것은 가른다(변경 이유 단위 응집).
- 분리 신호: props 폭발, 불리언 난립, 내부 분기 다수, 재사용마다 예외 추가.
- 상태 소유권을 먼저 정하고 그 경계에 컴포넌트를 맞춘다.
- 공용화는 세 번째 사례부터. 두 사례로 추상화하면 잘못된 추상이 남는다.

- ✅ **좋은 신호** — 판단 기준을 변경 이유와 상태 소유권으로 대고 되돌린 경험도 말한다.
- ⚠️ **약한 신호** — "재사용할 수 있게 작게 만든다"만 답한다.
- ↪️ **후속 질문** — 공용 컴포넌트가 앱마다 다르게 쓰여야 한다면?
- 📖 **레퍼런스** — [react.dev 상태 관리·구조](https://react.dev/learn/managing-state)

#### [시니어] 프론트엔드 장애를 어떻게 관측하나?

**핵심 답**

- 에러 트래킹(소스맵·릴리스 태깅), 필드 성능(RUM), 사용자 흐름 이벤트, 그리고 배포 시점과 지표를 연결한 알림.
- 이벤트 이름·속성 규칙을 정해 두지 않으면 데이터가 남아도 질문에 답할 수 없다.
- 실패 경로에 로그를 먼저 심는다(요청 실패, 재시도, 빈 상태). 성공 경로만 계측하면 장애가 안 보인다.
- 페이지 이탈 시 전송은 `sendBeacon`으로.

- ✅ **좋은 신호** — 관측 항목을 답해야 할 질문에서 역산하고 명명 규칙을 언급한다.
- ⚠️ **약한 신호** — 에러 트래킹 도구 설치로 끝낸다.
- ↪️ **후속 질문** — 사용자 제보만 있고 로그가 없는 장애는 어떻게 추적하나?
- 📖 **레퍼런스** — [MDN sendBeacon](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon) · [Sentry 소스맵](https://docs.sentry.io/platforms/javascript/sourcemaps/)

#### [시니어] 실시간 피드나 AI 채팅 화면을 설계한다면 무엇을 먼저 정하나?

**핵심 답**

- 전송 방식(SSE vs WebSocket)과 유실·재연결 보정 규칙.
- 스트리밍 토큰을 화면에 붙일 때 렌더 빈도 제어(프레임당 1회 배치), 긴 대화는 가상화.
- 중단·재생성·부분 실패 UX, 그리고 낙관적 사용자 메시지 표시와 서버 확정 사이의 재조정.
- 비용·레이트 리밋 처리, 재연결 시 스트림 재개 지점.

- ✅ **좋은 신호** — 스트리밍 렌더 비용과 유실 보정을 함께 말하고 취소 경로를 설계한다.
- ⚠️ **약한 신호** — 토큰을 받는 대로 setState한다고만 답한다.
- ↪️ **후속 질문** — 스트리밍 중 사용자가 탭을 떠났다면 어떻게 처리하나?
- 📖 **레퍼런스** — [MDN Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) · [MDN EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) · [web.dev 긴 작업 쪼개기](https://web.dev/articles/optimize-long-tasks)

#### [시니어] 기술 부채 정리나 리팩터를 어떻게 설득했나?

**핵심 답**

- 수치로 말한다: 리드타임, 버그 재발률, 번들 크기, p75 지표, 온보딩 시간.
- 크게 한 번이 아니라 기능 작업에 얹어 작게 쪼갠 계획으로 제안한다.
- 리스크와 롤백 계획을 함께 제시하고, 끝난 뒤 같은 지표를 다시 측정해 보고한다.

- ✅ **좋은 신호** — 승인받은 실제 사례와 사후 측정을 말한다.
- ⚠️ **약한 신호** — 코드가 더럽다는 주관적 표현만 쓴다.
- ↪️ **후속 질문** — 설득이 실패했을 때 어떻게 했나?
- 📖 **레퍼런스** — [web.dev 성능 예산](https://web.dev/articles/performance-budgets-101)

#### [시니어] 코드 리뷰에서 무엇을 막고 무엇을 넘기나?

**핵심 답**

- 막는다: 정확성·보안·데이터 손실·공개 계약 변경·롤백 불가 설계.
- 자동화한다: 포맷·네이밍 규칙·린트 가능한 규칙은 사람이 지적하지 않는다.
- 제안은 근거와 비용을 함께. 취향 논쟁은 팀 규칙으로 승격시켜 끝낸다.
- 라운드를 뭉쳐 왕복을 줄이고, 차단 항목과 선택 항목을 라벨로 구분한다.

- ✅ **좋은 신호** — 차단 기준을 명시하고 자동화로 옮긴 경험을 든다.
- ⚠️ **약한 신호** — 모든 지적을 동일한 무게로 남긴다.
- ↪️ **후속 질문** — 의견이 갈려 합의가 안 될 때 어떻게 끝내나?
- 📖 **레퍼런스** — [Testing Library 원칙(리뷰 기준 예)](https://testing-library.com/docs/guiding-principles)

#### [공통] 최근 가장 어려웠던 버그와 원인을 확정한 과정을 말해 보라.

**핵심 답**

- 재현 확보 → 가설 하나씩 측정 → 범인 변경 지점 특정(bisect·로그 대조) → 근본 원인 수정 → 재발 방지 테스트.
- 증상 수정과 근본 수정을 구분해 말하는지가 핵심 신호.
- 막다른 길과 틀린 가설을 솔직히 말하는 것이 감점이 아니다.

- ✅ **좋은 신호** — 측정 근거(로그·프로파일·커밋)를 들고 왜 그 결론인지 설명한다.
- ⚠️ **약한 신호** — "결국 캐시 문제였다" 같은 결론만 말하고 확정 과정이 없다.
- ↪️ **후속 질문** — 같은 종류의 버그가 다시 나지 않게 무엇을 바꿨나?
- 📖 **레퍼런스** — [Chrome DevTools 성능 프로파일링](https://developer.chrome.com/docs/devtools/performance)

#### [공통] 기획·디자인과 의견이 충돌했을 때 어떻게 했나?

**핵심 답**

- 요구의 배경(무엇을 해결하려는지)을 먼저 확인한다.
- 대안을 비용과 함께 제시한다: 구현 기간, 성능·접근성 영향, 유지 비용.
- 결정 기준을 사용자 영향으로 옮기고, 결정과 근거를 문서에 남긴다.

- ✅ **좋은 신호** — 관철 여부와 무관하게 판단 기준과 기록을 말한다.
- ⚠️ **약한 신호** — 기술적으로 불가능하다고 답해 끝냈다고 말한다.
- ↪️ **후속 질문** — 결정이 나중에 틀렸다고 판명되면 어떻게 되돌렸나?
- 📖 **레퍼런스** — [Martin Fowler — ParallelChange](https://martinfowler.com/bliki/ParallelChange.html)

#### [공통] 추정이 크게 틀린 경험이 있나?

**핵심 답**

- 불확실성을 분해했는지: 모르는 부분은 스파이크로 먼저 줄인다.
- 중간 보고 지점을 두어 틀린 추정을 빨리 드러낸다.
- 마감이 고정이면 범위를 협상한다. 품질을 조용히 깎는 선택은 나중에 더 비싸다.

- ✅ **좋은 신호** — 틀린 원인을 구조적으로 설명하고 이후 방식이 바뀐 점을 든다.
- ⚠️ **약한 신호** — 운이 나빴다거나 요구가 자주 바뀌었다는 설명에서 멈춘다.
- ↪️ **후속 질문** — 지금 같은 일을 다시 추정하면 무엇을 다르게 하나?
- 📖 **레퍼런스** — [Practical Test Pyramid(리스크 기반 판단 예)](https://martinfowler.com/articles/practical-test-pyramid.html)

## 출처

문항 선정은 2026년 채용 시장의 실제 질문 목록을 교차 확인해 뽑았고, 답과 판별 기준은 각 문항의 레퍼런스에 달린 공식 문서를 근거로 썼다 (MDN · web.dev · react.dev · TypeScript 핸드북 · OWASP · W3C ARIA APG/WCAG · TanStack Query · Testing Library · Playwright · webpack · Node.js · Nx · Martin Fowler · Sentry).

- [Frontend Developer Interview Questions in 2026 — OnlyFrontendJobs](https://www.onlyfrontendjobs.com/blog/frontend-developer-interview-questions-2026)
- [Frontend Developer Interview Questions 2026 — KORE1](https://www.kore1.com/frontend-developer-interview-questions/)
- [Deep JavaScript Interview Guide for 2025–2026 — Code With Seb](https://www.codewithseb.com/blog/deep-javascript-interview-guide-for-2025%E2%80%932026)
- [30 Senior Frontend Engineer Interview Questions for 2026 — Verve AI](https://www.vervecopilot.com/blog/senior-frontend-engineer-interview-questions)
- [카카오 출신 개발자가 정리한 프론트엔드 기술 면접 질문 TOP 20 — zero-base](https://zero-base.co.kr/event/media_insight_contents_FE_frontend_tech_Interview)
- [프론트엔드 기술 면접 질문 (한국어 모음집)](https://frontend-interview-question.vercel.app/)
- [How the Core Web Vitals metrics thresholds were defined — web.dev](https://web.dev/articles/defining-core-web-vitals-thresholds)

## 라이선스

문서·문항: CC BY 4.0. 레퍼런스로 링크한 외부 문서는 각 저작자의 라이선스를 따른다.
