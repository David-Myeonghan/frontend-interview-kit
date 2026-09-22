// index.html 안의 문항 데이터를 유일한 출처로 삼아 questions.json 과 README.md 를 다시 쓴다.
// 실행: node tools/export.mjs
import { readFileSync, writeFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const script = html.slice(html.indexOf("<script>") + 8, html.lastIndexOf("</script>"));
const dataPart = script.slice(0, script.indexOf("/* DATA_END"));

// 인라인 <script> 안에서 이 시퀀스들은 파서를 조기 종료시키거나 escaped 상태로 밀어 넣는다.
// 코드 예제에 HTML 을 넣을 때 반드시 역슬래시로 escape 해야 한다: <\/script>, <\!--
// innerHTML 로 삽입되는 텍스트 필드(문항·꼬리질문·심층 답·대본)에 태그 시작이 있으면 뒤 내용을 삼킨다.
// 코드 예제(CODE)는 esc() 로 이스케이프되므로 제외하고, 그 밖의 텍스트에서만 검사한다.
{
  const codeStart = dataPart.indexOf("const CODE = {");
  const codeEnd = dataPart.indexOf("Q.forEach((q,i)=>{ q.p = q.p ||");
  const textOnly = codeStart >= 0 ? dataPart.slice(0, codeStart) + dataPart.slice(codeEnd) : dataPart;
  const m = textOnly.match(/<(script|link|style|iframe|img|input)\b/i);
  if (m) throw new Error("텍스트 필드에 이스케이프되지 않은 태그 시작 " + m[0] + " 이 있다 — &lt; 로 바꿔라. innerHTML 삽입 시 뒤 내용이 사라진다.");
}
for (const [seq, fix] of [["</scr" + "ipt>", "<\\/script>"], ["<!" + "--", "<\\!--"]]) {
  if (dataPart.includes(seq)) {
    throw new Error(
      "index.html 데이터 영역에 이스케이프되지 않은 " + seq + " 가 있다 — " + fix + " 로 바꿔라. " +
      "그대로 두면 브라우저가 스크립트를 조기 종료해 페이지가 통째로 깨진다."
    );
  }
}
const { CATS, LV, Q, TRACKS, PROV, STRUCT_RUBRIC } = new Function(dataPart + ";return {CATS,LV,Q,TRACKS,PROV,STRUCT_RUBRIC};")();

writeFileSync("questions.json", JSON.stringify({ categories: CATS, levels: LV, questions: Q, tracks: TRACKS }, null, 2) + "\n");

const md = (s) => String(s)
  .replace(/<code>([\s\S]*?)<\/code>/g, (_, c) => "`" + c.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&") + "`")
  .replace(/<b>([\s\S]*?)<\/b>/g, "**$1**")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

const count = (l) => Q.filter((q) => q.l === l).length;
const out = [];
out.push("# 프론트엔드 면접 문항집");
out.push("");
out.push("> **TL;DR** — 프론트엔드 면접 문항 " + Q.length + "개 + 딥다이브 대본 " + TRACKS.length + "개. 지식 문답 + 라이브 코딩 + 시스템 디자인 + 디버깅/코드리뷰 라운드 + 과제 + AI 도구 활용 + **토스 예상 문항**(공식 채용 아티클·기술 블로그·오픈소스·후기 근거, 출처 등급 표기). 문항마다 핵심 답, 좋은/약한 신호, 꼬리질문과 기대 답, 코드 예제, 심층 답, 공식 문서 레퍼런스.");
out.push("> **출처 주의** — 출제 이력 기록이 아니다. 공개 정리글에서 반복 등장하는 **주제**를 기준으로 고른 문항이고, 문항 문장과 답은 직접 썼다. [출처](#출처) 참고.");
out.push("> 필터·검색·셀프 퀴즈가 되는 웹 페이지: **https://david-myeonghan.github.io/frontend-interview-kit/**");
out.push("");
out.push("- 문항 " + Q.length + "개 · 영역 " + Object.keys(CATS).length + "개");
out.push("- 레벨 분포: 주니어 " + count("jr") + " / 미들 " + count("mid") + " / 시니어 " + count("sr") + " / 공통 " + count("all"));
out.push("- 레퍼런스 링크 " + new Set(Q.flatMap((q) => q.r.map((r) => r[1]))).size + "개 (전부 HTTP 200 확인)");
out.push("- 꼬리질문 " + Q.reduce((a, q) => a + (q.p ? q.p.length : 0), 0) + "단계 — 문항마다 면접관이 파고드는 질문과 단계별 기대 답");
out.push("- 코드 예제 " + Q.reduce((a, q) => a + (q.code ? q.code.length : 0), 0) + "개 — 코드로 답해야 하는 " + Q.filter((q) => q.code && q.code.length).length + "문항에 동작하는 예제 첨부");
out.push("- 딥다이브 대본 " + TRACKS.length + "개(" + TRACKS.reduce((a, t) => a + t.steps.length, 0) + "단계) — 한 주제를 20~45분 파는 면접관 대본. 단계별 기대 답 · 레벨 기준선 · 분기(잘 답하면/막히면)");
out.push("- 심층 답 " + Q.filter((q) => q.deep).length + "문항 — 원리 · 증상 · 측정 · 반례 · 스펙 근거(절 링크)");
out.push("- 기준·결론 " + Q.filter((q) => q.struct).length + "/" + Q.length + "문항 — 답의 첫 두 줄을 「판단 기준 → 결론」으로 세우고 핵심 답은 그 이유로 배치");
{
  const toss = Q.filter((q) => q.c === "toss");
  const by = {};
  toss.forEach((q) => { by[q.prov.kind] = (by[q.prov.kind] || 0) + 1; });
  out.push("- 토스 예상 문항 " + toss.length + "개 — " + Object.entries(by).map(([k, n]) => PROV[k].label + " " + n).join(" · ") + ". 문항마다 출처 등급과 근거 표기");
}
out.push("");
out.push("## 쓰는 법");
out.push("");
out.push("**지원자**: 페이지에서 `셀프 퀴즈`를 켜면 답이 가려진다. 소리 내어 답한 뒤 열어서 핵심 항목을 몇 개 짚었는지 센다. 내 대답이 `약한 신호`에 들어가면 그 문항의 레퍼런스부터 읽는다.");
out.push("");
out.push("**면접관**: 레벨당 6~8문항이면 60분이 찬다. 영역을 3~4개로 좁히고 후속 질문으로 깊이를 잰다. 정답 여부보다 모르는 것을 어떻게 다루는지가 신호다.");
out.push("");
out.push("## 공통 채점 기준 — 답의 구조");
out.push("");
out.push("모든 문항에 같은 기준을 적용한다. 내용이 맞아도 나열이면 약한 답, 기준→결론→이유 순서면 강한 답이다.");
out.push("");
for (const [k, d] of STRUCT_RUBRIC.items) out.push("- **" + k + "** — " + d);
out.push("");
out.push("지원자가 나열로 답하면 되묻는 표준 힌트: \"" + STRUCT_RUBRIC.hint + "\"");
out.push("");
out.push("## 구성");
out.push("");
out.push("| 파일 | 내용 |");
out.push("|---|---|");
out.push("| `index.html` | 문항 데이터 + 페이지. 단일 파일, 의존성 없음. **데이터 수정은 여기서 한다** |");
out.push("| `questions.json` | 기계가 읽는 문항 데이터 (생성물) |");
out.push("| `README.md` | 문항 전문 (생성물) |");
out.push("| `tools/export.mjs` | `index.html` → `questions.json` + `README.md` 재생성 |");
out.push("");
out.push("```bash");
out.push("node tools/export.mjs   # 문항을 고친 뒤 실행");
out.push("```");
out.push("");
out.push("## 딥다이브 대본");
out.push("");
out.push("한 주제를 20~45분 파는 면접관 대본. 각 단계에 기대 답, 레벨별 기준선(주니어/미들/시니어가 어디까지 답하면 되는지), 분기(잘 답하면 → 심화 / 막히면 → 힌트·우회)가 있다. 단계마다 연결된 문항의 핵심 답·코드·심층 답을 함께 본다. 웹 페이지 상단 `딥다이브 대본` 탭에서 문항과 왕복하며 볼 수 있다.");
out.push("");
for (const t of TRACKS) {
  out.push("### " + t.title);
  out.push("");
  out.push("*" + t.minutes + "분 · " + t.lv.map((l) => LV[l]).join(" · ") + " · " + t.steps.length + "단계*");
  out.push("");
  out.push(md(t.intro));
  out.push("");
  out.push("근거: " + t.r.map(([a, u]) => "[" + a + "](" + u + ")").join(" · "));
  out.push("");
  t.steps.forEach((st, i) => {
    const q = st.node != null ? Q[st.node] : null;
    out.push("#### " + (i + 1) + ". [" + st.phase + "] " + md(st.q));
    out.push("");
    if (q) out.push("연결 문항: **" + md(q.q) + "**");
    if (q) out.push("");
    out.push("- **기대 답** — " + md(st.expect));
    out.push("- **기준선** — 주니어: " + md(st.bar.jr) + " / 미들: " + md(st.bar.mid) + " / 시니어: " + md(st.bar.sr));
    out.push("- **잘 답하면 →** " + md(st.good));
    out.push("- **막히면 →** 힌트: " + md(st.weak.hint) + " / 우회: " + md(st.weak.detour));
    if (q) out.push("- **레퍼런스** — " + q.r.map(([a, u]) => "[" + a + "](" + u + ")").join(" · "));
    out.push("");
  });
}
out.push("## 문항");
out.push("");
for (const [key, label] of Object.entries(CATS)) {
  const items = Q.filter((q) => q.c === key);
  if (!items.length) continue;
  out.push("### " + label + " (" + items.length + ")");
  out.push("");
  for (const it of items) {
    out.push("#### [" + LV[it.l] + "] " + md(it.q));
    out.push("");
    if (it.prov) {
      out.push("> **" + PROV[it.prov.kind].label + "** — " + md(it.prov.note));
      out.push("");
    }
    if (it.struct) {
      out.push("**기준** — " + md(it.struct[0]));
      out.push("");
      out.push("**결론** — " + md(it.struct[1]));
      out.push("");
    }
    out.push(it.struct ? "**이유**" : "**핵심 답**");
    out.push("");
    for (const c of it.core) out.push("- " + md(c));
    out.push("");
    for (const [label, lang, src] of it.code ?? []) {
      out.push("*" + label + "*");
      out.push("");
      out.push("```" + lang);
      out.push(src);
      out.push("```");
      out.push("");
    }
    if (it.deep) {
      out.push("<details><summary><b>심층 답</b> — 원리 · 증상 · 측정 · 반례 · 스펙 근거</summary>");
      out.push("");
      out.push("- **왜 그렇게 동작하나** — " + md(it.deep.why));
      out.push("- **실무에서 어떻게 드러나나** — " + md(it.deep.symptom));
      out.push("- **어떻게 확인하나** — " + md(it.deep.measure));
      out.push("- **안 맞는 경우** — " + md(it.deep.counter));
      out.push("- **스펙·문서 근거**");
      for (const [t, u, note] of it.deep.spec) out.push("  - [" + t + "](" + u + ") — " + md(note));
      out.push("");
      out.push("</details>");
      out.push("");
    }
    out.push("- ✅ **좋은 신호** — " + md(it.good));
    out.push("- ⚠️ **약한 신호** — " + md(it.weak));
    out.push("- 🧭 **구조 채점** — " + STRUCT_RUBRIC.items.map(([k]) => k).join(" · "));
    if (it.p && it.p.length) {
      out.push("- ↪️ **꼬리질문** — 면접관이 파고드는 순서");
      it.p.forEach(([pq, pe], i) => {
        out.push("  " + (i + 1) + ". " + md(pq));
        out.push("     - 기대 답: " + md(pe));
      });
    } else {
      out.push("- ↪️ **후속 질문** — " + md(it.next));
    }
    out.push("- 📖 **레퍼런스** — " + it.r.map(([t, u]) => "[" + t + "](" + u + ")").join(" · "));
    out.push("");
  }
}
out.push("## 출처");
out.push("");
out.push("**이 문항집은 출제 이력 기록이 아니다.** 공개된 면접 질문 정리글에서 반복해 등장하는 주제를 교차 확인해 문항을 골랐고, 문항 문장과 답·판별 기준은 직접 썼다. 어느 회사가 어떤 표현으로 출제했는지는 대조하지 않았다.");
out.push("");
out.push("아래 링크는 **주제 선정에 참고한 글**이다. 그중 면접 회고 글만 작성자 본인이 받은 질문이라고 밝힌 1차 자료이고, 나머지는 큐레이션 글이다. 각 문항에 달린 **레퍼런스**는 성격이 다르다 — 답 내용이 공식 문서와 맞는지 검증한 링크이며 출제 근거가 아니다 (MDN · web.dev · react.dev · TypeScript 핸드북 · OWASP · W3C ARIA APG/WCAG · TanStack Query · Testing Library · Playwright · webpack · Node.js · Nx · Martin Fowler · Sentry).");
out.push("");
for (const [t, u] of [
  ["Frontend Developer Interview Questions in 2026 — OnlyFrontendJobs", "https://www.onlyfrontendjobs.com/blog/frontend-developer-interview-questions-2026"],
  ["Frontend Developer Interview Questions 2026 — KORE1", "https://www.kore1.com/frontend-developer-interview-questions/"],
  ["Deep JavaScript Interview Guide for 2025–2026 — Code With Seb", "https://www.codewithseb.com/blog/deep-javascript-interview-guide-for-2025%E2%80%932026"],
  ["30 Senior Frontend Engineer Interview Questions for 2026 — Verve AI", "https://www.vervecopilot.com/blog/senior-frontend-engineer-interview-questions"],
  ["카카오 출신 개발자가 정리한 프론트엔드 기술 면접 질문 TOP 20 — zero-base", "https://zero-base.co.kr/event/media_insight_contents_FE_frontend_tech_Interview"],
  ["프론트엔드 기술 면접 질문 (한국어 모음집)", "https://frontend-interview-question.vercel.app/"],
  ["3년차 프론트엔드 면접 질문 회고 (velog) — 본인이 받은 질문이라 밝힌 1차 자료", "https://velog.io/@qnrjs42/23.10-24.01-3%EB%85%84%EC%B0%A8-%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%EB%A9%B4%EC%A0%91-%EB%95%8C-%EB%B0%9B%EC%95%98%EB%8D%98-%EC%A7%88%EB%AC%B8%EA%B3%BC-%EB%8A%90%EB%82%80-%EC%A0%90-react"],
  ["프론트엔드 기술 면접 질문 리스트 (velog)", "https://velog.io/@doheek2/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%EA%B8%B0%EC%88%A0-%EB%A9%B4%EC%A0%91-%EC%A7%88%EB%AC%B8-%EB%A6%AC%EC%8A%A4%ED%8A%B8"],
  ["프론트엔드 기술 면접 질문 정리 — hyunwoo.dev", "https://www.chahyunwoo.dev/blog/frontend-technical-interview"],
  ["프론트엔드 면접 질문 리스트 (Browser) — dev and dev", "https://joontae-kim.github.io/2020/10/26/interview-question-fe/"],
  ["Front End Interview Handbook — 프론트 시스템 디자인(RADIO)", "https://www.frontendinterviewhandbook.com/front-end-system-design"],
  ["Front End Interview Handbook — 유틸 함수 머신코딩", "https://www.frontendinterviewhandbook.com/coding/javascript-utility-function"],
  ["FrontendInterviews.dev — 시스템 디자인 문제 목록", "https://frontendinterviews.dev/frontend-system-design-interview-questions"],
  ["Scrimba — 2026 프론트 면접 준비 가이드(5단계 구성)", "https://scrimba.com/articles/frontend-interview-prep-guide-2026/"],
  ["DesignGurus — 프론트 면접 라운드 구성", "https://www.designgurus.io/answers/detail/what-does-a-frontend-interview-look-like"],
  ["hackajob — 기술 평가 준비 가이드", "https://hackajob.com/talent/technical-assessment/frontend-developer-interview-questions-preparation-guide"],
  ["dev.to — take-home 과제 리뷰 관점", "https://dev.to/gergelyorosz/9-insider-tips-to-ace-your-next-takehome-project-for-frontend-fullstack-and-mobile-interviews-41nn"],
  ["Formation — AI 보조 코딩 면접(Direct·Explain·Verify)", "https://formation.dev/blog/ai-assisted-coding-interviews"],
  ["Exponent — Google AI 보조 코딩 면접 가이드", "https://www.tryexponent.com/blog/google-ai-coding-interview"],
  ["PracHub — AI 코딩 면접 가이드", "https://prachub.com/resources/ai-coding-interview-guide"],
]) out.push("- [" + t + "](" + u + ")");
out.push("");
out.push("### 토스 예상 문항의 출처 등급");
out.push("");
out.push("**출제·평가 확인** = 토스 공식 채용 아티클(NEXT 출제 기록·합격 수기), 토스 기술 블로그 모닥불(면접관 발언), 지원자 후기에서 실제 전형 방식·질문이 확인된 문항. **토스 공개자료 기반 예상** = 토스 기술 블로그·SLASH 세션·오픈소스(es-toolkit·Suspensive·overlay-kit·use-funnel·es-hangul)·Frontend Fundamentals 가 다루는 주제로 만든 예상 문항. **도메인·JD 기반 예상** = 담당 영역과 채용 공고에서 추정. 예상 문항은 출제 여부가 확인되지 않았다.");
out.push("");
for (const [t, u] of [
  ["토스 커리어 — [NEXT 합격 수기 - Frontend] 결과보다 '왜'에 집중했어요 (합격자·면접관 인터뷰)", "https://toss.im/career/article/next-25-frontend"],
  ["토스 커리어 — 2024 NEXT 개발자 챌린지: 테스트 현장, 그 날의 기록 (출제진 인터뷰)", "https://toss.im/career/article/2024_NEXTDEVELOPER_6"],
  ["토스 기술 블로그 — 모닥불 EP.8 Next.js 그만 쓰세요! 면접관이 진짜 원하는 것", "https://toss.tech/article/firesidechat_frontend_8"],
  ["모닥불 EP.6 Next.js, 꼭 써야 할까?", "https://toss.tech/article/firesidechat_frontend_6"],
  ["모닥불 EP.3 테스트 자동화, 꼭 해야 할까?", "https://toss.tech/article/firesidechat_frontend_3"],
  ["모닥불 EP.10 캠프파이어 상편(폴더 구조·추상화·유효성·함수형)", "https://toss.tech/article/firesidechat_frontend_10"],
  ["모닥불 EP.12 코드 리뷰할 시간이 어딨어요?", "https://toss.tech/article/firesidechat_frontend_12"],
  ["토스 기술 블로그 — App Router 의 장점은 우리에게도 장점일까요?", "https://toss.tech/article/52999"],
  ["토스 기술 블로그 — 전체 데이터를 브라우저에 두는 광고 대시보드 만들기", "https://toss.tech/article/ads_dashboard_fe"],
  ["토스 기술 블로그 — 모노리포 희망편", "https://toss.tech/article/52209"],
  ["Frontend Fundamentals — 좋은 코드를 위한 4가지 기준", "https://frontend-fundamentals.com/code-quality/code/"],
  ["SLASH 21 — 프론트엔드 웹 서비스에서 우아하게 비동기 처리하기", "https://toss.im/slash-21/sessions/3-1"],
  ["SLASH 23 — 퍼널: 쏟아지는 페이지 한 방에 관리하기", "https://toss.im/slash-23/session-detail/B1-7"],
  ["SLASH 23 — Server-driven UI 로 토스의 마지막 어드민 만들기", "https://toss.im/slash-23/session-detail/A1-2"],
  ["toss/es-toolkit", "https://github.com/toss/es-toolkit"],
  ["toss/suspensive", "https://github.com/toss/suspensive"],
  ["toss/overlay-kit", "https://github.com/toss/overlay-kit"],
  ["toss/use-funnel", "https://github.com/toss/use-funnel"],
  ["toss/es-hangul", "https://github.com/toss/es-hangul"],
  ["토스 프론트엔드 면접 후기 (경력, 2025-08) — 1차 자료", "https://caesiumy.dev/posts/career/toss-interview-retrospect/"],
  ["토스 NEXT 2023 후기 (Node 직군, 전형 구조 참고)", "https://spongelog.netlify.app/toss_next_2023_postmortem/"],
  ["토스 프론트엔드 멘토링 후기", "https://joong-sunny.github.io/career/toss/"],
  ["비바리퍼블리카 Frontend Developer 채용 공고 (원티드)", "https://www.wanted.co.kr/wd/204081"],
  ["How the Core Web Vitals metrics thresholds were defined — web.dev", "https://web.dev/articles/defining-core-web-vitals-thresholds"],
]) out.push("- [" + t + "](" + u + ")");
out.push("");
out.push("## 라이선스");
out.push("");
out.push("문서·문항: CC BY 4.0. 레퍼런스로 링크한 외부 문서는 각 저작자의 라이선스를 따른다.");
out.push("");
writeFileSync("README.md", out.join("\n"));
console.log("wrote questions.json, README.md —", Q.length, "questions");
