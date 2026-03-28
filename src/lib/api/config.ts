export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://rust.asepharyana.tech/api";

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Request failed with status ${response.status}: ${await response.text()}`);
  }

  return response.json() as Promise<T>;
}
