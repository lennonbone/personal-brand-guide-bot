// ============================================================================
//  /api/chat  —  Secure backend for the Personal Brand Guide Bot
//
//  This runs on the server. It holds your Anthropic API key (NEVER in the
//  browser) and forwards the conversation to Claude. Works on Vercel as a
//  serverless function with zero extra setup.
//
//  Required environment variable:
//    ANTHROPIC_API_KEY   — your key from console.anthropic.com
//  Optional:
//    CLAUDE_MODEL        — defaults to claude-sonnet-4-6
// ============================================================================

const { SYSTEM_PROMPT } = require("./systemPrompt.js");

const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-4-6";

module.exports = async function handler(req, res) {
  // --- CORS so it can be embedded from your Kajabi site ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "Server is missing ANTHROPIC_API_KEY. Set it in your host's environment variables.",
    });
  }

  try {
    // Vercel parses JSON automatically; fall back to manual parse just in case.
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const messages = Array.isArray(body.messages) ? body.messages : [];

    if (messages.length === 0) {
      return res.status(400).json({ error: "No messages provided." });
    }

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        // Prompt caching: the big instruction sheet is identical on every turn,
        // so we cache it. Repeat reads are ~90% cheaper than re-sending it fresh.
        system: [
          {
            type: "text",
            text: SYSTEM_PROMPT,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: messages,
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      return res.status(anthropicRes.status).json({
        error: "Claude API error",
        detail: errText,
      });
    }

    const data = await anthropicRes.json();
    const reply =
      (data.content || [])
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("\n") || "";

    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: "Server error", detail: String(err) });
  }
};
