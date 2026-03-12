/* This file records type declaration of typing program array that passes to typewriter, which is in this format:

[
  { kind: "type", text: "The " },
  { kind: "type", text: "authors" },
  { kind: "pause", ms: 120 },
  { kind: "type", text: " propose" },
  { kind: "pause", ms: 250 },
  { kind: "deleteChars", count: 7 },
  { kind: "type", text: " drop" },
] 

and it will be complied to a chain like:

<Typewriter
  onInit={(typewriter) => {
    typewriter.typeString("The ").typeString("authors").pause(120).typeString(" propose").pause(120).deleteChars(7).typeString(" drop")
  }}
/>

*/

// typescript type vs interface: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces
// union types for typing operator, reference: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types

// setup basic expression cases
export type TypingOp =
  | { kind: "type"; text: string } // .typeString(String)
  | { kind: "pause"; ms: number } // .pauseFor(number)
  | { kind: "deleteChars"; count: number } // .deleteChars(number)
  | { kind: "deleteAll" }; // .deleteAll()

// a program is just a list of operations
export interface TypingProgram {
  ops: TypingOp[];
}
