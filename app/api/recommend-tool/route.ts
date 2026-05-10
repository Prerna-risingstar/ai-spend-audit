import { NextResponse } from "next/server";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const openai = process.env.OPENAI_API_KEY 
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) 
    : null;

const genAI = process.env.GOOGLE_GENERATIVE_AI_API_KEY 
    ? new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY) 
    : null;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const task = body.task;
        let userStack = body.userStack;

        if (!task) return NextResponse.json({ error: "Missing query" }, { status: 400 });

        const taskLower = task.toLowerCase().trim();

        // Conversational handling for non-tool queries
        const greetings = ["hi", "hello", "hey", "hola", "yo", "good morning", "good afternoon"];
        const simpleHelp = ["i want help", "help me", "what can you do", "who are you"];

        if (greetings.some(g => taskLower.startsWith(g)) || simpleHelp.some(h => taskLower.includes(h))) {
            return NextResponse.json({
                recommendedTool: "Your Personal AI Concierge",
                reasoning: `Hello! I'm your dedicated Credex AI assistant. I have extensive knowledge of the current AI tool landscape. I can help you find free alternatives, compare pricing, or tell you which model in your stack is best for a specific task. Try asking: "Should I keep ChatGPT or Claude?" or "Which tool is best for research?"`,
                proTip: "I work best when you ask about specific workflows or tool comparisons!",
                isConversational: true
            });
        }

        // Use Global Stack if none provided
        if (!userStack || userStack.length === 0) {
            userStack = [
                { tool: "ChatGPT (GPT-4o)", plan: "Pro" },
                { tool: "Claude 3.5 Sonnet", plan: "Pro" },
                { tool: "Perplexity AI", plan: "Pro" },
                { tool: "Cursor AI", plan: "Pro" },
                { tool: "Jasper", plan: "Pro" }
            ];
        }

        const toolNames = userStack.map((t: any) => t.tool).join(", ");

        // 1. Try Gemini
        if (genAI) {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `You are a high-end AI Tool Consultant named Credex Concierge. 
            The user has these tools in their stack: ${toolNames}. 
            User question: "${task}". 
            If they ask for a recommendation, pick the best tool and explain why. 
            If they ask a general question or just chat, answer like a human with deep knowledge of AI productivity.
            Return ONLY a JSON object: {"recommendedTool": "...", "reasoning": "...", "proTip": "..."}`;
            
            const result = await model.generateContent(prompt);
            const response = result.response.text();
            // Clean the response if Gemini wraps it in markdown blocks
            const jsonStr = response.replace(/```json|```/g, "").trim();
            return NextResponse.json(JSON.parse(jsonStr));
        }

        // 2. Try OpenAI
        if (openai) {
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are a tool recommendation expert. Reply only in valid JSON." },
                    { role: "user", content: `User stack: ${toolNames}. Question: ${task}. Return JSON: {"recommendedTool", "reasoning", "proTip"}` }
                ],
                response_format: { type: "json_object" }
            });
            return NextResponse.json(JSON.parse(response.choices[0]?.message?.content || "{}"));
        }

        // 3. Smarter Mock Fallback (if no keys)
        const stackLower = userStack.map((t: any) => t.tool.toLowerCase());
        let winner = userStack[0].tool;
        let reason = "This tool offers the most balanced feature set for your current requirements.";
        let tip = "Try using a detailed system prompt to unlock its full potential.";

        if (taskLower.includes("code") || taskLower.includes("program")) {
            winner = stackLower.some((s: string) => s.includes("cursor")) ? "Cursor" : "Claude 3.5 Sonnet";
            reason = `${winner} has a deeper understanding of complex architectural patterns and generates fewer bugs in my benchmarks.`;
            tip = "Be specific about the library versions you are using.";
        } else if (taskLower.includes("research") || taskLower.includes("search")) {
            winner = stackLower.some((s: string) => s.includes("perplexity")) ? "Perplexity" : "ChatGPT (Browse Mode)";
            reason = `${winner} is built specifically for real-time indexing, ensuring you don't get 'hallucinated' data from 2023.`;
            tip = "Ask for citations to verify the source directly.";
        } else if (taskLower.includes("write") || taskLower.includes("creative")) {
            winner = stackLower.some((s: string) => s.includes("claude")) ? "Claude 3.5 Sonnet" : "ChatGPT";
            reason = "This model has the most natural, human-like cadence for creative prose and professional emails.";
            tip = "Describe the intended audience clearly for better tone matching.";
        } else if (taskLower.includes("cancel") || taskLower.includes("redundant") || taskLower.includes("save")) {
            winner = "Credex Optimization Engine";
            reason = "Most users can cancel Jasper if they have ChatGPT, or cancel Copilot if they have Cursor. Consolidation is key.";
            tip = "Check your 'Overlap Score' in the full audit report for more details.";
        }

        return NextResponse.json({ recommendedTool: winner, reasoning: reason, proTip: tip });

    } catch (error) {
        console.error("Error in recommend-tool:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
