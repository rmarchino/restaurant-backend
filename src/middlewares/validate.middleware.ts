import { Request, Response, NextFunction } from "express";
import { z, ZodError, ZodIssue } from "zod"; // Importamos 'z' y 'ZodError'

export const validate = (schema: z.ZodType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = await schema.parseAsync(req.body);
      req.body = parsedData;
      next();
      
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err: ZodIssue) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(400).json({
          message: "Error de validación en los datos de entrada.",
          errors,
        });
      }
      next(error);
    }
  };
};
