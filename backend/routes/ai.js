const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- Configuration ---
const geminiApiKey = process.env.GEMINI_API_KEY;

// --- Clients ---
let genAI;
if (geminiApiKey) {
  genAI = new GoogleGenerativeAI(geminiApiKey);
}

// --- Routes ---

// POST /api/ai/generate-form
router.post('/generate-form', async (req, res) => {
  console.log('--- AI Debug Start ---');
  console.log('GEMINI_API_KEY present:', !!process.env.GEMINI_API_KEY);

  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    if (!genAI) {
      console.error('Gemini error: genAI client not initialized (missing API key)');
      return res.status(503).json({ error: "Gemini API not configured" });
    }

    // ✅ UPDATED: Using Gemini 2.5 Flash (Current Standard)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

module.exports = router;