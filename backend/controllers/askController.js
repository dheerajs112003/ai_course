import fs from "fs";
import OpenAI from "openai";

export const askAI = async (req, res) => {
  try {
    if (!req.auth?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ Create OpenAI INSIDE handler (prevents missing env bug)
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,   // your OpenRouter key
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "AI Course Generator",
      },
    });

    const { question, link } = req.body;
    let fileContent = "";

  
    if (req.file) {
      fileContent = fs.readFileSync(req.file.path, "utf-8");

      // cleanup temp file
      fs.unlinkSync(req.file.path);
    }

   const prompt = `
You are a tutor.

User Question:
${question}

Provided Link:
${link || "None"}

Uploaded Content:
${fileContent || "None"}

STRICT FORMAT RULES:

- NO markdown symbols (no ###, **, latex)
- Explain in clean simple English
- If solution has steps:
  use:
  1. Step
  2. Step
  3. Step

- Keep paragraphs aligned and readable
- If link is YouTube assume it's a tutorial and explain clearly

Now answer:
`;


    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.status(200).json({
      answer: response.choices[0].message.content,
    });

  } catch (error) {
    console.error("ASK AI ERROR:", error.message);
    res.status(500).json({ message: "AI chat failed" });
  }
};
