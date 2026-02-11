import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs/promises";
import * as path from "path";
import { tmpdir } from "os";

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  let tempDir: string | null = null;

  try {
    const { latex } = await request.json();

    if (!latex) {
      return NextResponse.json(
        { error: "LaTeX code is required" },
        { status: 400 }
      );
    }

    // Create a temporary directory
    tempDir = await fs.mkdtemp(path.join(tmpdir(), "latex-"));

    // Write LaTeX to file
    const texFile = path.join(tempDir, "resume.tex");
    await fs.writeFile(texFile, latex, "utf-8");

    // Compile LaTeX to PDF using pdflatex
    // Run twice to resolve references
    try {
      await execAsync(
        `pdflatex -interaction=nonstopmode -output-directory="${tempDir}" "${texFile}"`,
        { cwd: tempDir }
      );
      
      // Second pass for references
      await execAsync(
        `pdflatex -interaction=nonstopmode -output-directory="${tempDir}" "${texFile}"`,
        { cwd: tempDir }
      );
    } catch (execError) {
      // Even if there's an error, the PDF might be partially generated
      console.warn("LaTeX compilation warning:", execError);
    }

    // Read the generated PDF
    const pdfFile = path.join(tempDir, "resume.pdf");
    
    try {
      const pdfBuffer = await fs.readFile(pdfFile);

      // Return PDF as response
      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'inline; filename="resume.pdf"',
        },
      });
    } catch (readError) {
      // If PDF doesn't exist, check log for errors
      try {
        const logFile = path.join(tempDir, "resume.log");
        const logContent = await fs.readFile(logFile, "utf-8");
        
        // Extract error messages
        const errors = logContent.match(/^!.*$/gm) || [];
        const errorMessage = errors.length > 0 
          ? errors.join("\n") 
          : "PDF compilation failed";

        return NextResponse.json(
          { error: errorMessage },
          { status: 500 }
        );
      } catch {
        return NextResponse.json(
          { error: "Failed to compile LaTeX. Check your LaTeX syntax." },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error("Error compiling LaTeX:", error);
    return NextResponse.json(
      { error: "Failed to compile LaTeX to PDF" },
      { status: 500 }
    );
  } finally {
    // Cleanup temporary directory
    if (tempDir) {
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.warn("Failed to cleanup temp directory:", cleanupError);
      }
    }
  }
}