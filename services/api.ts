type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type FetchApiOptions<TBody> = {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
  cache?: RequestCache;
};

async function fetchApi<TResponse, TBody = any>(
  url: string,
  options: FetchApiOptions<TBody> = {}
): Promise<TResponse> {
  const { method = "GET", body, headers, cache = "no-store" } = options;

  const res = await fetch(url, {
    method,
    cache,
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // Hata yönetimi (mülakatta puan)
  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}

export const getApi = <T>(url: string) => fetchApi<T>(url, { method: "GET" });

export const postApi = <T, B>(url: string, body: B) =>
  fetchApi<T, B>(url, { method: "POST", body });

export const putApi = <T, B>(url: string, body: B) =>
  fetchApi<T, B>(url, { method: "PUT", body });

export const deleteApi = <T>(url: string) =>
  fetchApi<T>(url, { method: "DELETE" });