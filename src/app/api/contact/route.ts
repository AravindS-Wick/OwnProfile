import { NextRequest, NextResponse } from "next/server";
import { logOrderToSheets } from "@/lib/sheets";
import { sendOrderNotifications } from "@/lib/notify";
import type { OrderData } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, service, budget, description } = body;

    // Validate required fields
    if (!name || !email || !service || !description) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, service, description" },
        { status: 400 }
      );
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const order: OrderData = {
      name: String(name).slice(0, 100),
      email: String(email).slice(0, 200),
      service: String(service).slice(0, 100),
      budget: String(budget || "Not specified").slice(0, 50),
      description: String(description).slice(0, 2000),
      timestamp: new Date().toISOString(),
    };

    // Fire Sheets write + notifications in parallel
    // If one fails, the others still complete
    const results = await Promise.allSettled([
      logOrderToSheets(order),
      sendOrderNotifications(order),
    ]);

    // Log any failures server-side but don't fail the response
    results.forEach((result, i) => {
      if (result.status === "rejected") {
        const label = i === 0 ? "Sheets" : "Notifications";
        console.error(`[contact] ${label} failed:`, result.reason);
      }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] Unhandled error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
