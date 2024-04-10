import { Request, Response, NextFunction } from "express";

import ApiError, { API_ERRORS } from "../lib/api-error";

export default function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof ApiError) {
    return res
      .status(error.statusCode)
      .json({ error: error.errorName, message: error.message });
  }

  console.error(error);

  const serverError = API_ERRORS.internalServerError;

  res
    .status(serverError.statusCode)
    .json({ error: serverError.errorName, message: "Unexpected error" });
}
