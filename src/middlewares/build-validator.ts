import { Request, Response, NextFunction } from "express";
import { Schema } from "zod";

import ApiError from "../lib/api-error";

export default function buildValidator(
  type: "body" | "query" | "params",
  schema: Schema
) {
  return function validation(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = schema.parse(req[type]);

      if (res.locals.validated === undefined) {
        res.locals.validated = {};
      }

      res.locals.validated[type] = parsed;

      next();
    } catch (error) {
      throw new ApiError(
        error instanceof Error ? error.message : "Bad Request",
        "badRequest"
      );
    }
  };
}
