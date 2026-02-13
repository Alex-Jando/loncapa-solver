export interface AssignmentMetadata {
  title?: string;
  assignmentNumber?: number;
}

export interface ExtractedValue {
  raw: string;
  value: number | null;
  unit: string | null;
  context: string;
  position?: number;
}

export interface ParsedProblem {
  problemId: string;
  rawText: string;
  extractedValues: ExtractedValue[];
}

export interface ParseLonCapaResult {
  assignmentMetadata: AssignmentMetadata;
  problems: ParsedProblem[];
}

