export type Model = 'deepseek-r1' | 'gemini-2.0';

export interface PaperConfig {
  topic: string;
  wordCount: number;
  referenceCount: number;
  model: Model;
  academicLevel: 'undergraduate' | 'masters' | 'doctoral';
  citationStyle: 'ieee' | 'apa' | 'mla';
}

export interface ResearchPaper {
  title: string;
  abstract: string;
  introduction: string;
  methodology: string;
  results: string;
  discussion: string;
  conclusion: string;
  references: string;
}

export interface GenerateResponse {
  content: string;
}

export interface StreamChunk {
  section: keyof ResearchPaper;
  content: string;
}