export interface ApiResponse<T> {
    Body: T;
    Error: string;
    HttpStatus: number;
    Message: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found', data?: any) {
    super(message, 404, data);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Authentication required', data?: any) {
    super(message, 401, data);
    this.name = 'UnauthorizedError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string = 'Validation failed', data?: any) {
    super(message, 400, data);
    this.name = 'ValidationError';
  }
}

export interface ErrorResponse {
    valid: boolean;
    exception: string;
    message: string;
    path: string;
    traceId: string;
    localDateTime: string;
    listMessage: string[];
    messageList: string[];
}
