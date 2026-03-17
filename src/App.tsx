// for useState in react: https://react.dev/reference/react/useState
import { useState } from "react";
import { useExtensionStorage } from "./lib/storage";
import { ABBREV, SLANG_STEMS } from "./lib/rewriteRule";

function App() {
  const { isActive, toggleActive, customRules, saveCustomRules } =
    useExtensionStorage();
  const [newWord, setNewWord] = useState("");
  const [newReplacement, setNewReplacement] = useState("");

  // get the value from the input fields and save it to the extension storage
  const handleAddAbbrev = () => {
    if (!newWord || !newReplacement) return;
    const updated = {
      ...customRules,
      abbrevs: {
        ...customRules.abbrevs,
        [newWord.toLowerCase()]: newReplacement,
      },
    };
    saveCustomRules(updated);
    setNewWord("");
    setNewReplacement("");
  };

  // remove the custom rule from the extension storage
  const handleRemoveAbbrev = (key: string) => {
    const newAbbrevs = { ...customRules.abbrevs };
    delete newAbbrevs[key];
    saveCustomRules({ ...customRules, abbrevs: newAbbrevs });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-6 flex flex-col gap-6 font-mono text-zinc-800 dark:text-zinc-300 transition-colors">
      {/* Header Area */}
      <div className="flex justify-between items-center bg-white dark:bg-zinc-950 p-4 border border-black dark:border-zinc-800 transition-colors">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white tracking-widest uppercase">
            BadWriter_
          </h1>
          <p className="text-xs text-zinc-500 mt-2">
            Write as an IELTS 3.0 student.
          </p>
          <p className="text-[10px] bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-2 py-1 inline-block mt-3 text-zinc-600 dark:text-zinc-400 font-bold transition-colors">
            Hold Alt + Click to write
          </p>
        </div>

        {/* Global Toggle for extension activity*/}
        <label className="flex items-center gap-3 cursor-pointer group">
          <span className="text-sm font-bold uppercase tracking-wider text-zinc-500 group-hover:text-black dark:group-hover:text-white transition-colors">
            {isActive ? "ACTIVE" : "OFF"}
          </span>
          <div className="relative w-10 h-10 border border-black dark:border-zinc-700 bg-white dark:bg-zinc-900 flex items-center justify-center transition-colors group-hover:border-zinc-400 dark:group-hover:border-zinc-500">
            <input
              type="checkbox"
              className="absolute opacity-0 w-full h-full cursor-pointer"
              checked={isActive}
              onChange={toggleActive}
            />
            {/* Inner fill when active */}
            <div
              className={`w-6 h-6 transition-all duration-200 ${isActive ? "bg-black dark:bg-white" : "bg-transparent"}`}
            ></div>
          </div>
        </label>
      </div>

      {/* Main Settings Area */}
      <div className="grid gap-6">
        {/* Custom Rules Editor */}
        <section className="bg-white dark:bg-zinc-950 p-5 border border-black dark:border-zinc-800 transition-colors">
          <h2 className="text-sm font-bold uppercase tracking-widest text-black dark:text-white mb-4 border-b border-black dark:border-zinc-800 pb-2 transition-colors">
            Custom Replacements
          </h2>
          <div className="flex gap-2 mb-6">
            <input
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              placeholder="Origin"
              className="w-1/3 px-3 py-2 bg-white dark:bg-black border border-black dark:border-zinc-800 text-sm text-black dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 placeholder-zinc-400 dark:placeholder-zinc-700 transition-colors"
            />
            <span className="self-center text-zinc-600 font-bold">→</span>
            <input
              value={newReplacement}
              onChange={(e) => setNewReplacement(e.target.value)}
              placeholder="Target"
              className="flex-1 px-3 py-2 bg-white dark:bg-black border border-black dark:border-zinc-800 text-sm text-black dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 placeholder-zinc-400 dark:placeholder-zinc-700 transition-colors"
            />
            <button
              onClick={handleAddAbbrev}
              className="bg-black dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-300 dark:hover:text-black border border-black dark:border-zinc-700 hover:border-black dark:hover:border-white px-4 py-2 text-sm font-bold uppercase transition-colors"
            >
              Add
            </button>
          </div>

          <div className="space-y-1 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {Object.entries(customRules?.abbrevs || {}).map(([key, val]) => (
              <div
                key={key}
                className="flex justify-between items-center p-2 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-900 hover:border-black dark:hover:border-zinc-700 group text-sm transition-colors"
              >
                <div className="flex gap-4">
                  <span className="font-bold text-black dark:text-zinc-300">
                    {key}
                  </span>
                  <span className="text-zinc-300 dark:text-zinc-700">|</span>
                  <span className="text-black dark:text-white font-medium">
                    {val}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveAbbrev(key)}
                  className="text-zinc-400 dark:text-zinc-600 hover:text-white dark:hover:text-red-500 hover:bg-red-600 dark:hover:bg-red-950 px-2 py-1 text-xs uppercase font-bold border border-transparent hover:border-red-700 dark:hover:border-red-900 transition-all"
                >
                  Del
                </button>
              </div>
            ))}
            {Object.keys(customRules?.abbrevs || {}).length === 0 && (
              <p className="text-zinc-500 dark:text-zinc-600 text-xs uppercase tracking-widest text-center py-6 border border-dashed border-zinc-300 dark:border-zinc-800">
                No Custom Rules
              </p>
            )}
          </div>
        </section>

        {/* Built-in Rules Visualizer */}
        <section className="bg-white dark:bg-zinc-950 p-5 border border-black dark:border-zinc-800 transition-colors">
          <h2 className="text-sm font-bold uppercase tracking-widest text-black dark:text-white mb-4 border-b border-black dark:border-zinc-800 pb-2 transition-colors">
            Lexicon Core
          </h2>

          <div className="mb-8">
            <h3 className="text-[10px] text-zinc-500 mb-3 uppercase tracking-widest">
              System Abbreviations
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(ABBREV).map(([key, val]) => (
                <span
                  key={key}
                  className="bg-white dark:bg-black border border-zinc-300 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs px-2 py-1 transition-colors"
                >
                  {key}{" "}
                  <span className="text-zinc-400 dark:text-zinc-700 mx-1">
                    →
                  </span>{" "}
                  <span className="text-black dark:text-white font-bold">
                    {val}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] text-zinc-500 mb-3 uppercase tracking-widest">
              Slang Branches
            </h3>
            <div className="space-y-1 max-h-40 overflow-y-auto text-xs pr-2">
              {SLANG_STEMS.map((group, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-black p-3 border border-zinc-200 dark:border-zinc-900 flex flex-col gap-1 hover:border-black dark:hover:border-zinc-700 transition-colors"
                >
                  <span className="font-bold text-black dark:text-white uppercase tracking-wider">
                    {group.out.join(" / ")}
                  </span>
                  <span className="text-zinc-500 block">
                    TRIGGERS: {group.stems.slice(0, 5).join(", ")}...
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
