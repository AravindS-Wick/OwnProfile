import type { OrderData } from "./types";
import nodemailer from "nodemailer";

// ─── Telegram ────────────────────────────────────────────────────────────────

async function notifyTelegram(message: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn("[notify] Telegram env vars not set — skipping");
    return;
  }
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
  });
}

// ─── Discord ─────────────────────────────────────────────────────────────────

async function notifyDiscord(message: string): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("[notify] DISCORD_WEBHOOK_URL not set — skipping");
    return;
  }
  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: message, username: "Portfolio Bot 🤖" }),
  });
}

// ─── Email (Outlook SMTP) ────────────────────────────────────────────────────

async function notifyEmail(subject: string, body: string): Promise<void> {
  const email = process.env.OUTLOOK_EMAIL;
  const password = process.env.OUTLOOK_PASSWORD;
  if (!email || !password) {
    console.warn("[notify] Outlook env vars not set — skipping email");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: { user: email, pass: password },
    tls: { ciphers: "SSLv3" },
  });

  await transporter.sendMail({
    from: `"Portfolio Bot" <${email}>`,
    to: email,
    subject,
    text: body,
  });
}

// ─── Compose messages ────────────────────────────────────────────────────────

function buildOrderMessage(order: OrderData): string {
  return `🚀 <b>New Project Order!</b>

👤 <b>Name:</b> ${order.name}
📧 <b>Email:</b> ${order.email}
🛠 <b>Service:</b> ${order.service}
💰 <b>Budget:</b> ${order.budget}

📝 <b>Details:</b>
${order.description}

⏰ <b>Time:</b> ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST`;
}

function buildDigestMessage(orders: OrderData[]): string {
  if (orders.length === 0) {
    return `📋 <b>Daily Digest — 9 PM IST</b>

No new orders today. Keep building! 💪`;
  }
  const list = orders
    .map(
      (o, i) =>
        `${i + 1}. <b>${o.name}</b> → ${o.service} (${o.budget})\n   📧 ${o.email}`
    )
    .join("\n\n");

  return `📋 <b>Daily Digest — 9 PM IST</b>

You have <b>${orders.length} pending order(s)</b>:

${list}

Check your Google Sheet for full details.`;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Send all notifications when a new order comes in.
 * Fires Telegram + Discord + Email in parallel.
 * Failures in any channel do NOT block the others.
 */
export async function sendOrderNotifications(order: OrderData): Promise<void> {
  const message = buildOrderMessage(order);
  const subject = `New Order: ${order.service} from ${order.name}`;
  const plainText = message.replace(/<[^>]+>/g, "");

  await Promise.allSettled([
    notifyTelegram(message),
    notifyDiscord(plainText),
    notifyEmail(subject, plainText),
  ]);
}

/**
 * Send the daily 9 PM IST digest with all pending orders.
 */
export async function sendDailyDigest(orders: OrderData[]): Promise<void> {
  const message = buildDigestMessage(orders);
  const plainText = message.replace(/<[^>]+>/g, "");
  const subject = `Daily Digest — ${orders.length} Pending Order(s)`;

  await Promise.allSettled([
    notifyTelegram(message),
    notifyDiscord(plainText),
    notifyEmail(subject, plainText),
  ]);
}
