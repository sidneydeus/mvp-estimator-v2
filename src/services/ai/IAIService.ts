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
  /** Estimated LLM tokens required for code generation of this story */
  estimatedTokens: {
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
 * Interface for AI service implementations that generate project backlogs.
 */
export interface IAIService {
  /**
   * Generates a structured backlog based on a natural language idea description.
   * 
   * @param ideaDescription - The user's project idea
   * @param pricing - Optional pricing configuration for cost calculation
   * @returns A promise resolving to a detailed BacklogResult
   */
  generateBacklog(
    ideaDescription: string,
    pricing?: AICodeGenerationPricing,
  ): Promise<BacklogResult>;
}

/**
 * Configuration for calculating AI-assisted development costs.
 */
export interface AICodeGenerationPricing {
  /** Cost per 1 million input tokens (USD) */
  inputCostPer1MTokens: number;
  /** Cost per 1 million output tokens (USD) */
  outputCostPer1MTokens: number;
  /** Optional cost factor per complexity point */
  costPerComplexityPoint?: number;
  /** Average hourly rate for development work */
  hourlyRate?: number;
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
 * Represents a numeric range for estimations.
 */
export interface TokenRange {
  /** Lower bound of the estimate */
  min: number;
  /** Upper bound of the estimate */
  max: number;
}
