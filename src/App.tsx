import TypewriterStage from "./components/TypewriterStage";

import type { TypingProgram } from "./types/typingProgram";
import { rewriteText } from "./lib/rewriteRule";
import { fetchGuardian } from "./lib/api";
import { useState } from "react";

function App() {
  const [_txt, setTxt] = useState<string>("");
  const [runKey, setRunKey] = useState(0);
  const [program, setProgram] = useState<TypingProgram>({ ops: [] });
  async function run() {
    setRunKey((k) => k + 1);
    const res = await fetchGuardian("brexit", { showFields: "bodyText" });

    // get first result
    const first = res?.data?.response?.results?.[0];
    if (!first) {
      setTxt("(No results)");
      return;
    }

    const body = first?.fields?.bodyText;
    setTxt(body);
    setProgram(rewriteText(body));
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 space-y-4">
      <button
        onClick={run}
        className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-black"
      >
        Fetch first article text
      </button>
      <TypewriterStage program={program} runKey={runKey} />
    </div>
  );
}

export default App;
