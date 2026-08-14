export class ApiClient {
  constructor(public readonly baseUrl: string) {}

  async post<TResponse>(path: string, body: unknown): Promise<TResponse> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return (await response.json()) as TResponse;
  }
}
