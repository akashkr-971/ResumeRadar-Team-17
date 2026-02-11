import { NextRequest, NextResponse } from "next/server";
import { pdf }from "pdf-parse";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // 1. Extract Text from PDF
    const pdfData = await pdf(buffer);
    const resumeText = pdfData.text;

    // 2. Local AI Prompt
    const prompt = `Analyze this resume text and provide a JSON response.
    Resume: ${resumeText}
    
    Provide:
    1. atsScore (0-100)
    2. riskFactor (Low/Medium/High with brief reason)
    3. jobProbability (Percentage)
    4. roadmap (Array of 4 specific skill-up steps)
    5. interviewRiskDetection (Specific weak points)
    6. personalBrandingScore (0-100)
    
    Return ONLY JSON.`;

    const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      body: JSON.stringify({
        model: "mistral:latest",
        prompt: prompt,
        stream: false,
        format: "json"
      }),
    });

    const aiData = await ollamaResponse.json();
    return NextResponse.json(JSON.parse(aiData.response));
  } catch (error) {
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}