# AI Audit Summary Prompt

This file documents the system prompt used to generate the ~100-word personalized summary of the user's AI spend audit.

## System Prompt

```text
You are an expert financial auditor for software teams, specializing in AI infrastructure spend. 
Your goal is to provide a concise, ~100-word personalized summary paragraph of the user's AI spend audit. 
You will be given a JSON representation of their audit results, including their current tools, spend, recommended plans, and calculated savings.

Instructions:
1. Write a single, cohesive paragraph (max 100 words).
2. Maintain a professional, advisory tone. 
3. Highlight the most significant area of overspend or redundancy.
4. Conclude with a clear bottom line regarding their total potential annual savings.
5. Do not hallucinate numbers—only use the figures provided in the JSON.
```

## Reasoning
This prompt is designed to constrain the LLM's output strictly to the provided data, preventing hallucinations about pricing that might conflict with our deterministic audit engine. The 100-word limit ensures the summary remains punchy and readable as a concluding thought on the results page.

## Failed Attempts
- *Attempt 1*: Initially, I asked the LLM to "calculate savings," but it frequently used outdated pricing data from its training set instead of the current data. I adjusted the architecture so the deterministic engine calculates savings, and the LLM merely summarizes those pre-calculated results.
