import type { ApiClient } from "../../api/client";

export type QuoteRequest = {
  tenant_id?: string;
  store_id?: string;
  pages: number;
  copies: number;
  color_mode: string;
  paper_size?: string;
  duplex?: boolean;
};

export type QuoteResult = {
  base_price: string;
  tax: string;
  discount: string;
  total_amount: string;
  currency: string;
};

export async function fetchQuote(
  client: ApiClient,
  req: QuoteRequest,
): Promise<QuoteResult> {
  return client.post<QuoteResult>("/api/v1/pricing/quote", req);
}
