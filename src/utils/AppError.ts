import { ValidationError } from "express-validator";
type Status = "success" | "fail" | "error";

export class AppError extends Error {
  code: number;
  statusText: Status;
  constructor(
    code: number,
    statusText: Status,
    message: string | ValidationError[]
  ) {
    super();
    this.code = code;
    this.statusText = statusText;
    this.message = Array.isArray(message) ? message.map((error) => error.msg).join(", ") : message;
  }
}