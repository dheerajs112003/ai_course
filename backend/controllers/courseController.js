import OpenAI from "openai";
import axios from "axios";

export const generateCourse = async (req, res) => {
  try {
    if (!req.auth?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { description, level, duration } = req.body;

    if (!description || !level || !duration) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ OpenRouter/OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // your OpenRouter key works here
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "AI Course Generator",
      },
    });

    /* ================= AI CURRICULUM ================= */

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `
Create a ${level} ${duration} course on "${description}".

STRICT RULES:
1. Use plain readable text only (no markdown, no ###, no **).
2. Each topic must be on a new line.
3. After each section include REAL WORKING links.
4. Use ONLY these trusted sites:
   https://docs.oracle.com
   https://www.w3schools.com
   https://www.geeksforgeeks.org
   https://codingbat.com
5. NEVER make fake URLs.

FORMAT EXACTLY LIKE THIS:

SECTION TITLE
1. Point
2. Point

Learning Links:
https://validlink1
https://validlink2
`,
        },
      ],
    });

    const curriculum =
      aiResponse.choices?.[0]?.message?.content || "No curriculum generated.";

    /* ================= YOUTUBE VIDEOS ================= */

    const ytResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: `${description} ${level} tutorial`,
          type: "video",
          maxResults: 5,
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    const videos = (ytResponse.data.items || [])
      .filter((item) => item.id?.videoId)
      .map((item) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
      }));

    /* ================= RESPONSE ================= */

    res.status(200).json({
      curriculum,
      videos,
    });

  } catch (error) {
    console.error("COURSE ERROR:", error);
    res.status(500).json({ message: "Course generation failed" });
  }
};
