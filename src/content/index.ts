import { DOMTypewriter } from "./typewriter";
import { isEditableTarget } from "./range";
import { rewriteText } from "../lib/rewriteRule";
import { playTypingProgram } from "../lib/playTyping";

import { setCustomRules } from "../lib/rewriteRule";

console.log("BadWriter Content Script Loaded");

// --- STATE & INITIALIZATION ---

// a global toggle to control whether the extension is actively rewriting or not
let globalActive = true;

// initialize state from chrome storage at startup
if (typeof chrome !== "undefined" && chrome.storage) {
  chrome.storage.local.get(["isActive", "customRules"]).then((result) => {
    if (result.isActive !== undefined)
      globalActive = result.isActive as boolean;
    if (result.customRules) {
      const cr = result.customRules as {
        slangs?: any[];
        abbrevs?: Record<string, string>;
      };
      setCustomRules(cr.slangs || [], cr.abbrevs || {});
    }
  });
}

// A state to keep track of created shadows so we can remove them if needed
// map of original elements and their innerHTML to restore on toggle off
const originalStates = new Map<HTMLElement, string>();

// listen for storage changes directly to sync the rules without relying on message passing
if (typeof chrome !== "undefined" && chrome.storage) {
  chrome.storage.local.onChanged.addListener((changes) => {
    if (changes.isActive) {
      globalActive = changes.isActive.newValue as boolean;
      if (!globalActive) {
        // restore original dom when the user toggles the extension off
        originalStates.forEach((html, element) => {
          if (document.body.contains(element)) {
            element.innerHTML = html;
          }
        });
        originalStates.clear();
      }
    }

    // update custom rules when they change in storage
    if (changes.customRules && changes.customRules.newValue) {
      const cr = changes.customRules.newValue as {
        slangs?: any[];
        abbrevs?: Record<string, string>;
      };
      setCustomRules(cr.slangs || [], cr.abbrevs || {});
    }
  });
}

// --- HOVER PREVIEW ---

// track the element that is currently being hovered with alt key pressed
let hoveredElement: HTMLElement | null = null;
const HIGHLIGHT_OUTLINE = "2px dashed #6366f1"; // visually indicate the target

// apply or remove highlights dynamically based on cursor movement
function updateHoverHighlight(e: MouseEvent) {
  if (!globalActive || !e.altKey) {
    if (hoveredElement) {
      hoveredElement.style.outline = "";
      hoveredElement = null;
    }
    return;
  }

  const target = e.target as HTMLElement;
  if (isEditableTarget(target) || originalStates.has(target)) return;

  const textToRewrite = target.textContent?.trim() || "";

  // need enough text to rewrite to justify drawing an outline outline
  if (textToRewrite.length > 5) {
    if (hoveredElement !== target) {
      if (hoveredElement) {
        hoveredElement.style.outline = "";
        hoveredElement.style.cursor = "";
      }
      hoveredElement = target;
      hoveredElement.style.outline = HIGHLIGHT_OUTLINE;
      hoveredElement.style.outlineOffset = "2px";
      hoveredElement.style.cursor = "pointer";
    }
  } else if (hoveredElement) {
    hoveredElement.style.outline = "";
    hoveredElement.style.cursor = "";
    hoveredElement = null;
  }
}

// track mouse movement to highlight what will be clicked
document.addEventListener("mousemove", updateHoverHighlight, { passive: true });

// listen for alt key press/release while mouse is stationary to pop up the highlight
document.addEventListener("keydown", (e) => {
  if (e.key === "Alt" && hoveredElement) {
    hoveredElement.style.outline = HIGHLIGHT_OUTLINE;
    hoveredElement.style.outlineOffset = "2px";
    hoveredElement.style.cursor = "pointer";
  }
});
document.addEventListener("keyup", (e) => {
  if (e.key === "Alt" && hoveredElement) {
    hoveredElement.style.outline = "";
    hoveredElement.style.cursor = "";
  }
});

// --- MAIN CLICK OBSERVER ---

// main click observer to execute the rewrite process
document.addEventListener(
  "click",
  (e) => {
    if (!globalActive) return;

    const target = e.target as Element;
    if (isEditableTarget(target)) return;

    // we only rewrite if the target has text that isn't just whitespace
    // alt+click triggers rewriting to preserve standard click navigation on native links
    if (e.altKey && !!target.textContent?.trim()) {
      const textToRewrite = target.textContent?.trim() || "";

      // only engage if we actually have enough text to warrant rewriting and it hasn't been rewritten yet
      if (
        textToRewrite.length > 5 &&
        !originalStates.has(target as HTMLElement)
      ) {
        e.preventDefault();
        e.stopPropagation();

        handleRewriteOnElement(target as HTMLElement, textToRewrite);
      }
    }
  },
  { capture: true },
);

// execution wrapper that runs the typewriter animation directly into the dom
function handleRewriteOnElement(target: HTMLElement, text: string) {
  // get rewritten instructions array from rita rules
  const typingProgram = rewriteText(text);

  // save original html markup to memory for later restoration
  if (!originalStates.has(target)) {
    originalStates.set(target, target.innerHTML);
  }

  // prepare target for typing animation
  target.innerHTML = "";

  // add a subtle transition hint to the user that it's being rewritten
  target.style.transition = "color 0.3s ease";

  // play animation directly inside target element without shadow dom
  const renderer = new DOMTypewriter(target);

  // Cleanup transition when done (optional enhancement via CallFunction, but simple reset works too)
  playTypingProgram(renderer as any, typingProgram);
}
