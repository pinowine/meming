/* This file is for extension storage, basically deal with the chrome.storage.local API
 * store the isActive state and custom rules into chrome's local storage
 */

import { useState, useEffect } from "react";

// --- CUSTOM RULES INTERFACE ---

// a standard payload interface for saving abbreviation and slang dictionaries
export interface CustomRulesPayload {
  abbrevs: Record<string, string>;
  slangs: Array<{ stems: string[]; out: string[] }>;
}

export function useExtensionStorage() {
  const [isActive, setIsActive] = useState(true);
  const [customRules, setCustomRulesState] = useState<CustomRulesPayload>({
    abbrevs: {},
    slangs: [],
  });

  // observe and listen to extension state changes on mount
  useEffect(() => {
    // only operate storage logic if we are safely inside the chrome extension api context
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(["isActive", "customRules"]).then((result) => {
        if (result.isActive !== undefined)
          setIsActive(result.isActive as boolean);
        if (result.customRules)
          setCustomRulesState(result.customRules as CustomRulesPayload);
      });

      const handleStorageChange = (changes: {
        [key: string]: chrome.storage.StorageChange;
      }) => {
        if (changes.isActive) setIsActive(changes.isActive.newValue as boolean);
        if (changes.customRules)
          setCustomRulesState(
            changes.customRules.newValue as CustomRulesPayload,
          );
      };

      chrome.storage.local.onChanged.addListener(handleStorageChange);
      return () =>
        chrome.storage.local.onChanged.removeListener(handleStorageChange);
    }
  }, []);

  const toggleActive = () => {
    const newState = !isActive;
    setIsActive(newState);
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.set({ isActive: newState });
    }
  };

  const saveCustomRules = (rules: CustomRulesPayload) => {
    setCustomRulesState(rules);
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.set({ customRules: rules });
    }
  };

  return {
    isActive,
    toggleActive,
    customRules,
    saveCustomRules,
  };
}
