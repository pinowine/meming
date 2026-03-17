/* this file is for rewrite rules, which defines how to change the original text into the text that will be typed
 * accept a string and returned an object array for typing program to read, like:
 * [
 *   { kind: "type", text: "hello" },
 *   { kind: "pause", ms: 1000 },
 *   { kind: "deleteChars", count: 5 },
 *   { kind: "type", text: "hi" },
 * ]
 */

import { RiTa } from "rita";
import type { TypingProgram, TypingOp } from "../types/typingProgram";

// --- CONSTANTS ---

// usual English syllable onsets
// set reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
const ONSETS = new Set([
  "b",
  "c",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "m",
  "n",
  "p",
  "q",
  "r",
  "s",
  "t",
  "v",
  "w",
  "x",
  "y",
  "z",
  "dr",
  "tr",
  "ch",
  "sh",
  "th",
  "ph",
  "wh",
  "wr",
  "sch",
]);

// Record in typescript: https://refine.dev/blog/typescript-record-type/
// pronoun case
const PRP: Record<string, string> = {
  we: "ppl",
  they: "ppl",
  he: "bro",
  she: "sis",
  you: "u",
  i: "me",
};
// possessive pronoun case
const PSS: Record<string, string> = {
  your: "ur",
  his: "bro's",
  her: "sis's",
};
// pronoun + auxiliary verb / modal verb
const PRON_ABBREV: Record<string, string> = {
  will: "ll",
  would: "d",
  should: "d",
  am: "m",
  have: "ve",
};
// normal abbreviation
export const ABBREV: Record<string, string> = {
  for: "4",
  to: "2",
  are: "r",
  before: "b4",
  because: "cuz",
};
// slang replacement sheet: using a original word, rita will conjugate it to the correct form
export const SLANG_STEMS: Array<{ stems: string[]; out: string[] }> = [
  {
    stems: [
      "smile",
      "laugh",
      "happi",
      "ecstasi",
      "funni",
      "fun",
      "amus",
      "interest",
    ],
    out: ["lmao", "lmfao", "lol"],
  },
  { stems: ["respect", "honor"], out: ["o7"] },
  {
    stems: ["scare", "horribl", "shock", "amaz", "astonish"],
    out: ["omg"],
  },
  {
    stems: [
      "good",
      "great",
      "nice",
      "excel",
      "wonder",
      "better",
      "best",
      "greater",
      "greatest",
      "expert",
      "master",
      "profession",
    ],
    out: ["goat"],
  },
  {
    stems: [
      "done",
      "end",
      "finish",
      "kill",
      "destroy",
      "think",
      "consid",
      "understand",
      "make",
    ],
    out: ["cook"],
  },
];
// break word between sentences
const INSIDE = [
  "you know",
  "kind of",
  "sort of",
  "I mean",
  "lowkey",
  "fr",
  "ngl",
  "sort of",
  "indeed",
  "of course",
  "for sure",
];
// starting sentence expressions
const START = [
  "Tbh",
  "I would like to say",
  "I'd say",
  "I gotta say",
  "Honestly",
  "Surely",
  "What I want to say is",
  "What I'm trying to say is",
  "As a matter of fact",
];
// front punctuations
const FRONT_PUNCTS = ["`", "“", "‘", "«", "‹", "《", "(", "["];

// Custom extensions state
let customSlangs: Array<{ stems: string[]; out: string[] }> = [];
let customAbbrev: Record<string, string> = {};

export function setCustomRules(
  slangs: Array<{ stems: string[]; out: string[] }>,
  abbrevs: Record<string, string>,
) {
  customSlangs = slangs;
  customAbbrev = abbrevs;
}

// main export function
export function rewriteText(text: string): TypingProgram {
  let ops: Array<TypingOp> = []; // empty array to store all the typing operations

  // --- preparation: tokenize text, analyze part-of-speech ---
  const tokens = RiTa.tokenize(text);
  const len = tokens.length;
  const pos = [...RiTa.pos(tokens)];

  // --- main loop: scan through each token, and apply rules ---
  for (let i = 0; i < len; ) {
    const { ops: rule, advance } = applyRules(tokens, pos, i);
    ops = ops.concat(rule);
    i += advance;
  }

  return {
    ops: ops,
  };
}

// main rewrite applier
// advance is needed to figure out how many tokens to skip
function applyRules(
  tokens: string[],
  pos: string[],
  i: number,
): { ops: TypingOp[]; advance: number } {
  // console.log("tokens", tokens);
  // this part is for testing stems for several words...
  // console.log("funny", RiTa.stem("funny"));
  // console.log("happy", RiTa.stem("happy"));
  // console.log("greater", RiTa.stem("greater"));
  // console.log("best", RiTa.stem("best"));
  // console.log("smile", RiTa.stem("smile"));
  // console.log("professional", RiTa.stem("professional"));
  // console.log("ecstasy", RiTa.stem("ecstasy"));
  // console.log("destroy", RiTa.stem("destroy"));
  // console.log("think", RiTa.stem("think"));
  // console.log("consider", RiTa.stem("consider"));
  // console.log("understand", RiTa.stem("understand"));
  // console.log("make", RiTa.stem("make"));
  // console.log("interesting", RiTa.stem("interesting"));
  // console.log("fun", RiTa.stem("fun"));
  // console.log("amusing", RiTa.stem("amusing"));
  // console.log("amuse", RiTa.stem("amuse"));
  // console.log("respect", RiTa.stem("respect"));
  // console.log("honor", RiTa.stem("honor"));
  // console.log("scare", RiTa.stem("scare"));
  // console.log("horrible", RiTa.stem("horrible"));
  // console.log("shock", RiTa.stem("shock"));
  // console.log("amazing", RiTa.stem("amazing"));
  // console.log("astonish", RiTa.stem("astonish"));
  // console.log("nice", RiTa.stem("nice"));
  // console.log("excellent", RiTa.stem("excellent"));
  // console.log("wonderful", RiTa.stem("wonderful"));
  // console.log("done", RiTa.stem("done"));
  const tok = tokens[i];
  const tag = pos[i]?.toLowerCase() ?? "";
  const tokHasSpace = hasSpace(tokens, i);
  // console.log(tok, tokHasSpace);
  const lower = tok.toLowerCase();

  const hasNext = i + 1 < tokens.length;
  const next = hasNext ? tokens[i + 1]?.toLowerCase() : "";
  const nextTag = hasNext ? pos[i + 1]?.toLowerCase() : "";
  const nextHasSpace = hasNext ? hasSpace(tokens, i + 1) : false;

  const hasPrev = i - 1 >= 0;
  const prev = hasPrev ? tokens[i - 1]?.toLowerCase() : "";

  // rule 11
  if (prev === ".") {
    const rule = sentenceStart(tok, tokHasSpace);
    if (rule) return { ops: rule, advance: 1 };
  }
  // rule 10
  if (prev === "," || prev === ";") {
    const rule = sentenceBreak(tok, tokHasSpace);
    if (rule) return { ops: rule, advance: 1 };
  }
  // rule 9
  const box = getSlangBox(lower);
  if (box && box.length > 0)
    return {
      ops: slang(tok, tag, box, tokHasSpace),
      advance: 1,
    };
  // rule 8
  if (customAbbrev[lower] || ABBREV[lower])
    return { ops: normalAbbrev(tok, tokHasSpace), advance: 1 };
  // rule 7
  if (tag === "prp" && checkNextVerb(next, nextTag))
    return {
      ops: pronAbbrev(tok, tokHasSpace, next, nextHasSpace),
      advance: 2,
    };
  // rule 6
  if (tag === "cc") return { ops: conj(tok, tokHasSpace), advance: 1 };
  // rule 5
  if (tag === "prp$" && PSS[lower])
    return { ops: possPronoun(tok, tokHasSpace), advance: 1 };
  // rule 4
  if (tag === "prp" && PRP[lower])
    return { ops: personalPronoun(tok, tokHasSpace), advance: 1 };
  // rule 3
  if (tag === "wp" && lower === "who")
    return { ops: whoPronoun(tok, tokHasSpace), advance: 1 };
  // rule 2
  if (tag === "nn" || tag === "nns")
    return { ops: normalNoun(tok, tokHasSpace), advance: 1 };
  // rule 1
  if (tag === "nnp" || tag === "nnps") {
    const rule = properNoun(tok, tokHasSpace);
    if (rule) return { ops: rule, advance: 1 };
  }

  // default
  return {
    ops: [
      {
        kind: "type",
        text: createChunk(tok, tokHasSpace),
      },
    ],
    advance: 1,
  };
}

// --- REWRITE HELP FUNCTIONS ---

// check the situation of pronoun and its next word
function checkNextVerb(next: string, nextTag: string): boolean {
  if (RiTa.stem(next).toLowerCase() === "be" || nextTag === "md") return true;
  return false;
}

// check if a token is inside the slang sheet
function getSlangBox(token: string): string[] | null {
  const stem = RiTa.stem(token).toLowerCase();
  // Check custom first
  const customHit = customSlangs.find((s) => s.stems.includes(stem));
  if (customHit) return customHit.out;
  const hit = SLANG_STEMS.find((s) => s.stems.includes(stem));
  return hit?.out ?? null;
}

// check if a token has space after it
function hasSpace(tokens: string[], i: number): boolean {
  const tok = tokens[i];
  const next = tokens[i + 1];
  // no space for end of the passage
  if (!next) return false;
  // if it is a change line marker, no space
  if (!!tok && /^\s+$/.test(tok)) return false;

  // token is punctuation:
  if (RiTa.isPunct(tok)) {
    // if it is front punctuation, no space
    if (FRONT_PUNCTS.includes(tok)) return false;
    // if next token is punctuation, no space
    return !RiTa.isPunct(next);
  }

  // token is not punctuation:
  if (RiTa.isPunct(next)) {
    // if next token is front punctuation, space
    if (FRONT_PUNCTS.includes(next)) return true;
    // otherwise, no space
    return false;
  }

  // otherwise, space
  return true;
}

// add a space to the end of the string
function createChunk(str: string, hasSpace: boolean): string {
  if (!hasSpace) return str;
  return str + " ";
}

// keep the case situation same
function matchInitialCase(input: string, output: string): string {
  // preserve only the first-letter case
  if (input[0] === input[0].toUpperCase()) {
    return output[0].toUpperCase() + output.slice(1);
  }
  return output;
}

// build replace operation
function buildReplaceOp(
  original: string,
  replacement: string,
  pauseMs = 10,
  hasSpace = false,
): TypingOp[] {
  const og = createChunk(original, hasSpace);
  const count = Array.from(og).length;
  const rep = createChunk(replacement, hasSpace);
  return [
    { kind: "type", text: og },
    { kind: "pause", ms: pauseMs },
    { kind: "deleteChars", count: count },
    { kind: "type", text: rep },
  ];
}

// --- POS-based rules ---

// proper nouns: input token and output first syllable slice
function properNoun(token: string, hasSpace: boolean): TypingOp[] | null {
  const change = Math.random() < 0.38;
  if (!change) return null;
  // check if it is multi-syllables
  const syl = RiTa.syllables(token);
  // rita return like: ae/p-ah-l, "/" claims the number of syllables
  if (!syl.includes("/"))
    return [
      {
        kind: "type",
        text: createChunk(token, hasSpace),
      },
    ];

  // get all vowel groups in a token
  // matchAll reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll
  const w = token.toLowerCase();
  const vowelGroups = [...w.matchAll(/[aeiouy]+/g)];
  if (vowelGroups.length < 2)
    return [
      {
        kind: "type",
        text: createChunk(token, hasSpace),
      },
    ];

  // calculate distance between two vowel groups
  const firstVowelEnd = vowelGroups[0].index + vowelGroups[0][0].length;
  const secondVowelStart = vowelGroups[1].index;
  const between = w.slice(firstVowelEnd, secondVowelStart);

  // no consonants between vowel groups: chaos -> chaos
  if (!between.length) {
    return [
      {
        kind: "type",
        text: createChunk(token, hasSpace),
      },
    ];
  }

  // keep the longest valid onset for the next syllable
  let onsetLen = 1;
  for (let len = Math.min(3, between.length); len >= 1; len--) {
    const cand = between.slice(-len);
    if (ONSETS.has(cand)) {
      onsetLen = len;
      break;
    }
  }
  const cut = secondVowelStart - onsetLen;
  const output = token.slice(0, cut);
  return buildReplaceOp(token, output, 40, hasSpace);
}

// normal nouns: get consonants letter = remove all vowel letters
function normalNoun(token: string, hasSpace: boolean): TypingOp[] {
  const output = token.replace(/[aeiou]/gi, "");
  return buildReplaceOp(token, output, 100, hasSpace);
}

// who-pronoun: keep the first letter's case
function whoPronoun(token: string, hasSpace: boolean): TypingOp[] {
  const output = matchInitialCase(token, "which");
  return buildReplaceOp(token, output, 200, hasSpace);
}

// personal pronouns
function personalPronoun(token: string, hasSpace: boolean): TypingOp[] {
  const output = matchInitialCase(token, PRP[token.toLowerCase()]);
  return buildReplaceOp(token, output, 250, hasSpace);
}

// possessive pronouns
function possPronoun(token: string, hasSpace: boolean): TypingOp[] {
  const output = matchInitialCase(token, PSS[token.toLowerCase()]);
  return buildReplaceOp(token, output, 150, hasSpace);
}

// conjunction case
function conj(token: string, hasSpace: boolean): TypingOp[] {
  const output = matchInitialCase(token, "and");
  return buildReplaceOp(token, output, 160, hasSpace);
}

// --- lexicon based rules ---

// pronoun + auxiliary verb / modal verb
function pronAbbrev(
  pronoun: string,
  hasSpace: boolean,
  verb: string,
  nextHasSpace: boolean,
): TypingOp[] {
  const og = createChunk(pronoun, hasSpace) + createChunk(verb, nextHasSpace);
  const suffix = PRON_ABBREV[verb.toLowerCase()];
  if (!suffix) {
    return [{ kind: "type", text: og }];
  }
  const output = createChunk(`${pronoun}'${suffix}`, nextHasSpace);
  return buildReplaceOp(og, output, 120, nextHasSpace);
}

// normal abbreviation
function normalAbbrev(token: string, hasSpace: boolean): TypingOp[] {
  const lower = token.toLowerCase();
  const repl = customAbbrev[lower] || ABBREV[lower];
  const output = matchInitialCase(token, repl);
  return buildReplaceOp(token, output, 180, hasSpace);
}

// slang replacement
function slang(
  token: string,
  tag: string,
  slangBox: string[],
  hasSpace: boolean,
): TypingOp[] {
  const s = slangBox[Math.floor(Math.random() * slangBox.length)];
  const isVerb = RiTa.isVerb(s); // some is not a verb like "goat" but used as a verb
  let out = s;
  switch (tag.toLowerCase()) {
    case "vbd": // past tense
      if (isVerb) {
        out = RiTa.conjugate(s, {
          tense: RiTa.PAST,
          person: RiTa.THIRD,
          number: RiTa.SINGULAR,
        });
      } else {
        out = `${s}ed`;
      }
      break;
    case "vbz": // present tense
      if (isVerb) {
        out = RiTa.conjugate(s, {
          tense: RiTa.PRESENT,
          person: RiTa.THIRD,
          number: RiTa.SINGULAR,
        });
      } else {
        out = `${s}s`;
      }
      break;
    case "vbg": // present participle
      if (isVerb) {
        out = RiTa.presentPart(s);
      } else {
        out = `${s}ing`;
      }
      break;
    case "vbn": // past participle
      if (isVerb) {
        out = RiTa.pastPart(s);
      } else {
        out = `${s}ed`;
      }
      break;
  }
  const output = matchInitialCase(token, out);
  return buildReplaceOp(token, output, 190, hasSpace);
}

// --- grammar based rules ---

// sentence break case
function sentenceBreak(token: string, hasSpace: boolean): TypingOp[] | null {
  // give a random number of breaking words (0/1/2)
  const breakNum = Math.floor(Math.random() * 3);
  if (breakNum === 0) return null;

  const arr = [...INSIDE]; // copy the original array
  const shuffle = arr.sort(() => Math.random() - 0.5); // randomly sort the array
  const breakWords = shuffle.slice(0, breakNum);

  if (breakWords.length > 0) {
    const insert = breakWords.join(", ");
    const output = `${insert}, ${token}`;
    return buildReplaceOp(token, output, 200, hasSpace);
  } else {
    return [{ kind: "type", text: createChunk(token, hasSpace) }];
  }
}
// sentence start case
function sentenceStart(token: string, hasSpace: boolean): TypingOp[] | null {
  const shouldAdd = Math.random() < 0.38; // 38% of chance to generate an addon
  if (!shouldAdd) return null;
  const start = START[Math.floor(Math.random() * START.length)];
  const output = `${start}, ${token.toLowerCase()}`;
  return buildReplaceOp(token, output, 200, hasSpace);
}
