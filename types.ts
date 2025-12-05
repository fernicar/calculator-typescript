export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  isAi?: boolean;
  explanation?: string;
}

export enum CalculatorMode {
  STANDARD = 'STANDARD',
  SCIENTIFIC = 'SCIENTIFIC',
  AI = 'AI'
}

export interface AiMathResponse {
  result: string;
  steps: string[];
  category: string;
}
