/* eslint-disable no-underscore-dangle */
import { serializeError } from "serialize-error";
import { ExposableError } from "./exposableError";

// eslint-disable-next-line no-unused-vars
export function errorHandler(error, req, res, next) {
  const printableError = serializeError(error);

  if (error instanceof ExposableError) {
    let params;

    if (error.innerError) {
      if (error.innerError.isJoi) params = error.innerError._object;
    }

    // eslint-disable-next-line no-console
    console.error("errorHandler(ExposableError): ", printableError);
    res.status(error.statusCode || 400).json({ message: error.message, params });
  } else {
    // eslint-disable-next-line no-console
    console.error("errorHandler(500): ", printableError);
    // eslint-disable-next-line no-debugger
    debugger;

    res.status(500).json({
      message: "Internal sever error, contact support",
    });
  }
}
