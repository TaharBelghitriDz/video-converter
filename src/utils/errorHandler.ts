import { error } from "console";
import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next?: NextFunction
) => {
  if (next) next();
  else
    res.status(400).json({
      success: false,
      message: err.message,
    });
};
