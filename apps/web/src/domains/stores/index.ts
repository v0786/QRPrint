import type { ApiClient } from "../../api/client";

export type StoreInfo = {
  id: string;
  tenant_id: string;
  name: string;
  status: string;
  currency: string;
  available_services: string[];
  payment_options: string[];
};

export async function fetchStore(
  client: ApiClient,
  storeId: string,
): Promise<StoreInfo> {
  return client.get<StoreInfo>(`/api/v1/stores/${storeId}`);
}
