import { ExtractedValue, ParseLonCapaResult, ParsedProblem } from "@/lib/types";

const PROBLEM_HEADER_REGEX = /^\s*([a-z]{2}-prob\d+[a-z]?\.problem)\s*$/i;

const NUMBER_WITH_UNIT_REGEX =
  /(?<![A-Za-z0-9_-])([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:[Ee][+-]?\d+)?)(\s*)(A\s*hr|electrons\/m3|g\/cm3|rad\/s|(?:\u2126|\u03A9|ohms?|ohm)(?:\s*(?:\u00B7|\.|\s)\s*m)?|\u00B5A|\u03BCA|uA|mA|mm|cm|km|kg|A|V|W|C|m|g|times)(?=$|[\s,.;:!?)\]\}])/gi;

function normalizeText(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/-\n(?=[a-z])/g, "")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parseAssignmentMetadata(text: string) {
  const assignmentNumberMatch =
    text.match(/\bassignment\s*#?\s*(\d+)\b/i) ??
    text.match(/\bassignment\s+(\d+)\b/i);

  const assignmentNumber = assignmentNumberMatch
    ? Number.parseInt(assignmentNumberMatch[1], 10)
    : undefined;

  const assignmentLineMatch = text.match(/^\s*assignment[s]?[^\n]*$/im);
  let title = assignmentLineMatch?.[0]?.trim();

  if (title?.toLowerCase() === "assignments" && assignmentNumber !== undefined) {
    title = `Assignment ${assignmentNumber}`;
  }

  return {
    title,
    assignmentNumber:
      Number.isFinite(assignmentNumber) && assignmentNumber !== undefined
        ? assignmentNumber
        : undefined,
  };
}

function splitProblemBlocks(text: string): Array<{ problemId: string; rawText: string }> {
  const lines = text.split("\n");
  const blocks: Array<{ problemId: string; rawText: string }> = [];

  let currentProblemId: string | null = null;
  let currentLines: string[] = [];

  for (const line of lines) {
    const headerMatch = line.match(PROBLEM_HEADER_REGEX);

    if (headerMatch) {
      if (currentProblemId) {
        blocks.push({
          problemId: currentProblemId,
          rawText: currentLines.join("\n").trim(),
        });
      }

      currentProblemId = headerMatch[1];
      currentLines = [];
      continue;
    }

    if (currentProblemId) {
      currentLines.push(line);
    }
  }

  if (currentProblemId) {
    blocks.push({
      problemId: currentProblemId,
      rawText: currentLines.join("\n").trim(),
    });
  }

  return blocks;
}

function normalizeUnit(unit: string): string {
  const compact = unit.trim().replace(/\s+/g, " ");
  const lower = compact.toLowerCase();

  if (lower === "ua" || lower === "\u00b5a" || lower === "\u03bca") {
    return "\u00B5A";
  }
  if (lower === "ohm" || lower === "ohms") {
    return "\u2126";
  }
  if (lower === "a hr") {
    return "A\u00B7hr";
  }
  if (lower === "ohm m" || lower === "ohm.m" || lower === "ohm\u00b7m") {
    return "\u2126\u00B7m";
  }
  if (compact === "\u03A9" || compact === "\u2126") {
    return "\u2126";
  }
  if (compact === "\u03A9\u00B7m" || compact === "\u2126\u00B7m") {
    return "\u2126\u00B7m";
  }
  if (compact === "\u03A9 m" || compact === "\u2126 m") {
    return "\u2126\u00B7m";
  }
  return compact;
}

function findLeftBoundary(text: string, startIndex: number): number {
  for (let i = startIndex - 1; i >= 0; i -= 1) {
    const ch = text[i];
    if (ch === "." || ch === "!" || ch === "?" || ch === "\n") {
      return i + 1;
    }
  }
  return 0;
}

function findRightBoundary(text: string, endIndex: number): number {
  for (let i = endIndex; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === "." || ch === "!" || ch === "?" || ch === "\n") {
      return i;
    }
  }
  return text.length;
}

function extractContext(text: string, startIndex: number, endIndex: number): string {
  const left = findLeftBoundary(text, startIndex);
  const right = findRightBoundary(text, endIndex);
  const sentenceCandidate = text.slice(left, right).replace(/\s+/g, " ").trim();

  if (sentenceCandidate.length >= 8 && sentenceCandidate.length <= 260) {
    return sentenceCandidate;
  }

  const windowStart = Math.max(0, startIndex - 35);
  const windowEnd = Math.min(text.length, endIndex + 35);
  return text.slice(windowStart, windowEnd).replace(/\s+/g, " ").trim();
}

function extractValuesFromBlock(rawText: string): ExtractedValue[] {
  const values: ExtractedValue[] = [];
  let match: RegExpExecArray | null;

  NUMBER_WITH_UNIT_REGEX.lastIndex = 0;

  while ((match = NUMBER_WITH_UNIT_REGEX.exec(rawText)) !== null) {
    const [raw, numericToken, , unitToken] = match;
    const value = Number.parseFloat(numericToken);
    const position = match.index;
    const context = extractContext(rawText, position, position + raw.length);

    values.push({
      raw,
      value: Number.isFinite(value) ? value : null,
      unit: normalizeUnit(unitToken),
      context,
      position,
    });
  }

  return values;
}

export function parseLonCapaPdfText(rawText: string): ParseLonCapaResult {
  const normalizedText = normalizeText(rawText);
  const assignmentMetadata = parseAssignmentMetadata(normalizedText);

  const problems: ParsedProblem[] = splitProblemBlocks(normalizedText).map((block) => ({
    problemId: block.problemId,
    rawText: block.rawText,
    extractedValues: extractValuesFromBlock(block.rawText),
  }));

  return {
    assignmentMetadata,
    problems,
  };
}
