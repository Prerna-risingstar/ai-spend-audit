import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

const resendKey = process.env.RESEND_API_KEY;
const isPlaceholderKey = resendKey === 're_your_actual_resend_key';

if (isPlaceholderKey) {
    console.warn("⚠️ [API/SAVE-AUDIT] RESEND_API_KEY is still the placeholder! Emails will NOT be sent.");
}

const resend = resendKey && !isPlaceholderKey ? new Resend(resendKey) : null;

export async function POST(req: Request) {
    console.log("🚀 [API/SAVE-AUDIT] Request received");
    try {
        const body = await req.json();
        const { email, results, totalSavings, annualSavings, company, role } = body;

        console.log("📧 [API/SAVE-AUDIT] Saving audit for:", email);

        if (!email || !results) {
            console.warn("⚠️ [API/SAVE-AUDIT] Missing fields");
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const shareId = crypto.randomUUID();
        console.log("🆔 [API/SAVE-AUDIT] Generated Share ID:", shareId);

        // Save to Supabase
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) {
            console.log("💾 [API/SAVE-AUDIT] Inserting into Supabase...");
            const { error: dbError } = await supabase
                .from('audits')
                .insert([
                    {
                        share_id: shareId,
                        email: email,
                        results: results,
                        total_savings: totalSavings,
                        annual_savings: annualSavings,
                        company: company || null,
                        role: role || null
                    }
                ]);

            if (dbError) {
                console.error("❌ [API/SAVE-AUDIT] Supabase Error:", dbError);
            } else {
                console.log("✅ [API/SAVE-AUDIT] Supabase Success");
            }
        } else {
            console.warn("⚠️ [API/SAVE-AUDIT] Supabase not configured properly");
        }

        // Send Email
        if (resend) {
            console.log("✉️ [API/SAVE-AUDIT] Sending email...");
            try {
                await resend.emails.send({
                    from: "Credex Audit <onboarding@resend.dev>", // Using Resend's default dev email for safety
                    to: [email],
                    subject: "Your AI Spend Audit Results",
                    html: `
                        <div style="font-family: sans-serif; color: #0f172a;">
                            <h1>Your AI Spend Audit is Ready</h1>
                            <p>We've identified potential savings of <strong>$${totalSavings}/mo</strong> ($${annualSavings}/yr).</p>
                            <p>View your full report and share it with your team here:</p>
                            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/audit/${shareId}" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View Full Audit</a>
                        </div>
                    `,
                });
                console.log("✅ [API/SAVE-AUDIT] Email sent");
            } catch (emailError) {
                console.error("❌ [API/SAVE-AUDIT] Email Error:", emailError);
            }
        }

        return NextResponse.json({ success: true, shareId });

    } catch (error: any) {
        console.error("🔥 [API/SAVE-AUDIT] Critical Error:", error);
        return NextResponse.json({ 
            error: "Internal Server Error", 
            details: error?.message || "Unknown error" 
        }, { status: 500 });
    }
}
