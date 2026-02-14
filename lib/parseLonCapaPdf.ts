import { ExtractedValue, ParseLonCapaResult, ParsedProblem } from "@/lib/types";

const PROBLEM_HEADER_REGEX = /^\s*([a-z]{2}-prob\d+[a-z]?\.problem)\s*$/i;

const NUMBER_WITH_UNIT_REGEX =
  /(?<![0-9_.-])([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:[Ee][+-]?\d+)?)(\s*)(A\s*hr|electrons\/m3|g\/cm3|rad\/s|m\/s|V\/m|N\/C|nC\/m|C\/m|N\*m2\/C|MeV|(?:\u2126|\u03A9|\u03C9|ohms?|ohm)(?:\s*(?:\u00B7|\.|\s)\s*m)?|\u00B5A|\u03BCA|uA|mA|uC|\u00B5C|\u03BCC|nC|pF|uF|nF|fm|nm|cm2|m2|c|deg(?:ree)?s?|mm|cm|km|kg|A|V|W|C|m|g|s|times)(?=$|[\s,.;:!?)\]\}])/gi;

const ANGLE_ASSIGN_REGEX = /(?:theta|θ|alpha|α)\s*=\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))/gi;
const KAPPA_ASSIGN_REGEX =
  /(?:kappa|k|κ|Îº)\s*([123])?\s*=\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:[Ee][+-]?\d+)?)/gi;
const VECTOR_COMPONENT_REGEX =
  /([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:[Ee][+-]?\d+)?)\s*i\s*[+,−-]\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:[Ee][+-]?\d+)?)\s*j\s*(?:N\/C|V\/m)/gi;

function normalizeText(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/-\n(?=[a-z])/g, "")
    .replace(/([Ee])\s*([+-])\s*(\d+)/g, "$1$2$3")
    .replace(/([Ee])\s+(\d+)/g, "$1$2")
    .replace(/electrons\/m\s*3/gi, "electrons/m3")
    .replace(/g\/cm\s*3/gi, "g/cm3")
    .replace(/&deg;?/gi, "deg")
    .replace(/°/g, "deg")
    .replace(/\bdegrees?\b/gi, "deg")
    .replace(/cm\s*2/gi, "cm2")
    .replace(/m\s*2/gi, "m2")
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
  const headerGlobal = /([a-z]{2}-prob\d+[a-z]?\.problem)/gi;
  const matches = Array.from(text.matchAll(headerGlobal));
  if (matches.length === 0) {
    return [];
  }

  const blocks: Array<{ problemId: string; rawText: string }> = [];
  for (let i = 0; i < matches.length; i += 1) {
    const current = matches[i];
    const next = matches[i + 1];
    const start = current.index ?? 0;
    const headerLength = current[1].length;
    const end = next?.index ?? text.length;
    const rawText = text.slice(start + headerLength, end).trim();
    blocks.push({
      problemId: current[1],
      rawText,
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
  if (lower === "uc" || lower === "\u00b5c" || lower === "\u03bcc") {
    return "uC";
  }
  if (lower === "pf") {
    return "pF";
  }
  if (lower === "uf") {
    return "uF";
  }
  if (lower === "nf") {
    return "nF";
  }
  if (lower === "v/m") {
    return "V/m";
  }
  if (lower === "nc") {
    return "nC";
  }
  if (lower === "n/c") {
    return "N/C";
  }
  if (lower === "nc/m") {
    return "nC/m";
  }
  if (lower === "c/m") {
    return "C/m";
  }
  if (lower === "deg" || lower === "degree" || lower === "degrees") {
    return "deg";
  }
  if (lower === "cm2") {
    return "cm2";
  }
  if (lower === "m2") {
    return "m2";
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
    if (unitToken === "a") {
      continue;
    }
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

  VECTOR_COMPONENT_REGEX.lastIndex = 0;
  while ((match = VECTOR_COMPONENT_REGEX.exec(rawText)) !== null) {
    const [raw, xToken, yToken] = match;
    const xVal = Number.parseFloat(xToken);
    const yVal = Number.parseFloat(yToken);
    const basePosition = match.index;
    if (Number.isFinite(xVal)) {
      values.push({
        raw: `${xToken}i`,
        value: xVal,
        unit: "component",
        context: extractContext(rawText, basePosition, basePosition + raw.length),
        position: basePosition,
      });
    }
    if (Number.isFinite(yVal)) {
      values.push({
        raw: `${yToken}j`,
        value: yVal,
        unit: "component",
        context: extractContext(rawText, basePosition, basePosition + raw.length),
        position: basePosition + raw.indexOf(yToken),
      });
    }
  }

  ANGLE_ASSIGN_REGEX.lastIndex = 0;
  while ((match = ANGLE_ASSIGN_REGEX.exec(rawText)) !== null) {
    const [raw, numericToken] = match;
    const value = Number.parseFloat(numericToken);
    const position = match.index;
    if (!Number.isFinite(value)) {
      continue;
    }

    const duplicate = values.some((item) => item.position === position && item.raw === raw);
    if (duplicate) {
      continue;
    }

    values.push({
      raw,
      value,
      unit: "deg",
      context: extractContext(rawText, position, position + raw.length),
      position,
    });
  }

  KAPPA_ASSIGN_REGEX.lastIndex = 0;
  while ((match = KAPPA_ASSIGN_REGEX.exec(rawText)) !== null) {
    const [raw, indexToken, numericToken] = match;
    const value = Number.parseFloat(numericToken);
    const position = match.index;
    if (!Number.isFinite(value)) {
      continue;
    }

    const normalizedRaw = indexToken ? `k${indexToken}=${numericToken}` : raw;
    const duplicate = values.some((item) => item.position === position && item.raw === normalizedRaw);
    if (duplicate) {
      continue;
    }

    values.push({
      raw: normalizedRaw,
      value,
      unit: "kappa",
      context: extractContext(rawText, position, position + raw.length),
      position,
    });
  }

  values.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

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
