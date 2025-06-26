export type Result<T, E extends GlobalError> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export interface GlobalError {
  readonly _tag: string;
  readonly message: string;
}

export class DatabaseError extends Error implements GlobalError {
  readonly _tag = "DatabaseError";
  constructor(public readonly cause: unknown) {
    super(`DatabaseError: ${String(cause)}`);
  }
}

export class OpenAIAPIError extends Error implements GlobalError {
  readonly _tag = "OpenAIAPIError";
  constructor(public readonly cause: unknown) {
    super(`OpenAI API failed: ${String(cause)}`);
  }
}

export class UnauthorizedError extends Error implements GlobalError {
  readonly _tag = "UnauthorizedError";
  constructor() {
    super(`User is not authenticated`);
  }
}

export type AppError = DatabaseError | OpenAIAPIError | UnauthorizedError;
