interface Options {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: object;
  body?: object;
  json?: boolean;
}

export async function fetchJSON<T>(
  url: string,
  options: { json: false } & Options
): Promise<{ response: Response }>;

export async function fetchJSON<T>(
  url: string,
  options?: Options
): Promise<{ response: Response; json: T }>;

export async function fetchJSON<T>(url: string, options?: Options) {
  const response = await fetch(url, {
    method: options?.method,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    body: JSON.stringify(options?.body),
  });

  if (options?.json === false) {
    return { response };
  }

  return { response, json: (await response.json()) as T };
}
