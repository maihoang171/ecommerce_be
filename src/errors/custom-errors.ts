export class ConflictError extends Error {
  public statusCode;
  constructor(msg: string) {
    super(msg);
    this.name = "ConflictError";
    this.statusCode = 409;
  }
}

export class UnauthorizedError extends Error {
  public statusCode;
  constructor(msg: string) {
    super(msg);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
}

export class NotFoundError extends Error {
  public statusCode;
  constructor(msg: string) {
    super(msg);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

export class BadRequestError extends Error {
  public statusCode;
  constructor(msg: string) {
    super(msg);
    this.name = "BadRequestError";
    this.statusCode = 400;
  }
}
