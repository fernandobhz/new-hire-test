export class ExposableError extends Error {
  constructor(message, statusCode, innerError) {
    super(message);
    this.code = "ERR_EXPOSABLE_ERROR";
    this.statusCode = statusCode;
    this.status = statusCode;
    this.innerError = innerError;
  }
}
