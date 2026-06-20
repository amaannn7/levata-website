import { Resend } from "resend";
import { NextResponse } from "next/server";

// TODO: Replace "onboarding@resend.dev" with "hello@levata.ai" once the
// levata.ai domain is verified inside the Resend dashboard.
const FROM_ADDRESS = "Levata <noreply@levatahq.com>";
const TO_ADDRESS = "tigo.yusuf@gmail.com";

function buildHtml(fields: {
    name: string;
    email: string;
    company?: string;
    phone?: string;
    services?: string;
    message: string;
    source?: string;
    timestamp: string;
}): string {
    const BG = "#F4F6F9";
    const CARD = "#FFFFFF";
    const FOOTER = "#F4F6F9";
    const BORDER = "#E2E5EC";

    const field = (label: string, value: string, accent = false) => `
        <tr>
            <td bgcolor="${CARD}" style="padding:0;border-bottom:1px solid ${BORDER};background-color:${CARD};">
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                    <tr>
                        <td bgcolor="${CARD}" style="padding:14px 0 5px;background-color:${CARD};">
                            <span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:#9CA3AF;">${label}</span>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="${CARD}" style="padding:0 0 14px;background-color:${CARD};">
                            <span style="font-size:15px;line-height:1.6;color:${accent ? "#2563EB" : "#111827"};">${value}</span>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>`;

    const optionalFields = [
        fields.company ? field("Company", fields.company) : "",
        fields.phone ? field("Phone", fields.phone) : "",
        fields.services ? field("Interested In", fields.services, true) : "",
    ].join("");

    return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <title>New Levata Inquiry</title>
</head>
<body bgcolor="${BG}" style="margin:0;padding:0;background-color:${BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">

    <!--[if mso]><center><table width="600"><tr><td><![endif]-->

    <table width="100%" cellpadding="0" cellspacing="0" bgcolor="${BG}" style="background-color:${BG};border-collapse:collapse;">
        <tr>
            <td align="center" bgcolor="${BG}" style="padding:36px 16px 44px;background-color:${BG};">

                <!-- Card -->
                <table width="100%" cellpadding="0" cellspacing="0" bgcolor="${CARD}" style="max-width:560px;border-collapse:collapse;background-color:${CARD};border-radius:12px;border:1px solid ${BORDER};overflow:hidden;">

                    <!-- Gradient accent bar -->
                    <tr>
                        <td bgcolor="#4B91F7" style="height:4px;background:linear-gradient(90deg,#4B91F7 0%,#7B55EA 100%);font-size:0;line-height:0;">&nbsp;</td>
                    </tr>

                    <!-- Header -->
                    <tr>
                        <td bgcolor="${CARD}" style="padding:24px 28px 20px;border-bottom:1px solid ${BORDER};background-color:${CARD};">
                            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                                <tr>
                                    <td bgcolor="${CARD}" style="background-color:${CARD};">
                                        <span style="font-size:14px;font-weight:700;letter-spacing:-0.01em;color:#111827;">Levata Website</span>
                                    </td>
                                    <td align="right" bgcolor="${CARD}" style="background-color:${CARD};">
                                        <span style="display:inline-block;padding:3px 10px;border-radius:100px;background-color:#EEF2FF;border:1px solid #C7D2FE;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.14em;color:#4338CA;">${fields.source ?? "Website"}</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Fields -->
                    <tr>
                        <td bgcolor="${CARD}" style="padding:0 28px;background-color:${CARD};">
                            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                                ${field("Name", fields.name)}
                                ${field("Email", fields.email, true)}
                                ${optionalFields}
                                <tr>
                                    <td bgcolor="${CARD}" style="padding:0;background-color:${CARD};">
                                        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                                            <tr><td bgcolor="${CARD}" style="padding:14px 0 5px;background-color:${CARD};"><span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:#9CA3AF;">Message</span></td></tr>
                                            <tr><td bgcolor="${CARD}" style="padding:0 0 20px;background-color:${CARD};"><span style="font-size:15px;line-height:1.75;color:#374151;">${fields.message.replace(/\n/g, "<br/>")}</span></td></tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td bgcolor="${FOOTER}" style="padding:14px 28px;border-top:1px solid ${BORDER};background-color:${FOOTER};">
                            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                                <tr>
                                    <td bgcolor="${FOOTER}" style="background-color:${FOOTER};">
                                        <span style="font-size:11px;color:#9CA3AF;">Received ${fields.timestamp} UTC</span>
                                    </td>
                                    <td align="right" bgcolor="${FOOTER}" style="background-color:${FOOTER};">
                                        <span style="font-size:11px;color:#9CA3AF;">levata.io</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

    <!--[if mso]></td></tr></table></center><![endif]-->

</body>
</html>`;
}

const isDev = process.env.NODE_ENV === "development";
const hasRealKey = !!process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.startsWith("re_your_key");
const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024; // 4MB

export async function POST(req: Request) {
    try {
        const contentType = req.headers.get("content-type") || "";

        let name: string | undefined;
        let email: string | undefined;
        let company: string | undefined;
        let phone: string | undefined;
        let services: string | undefined;
        let message: string | undefined;
        let source: string | undefined;
        let attachment: { filename: string; content: Buffer } | undefined;

        if (contentType.includes("multipart/form-data")) {
            const form = await req.formData();
            name = form.get("name")?.toString();
            email = form.get("email")?.toString();
            company = form.get("company")?.toString() || undefined;
            phone = form.get("phone")?.toString() || undefined;
            services = form.get("services")?.toString() || undefined;
            message = form.get("message")?.toString();
            source = form.get("source")?.toString() || undefined;

            const file = form.get("attachment");
            if (file instanceof File && file.size > 0) {
                if (file.size > MAX_ATTACHMENT_BYTES) {
                    return NextResponse.json(
                        { error: `Attachment too large. Max ${MAX_ATTACHMENT_BYTES / (1024 * 1024)}MB.` },
                        { status: 400 }
                    );
                }
                const buffer = Buffer.from(await file.arrayBuffer());
                attachment = { filename: file.name, content: buffer };
            }
        } else {
            const body = await req.json() as {
                name?: string;
                email?: string;
                company?: string;
                phone?: string;
                services?: string;
                message?: string;
                source?: string;
            };
            ({ name, email, company, phone, services, message, source } = body);
        }

        if (!name?.trim() || !email?.trim() || !message?.trim()) {
            return NextResponse.json(
                { error: "Name, email, and message are required." },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Please provide a valid email address." },
                { status: 400 }
            );
        }

        const timestamp = new Date().toLocaleString("en-GB", {
            timeZone: "UTC",
            dateStyle: "full",
            timeStyle: "short",
        });

        if (isDev && !hasRealKey) {
            console.log("\n [contact/route] DEV MODE -- email not sent. Payload:");
            console.log({ name, email, company, phone, services, message, source, timestamp, attachment: attachment ? `${attachment.filename} (${attachment.content.length} bytes)` : "none" });
            console.log("Add a real RESEND_API_KEY to .env.local to send actual emails.\n");
            return NextResponse.json({ success: true });
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: FROM_ADDRESS,
            to: [TO_ADDRESS],
            replyTo: email,
            subject: `New Levata Inquiry - ${name}`,
            html: buildHtml({ name, email, company, phone, services, message, source, timestamp }),
            ...(attachment && { attachments: [attachment] }),
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[contact/route] Resend error:", err);
        return NextResponse.json(
            { error: "Failed to send. Please try again." },
            { status: 500 }
        );
    }
}
