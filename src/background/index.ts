/// <reference types="chrome"/>

chrome.runtime.onInstalled.addListener(() => {
  console.log("BadWriter installed");
});

// setup side panel behavior to not open automatically on action click
// reference: https://developer.chrome.com/docs/extensions/reference/api/sidePanel
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: false })
  .catch((error) => console.error(error));

chrome.commands.onCommand.addListener((command) => {
  if (command === "rewrite_text") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab?.id) {
        // Feature: send shortcut message (omitted for now since we rely on content script key listeners directly)
        // chrome.tabs.sendMessage(activeTab.id, { type: "TRIGGER_REWRITE_SHORTCUT" });
      }
    });
  }
});
