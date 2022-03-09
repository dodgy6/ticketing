import { CustomError } from "./custom-errors";

export class NotAuthorizeError extends CustomError {
  statusCode = 401;

  constructor() {
    super("Not authorized");

    Object.setPrototypeOf(this, NotAuthorizeError.prototype);
  }

  serializeErrors() {
    return [{ message: "Not authorized" }];
  }
}
