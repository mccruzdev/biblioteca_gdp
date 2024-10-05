interface Request {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: object;
  body?: object;
}

export const fetchJSON = async <T>(
  request: Request
): Promise<{ response: Response; json: T }> => {
  const response = await fetch(request.url, {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
      ...request.headers,
    },
    body: JSON.stringify(request.body),
  });

  return { response, json: await response.json() };
};
