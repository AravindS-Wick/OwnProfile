import type { OrderData } from "./types";

/**
 * Logs an order to Google Sheets via the Apps Script web app endpoint.
 * The Apps Script URL is set via GOOGLE_APPS_SCRIPT_URL env var.
 * No credit card, no Google Cloud billing — purely Apps Script.
 */
export async function logOrderToSheets(order: OrderData): Promise<void> {
  const url = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!url) {
    console.warn("[sheets] GOOGLE_APPS_SCRIPT_URL not set — skipping sheet write");
    return;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...order,
      timestamp: new Date().toISOString(),
    }),
    // Apps Script sometimes needs a redirect follow
    redirect: "follow",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sheets write failed: ${res.status} — ${text}`);
  }
}

/**
 * Fetches all orders from Google Sheets via Apps Script GET endpoint.
 * Returns an array of order rows for the daily digest.
 */
export async function fetchOrdersFromSheets(): Promise<OrderData[]> {
  const url = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!url) return [];

  try {
    const res = await fetch(`${url}?action=getOrders`, { redirect: "follow" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.orders ?? [];
  } catch {
    console.error("[sheets] Failed to fetch orders");
    return [];
  }
}
