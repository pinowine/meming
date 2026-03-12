// this component accepts a string and return a letter-by-letter typing dom

// a lib for typewriting effect, reference: https://github.com/tameemsafi/typewriterjs?tab=readme-ov-file

import Typewriter from "typewriter-effect";
import type { TypingProgram } from "../types/typingProgram";
import { playTypingProgram } from "../lib/playTyping";

interface Props {
  program: TypingProgram;
  runKey: number;
}

export default function TypewriterStage({ program, runKey }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4 min-h-55">
      <div className="whitespace-pre-wrap wrap-break-word font-mono text-2xl leading-10 tracking-wide text-neutral-100">
        <Typewriter
          options={{
            autoStart: true,
            loop: false,
            delay: 50,
            deleteSpeed: 20,
            cursor: "|",
            skipAddStyles: true,
          }}
          key={runKey}
          onInit={(tw) => {
            playTypingProgram(tw as any, program);
          }}
        />
      </div>
    </div>
  );
}
