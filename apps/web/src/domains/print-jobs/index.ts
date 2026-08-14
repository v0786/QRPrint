import type { ApiClient } from "../../api/client";

export type PrintJobCreateRequest = {
  tenant_id: string;
  store_id: string;
  pages: number;
  copies: number;
  color_mode: string;
  duplex?: boolean;
  paper_size?: string;
};

export type PrintJobCreateResponse = {
  id: string;
  total_amount: string;
  state: string;
  version: number;
};

export async function createPrintJob(
  client: ApiClient,
  req: PrintJobCreateRequest,
): Promise<PrintJobCreateResponse> {
  return client.post<PrintJobCreateResponse>("/api/v1/print-jobs", req);
}
