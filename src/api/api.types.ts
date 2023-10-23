export type ServerErrorType = {
  error: string;
  message: string;
  statusCode: number;
  errors?: unknown[];
};
