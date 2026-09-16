// index.html 안의 문항 데이터를 유일한 출처로 삼아 questions.json 과 README.md 를 다시 쓴다.
// 실행: node tools/export.mjs
import { readFileSync, writeFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const script = html.slice(html.indexOf("<script>") + 8, html.lastIndexOf("</script>"));
const dataPart = script.slice(0, script.indexOf("const state = {"));
const { CATS, LV, Q } = new Function(dataPart + ";return {CATS,LV,Q};")();

writeFileSync("questions.json", JSON.stringify({ categories: CATS, levels: LV, questions: Q }, null, 2) + "\n");

const md = (s) => String(s)
  .replace(/<code>([\s\S]*?)<\/code>/g, (_, c) => "`" + c.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&") + "`")
  .replace(/<b>([\s\S]*?)<\/b>/g, "**$1**")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

const count = (l) => Q.filter((q) => q.l === l).length;
const out = [];
out.push("# 프론트엔드 면접 문항집");
out.push("");
out.push("> **TL;DR** — 프론트엔드 면접 문항 " + Q.length + "개. 지식 문답 + 라이브 코딩 + 프론트 시스템 디자인 + 디버깅/코드리뷰 라운드 + 과제 + AI 도구 활용. 문항마다 핵심 답, 면접관이 볼 좋은/약한 신호, 꼬리질문 2~3단계와 단계별 기대 답, 답을 검증할 공식 문서 레퍼런스가 붙어 있다.");
out.push("> **출처 주의** — 출제 이력 기록이 아니다. 공개 정리글에서 반복 등장하는 **주제**를 기준으로 고른 문항이고, 문항 문장과 답은 직접 썼다. [출처](#출처) 참고.");
out.push("> 필터·검색·셀프 퀴즈가 되는 웹 페이지: **https://david-myeonghan.github.io/frontend-interview-kit/**");
out.push("");
out.push("- 문항 " + Q.length + "개 · 영역 " + Object.keys(CATS).length + "개");
out.push("- 레벨 분포: 주니어 " + count("jr") + " / 미들 " + count("mid") + " / 시니어 " + count("sr") + " / 공통 " + count("all"));
out.push("- 레퍼런스 링크 " + new Set(Q.flatMap((q) => q.r.map((r) => r[1]))).size + "개 (전부 HTTP 200 확인)");
out.push("- 꼬리질문 " + Q.reduce((a, q) => a + (q.p ? q.p.length : 0), 0) + "단계 — 문항마다 면접관이 파고드는 질문과 단계별 기대 답");
out.push("");
out.push("## 쓰는 법");
out.push("");
out.push("**지원자**: 페이지에서 `셀프 퀴즈`를 켜면 답이 가려진다. 소리 내어 답한 뒤 열어서 핵심 항목을 몇 개 짚었는지 센다. 내 대답이 `약한 신호`에 들어가면 그 문항의 레퍼런스부터 읽는다.");
out.push("");
out.push("**면접관**: 레벨당 6~8문항이면 60분이 찬다. 영역을 3~4개로 좁히고 후속 질문으로 깊이를 잰다. 정답 여부보다 모르는 것을 어떻게 다루는지가 신호다.");
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
    out.push("**핵심 답**");
    out.push("");
    for (const c of it.core) out.push("- " + md(c));
    out.push("");
    out.push("- ✅ **좋은 신호** — " + md(it.good));
    out.push("- ⚠️ **약한 신호** — " + md(it.weak));
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
  ["How the Core Web Vitals metrics thresholds were defined — web.dev", "https://web.dev/articles/defining-core-web-vitals-thresholds"],
]) out.push("- [" + t + "](" + u + ")");
out.push("");
out.push("## 라이선스");
out.push("");
out.push("문서·문항: CC BY 4.0. 레퍼런스로 링크한 외부 문서는 각 저작자의 라이선스를 따른다.");
out.push("");
writeFileSync("README.md", out.join("\n"));
console.log("wrote questions.json, README.md —", Q.length, "questions");
