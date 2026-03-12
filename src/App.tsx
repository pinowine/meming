import TypewriterStage from "./components/TypewriterStage";

import type { TypingProgram } from "./types/typingProgram";
import { rewriteText } from "./lib/rewriteRule";
import { fetchGuardian } from "./lib/api";
import { useState } from "react";

function App() {
  const [txt, setTxt] = useState<string>("");
  const [runKey, setRunKey] = useState(0);
  const [keyword, setKeyword] = useState<string>("brexit");
  const [program, setProgram] = useState<TypingProgram>({ ops: [] });
  async function run() {
    const res = await fetchGuardian(keyword, { showFields: "bodyText" });

    // get results
    const results = res?.data?.response?.results;
    if (!results) {
      setTxt("(No results found 4 u.)");
      return;
    }

    // get a random article in results
    const idx = Math.floor(Math.random() * results.length);
    const article = results[idx];
    const body = article?.fields?.bodyText;
    setTxt(body);
  }

  function typeIn() {
    setRunKey((k) => k + 1);
    setProgram(rewriteText(txt));
  }

  return (
    <>
      <div className="flex gap-2 px-12 py-2 bg-neutral-200 items-baseline flex-wrap">
        <h1>BadWriter</h1>
        <h1 className="text-base">Try to write like a IELTS 3.0 writer_</h1>
      </div>
      <div className="min-h-screen bg-neutral-950 text-neutral-100 p-14 space-y-4 grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="flex flex-col gap-2 flex-wrap">
          <div className="flex gap-2 justify-between items-center flex-wrap">
            <div className="flex gap-4 items-center flex-wrap">
              <h2>{`1 => `}</h2>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="rounded-xl bg-neutral-600 px-3 py-2 text-sm font-medium"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="brexit"
              />
              <label htmlFor="name" className="text-lg">
                I Want <code>{keyword || "brexit"}</code> as my topic.
              </label>
            </div>
            <button onClick={run} className="btn">
              I Fetch.
            </button>
          </div>
          <div className="flex gap-4 items-center"></div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4 min-h-55">
            <textarea
              name="text"
              id="text"
              value={txt}
              rows={20}
              onChange={(e) => setTxt(e.target.value)}
              className="scrollbar whitespace-pre-wrap wrap-break-word text-2xl leading-10 tracking-wide text-neutral-400 w-full"
              placeholder="Fetch or paste ur text in here."
            ></textarea>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-4 items-center">
            <h2>{`2 => `} </h2>
            <button onClick={typeIn} className="btn">
              I Type.
            </button>
          </div>
          <TypewriterStage program={program} runKey={runKey} />
        </div>
      </div>
    </>
  );
}

export default App;
