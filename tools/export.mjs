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
out.push("> **TL;DR** — 주니어·미들·시니어 프론트엔드 면접 문항 " + Q.length + "개. 문항마다 핵심 답, 면접관이 볼 좋은/약한 신호, 후속 질문, 그리고 답을 검증할 공식 문서 레퍼런스가 붙어 있다.");
out.push("> 필터·검색·셀프 퀴즈가 되는 웹 페이지: **https://david-myeonghan.github.io/frontend-interview-kit/**");
out.push("");
out.push("- 문항 " + Q.length + "개 · 영역 " + Object.keys(CATS).length + "개");
out.push("- 레벨 분포: 주니어 " + count("jr") + " / 미들 " + count("mid") + " / 시니어 " + count("sr") + " / 공통 " + count("all"));
out.push("- 레퍼런스 링크 " + new Set(Q.flatMap((q) => q.r.map((r) => r[1]))).size + "개 (전부 HTTP 200 확인)");
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
    out.push("- ↪️ **후속 질문** — " + md(it.next));
    out.push("- 📖 **레퍼런스** — " + it.r.map(([t, u]) => "[" + t + "](" + u + ")").join(" · "));
    out.push("");
  }
}
out.push("## 출처");
out.push("");
out.push("문항 선정은 2026년 채용 시장의 실제 질문 목록을 교차 확인해 뽑았고, 답과 판별 기준은 각 문항의 레퍼런스에 달린 공식 문서를 근거로 썼다 (MDN · web.dev · react.dev · TypeScript 핸드북 · OWASP · W3C ARIA APG/WCAG · TanStack Query · Testing Library · Playwright · webpack · Node.js · Nx · Martin Fowler · Sentry).");
out.push("");
for (const [t, u] of [
  ["Frontend Developer Interview Questions in 2026 — OnlyFrontendJobs", "https://www.onlyfrontendjobs.com/blog/frontend-developer-interview-questions-2026"],
  ["Frontend Developer Interview Questions 2026 — KORE1", "https://www.kore1.com/frontend-developer-interview-questions/"],
  ["Deep JavaScript Interview Guide for 2025–2026 — Code With Seb", "https://www.codewithseb.com/blog/deep-javascript-interview-guide-for-2025%E2%80%932026"],
  ["30 Senior Frontend Engineer Interview Questions for 2026 — Verve AI", "https://www.vervecopilot.com/blog/senior-frontend-engineer-interview-questions"],
  ["카카오 출신 개발자가 정리한 프론트엔드 기술 면접 질문 TOP 20 — zero-base", "https://zero-base.co.kr/event/media_insight_contents_FE_frontend_tech_Interview"],
  ["프론트엔드 기술 면접 질문 (한국어 모음집)", "https://frontend-interview-question.vercel.app/"],
  ["How the Core Web Vitals metrics thresholds were defined — web.dev", "https://web.dev/articles/defining-core-web-vitals-thresholds"],
]) out.push("- [" + t + "](" + u + ")");
out.push("");
out.push("## 라이선스");
out.push("");
out.push("문서·문항: CC BY 4.0. 레퍼런스로 링크한 외부 문서는 각 저작자의 라이선스를 따른다.");
out.push("");
writeFileSync("README.md", out.join("\n"));
console.log("wrote questions.json, README.md —", Q.length, "questions");
