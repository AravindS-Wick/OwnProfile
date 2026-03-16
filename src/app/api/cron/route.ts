import { NextRequest, NextResponse } from "next/server";
import { fetchOrdersFromSheets } from "@/lib/sheets";
import { sendDailyDigest } from "@/lib/notify";

/**
 * Daily digest endpoint — called by GitHub Actions at 9 PM IST (15:30 UTC).
 *
 * Protected by a secret header to prevent unauthorized calls.
 * Set CRON_SECRET env var to a random string (min 32 chars).
 * Add the same secret to GitHub repo Secrets as CRON_SECRET.
 */
export async function POST(req: NextRequest) {
  // Auth check
  const secret = req.headers.get("x-cron-secret");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch pending orders from Google Sheets
    const orders = await fetchOrdersFromSheets();

    // Send digest to Telegram + Discord + Email
    await sendDailyDigest(orders);

    const istTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    console.log(
      `[cron] Daily digest sent at ${istTime} IST — ${orders.length} orders`
    );

    return NextResponse.json({
      success: true,
      sentAt: istTime,
      orderCount: orders.length,
    });
  } catch (err) {
    console.error("[cron] Failed to send digest:", err);
    return NextResponse.json(
      { error: "Digest failed", detail: String(err) },
      { status: 500 }
    );
  }
}

// Also allow GET for quick health check (no auth needed for this)
export async function GET() {
  return NextResponse.json({
    status: "ok",
    description: "Daily digest CRON endpoint. Use POST with x-cron-secret header.",
    schedule: "30 15 * * * (9 PM IST)",
  });
}
