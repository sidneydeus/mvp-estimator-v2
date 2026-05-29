export interface UserStory {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  complexityPoints: number;
  estimatedTokens?: {
    input: TokenRange;
    output: TokenRange;
  };
}

export interface Epic {
  id: string;
  title: string;
  description: string;
  stories: UserStory[];
}

export interface TokenRange {
  min: number;
  max: number;
}

export interface AITokenEstimate {
  planningAndContextTokens: TokenRange;
  codeGenerationInputTokens: TokenRange;
  codeGenerationOutputTokens: TokenRange;
  validationAndFixInputTokens: TokenRange;
  validationAndFixOutputTokens: TokenRange;
}

export interface AICodeGenerationEstimate {
  assumptions: {
    workflow: string;
    includes: string[];
    excludes: string[];
  };
  tokenEstimate: {
    planningAndContextTokens: TokenRange;
    codeGenerationInputTokens: TokenRange;
    codeGenerationOutputTokens: TokenRange;
    validationAndFixInputTokens: TokenRange;
    validationAndFixOutputTokens: TokenRange;
    totalInputTokens: TokenRange;
    totalOutputTokens: TokenRange;
    totalTokens: TokenRange;
  };
  costEstimate: {
    currency: 'USD';
    inputCostPer1MTokens: number;
    outputCostPer1MTokens: number;
    min: number;
    max: number;
    display: {
      range: string;
      min: string;
      max: string;
      inputCostPer1MTokens: string;
      outputCostPer1MTokens: string;
    };
    note: string;
  };
  display: {
    totalInputTokens: string;
    totalOutputTokens: string;
    totalTokens: string;
    estimatedCost: string;
    pricing: string;
    complexityTotalCost?: string;
  };
}

export enum ScenarioType {
  LEAN = 'LEAN',
  ENTERPRISE = 'ENTERPRISE',
}

export interface ScenarioResult {
  type: ScenarioType;
  vision: string;
  epics: Epic[];
  totalComplexityPoints: number;
  estimatedHours: {
    min: number;
    max: number;
  };
  aiTokenEstimate: AITokenEstimate;
  aiCodeGenerationEstimate: AICodeGenerationEstimate;
}

export interface BacklogResult {
  scenarios: ScenarioResult[];
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: {
    timestamp?: string;
    [key: string]: unknown;
  };
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiError {
  success: false;
  error: ApiErrorPayload;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
