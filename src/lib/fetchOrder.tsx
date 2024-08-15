import { auth } from "@/auth";
import { MultiItem, OrderItem, OrderItineraries } from "@/types";

const API = process.env.NEXT_PUBLIC_MARKET_API_SERVER;
const CLIENT_ID = process.env.NEXT_PUBLIC_MARKET_API_CLIENT_ID;

export const FetchOrder = async (): Promise<MultiItem<OrderItem>> => {
  const session = await auth();
  const token = session?.accessToken as string;

  const response = await fetch(`${API}/orders`, {
    method: "GET",
    headers: {
      "client-id": CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  return data;
};

const FetchOrderId = async (_id: string): Promise<OrderItem> => {
  const session = await auth();
  const token = session?.accessToken as string;

  const response = await fetch(`${API}/orders/${_id}`, {
    method: "GET",
    headers: {
      "client-id": CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  return data.item;
};

export default FetchOrderId;
