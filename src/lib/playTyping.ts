import type { TypingProgram } from "../types/typingProgram";

// typewriter core types used in this project, basically chaining methods in typescript can be described in a class.
// in this case just for type claiming, a self-callback is what I need
// reference: https://blog.arnabxd.me/method-chaining-in-typescript
interface TypewriterCore {
  typeString(text: string): this;
  pauseFor(ms: number): this;
  deleteChars(count: number): this;
  deleteAll(): this;
  callFunction(cb: () => void): this;
  start(): this;
}

export function playTypingProgram(tw: TypewriterCore, program: TypingProgram) {
  for (const op of program.ops) {
    // switch case reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch
    switch (op.kind) {
      case "type":
        tw.typeString(op.text);
        break;

      case "pause":
        tw.pauseFor(op.ms);
        break;

      case "deleteChars":
        tw.deleteChars(op.count);
        break;

      case "deleteAll":
        tw.deleteAll();
        break;

      default: {
        const _never: never = op;
        throw new Error(`Unknown op: ${JSON.stringify(_never)}`);
      }
    }
  }

  tw.start();
}
