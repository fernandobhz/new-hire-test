import { serializeError } from "serialize-error";
import { ExposableError } from "./exposableError";

export function errorHandler(error, req, res, next) {
  const printableError = serializeError(error);

  if (error instanceof ExposableError) {
    console.error("errorHandler(ExposableError): ", printableError);
    res.status(error.statusCode || 400).json(error.message);
  } else {
    console.error("errorHandler(500): ", printableError);
    debugger;

    res.status(500).json({
      message: "Internal sever error, contact support",
    });
  }
}
