// netlify functions, reference: https://docs.netlify.com/build/functions/get-started/?data-tab=TypeScript#runtime
// in the starting part of the doc, it suggests using ES modules, so I'll use .mts
// intro video: https://www.youtube.com/watch?v=RWpw1utaKuo

// the Guardian open-platform api: https://open-platform.theguardian.com/documentation/

import type { Context } from "@netlify/functions";

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init?.headers ?? {}),
    },
  });
}

export default async (req: Request, context: Context) => {
  const apiKey = process.env.GUARDIAN_API_KEY;
  if (!apiKey) {
    return json({
      error: "Missing GUARDIAN_API_KEY in Netlify env vars",
    });
  }

  // url.searchParams(set and get): https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
  // guardian api example: https://content.guardianapis.com/search?order-by=newest&q=football&api-key=test
  const url = new URL(req.url);
  const q = url.searchParams.get("q"); // get query params from request url
  const showFields = url.searchParams.get("show-fields") ?? "bodyText"; // decide what fields to show

  // set api url with official format: https://open-platform.theguardian.com/documentation/search
  const apiUrl = new URL("https://content.guardianapis.com/search");
  apiUrl.searchParams.set("order-by", "newest");
  apiUrl.searchParams.set("show-fields", showFields);
  apiUrl.searchParams.set("api-key", apiKey);
  apiUrl.searchParams.set("q", q || "brexit");

  // response/headers/source in fetching: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#setting_headers
  const response = await fetch(apiUrl.toString(), {
    headers: {
      accept: "application/json",
      "user-agent": "ibuprofennist-meming/1.0",
    },
  });

  if (!response.ok) {
    return json(
      {
        error: "Failed to fetch from Guardian API",
        status: response.status,
      },
      { status: 502 },
    );
  }

  const data = await response.json();
  return json(
    { source: "the guardian", q, data },
    {
      headers: {
        "cache-control": "public, max-age=30, s-maxage=300",
      },
    },
  );
};
