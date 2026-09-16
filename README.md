# 프론트엔드 면접 문항집

> **TL;DR** — 프론트엔드 면접 문항 163개. 지식 문답 + 라이브 코딩 + 프론트 시스템 디자인 + 디버깅/코드리뷰 라운드 + 과제 + AI 도구 활용. 문항마다 핵심 답, 면접관이 볼 좋은/약한 신호, 꼬리질문 2~3단계와 단계별 기대 답, 답을 검증할 공식 문서 레퍼런스가 붙어 있다.
> **출처 주의** — 출제 이력 기록이 아니다. 공개 정리글에서 반복 등장하는 **주제**를 기준으로 고른 문항이고, 문항 문장과 답은 직접 썼다. [출처](#출처) 참고.
> 필터·검색·셀프 퀴즈가 되는 웹 페이지: **https://david-myeonghan.github.io/frontend-interview-kit/**

- 문항 163개 · 영역 19개
- 레벨 분포: 주니어 40 / 미들 68 / 시니어 52 / 공통 3
- 레퍼런스 링크 218개 (전부 HTTP 200 확인)
- 꼬리질문 342단계 — 문항마다 면접관이 파고드는 질문과 단계별 기대 답
- 코드 예제 114개 — 코드로 답해야 하는 72문항에 동작하는 예제 첨부

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

*클로저로 상태를 가둔다 — 그리고 누수가 되는 경로*

```js
function createCounter() {
  let count = 0;                      // 외부에서 접근 불가, 함수만 기억한다
  return { inc: () => ++count, get: () => count };
}

// 누수: 클로저가 큰 객체·DOM 을 붙잡은 채 리스너가 남는다
function attach(node, hugeData) {
  const onClick = () => console.log(hugeData.length);  // hugeData 를 계속 참조
  node.addEventListener("click", onClick);
  return () => node.removeEventListener("click", onClick);  // 해제 함수 필수
}
```

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

*출력 순서를 근거와 함께*

```js
console.log("1 sync");
setTimeout(() => console.log("5 macrotask"), 0);
queueMicrotask(() => console.log("3 microtask"));
Promise.resolve().then(() => console.log("4 microtask"));
console.log("2 sync");

// 1 sync → 2 sync → 3 microtask → 4 microtask → 5 macrotask
// 동기 코드 전부 → 마이크로태스크 큐를 "전부" 비움 → 렌더 기회 → 매크로태스크 1개
```

*마이크로태스크 기아 — 화면이 멈춘다*

```js
// 나쁨: 마이크로태스크가 자기를 재등록 → 렌더 기회가 오지 않는다
function drain(queue) {
  if (!queue.length) return;
  process(queue.pop());
  Promise.resolve().then(() => drain(queue));
}

// 좋음: 프레임에 양보한다
async function drainYielding(queue) {
  while (queue.length) {
    process(queue.pop());
    if (navigator.scheduling?.isInputPending?.()) await scheduler.yield();
  }
}
```

- ✅ **좋은 신호** — 순서를 맞히고 큐 구조로 설명하며, 마이크로태스크 기아 같은 실제 증상까지 연결한다.
- ⚠️ **약한 신호** — "비동기는 나중에 실행된다" 수준. 두 큐의 우선순위를 모른다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. requestAnimationFrame 은 이 순서의 어디에 들어가나?
     - 기대 답: 마이크로태스크 처리 후 렌더 단계 직전. setTimeout 보다 프레임에 정확히 붙는다.
  2. 마이크로태스크가 계속 자기를 등록하면 화면은 어떻게 되나?
     - 기대 답: 렌더 기회가 오지 않아 화면이 멈춘다(입력도 막힌다). 작업을 매크로태스크로 쪼개거나 scheduler.yield 로 양보해야 한다.
  3. 그 증상을 프로파일러에서 어떻게 식별하나?
     - 기대 답: Long Task 로 잡히고 프레임이 비어 있다. 호출 스택 상단에 같은 함수가 반복 등장한다.
- 📖 **레퍼런스** — [MDN Execution model (event loop)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model) · [MDN scheduler.yield](https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/yield)

#### [미들] `this`는 어떻게 결정되나? 콜백으로 넘기면 왜 깨지나?

**핵심 답**

- 호출 형태가 결정한다: 일반 호출(undefined/전역), 메서드 호출(점 앞 객체), `new`(새 인스턴스), `call/apply/bind`(명시).
- 화살표 함수는 호출과 무관하게 정의 시점의 `this`를 가져온다.
- 메서드를 참조만 떼어 콜백으로 넘기면 점 앞 객체가 사라져 바인딩이 유실된다 → `bind` 또는 클래스 필드 화살표.

*콜백으로 넘기면 바인딩이 유실된다*

```js
const timer = {
  label: "upload",
  report() { console.log(this.label); },
};

timer.report();                       // "upload"  — 점 앞 객체가 this
setTimeout(timer.report, 0);          // undefined — 참조만 떼어 냈다
setTimeout(() => timer.report(), 0);  // "upload"  — 호출 형태를 유지
setTimeout(timer.report.bind(timer), 0);  // "upload"
```

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

*1단 복사 vs 깊은 복사 — 손실 지점*

```js
const state = { user: { name: "다윗" }, at: new Date(), tags: undefined };

const shallow = { ...state };
shallow.user.name = "변경";
state.user.name;                 // "변경"  — 중첩 객체는 참조 공유

const viaJson = JSON.parse(JSON.stringify(state));
typeof viaJson.at;               // "string" — Date 가 문자열로, tags 는 사라짐

const clone = structuredClone(state);   // Date·Map·순환 참조 보존(함수·DOM 은 불가)
```

*상태 갱신은 바뀐 경로만 새로*

```js
// 전량 복사 대신 구조적 공유 — 참조 비교로 리렌더를 가를 수 있다
const next = {
  ...state,
  user: { ...state.user, name: "다윗" },
};
next.tags === state.tags;   // true — 바뀌지 않은 가지는 같은 참조
```

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

*all 은 하나 실패로 전체 reject — 남은 요청은 취소되지 않는다*

```js
// 부분 실패를 화면에 보여야 하면 allSettled
const results = await Promise.allSettled([loadCases(), loadQuota(), loadNotices()]);
for (const r of results) {
  if (r.status === "fulfilled") render(r.value);
  else renderWidgetError(r.reason);          // 위젯 하나만 에러 표시
}
```

*타임아웃은 race 가 아니라 신호로*

```js
// race 로 타임아웃을 만들면 원 요청이 계속 살아 있다
const res = await fetch("/api/cases", { signal: AbortSignal.timeout(5000) });

// 여러 신호를 합칠 때
const signal = AbortSignal.any([userCancel.signal, AbortSignal.timeout(5000)]);
```

- ✅ **좋은 신호** — 부분 실패 UX를 기준으로 골라내고, reject 후 남은 요청 처리와 취소 수단을 구분한다.
- ⚠️ **약한 신호** — 이름별 동작만 암기해 말하고 어떤 화면에 쓸지 예를 못 든다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 요청 3개 중 2개가 실패한 화면을 어떻게 보여줄 건가?
     - 기대 답: allSettled 로 부분 성공을 표시하고 실패 위젯만 재시도 가능하게. 전체 화면 에러로 덮지 않는다.
  2. 그 재시도가 서버에 위험할 수 있나?
     - 기대 답: 멱등하지 않은 요청이면 중복 생성이 생긴다. 재시도는 조회·멱등 요청으로 제한하거나 요청 키를 쓴다.
- 📖 **레퍼런스** — [MDN Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) · [MDN Promise.allSettled](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) · [MDN AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) · [MDN AbortSignal.any()](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/any_static)

#### [미들] async 함수의 에러가 조용히 사라지는 경우를 아는가?

**핵심 답**

- `await` 없이 호출하면 거부가 처리되지 않고 unhandled rejection으로 흐른다.
- `forEach`에 async 콜백을 넣으면 반환된 Promise가 버려진다 → `for...of` 또는 `Promise.all(map())`.
- `setTimeout` 콜백 내부 throw는 바깥 try/catch가 못 잡는다.
- 전역 `unhandledrejection`·`error` 핸들러로 수집해 에러 트래킹에 보낸다.

*에러가 조용히 사라지는 네 경로*

```js
// 1) await 누락 → unhandled rejection
save(payload);                 // 실패해도 호출부는 모른다
await save(payload);

// 2) forEach + async → 반환된 Promise 가 버려진다
items.forEach(async (i) => await save(i));          // 나쁨
await Promise.all(items.map((i) => save(i)));       // 좋음

// 3) 타이머 콜백의 throw 는 바깥 try/catch 가 못 잡는다
try { setTimeout(() => { throw new Error("boom"); }, 0); } catch { /* 안 잡힌다 */ }

// 4) 마지막 그물
addEventListener("unhandledrejection", (e) => report(e.reason));
addEventListener("error", (e) => report(e.error));
```

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

*DOM 에 메타데이터를 붙이되 수명을 늘리지 않는다*

```js
const meta = new WeakMap();

function track(node, info) {
  meta.set(node, info);          // 강한 Map 이면 노드 제거 후에도 회수되지 않는다
}

// 노드가 DOM 에서 사라지고 다른 참조가 없으면 엔트리도 회수 대상
// 단, 회수 시점은 보장되지 않는다 → 정리 로직의 유일한 수단으로 쓰지 않는다
```

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

*값 복사 vs 참조 복사*

```js
let a = 1, b = a; b = 2;        // a === 1 (값 복사)

const o1 = { n: 1 };
const o2 = o1; o2.n = 2;        // o1.n === 2 (주소 복사)

function mutate(obj) { obj.n = 99; }   // 인자 변경이 호출부에 보인다
mutate(o1); o1.n;               // 99

({ n: 1 }) === ({ n: 1 });      // false — 내용이 같아도 참조가 다르다
```

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

*|| 가 0 을 덮어쓰는 버그*

```js
const settings = { retries: 0, label: "" };

settings.retries || 3;   // 3   ← 0 이 falsy 라서 기본값이 끼어든다 (버그)
settings.retries ?? 3;   // 0   ← null/undefined 일 때만 기본값
settings.label   ?? "무제";  // ""

// 옵셔널 체이닝은 "없을 수 있는" 값에만
user.profile?.avatar?.url         // 선택 필드
order?.total.toFixed(2)           // 필수 값을 가리면 원인 추적이 늦어진다
```

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

*reduce 로 객체를 누적할 때의 O(n²)*

```js
// 나쁨: 매 회 새 객체를 만든다
const byId = items.reduce((acc, it) => ({ ...acc, [it.id]: it }), {});

// 좋음: 누적 객체를 직접 채우거나 Map
const byId2 = items.reduce((acc, it) => { acc[it.id] = it; return acc; }, {});
const byId3 = new Map(items.map((it) => [it.id, it]));

// 중간 탈출이 필요하면 for...of — reduce 로 억지로 만들지 않는다
for (const it of items) if (it.broken) { report(it); break; }
```

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

*두 축은 다르다: 기본 동작 vs 전파*

```js
form.addEventListener("submit", (e) => {
  e.preventDefault();        // 페이지 새로고침(기본 동작)만 막는다. 전파는 계속
  submitViaFetch();
});

menu.addEventListener("click", (e) => {
  e.stopPropagation();       // 상위의 "바깥 클릭 닫기"가 죽는다 — 범위를 좁혀 쓴다
});

// passive 리스너에서는 preventDefault 가 무시된다(경고)
el.addEventListener("touchmove", onMove, { passive: true });
```

*스크롤 제어는 CSS 로*

```css
.pan-area { touch-action: pan-y; }   /* 가로 제스처만 차단, JS 개입 없음 */
```

- ✅ **좋은 신호** — 두 축(기본 동작 / 전파)을 분명히 나누고 각각의 증상을 예로 든다.
- ⚠️ **약한 신호** — 둘을 같이 호출하는 습관만 있고 차이를 설명하지 못한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 스크롤 성능 때문에 passive 리스너를 쓰면 preventDefault 는 어떻게 되나?
     - 기대 답: 무시된다(경고). 기본 동작을 막아야 하면 passive 를 쓸 수 없다.
  2. 그럼 터치 제스처에서 스크롤만 막으려면?
     - 기대 답: CSS touch-action 으로 선언적으로 제한한다. JS 로 막는 것보다 성능이 좋다.
- 📖 **레퍼런스** — [MDN preventDefault](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) · [MDN stopPropagation](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation) · [MDN touch-action](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action)

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

*border-box 리셋과 마진 병합*

```css
*, *::before, *::after { box-sizing: border-box; }
/* content-box: width 200 + padding 32 + border 2 = 실제 234 */
/* border-box:  지정한 200 이 최종 너비 */

.card { width: 200px; padding: 16px; border: 1px solid; }

/* 마진 병합: 인접 형제의 수직 마진이 합쳐지지 않고 큰 값만 남는다 */
.a { margin-bottom: 24px; }
.b { margin-top: 16px; }            /* 간격은 40px 이 아니라 24px */

/* 병합을 피하는 가장 단순한 방법 = 레이아웃이 간격을 소유한다 */
.stack { display: flex; flex-direction: column; gap: 24px; }
```

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

*쌓임 맥락을 만드는 속성들*

```css
/* 부모가 맥락을 만들면 자식 z-index 는 그 안에서만 경쟁한다 */
.parent {
  position: relative;
  z-index: 1;          /* 맥락 생성 */
  /* transform / filter / opacity < 1 / will-change / contain 도 생성한다 */
}
.child { position: absolute; z-index: 9999; }   /* 여전히 .parent 위로는 못 간다 */

/* 레이어는 토큰으로 관리한다 */
:root { --z-dropdown: 100; --z-modal: 1000; --z-toast: 1100; }
```

*잘림 문제는 구조로 푼다*

```jsx
// overflow:hidden 부모 밖으로 렌더
createPortal(<Dropdown />, document.body);
```

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

*sticky 가 안 되는 원인 3개*

```css
.wrap { overflow: hidden; }       /* ① 조상 overflow → 스크롤 컨테이너가 바뀐다 */

.header {
  position: sticky;
  /* top 미지정 → 임계점이 없어 붙지 않는다 ② */
  top: env(safe-area-inset-top, 0px);
}

.section { height: auto; }        /* ③ 부모 높이에 여유가 없으면 고정 구간이 없다 */

/* 앵커가 헤더에 가려지는 문제 */
:target { scroll-margin-top: var(--header-h, 56px); }
```

- ✅ **좋은 신호** — 조상 overflow를 1순위로 의심하고 DevTools로 확인하는 절차를 말한다.
- ⚠️ **약한 신호** — 브라우저 버그로 돌린다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 모바일 상단 바가 겹칠 때 safe-area 는 어떻게 처리하나?
     - 기대 답: env(safe-area-inset-top) 을 고정 요소의 padding 에 더한다. 뷰포트 메타에 viewport-fit=cover 가 필요하다.
  2. sticky 헤더와 스크롤 앵커링이 충돌하면?
     - 기대 답: scroll-margin-top 으로 앵커 위치를 보정한다. 헤더 높이를 변수로 두고 공유한다.
- 📖 **레퍼런스** — [MDN position](https://developer.mozilla.org/en-US/docs/Web/CSS/position) · [MDN scroll-margin](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin)

#### [주니어] 요소를 가로·세로 중앙에 두는 방법을 여러 개 말해 보라.

**핵심 답**

- 부모에 `display:flex; place-items:center` 또는 grid + `place-content:center`.
- `position:absolute; inset:0; margin:auto`, 또는 `top:50%; left:50%; translate:-50% -50%`(크기를 몰라도 된다).
- 텍스트 한 줄은 `line-height`로도 되지만 다중 행에서 깨진다.

*중앙 정렬 4가지와 제약*

```css
.a { display: grid; place-items: center; }              /* 부모 높이 필요 */
.b { display: flex; align-items: center; justify-content: center; }
.c { position: absolute; inset: 0; margin: auto; width: 120px; height: 40px; }
.d { position: absolute; top: 50%; left: 50%; translate: -50% -50%; }  /* 크기 몰라도 됨 */

/* 모바일 뷰포트: 100vh 는 주소창을 포함해 잘린다 */
.screen { min-height: 100dvh; }
```

- ✅ **좋은 신호** — 부모 높이를 모르는 경우, 스크롤이 생기는 경우 등 제약별로 고른다.
- ⚠️ **약한 신호** — 한 가지만 알고 왜 다른 상황에서 깨지는지 모른다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 뷰포트 높이를 100vh 로 잡으면 모바일에서 왜 잘리나?
     - 기대 답: 주소창 포함 높이로 계산돼 실제 보이는 영역보다 크다. dvh/svh 또는 100% 기반으로 바꾼다.
  2. 키보드가 올라올 때 입력창을 어떻게 보이게 하나?
     - 기대 답: visualViewport 이벤트로 보정하거나 스크롤 인투 뷰. 고정 하단 바는 키보드와 겹치기 쉽다.
- 📖 **레퍼런스** — [MDN grid 정렬](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout) · [MDN 길이 단위(dvh)](https://developer.mozilla.org/en-US/docs/Web/CSS/length)

#### [시니어] 디자인 토큰과 CSS 커스텀 프로퍼티로 다크 모드를 설계한다면?

**핵심 답**

- 토큰 전량을 기본 `:root`에 선언하고 다크에서는 **토큰만** 재정의한다.
- 컴포넌트는 리터럴 색을 쓰지 않고 토큰만 참조한다. 미디어 쿼리 안에만 정의된 색은 조건이 어긋난 상태에서 미정의가 되어 대비 사고를 만든다.
- 사용자의 명시적 토글과 시스템 설정 두 축을 모두 다루려면 속성 선택자와 `prefers-color-scheme`을 겹쳐 우선순위를 정한다.
- 의미 색(성공·경고·위험)은 브랜드 액센트와 분리하고 대비는 WCAG 기준으로 검증한다.

*토큰은 전량 :root 에, 다크는 토큰만 재정의*

```css
:root {                          /* 완전한 라이트 팔레트 */
  --bg: #ffffff; --fg: #131a24; --accent: #1f4d7a;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {        /* 명시적 라이트 선택이 이긴다 */
    --bg: #0f141a; --fg: #e7ecf2; --accent: #7fb3e0;
  }
}
:root[data-theme="dark"] { --bg: #0f141a; --fg: #e7ecf2; --accent: #7fb3e0; }

body { background: var(--bg); color: var(--fg); }   /* 컴포넌트는 토큰만 참조 */

/* 안티패턴: 미디어 쿼리 안에만 정의된 색 → 조건이 어긋난 상태에서 미정의 */
```

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

*명시도와 :where() / @layer*

```css
#app .btn.primary { color: red; }    /* id 1, class 2 */
.btn.primary      { color: blue; }   /* 짐 */

/* :where() 안은 명시도 0 → 덮어쓰기 쉬운 기본값 */
:where(.btn) { padding: 8px 12px; }

/* 레이어로 출처 순서를 정하면 명시도 경쟁이 필요 없다 */
@layer reset, base, components, overrides;
@layer components { .btn { color: blue; } }
@layer overrides  { .btn { color: red; } }   /* 명시도가 낮아도 이긴다 */
```

- ✅ **좋은 신호** — 가중치 순서를 말하고 명시도 문제를 구조로 푸는 방향을 제시한다.
- ⚠️ **약한 신호** — 안 먹히면 `!important`를 붙인다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. :where() 가 명시도에 미치는 영향은?
     - 기대 답: 명시도가 0 이 되어 덮어쓰기 쉬운 기본 스타일을 만들 수 있다. 리셋·라이브러리 기본값에 유용.
  2. 캐스케이드 레이어(@layer)는 어떤 문제를 푸나?
     - 기대 답: 출처 순서를 명시적으로 정해 명시도 경쟁 없이 우선순위를 관리한다.
- 📖 **레퍼런스** — [MDN 명시도](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Specificity) · [MDN @layer](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)

#### [주니어] `display`의 block, inline, inline-block, none 차이는?

**핵심 답**

- block은 한 줄 전체를 차지하고 width·height·수직 마진이 적용된다.
- inline은 콘텐츠 폭만 차지하고 width·height와 수직 마진이 무시된다.
- inline-block은 줄 안에 놓이지만 크기 지정이 된다.
- `none`은 레이아웃에서 제거된다(접근성 트리에서도 사라짐). 숨기되 낭독은 남기려면 시각적 숨김 기법을 쓴다.

*display 차이와 '시각적으로만 숨기기'*

```css
.inline  { display: inline; width: 200px; height: 40px; }  /* width·height 무시 */
.iblock  { display: inline-block; }                        /* 줄 안 + 크기 적용 */
.block   { display: block; }
.gone    { display: none; }        /* 접근성 트리에서도 사라진다 */

/* 화면에서만 감추고 스크린리더에는 남긴다 */
.visually-hidden {
  position: absolute; width: 1px; height: 1px;
  margin: -1px; padding: 0; overflow: hidden;
  clip-path: inset(50%); white-space: nowrap;
}
```

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

*단위 선택 — 사용자 글자 크기를 존중*

```css
html { font-size: 100%; }              /* 사용자 설정 기준 = 16px 가정 금지 */

.title  { font-size: 1.5rem; }          /* 루트 기준 — 타이포·간격 기본 */
.icon   { width: 1em; height: 1em; }    /* 요소 폰트 비례 — 중첩되면 누적 */
.col    { width: 50%; }                 /* 부모 기준 */
.hero   { padding-block: clamp(24px, 5vw, 64px); }   /* 뷰포트 기준 + 상·하한 */
.border { border-width: 1px; }          /* 확대와 무관해야 하는 곳은 px */

/* 고정 높이 + px 폰트는 200% 확대에서 잘린다 */
.chip { min-height: 2.5rem; height: auto; }
```

- ✅ **좋은 신호** — 접근성(사용자 글자 크기)을 이유로 rem을 고르는 근거를 댄다.
- ⚠️ **약한 신호** — 모든 값을 px로 고정한다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 글자 크기만 키운 사용자의 화면에서 레이아웃이 깨지지 않게 하려면?
     - 기대 답: 고정 높이·px 폰트를 피하고 rem 기반 간격, 내용에 따라 늘어나는 컨테이너. 200% 확대 테스트로 검증.
  2. 최소 폰트 크기를 px 로 고정하면 무엇이 문제인가?
     - 기대 답: 사용자 설정을 무시해 접근성 요건을 위반할 수 있다.
- 📖 **레퍼런스** — [MDN CSS 값과 단위](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Values_and_units) · [MDN clamp()](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)

### 네트워크·HTTP (10)

#### [미들] 정적 자산과 HTML의 캐시 헤더를 어떻게 설정하나?

**핵심 답**

- 콘텐츠 해시가 붙은 JS/CSS/이미지: `Cache-Control: public, max-age=31536000, immutable`.
- HTML 엔트리: `no-cache`로 매번 검증. 그래야 새 배포가 즉시 반영된다.
- `ETag`/`Last-Modified`로 조건부 요청 → 304. `stale-while-revalidate`로 체감 지연 제거.
- 브라우저 캐시와 CDN 캐시를 구분하고(`s-maxage`) 배포 시 무효화 대상을 정한다.

*해시 자산과 HTML 은 정책이 다르다*

```http
# 콘텐츠 해시가 붙은 정적 자산 — 1년 + immutable
Cache-Control: public, max-age=31536000, immutable

# HTML 엔트리 — 매번 검증(새 배포 즉시 반영)
Cache-Control: no-cache

# API 응답 — 짧게 캐시 + 재검증 허용
Cache-Control: private, max-age=0, stale-while-revalidate=60
ETag: "c-42-7"

# CDN 만 더 오래 (브라우저와 분리)
Cache-Control: max-age=0, s-maxage=600
```

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

*preflight 를 부르는 조건과 서버 응답*

```http
# 이 요청은 단순 요청이 아니다 → OPTIONS 가 먼저 나간다
POST /api/cases HTTP/1.1
Content-Type: application/json          # 단순 요청 허용 타입이 아니다
X-Request-Id: abc                        # 커스텀 헤더 하나로도 트리거

# 서버 preflight 응답
Access-Control-Allow-Origin: https://app.example.com   # credentials 면 * 불가
Access-Control-Allow-Methods: POST, GET
Access-Control-Allow-Headers: Content-Type, X-Request-Id
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 600              # preflight 결과 캐시
```

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

*자원별 캐시 전략 — 인증 응답은 캐시하지 않는다*

```js
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.mode === "navigate") {                 // HTML: 네트워크 우선
    event.respondWith(fetch(request).catch(() => caches.match("/offline.html")));
    return;
  }
  if (url.pathname.startsWith("/api/")) return;      // 인증 응답: 손대지 않는다
  if (/\.(js|css|woff2|avif)$/.test(url.pathname)) { // 해시 자산: 캐시 우선
    event.respondWith(caches.match(request).then((hit) => hit ?? fetchAndPut(request)));
  }
});
```

*업데이트 게이트 — 옛 버전 고착을 막는다*

```js
// 페이지: 새 워커가 대기 중이면 사용자에게 알린 뒤 적용
const reg = await navigator.serviceWorker.register("/sw.js");
reg.addEventListener("updatefound", () => {
  reg.installing?.addEventListener("statechange", (e) => {
    if (e.target.state === "installed" && navigator.serviceWorker.controller) {
      showReloadBanner(() => { reg.waiting?.postMessage("SKIP_WAITING"); });
    }
  });
});
navigator.serviceWorker.addEventListener("controllerchange", () => location.reload());
```

- ✅ **좋은 신호** — 업데이트 게이트와 자원별 캐시 정책을 나눠 말하고 사고 경험을 든다.
- ⚠️ **약한 신호** — PWA 플러그인을 켰다는 설명에서 멈춘다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 사용자가 옛 버전에 갇혔다면 어떻게 강제로 올리나?
     - 기대 답: 새 워커 활성화 신호를 받아 사용자에게 갱신을 안내하거나 안전 지점에서 자동 적용. 강제 skipWaiting 은 열린 탭을 깨뜨릴 수 있다.
  2. 오프라인 캐시가 인증 응답을 담아 버리면?
     - 기대 답: 다른 사용자에게 노출될 수 있다. 인증 응답은 캐시 금지, 로그아웃 시 캐시 삭제.
- 📖 **레퍼런스** — [MDN Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) · [web.dev 서비스워커 캐시 전략](https://web.dev/articles/service-workers-cache-storage) · [MDN Cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache)

### 보안 (6)

#### [미들] XSS의 종류와 실질적인 방어를 설명하라.

**핵심 답**

- 저장형(서버에 남아 모든 사용자에게), 반사형(요청 파라미터가 그대로 출력), DOM 기반(클라이언트가 위험한 싱크에 직접 넣음).
- 방어의 본질은 출력 컨텍스트별 인코딩이다. HTML 본문·속성·URL·인라인 JS가 각각 다른 처리를 요구한다.
- 프레임워크 기본 이스케이프를 유지하고 `innerHTML`·`dangerouslySetInnerHTML`은 금지하거나 sanitizer를 거친다.
- 사용자 입력 URL은 스킴 검증(`javascript:` 차단). CSP는 2차 방어선.

*위험한 싱크와 안전한 렌더*

```jsx
// 저장형 XSS: 사용자 입력이 HTML 로 실행된다
<div dangerouslySetInnerHTML={{ __html: comment.body }} />   // 금지

// 텍스트로 렌더 — 프레임워크 기본 이스케이프를 유지
<div>{comment.body}</div>

// 서식이 필요하면 허용 목록 sanitizer 를 거친다(raw HTML 허용 끄기)
<div dangerouslySetInnerHTML={{ __html: sanitize(comment.body) }} />
```

*URL 스킴도 입력이다*

```js
const SAFE = /^(https?:|mailto:|\/)/i;
const href = SAFE.test(userUrl) ? userUrl : "#";   // javascript: 차단
```

- ✅ **좋은 신호** — 위험 싱크 목록을 알고, 입력 필터링이 아니라 출력 인코딩이 본질이라고 말한다.
- ⚠️ **약한 신호** — "입력값을 필터링한다"로 끝낸다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 마크다운 렌더링 기능을 안전하게 만들려면?
     - 기대 답: 허용 목록 기반 sanitizer 를 서버·클라 양쪽에 적용하고 raw HTML 허용을 끈다. 링크 스킴 검증까지.
  2. sanitizer 를 통과하는 공격이 있나?
     - 기대 답: 설정 오류(허용 태그·속성 과다), mXSS, SVG·MathML 경로. 라이브러리 업데이트와 CSP 2차 방어가 필요하다.
  3. CSP 가 있으면 sanitizer 를 빼도 되나?
     - 기대 답: 안 된다. CSP 는 실행 차단이고 DOM 오염 자체는 막지 못한다.
- 📖 **레퍼런스** — [OWASP XSS 방어 치트시트](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) · [OWASP DOM XSS 치트시트](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) · [DOMPurify(허용목록 sanitizer)](https://github.com/cure53/DOMPurify)

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

*Authorization Code + PKCE (implicit 금지)*

```js
// 1) verifier 생성 → challenge 로 인증 요청
const verifier = base64url(crypto.getRandomValues(new Uint8Array(32)));
const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
const challenge = base64url(new Uint8Array(digest));
sessionStorage.setItem("pkce_verifier", verifier);

location.assign("https://auth.example.com/authorize?" + new URLSearchParams({
  response_type: "code",                 // 토큰을 URL 로 받지 않는다
  client_id: CLIENT_ID,
  redirect_uri: REDIRECT_URI,
  code_challenge: challenge,
  code_challenge_method: "S256",
  state: crypto.randomUUID(),            // CSRF 방어
  scope: "openid profile",
}));
```

*다중 탭 갱신 경합을 막는다*

```js
// 같은 리프레시 토큰을 두 탭이 동시에 쓰면 회전 정책이 서로를 무효화한다
export const refresh = () => navigator.locks.request("token-refresh", async () => {
  if (Date.now() < expiresAt - 5000) return accessToken;   // 다른 탭이 이미 갱신
  const res = await fetch("/auth/refresh", { method: "POST", credentials: "include" });
  if (!res.ok) { logout(); throw new Error("refresh failed"); }  // 루프 차단
  ({ accessToken, expiresAt } = await res.json());
  return accessToken;
});
```

- ✅ **좋은 신호** — PKCE 채택 이유와 토큰 수명·회전 정책을 말하고 다중 탭 경합까지 다룬다.
- ⚠️ **약한 신호** — 프레임워크 라이브러리를 붙였다는 설명에서 멈춘다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 리프레시 토큰이 탈취됐다고 판단되면 무엇을 하나?
     - 기대 답: 해당 세션 계열 전체 무효화(회전 재사용 감지), 사용자 알림, 영향 범위 조사. 토큰만 재발급하면 공격자도 함께 갱신된다.
  2. 탈취를 탐지할 신호는 무엇을 보나?
     - 기대 답: 같은 리프레시 토큰의 재사용, 기기·지역 급변, 비정상 갱신 빈도.
  3. SPA 에서 implicit 흐름을 아직 쓰면 무엇이 위험한가?
     - 기대 답: 토큰이 URL 에 노출되고 히스토리·리퍼러로 유출된다. Authorization Code + PKCE 로 옮긴다.
- 📖 **레퍼런스** — [RFC 7636 — PKCE](https://datatracker.ietf.org/doc/html/rfc7636) · [OAuth 2.0 for Browser-Based Apps](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps) · [OWASP 세션 관리](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) · [MDN Web Locks API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API) · [MDN SubtleCrypto.digest()](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest)

#### [시니어] iframe이나 위젯과 `postMessage`로 통신할 때 무엇을 검증하나?

**핵심 답**

- 수신 측은 `event.origin`을 화이트리스트와 대조하고, 메시지 스키마를 검증한다. 검증 없는 `postMessage` 핸들러는 크로스 오리진 침입 경로다.
- 송신 측은 대상 오리진을 `"*"`가 아닌 정확한 값으로 지정한다.
- 임베드 쪽 신뢰 경계를 문서화하고, 위젯에 권한을 넘길 때는 sandbox 속성과 권한 정책으로 좁힌다.

*origin 과 스키마를 둘 다 검증*

```js
const ALLOWED = new Set(["https://widget.example.com"]);

addEventListener("message", (e) => {
  if (!ALLOWED.has(e.origin)) return;              // ① 출처 확인
  const msg = WidgetMessage.safeParse(e.data);     // ② 스키마 확인
  if (!msg.success) return;
  handle(msg.data);
});

// 송신: 대상 오리진을 정확히 지정한다("*" 금지)
iframe.contentWindow.postMessage({ type: "init", locale }, "https://widget.example.com");
```

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

*인덱스 key 가 입력값을 다른 행에 붙인다*

```jsx
// 나쁨: 앞에 항목을 추가하면 모든 key 가 밀린다
{rows.map((row, i) => <Row key={i} row={row} />)}

// 좋음: 안정적인 id
{rows.map((row) => <Row key={row.id} row={row} />)}

// 의도적 초기화: key 를 바꿔 서브트리를 재마운트
<EditForm key={caseId} caseId={caseId} />
```

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

*클린업 + 요청 취소 + 경합 차단*

```jsx
useEffect(() => {
  const controller = new AbortController();
  let alive = true;

  (async () => {
    try {
      const res = await fetch("/api/case/" + caseId, { signal: controller.signal });
      const data = await res.json();
      if (alive) setCase(data);            // 언마운트 후 setState 방지
    } catch (err) {
      if (err.name !== "AbortError") setError(err);
    }
  })();

  return () => { alive = false; controller.abort(); };   // 겹친 요청도 취소
}, [caseId]);                                            // 의존성을 비우면 stale
```

*이펙트가 필요 없는 경우*

```jsx
// 나쁨: 파생 값을 이펙트로 동기화
useEffect(() => setFullName(first + " " + last), [first, last]);

// 좋음: 렌더 중 계산
const fullName = first + " " + last;
```

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

*참조 동일성이 소비자에게 의미 있을 때만*

```jsx
const Row = memo(function Row({ item, onSelect }) { /* … */ });

function List({ items }) {
  // onSelect 를 매 렌더 새로 만들면 memo(Row) 가 전부 무효화된다
  const onSelect = useCallback((id) => select(id), []);
  // 비싼 계산만 메모
  const sorted = useMemo(() => [...items].sort(byName), [items]);

  return sorted.map((item) => <Row key={item.id} item={item} onSelect={onSelect} />);
}
```

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

*Provider value 를 메모하고 Context 를 쪼갠다*

```jsx
// 나쁨: 매 렌더 새 객체 → 모든 소비자 리렌더
<AppContext.Provider value={{ user, setUser }}>

// 좋음: 자주 바뀌는 값과 안 바뀌는 값을 분리 + 메모
const actions = useMemo(() => ({ setUser, logout }), []);   // 거의 불변
<UserStateContext.Provider value={user}>
  <UserActionsContext.Provider value={actions}>{children}</UserActionsContext.Provider>
</UserStateContext.Provider>
```

*부분 구독이 필요하면 selector 스토어*

```jsx
// 새 배열을 반환하는 selector → 매 렌더 변경 판정(루프 위험)
const open = useStore((s) => s.items.filter((i) => i.open));           // 나쁨
const openCount = useStore((s) => s.items.reduce((n, i) => n + (i.open ? 1 : 0), 0));  // 원시값
```

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

*이중 호출에서 드러나는 결함과 수정*

```jsx
// 나쁨: 멱등하지 않다 — 개발에서 이벤트가 두 번 간다
useEffect(() => { track("case_opened", { caseId }); }, [caseId]);

// 좋음: 전송 계층에서 중복 제거 키를 쓴다
useEffect(() => {
  const key = "case_opened:" + caseId;
  if (sentOnce.has(key)) return;
  sentOnce.add(key);
  track("case_opened", { caseId });
}, [caseId]);

// 구독형은 클린업만 제대로 두면 이중 호출에 안전하다
useEffect(() => {
  const sub = socket.subscribe(caseId, onMessage);
  return () => sub.unsubscribe();
}, [caseId]);
```

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

*재조정을 깨뜨리는 대표 패턴*

```jsx
// 나쁨: 렌더마다 새 컴포넌트 타입 → 서브트리 언마운트·재마운트, 상태 소실
function Page() {
  function Panel() { return <input />; }     // 매 렌더 새 함수 = 새 타입
  return <Panel />;
}

// 좋음: 컴포넌트는 모듈 스코프에 정의
function Panel() { return <input />; }
function Page() { return <Panel />; }
```

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

*제어 / 비제어 / 흔한 실수*

```jsx
// 제어: state 가 값을 소유 — 검증·포맷팅에 유리
<input value={name} onChange={(e) => setName(e.target.value)} />

// 비제어: DOM 이 소유 — 큰 폼에서 렌더가 적다
<input defaultValue={name} ref={nameRef} />

// 실수: value 만 주고 onChange 를 빼면 입력이 안 된다(읽기 전용처럼 보인다)
<input value={name} />          // React 가 경고한다
```

*큰 폼은 제출 시 한 번에 읽는다*

```jsx
function onSubmit(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.currentTarget));
  save(data);                    // 키 입력마다 리렌더하지 않는다
}
```

- ✅ **좋은 신호** — 폼 크기·검증 요구로 선택 기준을 대고 흔한 실수를 안다.
- ⚠️ **약한 신호** — 항상 제어 컴포넌트가 정답이라고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 입력마다 렌더되는 큰 폼의 성능을 어떻게 개선하나?
     - 기대 답: 필드 단위 구독(비제어 + 폼 라이브러리)이나 렌더 범위 분리. 값 전체를 상위 state 하나에 두지 않는다.
  2. 검증은 언제 실행하나?
     - 기대 답: 블러·제출 시 기본, 실시간 검증은 디바운스. 매 키 입력 전체 검증은 비용이 크다.
- 📖 **레퍼런스** — [react.dev input](https://react.dev/reference/react-dom/components/input) · [react.dev 상태 공유](https://react.dev/learn/sharing-state-between-components) · [MDN FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)

#### [주니어] 조건부 렌더링에서 `0`이 화면에 찍히는 이유는?

**핵심 답**

- `{count && <Badge/>}`에서 `count`가 `0`이면 `&&`가 `0`을 반환하고 React는 숫자 `0`을 렌더한다.
- `false`·`null`·`undefined`는 렌더되지 않지만 `0`과 `NaN`은 렌더된다.
- 해결은 명시적 비교(`count > 0 ? … : null`) 또는 `Boolean(count) &&`.

*0 이 화면에 찍히는 이유*

```jsx
// 나쁨: count 가 0 이면 && 가 0 을 반환하고 React 는 숫자 0 을 렌더한다
{count && <Badge count={count} />}

// 좋음: 명시적 비교
{count > 0 && <Badge count={count} />}
{count > 0 ? <Badge count={count} /> : null}

// false·null·undefined 는 렌더되지 않지만 0·NaN 은 렌더된다
```

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

*Suspense 경계는 로딩 단위와 맞춘다*

```jsx
// 나쁨: 경계가 너무 넓다 — 화면 전체가 사라졌다 나타난다
<Suspense fallback={<FullPageSpinner />}>
  <Header /><Feed /><Sidebar />
</Suspense>

// 좋음: 느린 부분만 감싼다
<Header />
<Suspense fallback={<FeedSkeleton />}><Feed /></Suspense>
<Suspense fallback={<SidebarSkeleton />}><Sidebar /></Suspense>
```

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

*unknown 은 좁히기를 강제한다*

```ts
function handle(input: unknown) {
  // input.trim();            // 컴파일 에러 — 검사 없이는 아무 연산도 못 한다
  if (typeof input === "string") input.trim();      // 여기서만 string
}

function isCase(v: unknown): v is { id: string; state: string } {
  return typeof v === "object" && v !== null
    && typeof (v as Record<string, unknown>).id === "string"
    && typeof (v as Record<string, unknown>).state === "string";
}
```

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

*as 는 검증이 아니다 — satisfies 로 검사를 유지*

```ts
type Case = { id: string; state: "IMPORTED" | "DESIGNED" };

const wrong = { id: "c1", state: "DONE" } as Case;   // 통과한다. 런타임에 틀림

const right = { id: "c1", state: "DESIGNED" } satisfies Case;
//    ^ 초과·누락·오타를 잡으면서 리터럴 타입도 보존한다

const STATES = ["IMPORTED", "DESIGNED"] as const;    // as const 는 목적이 다르다
```

*테스트 스텁도 단언 없이*

```ts
const stub = Object.assign({}, base, { state: "DESIGNED" }) satisfies Partial<Case>;
```

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

*구조적 타이핑의 함정과 branded 타입*

```ts
type CaseId = string;
type UserId = string;
function open(id: CaseId) {}
open("u_1" as UserId);                      // 통과 — 모양이 같다

// branded 타입으로 분리
declare const brand: unique symbol;
type Branded<T, B> = T & { readonly [brand]: B };
type CaseId2 = Branded<string, "CaseId">;

const toCaseId = (s: string): CaseId2 => s as CaseId2;   // 변환 함수만 통과
function open2(id: CaseId2) {}
// open2("u_1");                            // 컴파일 에러
```

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

*경계에서 1회 파싱, 내부는 파싱된 타입만 신뢰*

```ts
import { z } from "zod";

const Case = z.object({
  id: z.string(),
  state: z.enum(["IMPORTED", "DESIGNED"]),
  updatedAt: z.coerce.date(),
});
type Case = z.infer<typeof Case>;           // 스키마가 단일 출처

export async function fetchCase(id: string): Promise<Case> {
  const res = await fetch("/api/case/" + id);
  const parsed = Case.safeParse(await res.json());
  if (!parsed.success) {
    report("case_parse_failed", parsed.error.issues);   // 조용히 넘기지 않는다
    throw new Error("invalid case payload");
  }
  return parsed.data;
}
```

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

*LCP 자원에 우선순위를 준다*

```html
<link rel="preload" as="image" href="/hero-800.avif" fetchpriority="high">
<img src="/hero-800.avif" width="800" height="450" alt="" fetchpriority="high">

<!-- 렌더 블로킹을 줄인다 -->
<link rel="stylesheet" href="/app.css">                 <!-- 임계 CSS 는 인라인 -->
<script src="/app.js" defer></script>
```

*필드에서 LCP 구간을 분해한다*

```js
import { onLCP } from "web-vitals/attribution";

onLCP(({ value, attribution }) => {
  report("lcp", {
    value,
    element: attribution.element,
    ttfb: attribution.timeToFirstByte,
    loadDelay: attribution.resourceLoadDelay,
    loadTime: attribution.resourceLoadDuration,
    renderDelay: attribution.elementRenderDelay,
  });
});
```

- ✅ **좋은 신호** — 네 구간 분해로 병목을 지목하고 측정 도구(필드 어트리뷰션)를 든다.
- ⚠️ **약한 신호** — 이미지 압축만 말한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. LCP 요소가 매 화면마다 다르면 무엇을 기준으로 개선하나?
     - 기대 답: 라우트별로 LCP 요소를 식별해 상위 트래픽 화면부터. 공통 원인(폰트·셸 렌더)이 있으면 그걸 먼저.
  2. preload 를 많이 걸면 왜 역효과가 나나?
     - 기대 답: 대역폭 경쟁으로 정작 중요한 자원이 늦어진다. 우선순위는 소수에만 부여한다.
- 📖 **레퍼런스** — [web.dev LCP](https://web.dev/articles/lcp) · [web.dev LCP 최적화](https://web.dev/articles/optimize-lcp) · [web.dev fetchpriority](https://web.dev/articles/fetch-priority) · [web-vitals 라이브러리(attribution)](https://github.com/GoogleChrome/web-vitals)

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

*해상도별 제공 + 자리 확보*

```html
<img
  src="/case-800.avif"
  srcset="/case-400.avif 400w, /case-800.avif 800w, /case-1600.avif 1600w"
  sizes="(max-width: 600px) 100vw, 800px"
  width="800" height="450"
  alt="상악 우측 제1대구치 크라운"
  loading="lazy" decoding="async">

<picture>
  <source type="image/avif" srcset="/case.avif">
  <source type="image/webp" srcset="/case.webp">
  <img src="/case.jpg" width="800" height="450" alt="">
</picture>
```

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

*폰트 교체로 인한 이동을 줄인다*

```css
@font-face {
  font-family: "Brand";
  src: url("/brand.woff2") format("woff2");
  font-display: swap;          /* optional: 첫 방문 교체를 포기해 CLS 0 */
  size-adjust: 96%;            /* 폴백과 메트릭을 맞춘다 */
  ascent-override: 88%;
  descent-override: 12%;
}
body { font-family: "Brand", "IBM Plex Sans KR", system-ui, sans-serif; }
```

*핵심 폰트만 preload*

```html
<link rel="preload" href="/brand.woff2" as="font" type="font/woff2" crossorigin>
```

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

*비긴급 업데이트를 내려 입력을 먼저 처리*

```jsx
const [isPending, startTransition] = useTransition();

function onChange(e) {
  setQuery(e.target.value);                    // 긴급: 입력 반영은 즉시
  startTransition(() => setResults(filter(all, e.target.value)));  // 비긴급
}

return (
  <>
    <input value={query} onChange={onChange} aria-busy={isPending} />
    {isPending ? <Skeleton /> : <List items={results} />}
  </>
);
```

*INP 구간을 필드에서 나눠 본다*

```js
import { onINP } from "web-vitals/attribution";

onINP(({ value, attribution }) => {
  report("inp", {
    value,
    target: attribution.interactionTarget,
    inputDelay: attribution.inputDelay,             // 실행 중 긴 작업
    processingDuration: attribution.processingDuration,  // 핸들러·렌더
    presentationDelay: attribution.presentationDelay,    // 표현 지연
  });
});
```

- ✅ **좋은 신호** — 구간 분해로 원인을 지목하고 필드 어트리뷰션 데이터를 쓴다.
- ⚠️ **약한 신호** — 메모이제이션을 추가하는 것으로 답을 끝낸다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 입력 직후 무거운 화면 전환이 필요하면 어떻게 체감을 지키나?
     - 기대 답: 입력 반응(즉시 피드백)을 먼저 커밋하고 무거운 갱신은 전환으로 내린다. 스켈레톤으로 진행을 알린다.
  2. 전환을 썼는데도 INP 가 안 좋아지면?
     - 기대 답: 핸들러 자체가 무겁거나 표현 지연(거대한 DOM)이 지배한다. 구간 분해로 다시 측정.
- 📖 **레퍼런스** — [web.dev INP](https://web.dev/articles/inp) · [web.dev INP 최적화](https://web.dev/articles/optimize-inp) · [react.dev useTransition](https://react.dev/reference/react/useTransition) · [web-vitals 라이브러리(attribution)](https://github.com/GoogleChrome/web-vitals)

#### [시니어] 대용량 파일 업로드를 어떻게 설계하나?

**핵심 답**

- 파일을 청크로 잘라(`Blob.slice`) 병렬 업로드하고, 실패 청크만 재시도·재개한다.
- 진행률·취소는 `AbortController`로. 메인 스레드를 막지 않도록 해시·압축은 워커에서.
- 서버와 합의할 것: 청크 크기, 세션 만료, 중복 방지 키(멱등), 완료 시 병합 확인.
- 네트워크 변동에 맞춘 동시성 조절과 이어받기 지점 저장이 실사용 품질을 결정한다.

*청크 업로드 + 재개*

```js
const CHUNK = 5 * 1024 * 1024;

async function upload(file, sessionId, signal) {
  const done = new Set(await fetchUploadedParts(sessionId));   // 재개 지점
  const limit = pLimit(3);
  const parts = Math.ceil(file.size / CHUNK);

  await Promise.all(
    Array.from({ length: parts }, (_, i) => i)
      .filter((i) => !done.has(i))
      .map((i) => limit(() => retry(() => putPart(
        sessionId, i, file.slice(i * CHUNK, (i + 1) * CHUNK), signal
      ), { signal })))
  );

  return complete(sessionId, parts);       // 서버 병합·검증까지가 "완료"
}
```

*진행률·취소*

```js
const controller = new AbortController();
cancelBtn.onclick = () => controller.abort();
// 청크 완료마다 진행률 갱신(요청 단위 이벤트가 파일 단위보다 정확하다)
```

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

### 라이브 코딩 (15)

#### [주니어] `debounce`와 `throttle`를 직접 구현하라. 둘을 어디에 쓰나?

**핵심 답**

- debounce: 마지막 호출 이후 지연이 지나면 1회 실행. 타이머를 클로저에 보관하고 재호출 시 `clearTimeout`.
- throttle: 주기당 1회 실행. 마지막 실행 시각 비교 또는 타이머 점유 방식.
- 입력 검색·자동 저장은 debounce(200~300ms), 스크롤·리사이즈·마우스 이동은 throttle.
- 빠뜨리기 쉬운 것: `this`·인자 전달, 취소 함수(`cancel`), 즉시 실행 옵션(leading), 언마운트 시 해제.

*debounce — 취소 가능*

```js
function debounce(fn, wait = 300) {
  let timer = null;
  function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, args);       // this·인자 보존
    }, wait);
  }
  debounced.cancel = () => { clearTimeout(timer); timer = null; };
  return debounced;
}
```

*throttle — 주기당 1회 + 마지막 호출 보장*

```js
function throttle(fn, interval = 200) {
  let last = 0, timer = null, lastArgs = null;
  return function throttled(...args) {
    const now = Date.now();
    const remain = interval - (now - last);
    lastArgs = args;
    if (remain <= 0) {
      last = now;
      fn.apply(this, args);
    } else if (!timer) {          // 마지막 입력을 버리지 않는다
      timer = setTimeout(() => {
        last = Date.now(); timer = null;
        fn.apply(this, lastArgs);
      }, remain);
    }
  };
}
```

- ✅ **좋은 신호** — 클로저로 타이머를 잡고 취소·해제까지 만든다. 두 함수의 선택 기준을 사용 사례로 댄다.
- ⚠️ **약한 신호** — 이름만 알고 구현에서 타이머 정리를 빠뜨린다. 둘을 같은 것으로 설명한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. React 컴포넌트에서 이걸 쓰면 어디에 두나?
     - 기대 답: 렌더마다 새로 만들면 디바운스가 초기화된다. ref 나 useMemo 로 인스턴스를 유지하고 언마운트에서 cancel.
  2. 디바운스 중에 사용자가 제출을 누르면?
     - 기대 답: 대기 중 호출을 flush 하거나 제출 경로는 디바운스를 우회해야 한다. 마지막 입력이 유실되는 사고가 여기서 난다.
- 📖 **레퍼런스** — [MDN setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout) · [Front End Interview Handbook — 유틸 함수 구현](https://www.frontendinterviewhandbook.com/coding/javascript-utility-function)

#### [주니어] 1000개 행 목록에서 클릭을 처리하라. 리스너를 몇 개 달겠나?

**핵심 답**

- 하나. 컨테이너에 위임하고 `event.target.closest('[data-id]')`로 대상 판별.
- 행이 동적으로 추가·삭제돼도 재바인딩이 필요 없다.
- 아이콘·span 같은 내부 노드가 target 이 되므로 `closest` 로 올려야 한다. 데이터는 `data-*` 로 싣는다.
- 키보드 접근을 위해 각 행은 버튼·링크 같은 실제 컨트롤이어야 한다.

*리스너 1개로 1000행 처리*

```js
list.addEventListener("click", (e) => {
  const row = e.target.closest("[data-id]");       // 아이콘 클릭도 잡힌다
  if (!row || !list.contains(row)) return;
  const action = e.target.closest("[data-action]")?.dataset.action ?? "open";
  handle(action, row.dataset.id);
});
```

*행 마크업 — 키보드로도 눌린다*

```html
<ul id="list">
  <li data-id="42">
    <button type="button" data-action="open">보고서 열기</button>
    <button type="button" data-action="delete" aria-label="보고서 42 삭제">삭제</button>
  </li>
</ul>
```

- ✅ **좋은 신호** — 위임 + closest 로 바로 쓰고, 키보드·접근성을 스스로 덧붙인다.
- ⚠️ **약한 신호** — 행마다 리스너를 붙이거나 target 을 그대로 비교해 아이콘 클릭에서 실패한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 행 안에 버튼이 여러 개면 어떻게 구분하나?
     - 기대 답: 각 컨트롤에 data-action 을 두고 closest('[data-action]') 로 판별. 액션 이름은 코드 상수와 맞춘다.
  2. 위임 핸들러에서 stopPropagation 을 쓰면 무엇이 깨질 수 있나?
     - 기대 답: 상위의 외부 클릭 닫기·분석 수집이 죽는다. 필요한 경우만 최소 범위로.
- 📖 **레퍼런스** — [MDN Element.closest](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest) · [MDN 이벤트 버블링](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling)

#### [미들] 자동완성(typeahead) 컴포넌트를 구현하라. 무엇부터 챙기나?

**핵심 답**

- 입력 디바운스(200~300ms) + 이전 요청 취소(`AbortController`) + 쿼리별 캐시. 이 셋이 빠지면 경합과 낭비가 난다.
- 응답 순서 보장: 취소하거나 요청 시퀀스를 비교해 마지막 것만 반영.
- 접근성: combobox 패턴 — 입력에 `role=combobox`·`aria-expanded`, 목록은 listbox, 활성 항목은 `aria-activedescendant`, 위/아래·Enter·Esc 키 처리.
- 빈 결과·에러·로딩 상태를 구분해 표시하고, 선택 시 입력값과 내부 값(id)을 분리해 둔다.

*요청 취소 + 쿼리 캐시*

```js
const cache = new Map();

async function search(query, signal) {
  const key = query.trim().toLowerCase();
  if (cache.has(key)) return cache.get(key);
  const res = await fetch("/api/search?q=" + encodeURIComponent(key), { signal });
  if (!res.ok) throw new Error("search failed: " + res.status);
  const data = await res.json();
  cache.set(key, data);
  return data;
}

// 입력마다: 이전 요청 취소 → 최신 응답만 화면에 남는다
let controller = null;
const onInput = debounce(async (query) => {
  controller?.abort();
  controller = new AbortController();
  try {
    render(await search(query, controller.signal));
  } catch (err) {
    if (err.name !== "AbortError") showError(err);
  }
}, 250);
```

*combobox 마크업 — 키보드·스크린리더*

```html
<label for="q">도시 검색</label>
<input id="q" role="combobox" aria-expanded="true" aria-controls="q-list"
       aria-autocomplete="list" aria-activedescendant="q-opt-2" autocomplete="off">
<ul id="q-list" role="listbox">
  <li id="q-opt-1" role="option" aria-selected="false">서울</li>
  <li id="q-opt-2" role="option" aria-selected="true">성남</li>
</ul>
<p aria-live="polite">2개 결과</p>
```

- ✅ **좋은 신호** — 경합·취소·캐시를 먼저 말하고 키보드·스크린리더까지 설계한다. 최소 3글자 같은 임의 규칙에도 근거를 댄다.
- ⚠️ **약한 신호** — 입력마다 fetch 하고 순서 문제를 모른다. 목록을 div 로 만들고 키보드 조작이 없다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 빠르게 타이핑하면 예전 응답이 나중에 도착한다. 어떻게 막나?
     - 기대 답: AbortController 로 취소하거나 요청 토큰 비교. 화면에는 항상 최신 쿼리의 결과만.
  2. 같은 쿼리를 다시 입력하면?
     - 기대 답: 캐시에서 즉시 렌더하고 백그라운드 재검증. 캐시 키는 정규화된 쿼리와 필터 조합.
  3. 스크린리더 사용자에게 결과 개수를 어떻게 알리나?
     - 기대 답: live region 으로 "N개 결과" 를 알린다. 목록만 갱신하면 변화가 전달되지 않는다.
- 📖 **레퍼런스** — [ARIA APG Combobox 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) · [MDN AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) · [MDN aria-activedescendant](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-activedescendant)

#### [미들] 무한 스크롤 목록을 구현하라.

**핵심 답**

- 센티넬 요소 + `IntersectionObserver` 로 다음 페이지를 로드한다. 스크롤 이벤트 계산보다 정확하고 싸다.
- 커서 페이징을 쓴다. 오프셋은 삽입·삭제 시 중복·누락이 난다.
- 중복 요청 방지(진행 중 플래그), 마지막 페이지 판정, 에러 시 재시도 UI.
- 수백 행이 넘으면 가상화. 키보드·스크린리더 사용자를 위해 "더 보기" 버튼 폴백을 남긴다.

*센티넬 + IntersectionObserver*

```js
const io = new IntersectionObserver((entries) => {
  const [entry] = entries;
  if (!entry.isIntersecting || loading || !cursor) return;   // 중복 로드 차단
  loadNextPage();
}, { rootMargin: "200px" });                                  // 도달 전에 미리

io.observe(sentinel);

async function loadNextPage() {
  loading = true;
  try {
    const res = await fetch("/api/feed?cursor=" + encodeURIComponent(cursor));
    const { items, nextCursor } = await res.json();          // 오프셋 아님: 커서
    append(items);
    cursor = nextCursor;                                      // null 이면 마지막 페이지
    if (!cursor) io.unobserve(sentinel);
  } finally {
    loading = false;
  }
}
```

*키보드 폴백은 남긴다*

```html
<div id="sentinel" aria-hidden="true"></div>
<button type="button" id="load-more">더 보기</button>
```

- ✅ **좋은 신호** — 센티넬·커서·중복 방지·폴백을 함께 말하고 접근성 대가를 인지한다.
- ⚠️ **약한 신호** — 스크롤 이벤트에 계산을 붙이고 중복 로드를 막지 않는다. 페이지 번호로 무한 스크롤을 만든다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 목록 중간 항목이 삭제되면 커서는 어떻게 되나?
     - 기대 답: 서버가 다음 유효 커서로 보정하거나 클라이언트가 중복·누락을 판정한다. 기준 항목이 사라지는 경우를 정의해야 한다.
  2. 뒤로 갔다 돌아오면 스크롤과 데이터는?
     - 기대 답: 로드한 페이지와 스크롤 위치를 복원한다. 처음부터 다시 받으면 사용자는 위치를 잃는다.
- 📖 **레퍼런스** — [MDN Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) · [TanStack Query 무한 쿼리](https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries) · [web.dev 긴 목록 가상화](https://web.dev/articles/virtualize-long-lists-react-window)

#### [미들] 모달을 처음부터 구현하라. 접근성 요건을 어떻게 만족시키나?

**핵심 답**

- 가능하면 네이티브 `<dialog>` + `showModal()`. 포커스 트랩·Esc·top layer·배경 비활성을 브라우저가 처리한다.
- 직접 만들면: 열 때 포커스 이동, Tab 순환 트랩, 닫을 때 트리거로 복귀, Esc 처리, 배경 `inert` 또는 aria-hidden, 스크롤 잠금.
- `role=dialog` + `aria-modal` + `aria-labelledby`. 제목이 없으면 이름 없는 대화상자가 된다.
- 포털로 렌더할 때 z-index 대신 top layer 나 레이어 토큰을 쓴다.

*네이티브 dialog — 트랩·Esc·top layer 를 브라우저가 처리*

```js
const dialog = document.querySelector("#confirm");
let opener = null;

openBtn.addEventListener("click", () => {
  opener = document.activeElement;
  dialog.showModal();              // 배경 비활성 + 포커스 트랩 + Esc 기본 제공
});

dialog.addEventListener("close", () => {
  opener?.focus();                 // 닫으면 트리거로 복귀
});
```

*마크업 — 이름 있는 대화상자*

```html
<dialog id="confirm" aria-labelledby="confirm-title">
  <h2 id="confirm-title">케이스를 삭제할까요?</h2>
  <form method="dialog">
    <button value="cancel">취소</button>
    <button value="delete" autofocus>삭제</button>
  </form>
</dialog>
```

- ✅ **좋은 신호** — 네이티브 우선을 말하고 직접 구현 시 체크리스트를 순서대로 댄다.
- ⚠️ **약한 신호** — 오버레이 div 와 z-index 만으로 끝낸다. 포커스·키보드 처리가 없다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 모달 안에서 또 모달을 열면?
     - 기대 답: 레이어 스택으로 관리하고 최상위만 트랩. 닫히면 직전 레이어로 포커스를 돌린다.
  2. 배경 스크롤 잠금을 body 에 overflow:hidden 으로 하면 무엇이 깨지나?
     - 기대 답: 모바일에서 스크롤 위치가 튀고 iOS 는 여전히 스크롤된다. 스크롤바 폭 보정도 필요하다.
- 📖 **레퍼런스** — [MDN dialog 요소](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) · [MDN inert](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert) · [ARIA APG Dialog 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

#### [미들] 이미지 캐러셀을 구현하라. 어떤 부분이 어려운가?

**핵심 답**

- 레이아웃은 CSS scroll snap 으로 두면 관성 스크롤·터치가 공짜로 따라온다. JS 는 인덱스 동기화만.
- 다음·이전 이미지 프리로드와 지연 로딩 조합. 첫 이미지는 eager, 나머지는 필요 시.
- 접근성: 슬라이드 목록 구조, 이전/다음 버튼 이름, 현재 위치 안내, 자동 재생이면 일시정지 제공과 `prefers-reduced-motion` 준수.
- 무한 순환은 복제 슬라이드로 만들면 포커스·스크린리더가 중복을 읽는다. 해결책을 미리 정해야 한다.

*레이아웃은 CSS 가 한다 — 관성 스크롤·터치 무료*

```css
.carousel {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 100%;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}
.carousel > .slide {
  scroll-snap-align: center;
  aspect-ratio: 16 / 9;   /* 자리 확보 = CLS 방지 */
}
@media (prefers-reduced-motion: reduce) {
  .carousel { scroll-behavior: auto; }   /* 자동 재생도 멈춘다 */
}
```

*JS 는 인덱스 동기화만*

```js
nextBtn.addEventListener("click", () => {
  track.scrollBy({ left: track.clientWidth, behavior: prefersReduced ? "auto" : "smooth" });
});

// 현재 위치는 스크롤에서 읽는다(계산 중복 금지)
track.addEventListener("scroll", throttle(() => {
  const index = Math.round(track.scrollLeft / track.clientWidth);
  status.textContent = (index + 1) + " / " + total;   // aria-live 영역
}, 100));
```

- ✅ **좋은 신호** — CSS 로 할 수 있는 것과 JS 가 필요한 것을 나누고 자동 재생의 접근성 요건을 안다.
- ⚠️ **약한 신호** — transform 계산만 말하고 터치·키보드·모션 설정을 고려하지 않는다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 자동 재생이 요구되면 무엇을 반드시 넣나?
     - 기대 답: 정지 버튼, 포커스·호버 시 정지, 모션 축소 설정 존중. 5초 이상 자동 이동은 조작 방해가 된다.
  2. 이미지 로딩 때문에 레이아웃이 튀면?
     - 기대 답: 슬라이드 비율을 aspect-ratio 로 고정한다. 크기 미지정이 CLS 원인.
- 📖 **레퍼런스** — [ARIA APG Carousel 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/) · [MDN CSS scroll snap](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap) · [web.dev CLS](https://web.dev/articles/cls) · [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

#### [주니어] 폼 검증을 구현하라. 브라우저 기본 검증을 쓸까 직접 만들까?

**핵심 답**

- 기본 제약(`required`·`type`·`pattern`·`min`)을 먼저 쓰고 `ValidityState` 로 사유를 읽어 메시지만 커스터마이즈한다.
- 제출 시 검증이 기본, 실시간은 블러 이후. 입력 중 빨간 에러를 뿌리면 방해가 된다.
- 에러 메시지는 필드와 프로그램적으로 연결(`aria-describedby`)하고 첫 에러로 포커스를 옮긴다.
- 클라이언트 검증은 UX 용이다. 서버 검증이 진짜 방어선.

*네이티브 제약 + 메시지만 커스터마이즈*

```js
form.addEventListener("submit", (e) => {
  if (!form.checkValidity()) {
    e.preventDefault();
    const first = form.querySelector(":invalid");
    showMessage(first, messageFor(first.validity));
    first.focus();                      // 첫 에러로 포커스
  }
});

function messageFor(v) {              // ValidityState 로 사유를 읽는다
  if (v.valueMissing) return "필수 항목입니다.";
  if (v.typeMismatch) return "이메일 형식이 아닙니다.";
  if (v.tooShort)     return "8자 이상 입력하세요.";
  if (v.patternMismatch) return "영문과 숫자만 사용할 수 있습니다.";
  return "값을 확인해 주세요.";
}
```

*에러를 필드에 연결한다*

```html
<label for="email">이메일</label>
<input id="email" name="email" type="email" required
       aria-describedby="email-error" aria-invalid="true">
<p id="email-error" role="alert">이메일 형식이 아닙니다.</p>
```

- ✅ **좋은 신호** — 네이티브 제약 + 커스텀 메시지 조합을 알고 에러 표시 시점과 접근성 연결을 말한다.
- ⚠️ **약한 신호** — 정규식만 직접 짜고 접근성 연결·서버 검증 이야기가 없다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 에러가 여러 개면 무엇을 먼저 알리나?
     - 기대 답: 요약 목록을 폼 상단에 두고 첫 에러로 포커스. 스크린리더에는 개수와 함께 알린다.
  2. 서버가 거부한 값은 어떻게 표시하나?
     - 기대 답: 필드별 에러로 매핑해 같은 자리에 표시한다. 전역 토스트만 띄우면 사용자가 어디를 고칠지 모른다.
- 📖 **레퍼런스** — [MDN 제약 검증](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation) · [MDN ValidityState](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState)

#### [미들] `retry(fn, times)` 와 동시 실행 제한(`pLimit`)을 구현하라.

**핵심 답**

- retry: 실패 시 지수 백오프 + 지터, 최대 횟수, 취소 신호(`AbortSignal`) 지원. 재시도해도 되는 에러만 구분한다.
- 비멱등 요청(POST 생성)에는 요청 키 없이 재시도하면 중복이 생긴다.
- pLimit: 대기 큐와 진행 카운터. 작업 완료 시 큐에서 다음을 꺼낸다. 에러가 나도 카운터를 되돌려야 멈추지 않는다.
- 타임아웃은 `AbortSignal.timeout` 으로 붙인다.

*retry — 백오프 + 지터 + 취소*

```js
async function retry(fn, { times = 3, base = 300, signal } = {}) {
  let lastErr;
  for (let attempt = 0; attempt < times; attempt++) {
    signal?.throwIfAborted();
    try {
      return await fn({ attempt, signal });
    } catch (err) {
      if (err.name === "AbortError" || !isRetryable(err)) throw err;
      lastErr = err;
      const wait = base * 2 ** attempt * (0.5 + Math.random());  // 지터
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
}

const isRetryable = (err) =>
  err.status === undefined || err.status === 429 || err.status >= 500;
```

*pLimit — 동시 실행 제한*

```js
function pLimit(concurrency) {
  let active = 0;
  const queue = [];
  const next = () => {
    if (active >= concurrency || queue.length === 0) return;
    active++;
    const { fn, resolve, reject } = queue.shift();
    fn().then(resolve, reject).finally(() => {   // 실패에도 카운터를 되돌린다
      active--;
      next();
    });
  };
  return (fn) => new Promise((resolve, reject) => {
    queue.push({ fn, resolve, reject });
    next();
  });
}

const limit = pLimit(4);
await Promise.all(urls.map((u) => limit(() => fetch(u))));
```

- ✅ **좋은 신호** — 재시도 대상 에러 구분과 멱등성 문제를 스스로 꺼낸다. 큐 구현에서 에러 경로를 챙긴다.
- ⚠️ **약한 신호** — 고정 지연으로 반복 재시도하고 취소·멱등을 고려하지 않는다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 429 응답에는 어떻게 재시도하나?
     - 기대 답: Retry-After 를 우선 따르고 없으면 백오프. 전역 동시성도 줄인다.
  2. 백오프에 지터를 왜 넣나?
     - 기대 답: 여러 클라이언트가 같은 시점에 몰리는 재시도 폭주를 흩는다.
- 📖 **레퍼런스** — [MDN AbortSignal.timeout()](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static) · [MDN AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) · [MDN HTTP 상태 코드](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)

#### [시니어] 가상 스크롤(윈도잉)을 라이브러리 없이 구현하라.

**핵심 답**

- 컨테이너 높이 = 행 수 × 행 높이. 스크롤 위치로 시작 인덱스를 계산해 보이는 범위 + 오버스캔만 렌더.
- 절대 위치 또는 transform 으로 행을 배치하고 스크롤 컨테이너는 고정 높이를 유지한다.
- 가변 높이는 측정 캐시와 추정치 보정이 필요하다. 점프를 줄이는 것이 핵심 난점.
- 대가: 브라우저 검색·인쇄·스크린리더 탐색이 제한된다. `content-visibility` 로 부분 대체 가능한지 먼저 본다.

*고정 높이 윈도잉*

```js
const ROW = 36, OVERSCAN = 5;

function render(scrollTop, viewportH) {
  const start = Math.max(0, Math.floor(scrollTop / ROW) - OVERSCAN);
  const visible = Math.ceil(viewportH / ROW) + OVERSCAN * 2;
  const end = Math.min(rows.length, start + visible);

  spacer.style.height = rows.length * ROW + "px";   // 스크롤바 길이 유지
  body.style.transform = "translateY(" + start * ROW + "px)";
  body.replaceChildren(...rows.slice(start, end).map(renderRow));
}

viewport.addEventListener("scroll", () => {
  requestAnimationFrame(() => render(viewport.scrollTop, viewport.clientHeight));
});
```

*먼저 검토할 CSS 대안*

```css
/* 목록이 크지만 DOM 을 유지해야 한다면(검색·인쇄·스크린리더 탐색) */
.row {
  content-visibility: auto;
  contain-intrinsic-size: auto 36px;   /* 추정 높이 → 스크롤바 안정 */
}
```

- ✅ **좋은 신호** — 인덱스 계산을 정확히 말하고 가변 높이·접근성 대가를 먼저 꺼낸다.
- ⚠️ **약한 신호** — 라이브러리 이름만 대거나 스크롤 이벤트마다 전량 재렌더한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 오버스캔을 왜 두나? 너무 크면?
     - 기대 답: 스크롤 시 빈 영역을 막는다. 과도하면 렌더 비용이 늘어 이득이 사라진다.
  2. 행 높이를 모르는 상태로 처음 렌더하면?
     - 기대 답: 추정 높이로 배치하고 측정 후 보정한다. 보정 중 스크롤 위치를 유지해야 사용자가 튀지 않는다.
- 📖 **레퍼런스** — [web.dev 긴 목록 가상화](https://web.dev/articles/virtualize-long-lists-react-window) · [MDN content-visibility](https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility)

#### [미들] 드래그로 순서를 바꾸는 목록을 구현하라.

**핵심 답**

- 포인터 이벤트로 통일하면 마우스·터치·펜을 한 경로로 처리한다. HTML5 DnD API 는 터치 지원이 약하다.
- 드래그 중 레이아웃 계산을 반복하지 않도록 시작 시 위치를 캐시하고 transform 으로 이동.
- 드롭 결과는 낙관적으로 반영하고 서버 실패 시 롤백. 순서 값은 정수 인덱스보다 간격을 둔 정렬키가 갱신 범위를 줄인다.
- 키보드 대안이 필수다. 항목 선택 후 방향키 이동 + 확정 방식으로 제공한다.

*포인터 이벤트 — 마우스·터치·펜 한 경로*

```js
handle.addEventListener("pointerdown", (e) => {
  e.target.setPointerCapture(e.pointerId);    // 포인터가 벗어나도 계속 받는다
  const startY = e.clientY;
  const rects = rows.map((r) => r.getBoundingClientRect());   // 시작 시 1회 측정

  const onMove = (ev) => {
    const dy = ev.clientY - startY;
    dragged.style.transform = "translateY(" + dy + "px)";     // 레이아웃 재계산 없음
    preview(indexAt(rects, ev.clientY));
  };
  const onUp = async (ev) => {
    handle.removeEventListener("pointermove", onMove);
    const to = indexAt(rects, ev.clientY);
    const prev = items.slice();
    commitOptimistic(move(items, from, to));                  // 낙관적 반영
    try { await save({ id: items[from].id, rank: rankBetween(to) }); }
    catch { commitOptimistic(prev); showError(); }            // 실패 시 롤백
  };
  handle.addEventListener("pointermove", onMove);
  handle.addEventListener("pointerup", onUp, { once: true });
});
```

*키보드 대안은 필수*

```js
row.addEventListener("keydown", (e) => {
  if (!e.altKey) return;                       // Alt+↑/↓ 로 순서 변경
  if (e.key === "ArrowUp")   { e.preventDefault(); moveBy(-1); }
  if (e.key === "ArrowDown") { e.preventDefault(); moveBy(+1); }
});
```

- ✅ **좋은 신호** — 키보드 대안과 서버 순서 모델을 함께 말한다. 포인터 이벤트 선택 이유를 댄다.
- ⚠️ **약한 신호** — 마우스 이벤트만 처리하고 접근성 대안이 없다. 정렬 결과 저장 방식을 생각하지 않는다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 항목 1만 개 목록의 재정렬은 어떻게 저장하나?
     - 기대 답: 이동한 항목만 새 정렬키를 받게 한다. 전체 인덱스 재계산은 대량 쓰기를 만든다.
  2. 드래그 중 스크롤이 필요하면?
     - 기대 답: 가장자리 자동 스크롤을 rAF 기반으로. 스크롤과 좌표 보정을 함께 계산해야 어긋나지 않는다.
- 📖 **레퍼런스** — [MDN 포인터 이벤트](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events) · [MDN HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API) · [ARIA APG 키보드 인터페이스](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/) · [MDN setPointerCapture()](https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture)

#### [주니어] 탭 컴포넌트를 구현하라. 키보드 동작은 어떻게 되어야 하나?

**핵심 답**

- 구조: `role=tablist` / `role=tab` / `role=tabpanel`, 선택 상태는 `aria-selected`, 연결은 `aria-controls`·`aria-labelledby`.
- 키보드: 좌우 방향키로 탭 이동, Home/End, Tab 은 탭 목록에서 패널로 나간다(roving tabindex).
- 패널 내용을 언마운트할지 유지할지는 상태 보존 요건으로 결정한다. 폼 입력이 있으면 유지가 안전하다.
- URL 과 동기화하면 새로고침·공유에서 같은 탭이 열린다.

*roving tabindex — Tab 은 목록을 나가고 방향키로 이동*

```js
tablist.addEventListener("keydown", (e) => {
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const i = tabs.indexOf(document.activeElement);
  const map = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
  if (!(e.key in map)) return;
  e.preventDefault();
  select(tabs[(map[e.key] + tabs.length) % tabs.length]);
});

function select(tab) {
  for (const t of tablist.querySelectorAll('[role="tab"]')) {
    const on = t === tab;
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;                    // 목록 안에서는 하나만 탭 정지
    document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
  }
  tab.focus();
}
```

*마크업*

```html
<div role="tablist" aria-label="케이스 상세">
  <button role="tab" id="t1" aria-controls="p1" aria-selected="true"  tabindex="0">요약</button>
  <button role="tab" id="t2" aria-controls="p2" aria-selected="false" tabindex="-1">로그</button>
</div>
<div role="tabpanel" id="p1" aria-labelledby="t1">…</div>
<div role="tabpanel" id="p2" aria-labelledby="t2" hidden>…</div>
```

- ✅ **좋은 신호** — roving tabindex 를 알고 URL 동기화·상태 보존 판단까지 말한다.
- ⚠️ **약한 신호** — 버튼 목록 + 조건부 렌더로만 끝내고 키보드·role 이 없다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 탭이 화면 폭보다 많으면?
     - 기대 답: 스크롤 또는 오버플로 메뉴. 키보드 이동 시 보이는 영역으로 스크롤해야 한다.
  2. 탭 전환이 느린 패널은 어떻게 하나?
     - 기대 답: 전환을 비긴급으로 내리고 스켈레톤을 보여 준다. 클릭 반응 자체는 즉시 커밋.
- 📖 **레퍼런스** — [ARIA APG Tabs 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) · [react.dev useId](https://react.dev/reference/react/useId)

#### [시니어] 외부 스토어를 만들고 React 에 안전하게 연결하라.

**핵심 답**

- 스토어는 `getState`·`setState`·`subscribe` 세 개로 충분하다. 구독자 집합에 알림을 보낸다.
- React 연결은 `useSyncExternalStore`. 동시성 렌더에서 찢어진 화면(tearing)을 막아 준다.
- selector 가 매번 새 객체를 반환하면 무한 리렌더가 된다. 원시값 단위 구독이나 얕은 비교를 함께 제공.
- SSR 은 서버 스냅샷을 따로 받아야 한다.

*스토어 — getState / setState / subscribe*

```js
function createStore(initial) {
  let state = initial;
  const listeners = new Set();
  return {
    getState: () => state,
    setState(patch) {
      const next = typeof patch === "function" ? patch(state) : { ...state, ...patch };
      if (next === state) return;
      state = next;
      listeners.forEach((l) => l());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);   // 해제 함수 반환이 계약
    },
  };
}
```

*React 연결 — tearing 방지 + 원시값 구독*

```jsx
import { useSyncExternalStore } from "react";

export function useStore(selector) {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),      // 새 객체를 만들면 무한 리렌더
    () => selector(serverSnapshot)         // SSR 스냅샷
  );
}

// 좋음: 원시값 구독
const count = useStore((s) => s.items.length);
// 나쁨: 매번 새 배열 → 렌더마다 변경으로 판정
// const items = useStore((s) => s.items.filter((i) => i.open));
```

- ✅ **좋은 신호** — tearing 문제와 selector 참조 동일성을 스스로 꺼낸다. SSR 스냅샷까지 고려한다.
- ⚠️ **약한 신호** — useState + 전역 변수로 구현하고 구독 해제·동시성 문제를 모른다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 구독 해제를 빠뜨리면 어떤 증상이 나나?
     - 기대 답: 언마운트된 컴포넌트 갱신 시도와 누수. 구독자 집합이 계속 커진다.
  2. 왜 Context 로 같은 걸 하면 안 되나?
     - 기대 답: Context 는 부분 구독이 없어 값이 바뀌면 모든 소비자가 리렌더된다.
- 📖 **레퍼런스** — [react.dev useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore)

#### [미들] 클라이언트 라우터를 직접 만들어 보라.

**핵심 답**

- `history.pushState` 로 주소를 바꾸고 `popstate` 로 뒤로/앞으로를 처리한다. 링크 클릭은 가로채되 새 탭·수정키·외부 링크는 기본 동작을 남긴다.
- 경로 매칭(동적 세그먼트), 중첩 라우트, 404 처리.
- 스크롤 복원과 포커스 이동이 접근성의 핵심이다. 전환 후 제목·주요 영역으로 포커스를 옮기고 스크린리더에 알린다.
- 코드 분할과 결합하면 전환 중 로딩 상태와 프리페치가 필요하다.

*History API — 링크 가로채기 예외를 남긴다*

```js
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[href]");
  if (!a) return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin) return;                 // 외부 링크
  if (a.target === "_blank" || a.hasAttribute("download")) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;  // 새 탭/창
  e.preventDefault();
  history.pushState(null, "", url);
  navigate(url.pathname);
});

addEventListener("popstate", () => navigate(location.pathname));
```

*전환 후 접근성 처리*

```js
async function navigate(path) {
  const view = await resolve(path);          // 코드 분할 로드
  main.replaceChildren(view.node);
  document.title = view.title;               // 제목 갱신
  liveRegion.textContent = view.title + " 페이지로 이동했습니다";
  main.focus();                              // main 에 tabindex="-1"
  scrollTo({ top: view.restoreScroll ?? 0 });
}
```

- ✅ **좋은 신호** — pushState/popstate 외에 포커스·스크롤·프리페치까지 말한다. 링크 가로채기 예외를 안다.
- ⚠️ **약한 신호** — hashchange 나 pushState 만 다루고 접근성·예외 처리를 빠뜨린다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. SPA 전환에서 스크린리더 사용자는 페이지가 바뀐 걸 어떻게 아나?
     - 기대 답: 제목 갱신 + live region 안내 + 포커스 이동. 시각 변화만으로는 전달되지 않는다.
  2. 직접 만든 라우터의 가장 큰 리스크는?
     - 기대 답: 브라우저 히스토리와 상태 동기화. 스크롤 복원·중복 진입에서 어긋나기 쉽다.
- 📖 **레퍼런스** — [MDN History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) · [web.dev 코드 분할](https://web.dev/articles/reduce-javascript-payloads-with-code-splitting)

#### [주니어] 이미지 지연 로딩을 직접 구현한다면?

**핵심 답**

- 기본은 속성 하나: `loading="lazy"`. 직접 만들 필요가 거의 없다.
- 세밀한 제어가 필요하면 `IntersectionObserver` 로 진입 시 `src` 를 채우고 관찰을 해제.
- 첫 화면(LCP) 이미지는 지연 로딩하지 않는다. 오히려 늦어진다.
- 자리 확보(width/height·aspect-ratio)와 저해상도 플레이스홀더로 CLS 를 막는다.

*기본은 속성 하나*

```html
<!-- 첫 화면(LCP) 이미지: 지연 로딩 금지, 우선순위 부여 -->
<img src="/hero-800.avif" width="800" height="450" alt="시술 전후 비교"
     fetchpriority="high" decoding="async">

<!-- 화면 밖 이미지 -->
<img src="/thumb-320.avif" width="320" height="180" alt="" loading="lazy" decoding="async">
```

*세밀한 제어가 필요할 때만 직접*

```js
const io = new IntersectionObserver((entries, observer) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const img = entry.target;
    img.src = img.dataset.src;
    observer.unobserve(img);        // 로드 후 해제 — 안 하면 관찰 대상이 쌓인다
  }
}, { rootMargin: "300px" });

document.querySelectorAll("img[data-src]").forEach((img) => io.observe(img));
```

- ✅ **좋은 신호** — 네이티브 속성을 먼저 말하고 LCP 예외를 짚는다.
- ⚠️ **약한 신호** — 스크롤 이벤트로 좌표를 계산하고 LCP 이미지까지 지연시킨다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 관찰 해제를 안 하면 어떤 비용이 생기나?
     - 기대 답: 관찰 대상이 계속 쌓여 콜백과 메모리가 늘어난다. 로드 후 unobserve 가 기본.
  2. 네트워크가 느린 사용자에게 무엇을 다르게 할 수 있나?
     - 기대 답: Network Information 으로 품질을 낮추거나 프리로드 수를 줄인다. 다만 지원이 고르지 않다.
- 📖 **레퍼런스** — [MDN img loading](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img) · [MDN Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) · [web.dev LCP 최적화](https://web.dev/articles/optimize-lcp)

#### [미들] 정렬·필터·검색이 되는 데이터 테이블을 구현하라.

**핵심 답**

- 정렬은 `Intl.Collator` 로 로케일·숫자 인식 비교(문자열 `localeCompare` 기본값은 언어에 따라 틀린다).
- 대량 데이터면 서버 정렬·필터로 옮기고 클라이언트는 상태만 관리. 경계를 먼저 정한다.
- 접근성: 표 헤더에 정렬 상태(`aria-sort`), 셀 탐색이 필요하면 grid 패턴. 필터 결과 개수를 알린다.
- 상태(정렬·필터·페이지)를 URL 에 두면 공유·복원이 된다.

*로케일·숫자 인식 정렬*

```js
const collator = new Intl.Collator("ko", { numeric: true, sensitivity: "base" });

const sorted = [...rows].sort((a, b) => {
  const r = collator.compare(a[key], b[key]);     // "케이스 2" < "케이스 10"
  return dir === "asc" ? r : -r;
});

// 문자열 기본 sort() 는 유니코드 코드포인트 순 → 대소문자·한글·숫자에서 틀린다
```

*정렬 상태를 보조기기에 알린다*

```html
<table>
  <thead>
    <tr>
      <th aria-sort="ascending"><button type="button">케이스명</button></th>
      <th aria-sort="none"><button type="button">생성일</button></th>
    </tr>
  </thead>
</table>
<p aria-live="polite">케이스명 오름차순, 42건</p>
```

- ✅ **좋은 신호** — 로케일 정렬 함정과 서버 이관 기준을 말하고 aria-sort 를 챙긴다.
- ⚠️ **약한 신호** — 대소문자·숫자 정렬 버그를 모른 채 기본 sort 를 쓰고 접근성 표기가 없다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 10만 행을 클라이언트에서 정렬하면?
     - 기대 답: 메인 스레드가 막힌다. 서버 정렬 또는 워커. 정렬 키를 미리 계산해 두는 방법도 있다.
  2. 필터 변경마다 요청하면 과다 호출이 된다. 어떻게 줄이나?
     - 기대 답: 디바운스 + 요청 취소 + 결과 캐시. 키는 필터 조합으로.
- 📖 **레퍼런스** — [MDN Intl.Collator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator) · [ARIA APG Grid 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/grid/) · [MDN aria-sort](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-sort)

### 시스템 디자인 (11)

#### [미들] 프론트 시스템 디자인 라운드를 어떤 순서로 진행하나?

**핵심 답**

- RADIO 순서가 널리 쓰인다: Requirements(요구 탐색) → Architecture(구성 요소·데이터 흐름) → Data model → Interface(컴포넌트·API 계약) → Optimizations(성능·접근성·보안).
- 시작은 질문이다. 사용자 규모, 기기, 실시간 요구, 오프라인, 인증, 지원 범위를 먼저 좁힌다.
- 45분이면 요구 5분 · 구조 10분 · 데이터·인터페이스 15분 · 최적화 10분 · 마무리 5분 정도로 배분.
- 트레이드오프를 말로 남기는 것이 점수다. 정답 아키텍처를 맞히는 라운드가 아니다.

- ✅ **좋은 신호** — 요구 탐색으로 범위를 좁히고 각 결정에 대안과 비용을 붙인다. 시간 배분이 있다.
- ⚠️ **약한 신호** — 바로 컴포넌트 트리를 그리기 시작하고 데이터 계약·실패 처리를 다루지 않는다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 요구를 좁히는 질문 3개를 지금 말해 보라.
     - 기대 답: 규모·실시간성·기기/네트워크 조건, 또는 인증·오프라인·국제화 중 해당 문제의 축을 고른다.
  2. 시간이 부족하면 무엇을 생략하나?
     - 기대 답: 최적화 세부와 코드 수준 인터페이스. 요구·데이터 흐름·실패 처리는 생략하면 설계가 성립하지 않는다.
- 📖 **레퍼런스** — [Front End Interview Handbook — 시스템 디자인](https://www.frontendinterviewhandbook.com/front-end-system-design) · [FrontendInterviews.dev — 시스템 디자인 문제](https://frontendinterviews.dev/frontend-system-design-interview-questions)

#### [미들] 뉴스 피드(타임라인)를 설계하라.

**핵심 답**

- 데이터: 커서 페이징, 게시물 정규화 캐시, 목록은 id 배열. 중복·순서 흔들림을 막는다.
- 렌더: 수백 개 넘으면 가상화, 이미지·영상은 지연 로딩과 자리 확보(CLS). 새 글 알림은 상단 배너로 주고 강제 삽입하지 않는다.
- 상호작용: 좋아요·팔로우는 낙관적 업데이트 + 롤백 + 멱등 키. 실패를 눈에 보이게 한다.
- 실시간: SSE/WS 로 새 글 수만 받고 본문은 사용자 동작 후 로드해 스크롤을 흔들지 않는다.
- 오프라인·재방문: 첫 페이지 캐시로 즉시 렌더 후 재검증.

*커서 페이징 응답 계약*

```json
{
  "items": [
    { "id": "c_1042", "title": "상악 크라운", "updatedAt": "2026-09-16T08:12:00Z" }
  ],
  "nextCursor": "eyJ1cGRhdGVkQXQiOiIyMDI2LTA5LTE2VDA4OjEyOjAwWiIsImlkIjoiY18xMDQyIn0",
  "hasMore": true
}
```

*정규화 캐시 — 같은 글이 두 화면에서 어긋나지 않게*

```js
// 목록은 id 배열만, 본문은 엔티티 한 곳
const state = {
  entities: { posts: { c_1042: { id: "c_1042", liked: false, likes: 12 } } },
  feed: { ids: ["c_1042", "c_1041"], nextCursor: "eyJ..." },
};

// 좋아요는 엔티티 한 곳만 갱신 → 피드·상세가 동시에 맞는다
function toggleLike(id) {
  const prev = state.entities.posts[id];
  patchEntity(id, { liked: !prev.liked, likes: prev.likes + (prev.liked ? -1 : 1) });
  return save(id, { idempotencyKey: crypto.randomUUID() })
    .catch(() => patchEntity(id, prev));      // 실패 롤백
}
```

- ✅ **좋은 신호** — 스크롤 안정성(위치 유지·CLS)과 낙관적 업데이트 롤백을 함께 설계한다. 실시간 갱신을 사용자 통제 아래 둔다.
- ⚠️ **약한 신호** — 서버 API 만 나열하고 목록 갱신·스크롤 점프·실패 처리를 다루지 않는다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 사용자가 목록 중간을 보는 중에 새 글 20개가 오면?
     - 기대 답: 상단 배너로 알리고 클릭 시 반영. 자동 삽입은 위치를 잃게 한다.
  2. 같은 게시물이 두 화면(피드·상세)에 있으면 좋아요 상태를 어떻게 맞추나?
     - 기대 답: 엔티티 단일 캐시로 정규화. 화면별 복사본을 두면 어긋난다.
  3. 이미지가 많아 LCP 가 나쁘면?
     - 기대 답: 첫 화면 이미지만 우선순위 부여, 나머지 지연. 목록 항목 높이를 미리 확보.
- 📖 **레퍼런스** — [Front End Interview Handbook — 애플리케이션 설계](https://www.frontendinterviewhandbook.com/front-end-system-design/applications) · [TanStack Query 무한 쿼리](https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries) · [web.dev CLS](https://web.dev/articles/cls)

#### [시니어] AI 채팅(토큰 스트리밍) 화면을 설계하라.

**핵심 답**

- 전송: SSE 가 기본(HTTP 인프라·재연결). 양방향 요구가 크면 WS. 중단은 `AbortController` 로 서버 생성까지 취소해 비용을 막는다.
- 렌더: 토큰마다 setState 하지 않고 프레임당 1회 배치. 긴 대화는 가상화. 마크다운은 증분 파싱 + sanitize.
- 상태: 서버가 메시지 상태 기계를 소유하고 클라이언트는 스냅샷을 따른다. 재생성·중단·부분 실패 후 이력이 어긋나지 않아야 한다.
- 신뢰·안전: 출력은 신뢰할 수 없는 입력이다. HTML 렌더 시 sanitize, 링크 스킴 검증, 프롬프트 주입 대비.
- 비용·한도: 레이트 리밋, 토큰 상한, 재시도 정책을 UI 에 드러낸다.

*SSE 수신 + 프레임당 1회 렌더*

```js
const es = new EventSource("/api/chat/" + sessionId + "/stream");
let buffer = "";
let scheduled = false;

es.addEventListener("token", (e) => {
  buffer += JSON.parse(e.data).text;
  if (scheduled) return;                 // 토큰마다 setState 하지 않는다
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    appendToMessage(buffer);             // 프레임당 1회 커밋
    buffer = "";
  });
});

es.addEventListener("done", () => es.close());
es.onerror = () => { /* 브라우저가 재연결한다. Last-Event-ID 로 재개 지점 전달 */ };
```

*중단은 서버 생성까지 취소한다*

```js
const controller = new AbortController();
stopBtn.onclick = () => controller.abort();          // 비용이 계속 발생하지 않게

await fetch("/api/chat", {
  method: "POST",
  signal: controller.signal,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ sessionId, prompt }),
});
```

- ✅ **좋은 신호** — 렌더 배치와 취소 경로를 먼저 말하고 출력 sanitize 를 보안 문제로 다룬다.
- ⚠️ **약한 신호** — 스트리밍을 받아 그대로 innerHTML 에 붙이고 중단·비용을 고려하지 않는다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 사용자가 탭을 떠나면 스트림을 어떻게 하나?
     - 기대 답: 정책을 정한다. 계속 받아 저장하거나 중단하고 서버 생성도 취소. 방치하면 비용이 샌다.
  2. 재연결 후 중간부터 이어받으려면?
     - 기대 답: 서버가 이벤트 id·시퀀스를 주고 Last-Event-ID 로 재개. 없으면 스냅샷 재조회.
  3. 응답 마크다운에 스크립트가 들어오면?
     - 기대 답: sanitize 로 제거하고 CSP 로 2차 방어. 모델 출력은 사용자 입력과 동급으로 취급한다.
- 📖 **레퍼런스** — [MDN Server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events) · [MDN Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) · [OWASP XSS 방어](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

#### [미들] 자동완성 검색 서비스를 설계하라(컴포넌트가 아니라 시스템으로).

**핵심 답**

- 클라이언트: 디바운스·취소·캐시(쿼리 정규화 키)·최소 길이·로컬 최근 검색.
- 네트워크: 응답 크기 제한(상위 N), 필드 최소화, HTTP 캐시 헤더 또는 엣지 캐시. 인기 쿼리는 CDN 캐시가 크게 먹힌다.
- 실패 시나리오: 느린 응답에는 이전 결과 유지 + 로딩 표시, 에러에는 직전 상태 보존. 빈 결과와 에러를 구분.
- 측정: 입력→첫 결과 지연, 취소율, 캐시 히트율, 선택률. 개선 여부를 이 지표로 말한다.

- ✅ **좋은 신호** — 캐시 계층(메모리·HTTP·엣지)을 나누고 측정 지표를 제시한다.
- ⚠️ **약한 신호** — 디바운스만 말하고 캐시·실패·지표를 다루지 않는다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 오타 교정·다국어를 지원하려면 클라이언트는 무엇이 달라지나?
     - 기대 답: 정규화 키에 로케일을 포함하고 결과 하이라이트 규칙이 달라진다. 조합 중 입력(IME)에서 디바운스 기준도 바뀐다.
  2. IME 입력에서 무엇이 문제가 되나?
     - 기대 답: 조합 중 이벤트로 요청이 나가 낭비·깜빡임이 생긴다. compositionend 기준으로 보정한다.
- 📖 **레퍼런스** — [Front End Interview Handbook — UI 컴포넌트 설계](https://www.frontendinterviewhandbook.com/front-end-system-design/ui-components) · [MDN HTTP 캐싱](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)

#### [시니어] 실시간 협업 편집기를 설계하라.

**핵심 답**

- 동시 편집 병합은 CRDT 또는 OT. 클라이언트는 로컬 우선 적용 + 원격 연산 병합.
- 전송은 WS, 재연결 시 누락 연산 재전송(버전 벡터·시퀀스). 오프라인 편집은 큐에 쌓고 복귀 시 병합.
- 프레즌스(커서·선택 영역)는 별도 저지연 채널로, 손실 허용. 문서 연산과 섞지 않는다.
- 렌더: 큰 문서는 뷰포트 단위 렌더, 입력 지연을 최우선으로 보호(INP).
- 권한·감사: 문서 단위 권한, 변경 이력·복원. 복원이 감사 시각을 되감지 않게 설계.

- ✅ **좋은 신호** — 문서 연산과 프레즌스를 분리하고 재연결·오프라인 병합을 설계한다. 입력 지연을 최우선으로 둔다.
- ⚠️ **약한 신호** — "CRDT 쓰면 된다"로 끝내고 재연결·권한·렌더 비용을 다루지 않는다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 두 사용자가 같은 줄을 동시에 고치면 무엇을 보장하나?
     - 기대 답: 수렴(같은 최종 상태)과 사용자 의도 보존. 어느 쪽이 이기는지가 아니라 둘 다 반영되는 형태가 목표.
  2. 디버깅이 어려워지는 이유는?
     - 기대 답: 상태가 연산 이력이라 스냅샷만으로 원인을 못 찾는다. 이력 조회·재생 도구가 필요하다.
- 📖 **레퍼런스** — [CRDT 개요](https://crdt.tech/) · [Yjs 문서](https://docs.yjs.dev/) · [MDN WebSockets API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

#### [미들] 대용량 파일 업로더를 설계하라.

**핵심 답**

- 청크 분할(`Blob.slice`) + 병렬 업로드 + 실패 청크만 재시도. 세션 id 와 완료 청크 목록을 로컬에 저장해 재개.
- 진행률·취소는 `AbortController`. 해시·압축은 워커로 보내 메인 스레드를 지킨다.
- 서버 계약: 청크 크기, 세션 만료, 멱등 키, 완료 시 병합 검증.
- UX: 드래그&드롭 + 파일 선택 버튼(접근성), 용량·형식 사전 검증, 여러 파일 큐, 실패 항목 개별 재시도.

- ✅ **좋은 신호** — 재개·멱등·동시성 조절과 워커 분리를 함께 말한다. 접근 가능한 파일 선택 경로를 남긴다.
- ⚠️ **약한 신호** — FormData 로 한 번에 보내고 실패·재개를 다루지 않는다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 동시 업로드 수를 고정값으로 두면 무엇이 문제인가?
     - 기대 답: 저속 회선에서 전체가 느려지고 고속에서는 낭비. 네트워크 상태에 맞춰 조절한다.
  2. 업로드 완료를 사용자에게 언제 알리나?
     - 기대 답: 서버 병합·검증까지 끝난 뒤. 청크 전송 완료를 완료로 표시하면 실패가 숨는다.
- 📖 **레퍼런스** — [MDN Blob.slice](https://developer.mozilla.org/en-US/docs/Web/API/Blob/slice) · [MDN File API](https://developer.mozilla.org/en-US/docs/Web/API/File_API) · [MDN AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)

#### [미들] 위젯 여러 개가 있는 대시보드를 설계하라.

**핵심 답**

- 위젯별 독립 로딩·실패. 하나가 죽어도 화면 전체가 에러가 되지 않게 경계를 둔다(`allSettled`·에러 경계).
- 갱신 정책을 위젯별로: 주기 폴링, 포커스 재검증, 구독. 모두 같은 주기로 두면 비용만 든다.
- 레이아웃: 사용자 배치 저장, 반응형 재배치, 위젯 크기별 데이터 해상도(요약 vs 상세).
- 성능: 화면 밖 위젯은 지연 로드, 차트는 데이터 포인트 축약. 동시 요청 수 제한.

- ✅ **좋은 신호** — 위젯 단위 실패 격리와 갱신 정책 차등을 말한다. 데이터 해상도 개념이 있다.
- ⚠️ **약한 신호** — 한 번에 전부 fetch 하고 실패 시 전체 에러 화면을 보여 준다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 위젯 20개가 동시에 요청하면?
     - 기대 답: 동시성 제한과 우선순위(첫 화면 보이는 것 먼저). 서버 배치 엔드포인트도 검토.
  2. 사용자가 탭을 오래 열어 두면 데이터가 낡는다. 어떻게 다루나?
     - 기대 답: 마지막 갱신 시각 표시 + 포커스 시 재검증. 조용히 낡은 값을 보여 주는 것이 가장 위험하다.
- 📖 **레퍼런스** — [TanStack Query 무효화](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation) · [MDN Promise.allSettled](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)

#### [시니어] 결제·체크아웃 플로우를 설계하라.

**핵심 답**

- 중복 결제 방지가 최우선: 멱등 키를 클라이언트가 생성해 재시도에 재사용, 제출 버튼 비활성·중복 제출 차단.
- 상태 기계로 모델링(입력 → 검증 → 승인 대기 → 완료/실패). 새로고침·뒤로 가기에서 재진입 규칙을 정의한다.
- 민감 정보는 결제사 위젯·토큰화로 우회해 카드 데이터를 우리 앱이 만지지 않게 한다. PCI 범위를 줄인다.
- 실패 UX: 사유별 안내(잔액·인증·네트워크), 재시도 가능 여부 구분. 낙관적 업데이트는 쓰지 않는다.
- 관측: 단계별 이탈률과 실패 코드 분포.

*멱등 키로 중복 결제를 막는다*

```js
// 키는 "결제 시도" 단위로 한 번 만들고 재시도에 재사용한다
const attemptKey = useRef(crypto.randomUUID());

async function pay() {
  setState("submitting");
  try {
    const res = await retry(() => fetch("/api/payments", {
      method: "POST",
      headers: { "Idempotency-Key": attemptKey.current },   // 재시도도 같은 키
      body: JSON.stringify({ orderId, amount }),
    }), { times: 3 });

    if (res.status === 409) return setState("already_paid");
    if (!res.ok) throw new Error("payment failed: " + res.status);
    setState("done");
  } catch {
    setState("unknown");                   // 성공/실패를 단정하지 않는다
    const confirmed = await confirmByServer(orderId);   // 서버 조회로 확정
    setState(confirmed.paid ? "done" : "failed");
  }
}
```

*상태 기계로 재진입을 정의한다*

```js
const NEXT = {
  idle:       { submit: "submitting" },
  submitting: { ok: "done", conflict: "already_paid", fail: "failed", timeout: "unknown" },
  unknown:    { confirmed_paid: "done", confirmed_unpaid: "failed" },
  done:       {},                       // 뒤로 가기로 재진입해도 재결제 불가
};
```

- ✅ **좋은 신호** — 멱등 키와 상태 기계를 먼저 말하고 카드 데이터를 다루지 않는 구조를 택한다.
- ⚠️ **약한 신호** — 제출 후 로딩만 두고 중복·재진입·부분 실패를 다루지 않는다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 결제 요청 응답이 타임아웃되면 무엇을 표시하나?
     - 기대 답: 성공/실패를 단정하지 않고 확인 중 상태로 두고 서버 조회로 확정한다. 재시도는 같은 멱등 키로.
  2. 뒤로 가기로 결제 화면에 다시 들어오면?
     - 기대 답: 이미 완료된 주문이면 완료 화면으로 보낸다. 재결제 가능 상태와 구분해야 한다.
- 📖 **레퍼런스** — [MDN HTTP 메서드 POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/POST) · [OWASP 세션 관리](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) · [IETF Idempotency-Key 헤더 초안](https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-idempotency-key-header)

#### [시니어] 여러 앱이 쓰는 컴포넌트 라이브러리를 설계하라.

**핵심 답**

- 공개 API 를 먼저 정한다: props 계약, 슬롯·컴포지션, 테마 토큰. 내부 구조는 감춰 파괴적 변경 범위를 줄인다.
- 배포: 세맨틱 버전, 트리 셰이킹 가능한 ESM, 사이드이펙트 표기, 타입 동시 배포. 스타일 주입 방식(CSS 파일 vs in-JS)이 소비자 빌드를 좌우한다.
- 접근성 규격을 컴포넌트 계약에 포함하고 테스트로 고정한다.
- 변경 관리: 마이그레이션 가이드·코드모드, 채택률·오버라이드 계측, Parallel Change 로 구·신 공존.

- ✅ **좋은 신호** — 공개 API 경계와 배포 포맷을 함께 말하고 접근성을 계약으로 다룬다.
- ⚠️ **약한 신호** — 컴포넌트 목록과 스토리북 도입만 말하고 버전·전파 전략이 없다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 소비자가 내부 DOM 을 CSS 로 덮어쓰고 있으면?
     - 기대 답: 그건 공개 API 가 부족하다는 신호. 필요한 변형을 API 로 올리고 내부 선택자를 캡슐화한다.
  2. 한 앱만 필요한 기능 요청은 어떻게 처리하나?
     - 기대 답: 라이브러리에 넣지 않고 컴포지션으로 앱에서 조립하게 한다. 특수 요구를 계속 흡수하면 API 가 붕괴한다.
- 📖 **레퍼런스** — [Design Tokens 포맷(W3C CG)](https://tr.designtokens.org/format/) · [webpack tree shaking](https://webpack.js.org/guides/tree-shaking/) · [Martin Fowler — ParallelChange](https://martinfowler.com/bliki/ParallelChange.html)

#### [시니어] 오프라인에서도 쓰는 노트 앱을 설계하라.

**핵심 답**

- 로컬 우선: IndexedDB 를 원본으로 두고 서버 동기화는 백그라운드. 로컬 쓰기 지연이 UX 를 결정한다.
- 동기화: 변경 큐 + 버전·타임스탬프로 충돌 감지, 충돌은 사용자 선택 또는 CRDT. 마지막 쓰기 승리는 데이터 손실.
- 서비스워커로 앱 셸 캐시. 버전 활성화 정책을 먼저 정해 옛 버전 고착을 막는다.
- 인증 만료·기기 변경·용량 초과(스토리지 압박) 처리와 데이터 내보내기 경로를 둔다.

- ✅ **좋은 신호** — 로컬 원본·동기화 큐·충돌 규칙을 계층으로 나누고 스토리지 한계를 고려한다.
- ⚠️ **약한 신호** — localStorage 에 저장하고 온라인 복귀 시 덮어쓴다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 같은 노트를 두 기기에서 오프라인으로 고치면?
     - 기대 답: 충돌 감지 후 양쪽 보존(버전 분기) 또는 연산 병합. 조용한 덮어쓰기는 금지.
  2. 브라우저가 저장소를 비우면?
     - 기대 답: 영구 저장 권한 요청과 서버 백업 안내. 로컬만 믿는 설계는 데이터 유실을 부른다.
- 📖 **레퍼런스** — [MDN IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) · [MDN Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) · [web.dev 서비스워커 캐시 전략](https://web.dev/articles/service-workers-cache-storage)

#### [미들] 다국어·다지역 사이트를 설계하라.

**핵심 답**

- 번역 번들을 언어별로 분할 로드하고 초기 언어는 서버에서 확정(깜빡임 방지).
- 형식은 `Intl` 에 맡긴다: 날짜·숫자·통화·상대 시간·복수형·정렬. 문자열 연결로 문장을 만들지 않는다.
- 라우팅: 경로 또는 서브도메인으로 언어 표시, 사용자 선택 저장, 검색엔진용 대체 언어 표기.
- RTL 은 논리 속성으로 대응하고 아이콘·차트 방향 규칙을 정한다. 번역 길이 변화(독일어 30% 증가)를 레이아웃이 견뎌야 한다.

- ✅ **좋은 신호** — Intl 위임과 번들 분할, RTL·길이 변화까지 말한다. 초기 언어 확정 지점을 안다.
- ⚠️ **약한 신호** — 키-값 치환만 말하고 복수형·정렬·RTL 을 다루지 않는다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 언어 전환 시 전체 새로고침을 피하려면?
     - 기대 답: 번들을 비동기 로드하고 렌더 트리만 갱신. 서버 렌더 캐시 키에 언어를 포함해야 한다.
  2. 번역이 늦어 배포가 막히면?
     - 기대 답: 소스 언어 폴백 + 누락 리포트로 배포는 진행. 조용한 폴백은 QA 가 놓친다.
- 📖 **레퍼런스** — [MDN Intl.PluralRules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) · [MDN Intl.Collator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator)

### 디버깅 라운드 (7)

#### [미들] [실습] 버튼을 누르면 화면이 2초간 멈춘다. 어떻게 원인을 찾나?

**핵심 답**

- Performance 탭으로 상호작용을 녹화한다. Long Task 와 그 호출 스택을 본다 — 추측으로 코드를 읽지 않는다.
- 구간을 나눈다: 핸들러 실행인가, 렌더·커밋인가, 레이아웃·페인트인가. INP 어트리뷰션과 같은 분해다.
- 흔한 원인: 대량 배열 동기 처리, 강제 동기 레이아웃, 거대한 리스트 재렌더, 동기 스토리지 접근.
- 처방은 원인별로: 작업 쪼개기·워커, 읽기/쓰기 분리, 가상화, 비긴급 업데이트로 내리기.

*구간을 코드로 표시해 프로파일에 남긴다*

```js
// 추측하지 않는다 — 어느 구간이 긴지 표시부터
performance.mark("handler:start");
const rows = buildRows(raw);              // 의심 구간
performance.mark("handler:built");
render(rows);
performance.measure("build", "handler:start", "handler:built");
performance.measure("render", "handler:built");

// Performance 패널의 Timings 트랙에 그대로 보인다
```

*강제 동기 레이아웃(layout thrashing) 제거*

```js
// 나쁨: 읽기와 쓰기를 번갈아 → 프레임마다 레이아웃 재계산
for (const el of items) {
  const h = el.offsetHeight;              // 읽기(강제 레이아웃)
  el.style.height = h * 2 + "px";         // 쓰기
}

// 좋음: 읽기 전부 → 쓰기 전부
const heights = items.map((el) => el.offsetHeight);
items.forEach((el, i) => { el.style.height = heights[i] * 2 + "px"; });
```

- ✅ **좋은 신호** — 측정 도구를 먼저 열고 구간 분해로 좁힌다. 처방을 원인에 맞춰 고른다.
- ⚠️ **약한 신호** — 코드를 눈으로 읽어 추측하거나 메모이제이션을 먼저 붙인다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. Long Task 는 보이는데 스택이 압축되어 안 읽히면?
     - 기대 답: 소스맵 활성화, 샘플링 간격 조정, 코드에 performance.mark 로 구간을 심는다.
  2. 로컬에서는 빠른데 사용자만 느리면?
     - 기대 답: 기기·네트워크 프로파일로 재현하고 필드 데이터(p75·p95)로 대상 세그먼트를 확인한다.
- 📖 **레퍼런스** — [Chrome DevTools 성능 프로파일링](https://developer.chrome.com/docs/devtools/performance) · [web.dev INP 최적화](https://web.dev/articles/optimize-inp) · [MDN Long Task API](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongTaskTiming) · [MDN performance.mark()](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark) · [web.dev layout thrashing](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing)

#### [미들] [실습] 목록이 가끔 비어 보인다. 네트워크는 200 이다. 어디를 보나?

**핵심 답**

- 응답은 왔는데 화면이 비었으면 클라이언트 처리 문제다. 응답 본문 형태(빈 배열 vs 래핑 객체), 파싱·매핑 오류, 조건부 렌더 조건을 확인.
- 경합 확인: 요청 두 개가 겹쳐 오래된 응답이 나중에 도착했는지(취소·시퀀스 검사).
- 예외가 조용히 삼켜졌는지: 브레이크포인트를 'Pause on exceptions' 로 걸고 재현한다.
- 캐시 오염: 빈 결과가 캐시에 저장돼 이후 계속 빈 화면이 되는 경우.

*오래된 응답이 최신 화면을 덮는 경합*

```js
// 나쁨: 취소도 순서 검사도 없다
async function load(query) {
  const data = await fetchList(query);
  setRows(data);                 // 느린 이전 요청이 나중에 도착해 덮어쓴다
}

// 좋음: 토큰으로 최신 요청만 반영
let seq = 0;
async function load2(query) {
  const my = ++seq;
  const data = await fetchList(query);
  if (my === seq) setRows(data);
}
```

*조용히 삼켜진 예외를 드러낸다*

```js
// 나쁨: catch 가 비어 화면만 빈다
try { setRows(parse(await res.json())); } catch {}

// 좋음: 보고 + 사용자에게 보이는 상태
try {
  setRows(parse(await res.json()));
} catch (err) {
  report("list_parse_failed", { err: String(err) });
  setError("목록을 불러오지 못했습니다");
}
```

- ✅ **좋은 신호** — 네트워크 성공/화면 실패를 경계로 나눠 좁히고 예외 일시정지 같은 실측 수단을 쓴다.
- ⚠️ **약한 신호** — 서버 탓으로 돌리거나 새로고침으로 넘어간다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 재현이 10번에 1번이면 어떻게 하나?
     - 기대 답: 반복 스크립트로 확률을 높이고 요청 지연을 인위적으로 넣어 경합을 강제 재현한다.
  2. 로그를 심는다면 어디에 무엇을 남기나?
     - 기대 답: 요청 시작·취소·응답 도착 시각과 쿼리 키, 렌더 분기. 실패 경로에 먼저.
- 📖 **레퍼런스** — [Chrome DevTools 네트워크 패널](https://developer.chrome.com/docs/devtools/network) · [Chrome DevTools 자바스크립트 디버깅](https://developer.chrome.com/docs/devtools/javascript) · [MDN AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)

#### [미들] [실습] 콘솔에 "Too many re-renders" 가 뜬다. 원인 후보를 대라.

**핵심 답**

- 렌더 중 setState 호출(조건 없이), 이펙트 의존성에 매 렌더 새로 만드는 객체·함수, selector 가 새 참조 반환.
- 이펙트가 자기 의존성을 갱신하는 순환. 정규화된 값으로 의존성을 좁히거나 상태를 하나로 합친다.
- 확인: React DevTools Profiler 의 렌더 원인, 의존성 배열을 로그로 찍어 무엇이 바뀌는지 본다.
- 즉시 처방은 메모이제이션이 아니라 데이터 흐름 수정이다.

*무엇이 매 렌더 바뀌는지 찍는다*

```jsx
function useWhyRender(name, deps) {
  const prev = useRef(deps);
  useEffect(() => {
    const changed = deps
      .map((d, i) => (Object.is(d, prev.current[i]) ? null : i))
      .filter((i) => i !== null);
    if (changed.length) console.log(name, "changed deps:", changed);
    prev.current = deps;
  });
}
```

*대표 원인 두 가지*

```jsx
// ① 렌더 중 setState — 조건 없이 호출하면 즉시 루프
function Bad({ items }) {
  setCount(items.length);              // 금지
  return null;
}
const count = items.length;            // 파생 계산으로 대체

// ② 매 렌더 새 객체를 의존성에 넣는다
useEffect(() => { load(filter); }, [{ ...filter }]);   // 항상 새 참조 → 무한
useEffect(() => { load(filter); }, [filter.status, filter.page]);  // 원시값으로
```

- ✅ **좋은 신호** — 후보를 나열하고 '무엇이 매 렌더 바뀌는가' 를 로그로 확정한다.
- ⚠️ **약한 신호** — useCallback·useMemo 를 무작정 감싸 증상만 덮는다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 의존성에서 무엇이 바뀌는지 어떻게 특정하나?
     - 기대 답: 이전 값과 현재 값을 ref 로 비교해 변한 키를 출력한다. 추측보다 빠르다.
  2. 렌더 중 setState 가 정당한 경우도 있나?
     - 기대 답: props 로부터 파생된 상태를 조건부로 조정하는 패턴은 허용되지만, 대개 파생 계산으로 없앨 수 있다.
- 📖 **레퍼런스** — [react.dev You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) · [react.dev useMemo](https://react.dev/reference/react/useMemo)

#### [시니어] [실습] 앱을 오래 열어 두면 느려지고 탭 메모리가 계속 증가한다.

**핵심 답**

- 힙 스냅샷을 두 번 찍어(동작 전/후) 증가한 객체와 retainer 체인을 본다. 추측 금지.
- 후보: 해제 안 된 리스너·타이머·구독, 무한히 커지는 캐시·로그 배열, detached DOM 을 잡은 클로저, 워커·소켓 누적.
- 라우팅 왕복 시나리오를 반복해 증가 추세를 재현한다. 1회 측정으로는 판단 불가.
- 수정 후 같은 시나리오로 회귀 측정하고, 장기 세션 지표를 계측에 추가한다.

- ✅ **좋은 신호** — 스냅샷 비교와 반복 시나리오로 증가를 증명하고 수정 후 재측정한다.
- ⚠️ **약한 신호** — 의심되는 코드를 고치고 체감으로 해결을 선언한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. detached DOM 이 왜 남아 있나?
     - 기대 답: JS 가 노드를 참조 중이다. 캐시·클로저·이벤트 핸들러가 붙잡은 경로를 retainer 로 찾는다.
  2. 장기 세션 누수를 CI 에서 감시할 수 있나?
     - 기대 답: 반복 시나리오 후 힙 크기 임계 검사. 노이즈가 커서 추세 기반으로 판정한다.
- 📖 **레퍼런스** — [Chrome DevTools 메모리 문제 진단](https://developer.chrome.com/docs/devtools/memory-problems) · [MDN WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)

#### [미들] [실습] Safari 에서만 레이아웃이 깨진다. 어떻게 접근하나?

**핵심 답**

- 먼저 기능 지원 여부를 확인한다(널리 지원되는 기능인지, 해당 버전 지원 범위인지). 추측하지 않고 지원 표를 본다.
- 재현 최소 케이스를 만들어 원인 속성·API 를 분리한다. 프레임워크 탓으로 넘기지 않는다.
- 처방 순서: 표준 대체 문법 → 기능 탐지 후 폴백 → 최후에 벤더 우회. 브라우저 감지(UA 분기)는 회피한다.
- 지원 정책을 팀의 browserslist 같은 단일 출처로 확인해 대응 범위를 결정한다.

*UA 분기 대신 기능 탐지*

```js
// 나쁨: 브라우저 감지
if (/Safari/.test(navigator.userAgent)) applyHack();

// 좋음: 기능 탐지
if (!("anchorName" in document.documentElement.style)) usePopoverFallback();
```

*CSS 는 @supports 로*

```css
.panel { position: absolute; }              /* 폴백 먼저 */

@supports (position-area: bottom span-right) {
  .panel { position-area: bottom span-right; }   /* 지원하는 곳만 */
}
```

- ✅ **좋은 신호** — 지원 범위 확인 → 최소 재현 → 기능 탐지 폴백 순서로 간다. UA 분기를 마지막 수단으로 둔다.
- ⚠️ **약한 신호** — UA 스니핑으로 분기하거나 벤더 접두사를 무작위로 추가한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 기능 탐지는 어떻게 쓰나?
     - 기대 답: CSS 는 @supports, JS 는 해당 API 존재 확인. 버전 비교로 판단하지 않는다.
  2. 그 브라우저 사용자가 2% 면 어떻게 결정하나?
     - 기대 답: 사업 영향 확인 후 축소 기능 제공 또는 지원 종료 공지. 전원에게 폴리필을 주는 선택은 피한다.
- 📖 **레퍼런스** — [web.dev Baseline](https://web.dev/baseline) · [browserslist](https://github.com/browserslist/browserslist) · [MDN @supports](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports)

#### [시니어] [실습] 배포 후에만 재현되는 버그다. 로컬은 정상이다.

**핵심 답**

- 환경 차이를 사슬로 실측한다: 어떤 번들이 서빙되는지(버전·해시), 어떤 API 호스트를 보는지, 빌드 모드·환경 변수·기능 플래그가 무엇인지.
- 캐시 의심: 옛 청크·서비스워커·CDN. 버전 정보를 응답에서 직접 확인한다.
- 프로덕션 전용 코드 경로(압축·DCE·NODE_ENV 분기)와 소스맵 복원으로 스택을 읽는다.
- 가설을 세우면 프로덕션 유사 빌드를 로컬에서 만들어 재현한다.

*무엇이 서빙되는지부터 확인한다*

```bash
# 캐시를 우회해 실제 응답을 본다
curl -s -H 'Cache-Control: no-cache' https://app.example.com/ | grep -o 'assets/[^"]*\.js'

# 배포 버전 엔드포인트와 대조
curl -s https://app.example.com/version.json

# hosts 하이재킹·프록시 의심이면 IP 를 고정해 직접
curl -s --resolve app.example.com:443:203.0.113.10 https://app.example.com/version.json
```

*프로덕션 전용 분기를 로컬에서 재현*

```bash
# dev 서버가 아니라 프로덕션 빌드를 띄워 확인한다
npm run build && npx serve dist

# 소스맵으로 스택 복원 (소스맵은 공개 배포하지 않는다)
npx source-map-cli resolve dist/assets/app-a1b2c3.js.map 1 45213
```

- ✅ **좋은 신호** — 서빙되는 산출물부터 확인하고 캐시·플래그·빌드 모드를 하나씩 배제한다.
- ⚠️ **약한 신호** — 로컬에서 같은 코드니 문제 없다고 결론 내린다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 어떤 번들이 서빙되는지 어떻게 확인하나?
     - 기대 답: 응답 HTML 의 스크립트 해시와 버전 엔드포인트를 대조한다. 브라우저 캐시를 우회해 요청한다.
  2. 서비스워커가 원인이면?
     - 기대 답: 활성 버전과 캐시 항목을 확인하고 갱신 경로를 검증한다. 강제 갱신 정책이 없으면 사용자가 옛 버전에 갇힌다.
- 📖 **레퍼런스** — [소스맵 업로드 운영(Sentry)](https://docs.sentry.io/platforms/javascript/sourcemaps/) · [MDN HTTP 캐싱](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching) · [web.dev 서비스워커 캐시 전략](https://web.dev/articles/service-workers-cache-storage)

#### [주니어] [실습] 페이지 로딩 중 콘텐츠가 위아래로 밀린다. 원인과 수정은?

**핵심 답**

- 크기 미지정 이미지·광고·임베드, 늦게 로드되는 폰트, 상단에 나중에 삽입되는 배너가 대표 원인.
- 수정: `width`/`height` 또는 `aspect-ratio` 로 자리 확보, 폰트 폴백 메트릭 정렬, 삽입 영역 공간 예약.
- 측정은 CLS. 어떤 요소가 이동했는지 DevTools 의 레이아웃 이동 영역으로 확인한다.
- 사용자 상호작용 후 500ms 안의 이동은 CLS 에서 제외된다는 점도 안다.

*자리 확보로 이동을 없앤다*

```css
/* 이미지·임베드: 비율로 공간을 먼저 잡는다 */
.thumb { aspect-ratio: 16 / 9; width: 100%; height: auto; }

/* 나중에 삽입되는 배너: 최소 높이를 예약 */
.banner-slot { min-height: 72px; }

/* 스크롤바 등장으로 인한 가로 이동 */
html { scrollbar-gutter: stable; }
```

*어떤 요소가 움직였는지 필드에서 확인*

```js
import { onCLS } from "web-vitals/attribution";

onCLS(({ value, attribution }) => {
  report("cls", {
    value,
    largestShiftTarget: attribution.largestShiftTarget,   // 선택자로 지목된다
    largestShiftTime: attribution.largestShiftTime,
  });
});
```

- ✅ **좋은 신호** — 원인별 수정을 짝지어 말하고 측정으로 이동 요소를 특정한다.
- ⚠️ **약한 신호** — 애니메이션으로 부드럽게 만들면 된다고 답한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 광고·서드파티 임베드는 크기를 모르는데 어떻게 하나?
     - 기대 답: 최소 높이를 예약하고 초과 시에만 확장. 예약 없이 삽입하면 매번 이동한다.
  2. 폰트 교체로 인한 이동을 0 으로 만들려면?
     - 기대 답: 폴백과 메트릭을 맞추거나 font-display: optional 로 첫 방문 교체를 포기한다.
- 📖 **레퍼런스** — [web.dev CLS](https://web.dev/articles/cls) · [MDN font-display](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display) · [web-vitals 라이브러리(attribution)](https://github.com/GoogleChrome/web-vitals) · [MDN scrollbar-gutter](https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter)

### 코드 리뷰 라운드 (5)

#### [미들] [실습] PR diff 를 받았다. 무엇을 어떤 순서로 보나?

**핵심 답**

- 먼저 무엇을 바꾸려는 PR 인지(설명·이슈)와 공개 계약 변경 여부. 그다음 정확성·보안·데이터 손실 가능성.
- 다음으로 실패 경로: 에러·로딩·빈 상태, 취소·경합, 되돌릴 수 있는지.
- 그다음 테스트가 그 변경을 실제로 잡는지. 마지막에 가독성·이름.
- 스타일·포맷은 지적하지 않는다(자동화 대상). 차단 항목과 제안을 라벨로 구분한다.

- ✅ **좋은 신호** — 차단 기준을 명시하고 자동화 가능한 것은 지적하지 않는다. 테스트가 변경을 잡는지 본다.
- ⚠️ **약한 신호** — 변수명·들여쓰기부터 지적하고 계약 변경·실패 경로를 놓친다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 리뷰에서 대안을 제시할 때 무엇을 함께 붙이나?
     - 기대 답: 근거와 비용, 그리고 지금 고칠지 다음으로 미룰지 판단. 대안만 던지면 저자가 결정할 수 없다.
  2. 큰 PR 이 와서 리뷰가 어려우면?
     - 기대 답: 분할을 요청하되 이미 늦었으면 커밋 단위로 읽고 위험 영역에 집중한다.
- 📖 **레퍼런스** — [Testing Library 원칙](https://testing-library.com/docs/guiding-principles) · [Martin Fowler — ParallelChange](https://martinfowler.com/bliki/ParallelChange.html)

#### [미들] [실습] 이 diff 에 `dangerouslySetInnerHTML={{__html: comment.body}}` 가 있다. 뭐라고 쓰나?

**핵심 답**

- 차단이다. 사용자 입력이 HTML 로 실행돼 저장형 XSS 가 된다.
- 대안: 텍스트로 렌더, 서식이 필요하면 허용 목록 sanitizer 를 거치고 raw HTML 허용을 끈다. 링크 스킴 검증.
- 서버 저장 시점 정화만으로 안전하다고 보지 않는다. 출력 컨텍스트별 인코딩이 본질.
- CSP 는 2차 방어선이며 이 결함을 대체하지 않는다.

*리뷰 코멘트에 붙일 수정 예시*

```jsx
// 받은 diff (차단)
- <div dangerouslySetInnerHTML={{ __html: comment.body }} />

// 제안 ①: 서식이 필요 없으면 텍스트
+ <div className="comment-body">{comment.body}</div>

// 제안 ②: 서식이 필요하면 허용 목록 sanitizer (raw HTML 차단)
+ import DOMPurify from "dompurify";
+ const clean = DOMPurify.sanitize(comment.body, {
+   ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li"],
+   ALLOWED_ATTR: ["href"],
+   ALLOWED_URI_REGEXP: /^(?:https?|mailto):/i,
+ });
+ <div dangerouslySetInnerHTML={{ __html: clean }} />
```

- ✅ **좋은 신호** — 차단 사유를 위험으로 설명하고 대안과 2차 방어를 구분한다.
- ⚠️ **약한 신호** — "sanitize 하면 됩니다" 한 줄로 끝내거나 통과시킨다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 마크다운 서식 요구가 실제로 있으면?
     - 기대 답: 마크다운 → 안전한 AST → 제한된 컴포넌트 렌더. HTML 통과 경로를 만들지 않는다.
  2. 이미 배포된 데이터에 스크립트가 섞여 있으면?
     - 기대 답: 출력 정화로 즉시 차단하고 저장 데이터 스캔·정리. 노출 범위를 조사한다.
- 📖 **레퍼런스** — [OWASP XSS 방어](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) · [MDN CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)

#### [미들] [실습] 목록 항목마다 `useEffect` 안에서 상세 API 를 호출하는 diff 다.

**핵심 답**

- N+1 요청이다. 100개 행이면 요청 100개. 배치 엔드포인트나 목록 응답에 필요한 필드를 포함시키는 쪽으로 돌린다.
- 그대로 둘 수 없다면 동시성 제한·취소·캐시가 필수. 스크롤 중 마운트·언마운트 반복이면 요청 폭주가 난다.
- 성능 문제이자 비용 문제다. 실제 수치(요청 수·INP 영향)를 붙여 지적한다.
- 즉시 차단할지는 화면 규모에 달렸다. 목록이 항상 5개면 과잉 지적일 수 있다.

*N+1 을 배치·프리페치로 바꾼다*

```jsx
// 받은 diff: 행마다 요청 (100행 = 100요청, 취소도 없다)
function Row({ id }) {
  const [detail, setDetail] = useState(null);
  useEffect(() => { fetch("/api/case/" + id).then(r => r.json()).then(setDetail); }, [id]);
}

// 제안 ①: 목록 응답에 필요한 필드를 포함 (서버와 계약 변경)
// 제안 ②: 배치 엔드포인트
const details = useQuery({
  queryKey: ["cases", "detail", ids],
  queryFn: ({ signal }) => fetchDetails(ids, { signal }),   // 1요청
});

// 그대로 둘 수밖에 없다면: 동시성 제한 + 취소 + 캐시
useEffect(() => {
  const c = new AbortController();
  limit(() => fetchDetail(id, { signal: c.signal })).then(setDetail).catch(ignoreAbort);
  return () => c.abort();
}, [id]);
```

- ✅ **좋은 신호** — 규모 조건을 확인한 뒤 지적 강도를 조절하고 수치를 근거로 댄다.
- ⚠️ **약한 신호** — 패턴만 보고 무조건 차단하거나 반대로 그냥 통과시킨다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 서버 팀이 배치 엔드포인트를 못 준다면?
     - 기대 답: 클라이언트에서 창 단위 프리페치 + 동시성 제한 + 캐시. 한계와 비용을 기록해 둔다.
  2. 요청 취소를 어디에 넣나?
     - 기대 답: 이펙트 클린업에서 AbortController. 없으면 스크롤 이탈 후 도착한 응답이 상태를 되살린다.
- 📖 **레퍼런스** — [react.dev useEffect](https://react.dev/reference/react/useEffect) · [TanStack Query 쿼리 키](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)

#### [주니어] [실습] `<div onClick={...}>저장</div>` 이 들어온 diff 다.

**핵심 답**

- 키보드로 접근·실행할 수 없고 스크린리더가 버튼으로 읽지 않는다. `<button type="button">` 로 바꾸는 것이 가장 싼 수정.
- 불가피하면 role·tabindex·Enter/Space 핸들러·비활성 상태를 모두 직접 구현해야 한다는 점을 지적한다.
- 포커스 표시가 사라지지 않는지도 함께 확인한다.
- 같은 패턴이 반복되면 공용 버튼 컴포넌트 부재 신호.

*가장 싼 수정은 태그 교체*

```jsx
// 받은 diff: 키보드로 접근·실행 불가, 스크린리더가 버튼으로 읽지 않는다
- <div className="btn" onClick={save}>저장</div>

// 제안: 네이티브 버튼 (포커스·Enter/Space·disabled 를 공짜로 얻는다)
+ <button type="button" className="btn" onClick={save}>저장</button>

// 이동 동작이면 링크로
+ <a className="btn" href={"/cases/" + id}>상세 보기</a>
```

*불가피하게 div 를 써야 한다면 전부 직접*

```jsx
<div
  role="button"
  tabIndex={0}
  aria-disabled={busy || undefined}
  onClick={busy ? undefined : save}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (!busy) save(); }
  }}
>저장</div>
```

- ✅ **좋은 신호** — 무엇을 잃는지 구체적으로 나열하고 가장 싼 수정을 제안한다.
- ⚠️ **약한 신호** — "접근성 고려 필요" 처럼 모호하게 남긴다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 이동 동작이면 무엇으로 바꾸나?
     - 기대 답: 링크. 주소가 생기고 새 탭·북마크가 가능해야 한다.
  2. 디자인이 버튼 기본 스타일을 거부하면?
     - 기대 답: 시맨틱은 button 으로 두고 스타일만 초기화한다. 시맨틱을 스타일 때문에 포기하지 않는다.
- 📖 **레퍼런스** — [MDN ARIA 기법](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Techniques) · [ARIA APG 키보드 인터페이스](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)

#### [미들] [실습] 타입 에러를 `as any` 로 막은 diff 다. 어떻게 리뷰하나?

**핵심 답**

- 단언은 런타임 검증이 아니라서 회귀를 침묵시킨다. 왜 타입이 안 맞는지 원인을 먼저 묻는다.
- 대안 제시: 타입 가드, 판별 유니온, 제네릭, 경계 스키마 파싱, `satisfies`.
- 급하면 범위를 좁힌 단언 + 이유 주석 + 후속 이슈를 조건으로 통과시킬 수 있다. 무조건 차단이 정답은 아니다.
- 같은 패턴이 여러 곳이면 타입 설계·계약 문제다.

*as any 대신 원인별 처방*

```ts
// 받은 diff
- const rows = (res.data as any).items;

// ① 응답이 불확실하면 경계에서 파싱
+ const { items } = ListResponse.parse(res.data);

// ② 유니온 좁히기
+ if (node.kind === "case") node.caseId;       // 판별 유니온

// ③ 서드파티 타입이 틀렸다면 한 곳에 격리
+ // ponytail: @vendor/sdk v3 의 listCases 반환 타입이 실제와 다르다(items 누락)
+ function listCases(): Promise<CaseListResponse> {
+   return sdk.listCases() as unknown as Promise<CaseListResponse>;
+ }

// ④ 정말 급하면 범위를 좁힌 단언 + 제거 조건이 적힌 이슈
+ const items = (res.data as { items: unknown[] }).items;   // TODO(FE-1234)
```

- ✅ **좋은 신호** — 원인을 묻고 대안을 비용과 함께 제시한다. 조건부 통과 기준이 있다.
- ⚠️ **약한 신호** — 규칙 위반이라고만 쓰거나 그냥 통과시킨다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 서드파티 타입이 틀린 경우라면?
     - 기대 답: 모듈 보강이나 좁힌 래퍼 함수 한 곳에 격리한다. 호출처마다 단언을 뿌리지 않는다.
  2. 후속 이슈를 남길 때 무엇을 적나?
     - 기대 답: 어떤 조건에서 제거 가능한지와 담당자. 만료 주체 없는 TODO 는 남지 않는다.
- 📖 **레퍼런스** — [TS 핸드북 Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) · [TS 4.9 satisfies](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html)

### 과제·포트폴리오 (5)

#### [미들] 과제(take-home)를 제출할 때 README 에 무엇을 쓰나?

**핵심 답**

- 실행 방법이 첫 줄. 의존성 설치·실행·테스트 명령이 그대로 동작해야 한다(리뷰어가 못 돌리면 끝이다).
- 구현 범위와 의도적으로 안 한 것, 그 이유. 시간 제약에서 무엇을 우선했는지.
- 주요 설계 결정과 대안, 그리고 알려진 한계·버그.
- AI 도구 사용 여부와 검증 방법(요구되면). 숨기는 것보다 검증 절차를 쓰는 편이 유리하다.

- ✅ **좋은 신호** — 실행 가능성을 최우선으로 두고 트레이드오프와 미완 항목을 스스로 드러낸다.
- ⚠️ **약한 신호** — 기능 목록만 나열하고 실행이 실패하거나 한계 언급이 없다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 시간이 부족하면 무엇을 먼저 자르나?
     - 기대 답: 부가 기능과 스타일링. 핵심 흐름 동작·에러 처리·실행 가능성은 자르지 않는다.
  2. 테스트는 어디까지 쓰나?
     - 기대 답: 핵심 로직과 실패 경로 소수. 전 범위 커버리지보다 '이 테스트가 무엇을 막는지' 를 보여 준다.
- 📖 **레퍼런스** — [Take-home 과제 리뷰 관점(dev.to)](https://dev.to/gergelyorosz/9-insider-tips-to-ace-your-next-takehome-project-for-frontend-fullstack-and-mobile-interviews-41nn) · [프론트 면접 단계 개요(designgurus)](https://www.designgurus.io/answers/detail/what-does-a-frontend-interview-look-like)

#### [미들] 과제에서 요구사항이 모호하면 어떻게 하나?

**핵심 답**

- 가정을 문서에 명시하고 그 가정 아래 완성한다. 멈추고 기다리는 것이 가장 나쁜 선택.
- 질문이 가능하면 결정에 영향을 주는 것만 묻는다(범위를 바꾸는 질문 위주).
- 모호한 부분은 확장 가능한 형태로 두고, 어느 쪽으로 바뀌어도 수정 범위가 작게 설계한다.
- 제출 시 "이렇게 해석했다, 반대 해석이면 이 부분만 바뀐다" 를 적는다.

- ✅ **좋은 신호** — 가정 명시 + 영향 범위 제한을 함께 말한다. 질문 선별 기준이 있다.
- ⚠️ **약한 신호** — 임의로 정하고 기록하지 않거나, 질문만 던지고 진행하지 않는다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 가정이 틀렸다는 피드백을 받으면?
     - 기대 답: 수정 범위를 먼저 제시하고 반영한다. 설계가 그 변화를 견디게 만들어 뒀는지가 드러난다.
  2. 과제 설명에 없는 요구를 추가 구현하는 건 어떤가?
     - 기대 답: 핵심이 완성된 뒤에만. 지시 준수가 먼저이고, 추가한 이유를 적는다.
- 📖 **레퍼런스** — [Take-home 과제 리뷰 관점(dev.to)](https://dev.to/gergelyorosz/9-insider-tips-to-ace-your-next-takehome-project-for-frontend-fullstack-and-mobile-interviews-41nn)

#### [주니어] 포트폴리오 프로젝트에서 기술 선택 이유를 묻는다면?

**핵심 답**

- 문제와 제약에서 출발해 설명한다: 무엇을 만들려 했고, 어떤 제약(시간·팀·배포 환경)이 있었는지.
- 대안을 검토했다는 증거를 댄다. 무엇을 비교했고 왜 이걸 골랐는지, 지금이라면 무엇을 바꿀지.
- "인기 있어서/튜토리얼이 그래서" 는 감점. 다만 학습 목적이었다면 그렇게 말하는 편이 낫다.
- 프로젝트에서 실제로 막혔던 지점과 해결 과정을 준비해 둔다 — 여기서 깊이가 갈린다.

- ✅ **좋은 신호** — 제약 → 대안 → 선택 → 회고 순서로 말하고 지금이라면 바꿀 점을 댄다.
- ⚠️ **약한 신호** — 기술 이름만 나열하거나 튜토리얼을 따랐다는 사실을 감춘다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 지금이라면 무엇을 다르게 하나?
     - 기대 답: 구조·상태 배치·테스트 중 하나를 구체적으로. "더 잘하겠다" 는 답이 아니다.
  2. 그 프로젝트에서 가장 어려웠던 버그는?
     - 기대 답: 재현·측정·수정 과정을 말할 수 있어야 한다. 이 답이 실제 경험 여부를 가른다.
- 📖 **레퍼런스** — [프론트 면접 준비 가이드 2026(Scrimba)](https://scrimba.com/articles/frontend-interview-prep-guide-2026/)

#### [미들] 과제 코드에 테스트를 어떻게 배치하나?

**핵심 답**

- 핵심 로직(계산·변환·상태 전이)은 유닛, 사용자 흐름 하나는 통합으로. 이 조합이 리뷰어에게 가장 잘 읽힌다.
- 테스트 이름을 요구사항 문장으로 쓴다. 무엇을 보장하는지가 이름에서 보이게.
- 쿼리는 접근성 기준(role·label)으로 작성해 구현 변경에 견디게 한다.
- 시간이 없으면 개수를 줄이되 실패 경로(에러·빈 상태) 하나는 남긴다.

- ✅ **좋은 신호** — 무엇을 막는 테스트인지로 설명하고 접근성 기준 쿼리를 쓴다.
- ⚠️ **약한 신호** — 스냅샷만 넣거나 커버리지 수치를 성과로 제시한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 시간이 정말 없으면 테스트를 아예 빼도 되나?
     - 기대 답: 빼더라도 README 에 무엇을 어떻게 테스트할지 계획을 적는다. 판단 근거가 남는다.
  2. 모킹은 어디까지 하나?
     - 기대 답: 네트워크 경계만. 내부 모듈 모킹은 리팩터에 부서지고 가짜 통과를 만든다.
- 📖 **레퍼런스** — [Testing Library 쿼리 우선순위](https://testing-library.com/docs/queries/about/) · [MSW 철학(경계 모킹)](https://mswjs.io/docs/philosophy)

#### [시니어] 과제 후속 인터뷰에서 무엇을 물을 것 같나? 어떻게 준비하나?

**핵심 답**

- "왜 이렇게 했나"와 "여기서 요구가 바뀌면 어디를 고치나" 가 핵심. 코드를 다시 읽고 결정 지점을 정리해 둔다.
- 자신의 코드에서 약한 부분을 먼저 말할 수 있어야 한다. 리뷰어는 대개 이미 알고 있다.
- 규모가 10배면 무엇이 먼저 깨지는지(렌더·요청·상태) 준비.
- 라이브 수정 요청에 대비해 로컬 실행·디버깅 환경을 정리해 둔다.

- ✅ **좋은 신호** — 약점을 먼저 꺼내고 확장 시 병목을 구체적으로 지목한다.
- ⚠️ **약한 신호** — 제출물이 완벽하다고 방어하거나 자기 코드 구조를 기억하지 못한다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 규모 10배에서 먼저 깨지는 건 무엇인가?
     - 기대 답: 대개 목록 렌더와 요청 수. 가상화·배치·캐시 중 무엇을 먼저 넣을지 답할 수 있어야 한다.
  2. 라이브로 기능 하나를 추가해 달라면?
     - 기대 답: 설계 의도를 유지하며 최소 변경으로. 여기서 구조가 실제로 확장 가능했는지 드러난다.
- 📖 **레퍼런스** — [프론트 면접 단계 개요(designgurus)](https://www.designgurus.io/answers/detail/what-does-a-frontend-interview-look-like) · [기술 평가 준비 가이드(hackajob)](https://hackajob.com/talent/technical-assessment/frontend-developer-interview-questions-preparation-guide)

### AI 도구 활용 (4)

#### [미들] AI 코딩 도구를 실무에서 어디까지 쓰고 어디서 직접 판단하나?

**핵심 답**

- 맡기기 좋은 것: 보일러플레이트, 테스트 초안, 변환·리네임, 익숙하지 않은 API 사용법 탐색, 리뷰 전 자체 점검.
- 직접 판단할 것: 아키텍처 경계, 데이터 계약, 보안·권한, 성능 트레이드오프, 삭제·마이그레이션 같은 되돌리기 어려운 변경.
- 기준은 '틀렸을 때 비용'이다. 비용이 크고 검증이 어려운 영역은 사람이 결정한다.
- 생성 코드는 리뷰 대상 코드와 같은 기준을 적용한다. 출처가 AI 라고 기준을 낮추지 않는다.

- ✅ **좋은 신호** — 위임 기준을 '검증 가능성과 실패 비용'으로 말하고 실제 사용 사례를 든다.
- ⚠️ **약한 신호** — 전부 맡긴다 또는 전혀 안 쓴다로 답하고 기준이 없다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 팀 규칙을 만든다면 무엇을 넣겠나?
     - 기대 답: 생성 코드 표기·검증 절차·금지 영역(시크릿·라이선스·개인정보), 리뷰 책임은 저자에게 남는다는 원칙.
  2. AI 가 만든 코드의 책임은 누구에게 있나?
     - 기대 답: 제출한 사람. 이 답이 흔들리면 신호가 나쁘다.
- 📖 **레퍼런스** — [AI 보조 코딩 면접 — Direct/Explain/Verify](https://formation.dev/blog/ai-assisted-coding-interviews) · [AI 코딩 면접 가이드(PracHub)](https://prachub.com/resources/ai-coding-interview-guide)

#### [미들] AI 가 만든 코드를 어떤 절차로 검증하나?

**핵심 답**

- 요구사항 대조부터. 코드가 아니라 요구를 기준으로 읽는다. 빠진 조건·틀린 가정을 먼저 찾는다.
- 실행 검증: 실패 경로(에러·경계값·빈 데이터)를 직접 돌린다. 생성 코드는 해피 패스만 맞는 경우가 흔하다.
- 존재 확인: API·옵션·패키지가 실제로 존재하는지 공식 문서로 확인한다(그럴듯한 환각이 여기서 걸린다).
- 보안·성능 점검: 입력 신뢰, 인증 경계, N+1·동기 블로킹. 그다음 테스트를 직접 쓴다.

- ✅ **좋은 신호** — 요구 대조 → 실패 경로 실행 → 문서로 존재 확인 순서를 말하고 환각 경험을 든다.
- ⚠️ **약한 신호** — "테스트가 통과하면 된다" 로 끝낸다. 문서 확인 단계가 없다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 문서에 없는 API 를 쓰자고 제안하면?
     - 기대 답: 실제 존재 여부를 확인하고 없으면 대안을 쓴다. 버전별 지원 여부까지 본다.
  2. 생성 코드가 기존 컨벤션을 어기면?
     - 기대 답: 컨벤션에 맞춰 고친다. 리뷰어는 출처를 모르고, 일관성은 유지 비용이다.
- 📖 **레퍼런스** — [AI 보조 코딩 면접 — Direct/Explain/Verify](https://formation.dev/blog/ai-assisted-coding-interviews) · [Google AI 보조 코딩 면접 가이드](https://www.tryexponent.com/blog/google-ai-coding-interview)

#### [미들] [실습] 그럴듯하지만 틀린 코드를 준다. 결함을 찾아 설명하라.

**핵심 답**

- 이 라운드는 '읽고 의심하는 능력' 을 본다. 실행 전에 계약부터 확인: 입력 범위, 반환값, 에러 처리, 비동기 순서.
- 자주 심는 결함: off-by-one, 얕은 복사로 인한 상태 공유, await 누락, 의존성 배열 누락, 취소 없는 요청, 부동소수 비교, 타임존 처리.
- 찾은 결함은 '왜 생기는지 + 어떤 입력에서 드러나는지 + 수정' 세 조각으로 말한다.
- 수정 후 그 결함을 잡는 테스트를 쓰는 것이 가장 강한 마무리.

*그럴듯하지만 틀린 코드 — 결함 5개를 찾아라*

```js
// AI 가 생성했다고 가정한 코드
async function loadPage(page) {
  const res = await fetch("/api/items?page=" + page);
  const data = res.json();                       // ① await 누락 → Promise 가 들어간다
  const items = data.items;
  for (let i = 0; i <= items.length; i++) {      // ② off-by-one → undefined 접근
    render(items[i]);
  }
  const copy = { ...state };
  copy.filters.status = "open";                  // ③ 얕은 복사 → 원본 상태 변경
  setState(copy);
  if (total == "0") showEmpty();                 // ④ 느슨한 비교 + 타입 혼동
  return items;                                  // ⑤ 실패(!res.ok)를 처리하지 않는다
}
```

*수정 + 결함을 잡는 테스트*

```js
async function loadPage(page, signal) {
  const res = await fetch("/api/items?page=" + page, { signal });
  if (!res.ok) throw new Error("items failed: " + res.status);     // ⑤
  const data = await res.json();                                    // ①
  for (const item of data.items) render(item);                      // ②
  setState((s) => ({ ...s, filters: { ...s.filters, status: "open" } }));  // ③
  if (data.total === 0) showEmpty();                                // ④
  return data.items;
}

test("서버가 500이면 던지고 빈 상태를 그리지 않는다", async () => {
  server.use(http.get("/api/items", () => new Response(null, { status: 500 })));
  await expect(loadPage(1)).rejects.toThrow(/items failed: 500/);
  expect(showEmpty).not.toHaveBeenCalled();
});
```

- ✅ **좋은 신호** — 결함마다 재현 입력을 대고 수정 + 테스트로 닫는다.
- ⚠️ **약한 신호** — 스타일 지적에 머물거나 실행해 보지 않고 넘어간다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 비동기 결함은 어떻게 드러내나?
     - 기대 답: 응답 지연을 인위적으로 넣어 순서를 뒤집는다. 정상 속도에서는 숨는다.
  2. 결함이 여러 개면 무엇을 먼저 말하나?
     - 기대 답: 데이터 손상·보안 → 기능 오류 → 성능 → 가독성 순.
- 📖 **레퍼런스** — [AI 코딩 면접 가이드(PracHub)](https://prachub.com/resources/ai-coding-interview-guide) · [Chrome DevTools 자바스크립트 디버깅](https://developer.chrome.com/docs/devtools/javascript) · [MSW 철학(경계 모킹)](https://mswjs.io/docs/philosophy)

#### [시니어] AI 도구를 팀에 도입할 때 무엇을 정하나?

**핵심 답**

- 허용 범위: 어떤 코드·데이터를 도구에 보낼 수 있는지(고객 데이터·시크릿·비공개 스펙 금지 경계).
- 검증 게이트: 생성 코드도 동일한 리뷰·테스트·보안 스캔을 통과. 예외 경로를 만들지 않는다.
- 라이선스·출처 리스크와 의존성 추가 승인 절차.
- 효과 측정: 리드타임·결함률·리뷰 왕복 변화를 보고 계속 쓸지 판단한다. 체감만으로 결정하지 않는다.

- ✅ **좋은 신호** — 데이터 경계와 측정 지표를 함께 말한다. 기존 게이트를 우회하지 않는 원칙을 세운다.
- ⚠️ **약한 신호** — 도입 자체를 성과로 말하고 경계·측정이 없다.
- ↪️ **꼬리질문** — 면접관이 파고드는 순서
  1. 생산성이 올랐다고 어떻게 증명하나?
     - 기대 답: 리드타임과 결함률을 도입 전후로 비교한다. 코드 양 증가는 지표가 아니다.
  2. 오히려 리뷰 부담이 늘었다면?
     - 기대 답: 생성 코드의 크기·검증 책임 배분을 조정한다. 리뷰 왕복 수를 지표로 본다.
- 📖 **레퍼런스** — [AI 보조 코딩 면접 — Direct/Explain/Verify](https://formation.dev/blog/ai-assisted-coding-interviews) · [Google AI 보조 코딩 면접 가이드](https://www.tryexponent.com/blog/google-ai-coding-interview)

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
- [Front End Interview Handbook — 프론트 시스템 디자인(RADIO)](https://www.frontendinterviewhandbook.com/front-end-system-design)
- [Front End Interview Handbook — 유틸 함수 머신코딩](https://www.frontendinterviewhandbook.com/coding/javascript-utility-function)
- [FrontendInterviews.dev — 시스템 디자인 문제 목록](https://frontendinterviews.dev/frontend-system-design-interview-questions)
- [Scrimba — 2026 프론트 면접 준비 가이드(5단계 구성)](https://scrimba.com/articles/frontend-interview-prep-guide-2026/)
- [DesignGurus — 프론트 면접 라운드 구성](https://www.designgurus.io/answers/detail/what-does-a-frontend-interview-look-like)
- [hackajob — 기술 평가 준비 가이드](https://hackajob.com/talent/technical-assessment/frontend-developer-interview-questions-preparation-guide)
- [dev.to — take-home 과제 리뷰 관점](https://dev.to/gergelyorosz/9-insider-tips-to-ace-your-next-takehome-project-for-frontend-fullstack-and-mobile-interviews-41nn)
- [Formation — AI 보조 코딩 면접(Direct·Explain·Verify)](https://formation.dev/blog/ai-assisted-coding-interviews)
- [Exponent — Google AI 보조 코딩 면접 가이드](https://www.tryexponent.com/blog/google-ai-coding-interview)
- [PracHub — AI 코딩 면접 가이드](https://prachub.com/resources/ai-coding-interview-guide)
- [How the Core Web Vitals metrics thresholds were defined — web.dev](https://web.dev/articles/defining-core-web-vitals-thresholds)

## 라이선스

문서·문항: CC BY 4.0. 레퍼런스로 링크한 외부 문서는 각 저작자의 라이선스를 따른다.
