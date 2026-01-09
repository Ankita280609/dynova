const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Azure imports commented out until keys are available
// const ContentSafetyClient = require("@azure-rest/ai-content-safety").default;
// const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
// const { isUnexpected } = require("@azure-rest/ai-content-safety");
// const { AzureKeyCredential: CoreKeyCredential } = require("@azure/core-auth");

// --- Configuration ---
const geminiApiKey = process.env.GEMINI_API_KEY;

// Azure config - commented out
// const safetyEndpoint = process.env.AZURE_CONTENT_SAFETY_ENDPOINT;
// const safetyKey = process.env.AZURE_CONTENT_SAFETY_KEY;
// const languageEndpoint = process.env.AZURE_LANGUAGE_ENDPOINT;
// const languageKey = process.env.AZURE_LANGUAGE_KEY;

// --- Clients ---
let genAI;
if (geminiApiKey) {
  genAI = new GoogleGenerativeAI(geminiApiKey);
}

// Azure clients - commented out
// let safetyClient;
// if (safetyEndpoint && safetyKey) {
//   safetyClient = ContentSafetyClient(safetyEndpoint, new CoreKeyCredential(safetyKey));
// }
// let languageClient;
// if (languageEndpoint && languageKey) {
//   languageClient = new TextAnalyticsClient(languageEndpoint, new AzureKeyCredential(languageKey));
// }

// --- Routes ---

// POST /api/ai/generate-form
// Body: { prompt: "Create a gym membership form" }
router.post('/generate-form', async (req, res) => {
  console.log('--- AI Debug Start ---');
  console.log('GEMINI_API_KEY present:', !!process.env.GEMINI_API_KEY);
  console.log('OPENAI_API_KEY present:', !!process.env.OPENAI_API_KEY);

  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });
    if (!genAI) {
      console.error('Gemini error: genAI client not initialized (missing API key)');
      return res.status(503).json({ error: "Gemini API not configured" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const systemPrompt = `You are a form builder assistant. Generate a JSON structure for a form based on the user's request.
Return ONLY valid JSON with this structure:
{
  "title": "Form Title",
  "description": "Form description",
  "elements": [
    {
      "type": "shortText" | "longText" | "numberField" | "singleSelect" | "multiSelect" | "dropdown" | "emailField" | "phoneField" | "datePicker",
      "label": "Question text",
      "required": true/false,
      "options": ["Option 1", "Option 2"] // only for singleSelect, multiSelect, dropdown
    }
  ]
}`;

    console.log('Generating content for prompt:', prompt);
    const result = await model.generateContent(`${systemPrompt}\n\nUser request: ${prompt}`);
    const response = await result.response;
    const text = response.text();
    console.log('AI Response text received');

    // Extract JSON from response
    let formData;
    try {
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      formData = JSON.parse(cleanText);
    } catch (e) {
      console.warn('JSON parse fallback used');
      formData = JSON.parse(text);
    }

    console.log('Successfully generated form JSON');
    res.json(formData);
  } catch (error) {
    console.error("--- AI ERROR DETECTED ---");
    console.error("Full Error Object:", error);
    console.error("Error Message:", error.message);
    if (error.stack) console.error("Stack Trace:", error.stack);
    res.status(500).json({
      error: "Failed to generate form",
      details: error.message,
      debug: "Check backend logs for more info"
    });
  } finally {
    console.log('--- AI Debug End ---');
  }
});

// Azure endpoints - commented out but keeping structure for when you add them later
/*
// POST /api/ai/sentiment
router.post('/sentiment', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });
  if (!languageClient) return res.status(503).json({ error: "Azure Language service not configured" });

  try {
    const results = await languageClient.analyzeSentiment([text]);
    const sentiment = results[0];
    res.json(sentiment);
  } catch (error) {
    console.error("Sentiment Error:", error);
    res.status(500).json({ error: "Failed to analyze sentiment", details: error.message });
  }
});

// POST /api/ai/moderate
router.post('/moderate', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });
  if (!safetyClient) return res.status(503).json({ error: "Azure Content Safety service not configured" });

  try {
    const result = await safetyClient.path("/text:analyze").post({
      body: { text }
    });

    if (isUnexpected(result)) {
      throw result.body;
    }

    res.json(result.body);
  } catch (error) {
    console.error("Moderation Error:", error);
    res.status(500).json({ error: "Failed to moderate content", details: error.message });
  }
});
*/

module.exports = router;
