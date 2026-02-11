import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { latex } = await request.json();

    if (!latex) {
      return NextResponse.json({ error: "No LaTeX provided" }, { status: 400 });
    }

    const encodedLatex = encodeURIComponent(latex);

    const response = await fetch(
      `https://latexonline.cc/compile?text=${encodedLatex}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Remote Compiler Error:", errorText);
      return NextResponse.json(
        { error: "Remote LaTeX compilation failed" },
        { status: 500 }
      );
    }

    const pdfBuffer = await response.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="resume.pdf"',
      },
    });
  } catch (error) {
    console.error("Compiler Connection Error:", error);
    return NextResponse.json(
      { error: "Failed to connect to LaTeX compiler" },
      { status: 500 }
    );
  }
}
