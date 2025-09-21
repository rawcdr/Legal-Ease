import { GoogleGenerativeAI } from "@google/generative-ai";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

// disable Next.js built-in body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let legalText = "";

    // Detect file upload vs JSON body
    const contentType = req.headers["content-type"] || "";
    if (contentType.includes("multipart/form-data")) {
      const busboy = await import("busboy");
      const bb = busboy.default({ headers: req.headers });

      let fileBuffer = Buffer.alloc(0);
      let filename = "";

      await new Promise((resolve, reject) => {
        bb.on("file", (name, file, info) => {
          filename = info.filename || "";
          file.on("data", (data) => {
            fileBuffer = Buffer.concat([fileBuffer, data]);
          });
        });

        bb.on("close", resolve);
        bb.on("error", reject);
        req.pipe(bb);
      });

      const ext = filename.split(".").pop().toLowerCase();

      if (ext === "pdf") {
        const parsed = await pdfParse(fileBuffer);
        legalText = parsed.text;
      } else if (ext === "doc" || ext === "docx") {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        legalText = result.value;
      } else {
        return res.status(400).json({ error: "Unsupported file type" });
      }
    } else {
      // Handle JSON body (raw text)
      const body = await new Promise((resolve, reject) => {
        let data = "";
        req.on("data", (chunk) => (data += chunk));
        req.on("end", () => resolve(JSON.parse(data || "{}")));
        req.on("error", reject);
      });
      legalText = body.legalText;
    }

    if (!legalText || legalText.trim() === "") {
      return res.status(400).json({ error: "No legal text provided" });
    }

    // call Gemini
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY environment variable");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a legal assistant AI. 
Simplify the following legal text for a non-technical person in simple English.
Respond ONLY with valid JSON (no code fences) with keys:
- summary: a 2-3 sentence overall plain-language summary
- obligations: array of obligations
- risks: array of risks
- benefits: array of benefits (if none then return ["No Benefits"])

Text: """${legalText}"""
`;

    const result = await model.generateContent(prompt);

    let text =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    // Strip Markdown code fences if present
    text = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();

    let structured;
    try {
      structured = JSON.parse(text);
      if (!structured.summary) structured.summary = "";
      if (!Array.isArray(structured.obligations)) structured.obligations = [];
      if (!Array.isArray(structured.risks)) structured.risks = [];
      if (!Array.isArray(structured.benefits))
        structured.benefits = structured.benefits ? [structured.benefits] : [];
    } catch {
      structured = {
        summary: "",
        obligations: [],
        risks: [],
        benefits: [],
      };
    }

    res.status(200).json(structured);
  } catch (error) {
    console.error("Error in /api/simplify:", error);
    res.status(500).json({ error: "AI service failed." });
  }
}
