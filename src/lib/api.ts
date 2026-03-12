// this file is for api calls, which ask netlify functions to fetch data from external apis

export type ApiResult = {
  source: string;
  q: string;
  data: any;
};

export async function fetchGuardian(
  q: string,
  options?: { showFields?: string },
) {
  const params = new URLSearchParams();
  params.set("q", q);
  if (options?.showFields) {
    params.set("show-fields", options.showFields);
  }
  const url = `/api/guardian?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch from Guardian API");
  }
  return (await res.json()) as ApiResult;
}
