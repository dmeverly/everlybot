import { Request, Response, NextFunction } from "express";

export interface Guard {
  id: string;
  middleware(): (req: Request, res: Response, next: NextFunction) => void;
}
