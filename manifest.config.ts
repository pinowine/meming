import { defineManifest } from "@crxjs/vite-plugin";

// most configuration come from this video: https://www.youtube.com/watch?v=iBL-vYXk9sc&t=1s

export default defineManifest({
  manifest_version: 3,
  name: "Bad Writer",
  version: "1.0.0",
  icons: {
    "16": "favicon-96x96.png",
    "32": "favicon-96x96.png",
    "48": "favicon-96x96.png",
    "128": "web-app-manifest-192x192.png",
  },
  permissions: ["activeTab", "sidePanel", "scripting", "storage"],
  host_permissions: ["http://*/*", "https://*/*"],
  action: {
    default_icon: {
      "16": "favicon-96x96.png",
      "32": "favicon-96x96.png",
      "48": "favicon-96x96.png",
      "128": "web-app-manifest-192x192.png",
    },
    default_title: "BadWriter Settings",
    default_popup: "src/popup/index.html",
  },
  background: {
    service_worker: "src/background/index.ts",
    type: "module",
  },
  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["src/content/index.ts"],
      run_at: "document_idle",
    },
  ],
  side_panel: {
    default_path: "index.html",
  },
  commands: {
    rewrite_text: {
      suggested_key: {
        default: "Ctrl+Shift+E",
        mac: "Command+Shift+E",
      },
      description: "Trigger rewriting selected/hovered text",
    },
  },
});
