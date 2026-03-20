/* This file is for the popup window of the extension
 * it will display the current state of the extension
 * and provide a way to toggle the extension on and off
 */

import { useExtensionStorage } from "../lib/storage";

export function Popup() {
  const { isActive, toggleActive } = useExtensionStorage();

  return (
    <div className="w-64 p-5 flex flex-col gap-4 font-mono bg-white dark:bg-black border border-black dark:border-zinc-800 text-black dark:text-zinc-300 transition-colors">
      <div className="border-b border-black dark:border-zinc-800 pb-3">
        <h1 className="text-xl font-bold uppercase tracking-widest text-black dark:text-white">
          BadWriter
        </h1>
        <p className="text-[10px] text-zinc-500 mt-1 uppercase">
          Quick Control
        </p>
      </div>

      {/* status toggle check box */}
      <label className="flex items-center justify-between cursor-pointer group mt-2 hover:bg-zinc-100 dark:hover:bg-zinc-950 p-2 border border-transparent hover:border-black dark:hover:border-zinc-800 transition-colors">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors">
          {isActive ? "SYS_ACTIVE" : "SYS_DOWN"}
        </span>
        <div className="relative w-8 h-8 border border-black dark:border-zinc-700 bg-white dark:bg-black flex items-center justify-center transition-colors group-hover:border-zinc-500 dark:group-hover:border-zinc-500">
          <input
            type="checkbox"
            className="absolute opacity-0 w-full h-full cursor-pointer"
            checked={isActive}
            onChange={toggleActive}
          />
          <div
            className={`w-4 h-4 transition-all duration-200 ${isActive ? "bg-black dark:bg-white" : "bg-transparent"}`}
          ></div>
        </div>
      </label>

      {/* Instructional Block */}
      <div className="text-[10px] text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950 p-3 border border-black dark:border-zinc-800 mt-2">
        <p className="mb-2 text-black dark:text-white border-b border-black dark:border-zinc-800 pb-1 uppercase tracking-widest">
          Operation
        </p>
        <p className="leading-relaxed">
          Hold{" "}
          <kbd className="bg-white dark:bg-black border border-black dark:border-zinc-700 px-1 py-0.5 text-black dark:text-white font-bold">
            Alt
          </kbd>{" "}
          & hover text. Click the dashed zone to rewrite.
        </p>
      </div>

      <p className="text-[9px] text-center text-zinc-600 mt-2 uppercase tracking-wide">
        Configure in Side Panel
      </p>
    </div>
  );
}
