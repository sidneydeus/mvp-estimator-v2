/**
 * Represents a specific user requirement within the system.
 */
export interface UserStory {
  /** Unique identifier for the story */
  id: string;
  /** Short, descriptive title of the requirement */
  title: string;
  /** Detailed explanation of the story's purpose and context */
  description: string;
  /** List of conditions that must be met for the story to be considered complete */
  acceptanceCriteria: string[];
  /** Relative measure of effort or complexity (e.g., Story Points) */
  complexityPoints: number;
  /** Optional: Estimated LLM tokens required for code generation of this story */
  estimatedTokens?: {
    input: TokenRange;
    output: TokenRange;
  };
}

/**
 * A group of related user stories that form a significant feature or module.
 */
export interface Epic {
  /** Unique identifier for the epic */
  id: string;
  /** Descriptive name of the feature set */
  title: string;
  /** High-level overview of the epic's goals */
  description: string;
  /** Collection of user stories belonging to this epic */
  stories: UserStory[];
}

/**
 * Represents a numeric range for estimations.
 */
export interface TokenRange {
  /** Lower bound of the estimate */
  min: number;
  /** Upper bound of the estimate */
  max: number;
}

/**
 * Breakdown of tokens used across different phases of AI generation.
 */
export interface AITokenEstimate {
  /** Tokens used for initial planning and architectural context */
  planningAndContextTokens: TokenRange;
  /** Tokens sent as input for code generation */
  codeGenerationInputTokens: TokenRange;
  /** Tokens received as output during code generation */
  codeGenerationOutputTokens: TokenRange;
  /** Tokens used for input during validation and fix loops */
  validationAndFixInputTokens: TokenRange;
  /** Tokens received as output during validation and fix loops */
  validationAndFixOutputTokens: TokenRange;
}

/**
 * Comprehensive estimate of AI-assisted code generation effort and cost.
 */
export interface AICodeGenerationEstimate {
  /** Explicit assumptions made during the estimation process */
  assumptions: {
    /** Description of the assumed development workflow */
    workflow: string;
    /** List of items included in the estimate */
    includes: string[];
    /** List of items explicitly excluded from the estimate */
    excludes: string[];
  };
  /** Aggregated token counts for the entire project */
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
  /** Financial cost analysis (USD) */
  costEstimate: {
    currency: 'USD';
    inputCostPer1MTokens: number;
    outputCostPer1MTokens: number;
    /** Minimum expected cost */
    min: number;
    /** Maximum expected cost */
    max: number;
    /** Human-readable display strings */
    display: {
      range: string;
      min: string;
      max: string;
      inputCostPer1MTokens: string;
      outputCostPer1MTokens: string;
    };
    /** Explanatory note about the calculation */
    note: string;
  };
  /** Pre-formatted display strings for the UI */
  display: {
    totalInputTokens: string;
    totalOutputTokens: string;
    totalTokens: string;
    estimatedCost: string;
    pricing: string;
    complexityTotalCost?: string;
  };
}

/**
 * The final output of the AI estimation process, containing the full backlog and cost analysis.
 */
export interface BacklogResult {
  /** High-level vision statement for the proposed idea */
  vision: string;
  /** List of epics and their associated stories */
  epics: Epic[];
  /** Total sum of complexity points across all stories */
  totalComplexityPoints: number;
  /** Estimated range of development hours */
  estimatedHours: {
    min: number;
    max: number;
  };
  /** Raw token estimation breakdown */
  aiTokenEstimate: AITokenEstimate;
  /** Detailed code generation cost and effort estimate */
  aiCodeGenerationEstimate: AICodeGenerationEstimate;
}

/**
 * Standard wrapper for successful API responses.
 */
export interface ApiSuccess<T> {
  /** Indicates the request was successful */
  success: true;
  /** The actual data returned by the API */
  data: T;
  /** Optional metadata about the response */
  meta?: {
    /** ISO timestamp of the response */
    timestamp?: string;
    [key: string]: unknown;
  };
}

/**
 * Structure for detailed API error information.
 */
export interface ApiErrorPayload {
  /** Machine-readable error code */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Additional error details or validation failures */
  details?: unknown;
}

/**
 * Standard wrapper for failed API responses.
 */
export interface ApiError {
  /** Indicates the request failed */
  success: false;
  /** Error details */
  error: ApiErrorPayload;
}

/**
 * Unified type representing any possible API response.
 */
export type ApiResponse<T> = ApiSuccess<T> | ApiError;
