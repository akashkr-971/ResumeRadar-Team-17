import { NextRequest, NextResponse } from "next/server";
const PDFParser = require("pdf2json");

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const targetRole = formData.get("targetRole") as string; // Fix: Get role from frontend
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const resumeText = await new Promise<string>((resolve, reject) => {
      const pdfParser = new PDFParser(null, 1);
      pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
      pdfParser.on("pdfParser_dataReady", () => resolve(pdfParser.getRawTextContent()));
      pdfParser.parseBuffer(buffer);
    });

    const prompt = `Act as an AI Career Coach and Senior Recruiter. 
    Analyze this resume for the specific target role: "${targetRole}".
    Resume Text: ${resumeText.slice(0, 5000)}
    
    Rules for JSON generation:
    1. atsScore: 0-100 based on keyword density for a ${targetRole}.
    2. riskFactor: Start with 'Low', 'Medium', or 'High' followed by a short reason.
    3. jobProbability: Predicted percentage of landing an interview for ${targetRole}.
    4. improvements: An array of 4-5 specific, actionable points to improve this resume for the role of ${targetRole}.
    5. roadmap: An array of 4 objects with "period" (e.g., "Week 1") and "task" (a specific learning goal).
    6. interviewRiskDetection: A single sentence warning about a potential weak spot.
    7. personalBrandingScore: A value from 40-95.

    Return ONLY raw JSON.`;

    const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || "mistral:latest",
        prompt: prompt,
        stream: false,
        format: "json"
      }),
    });

    const aiData = await ollamaResponse.json();
    
    // Safety check: parse the response to ensure it's valid JSON
    let parsedData;
    try {
      parsedData = JSON.parse(aiData.response);
    } catch (e) {
      console.error("AI returned invalid JSON:", aiData.response);
      throw new Error("AI response was not valid JSON");
    }
    
    return NextResponse.json(parsedData);

  } catch (error) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: "Failed to analyze resume" }, { status: 500 });
  }
}