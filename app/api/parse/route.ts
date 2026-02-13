import { NextResponse } from "next/server";
import { parseLonCapaPdfText } from "@/lib/parseLonCapaPdf";

export const runtime = "nodejs";
const WARNING_PATCH_FLAG = "__lonCapaDep0005PatchApplied";

function suppressDep0005WarningOnce(): void {
  const globalRef = globalThis as typeof globalThis & { [WARNING_PATCH_FLAG]?: boolean };
  if (globalRef[WARNING_PATCH_FLAG]) {
    return;
  }

  const originalEmitWarning = process.emitWarning.bind(process);
  (process as typeof process & { emitWarning: (...args: unknown[]) => void }).emitWarning = (
    warning: unknown,
    ...args: unknown[]
  ) => {
    const code = typeof args[0] === "string" ? args[0] : undefined;
    const warningText =
      typeof warning === "string"
        ? warning
        : warning instanceof Error
          ? warning.message
          : String(warning ?? "");

    if (code === "DEP0005" || warningText.includes("Buffer() is deprecated")) {
      return;
    }

    originalEmitWarning(warning as Parameters<typeof process.emitWarning>[0], ...(args as never[]));
  };

  globalRef[WARNING_PATCH_FLAG] = true;
}

function isLikelyPdf(file: File): boolean {
  const typeIsPdf = file.type === "application/pdf";
  const nameLooksPdf = file.name.toLowerCase().endsWith(".pdf");
  return typeIsPdf || nameLooksPdf;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing file upload. Submit multipart/form-data with a 'file' field." },
        { status: 400 },
      );
    }

    if (!isLikelyPdf(file)) {
      return NextResponse.json({ error: "Only PDF uploads are supported." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length === 0) {
      return NextResponse.json({ error: "Uploaded file is empty." }, { status: 400 });
    }

    suppressDep0005WarningOnce();
    const pdfParseModule = await import("pdf-parse");
    const pdfParse = pdfParseModule.default;
    const parsedPdf = await pdfParse(buffer);
    const text = parsedPdf.text?.trim() ?? "";

    if (!text) {
      return NextResponse.json(
        { error: "PDF text extraction returned empty content." },
        { status: 422 },
      );
    }

    const result = parseLonCapaPdfText(text);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error while parsing PDF.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
