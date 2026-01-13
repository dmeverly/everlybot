import { Request, Response, NextFunction } from "express";
import { Guard } from "./Guard";

export class RequestIdGuard implements Guard {
  public readonly id = "request-id";

  middleware() {
    return (_req: Request, res: Response, next: NextFunction) => {
      const id =
        (globalThis.crypto as any)?.randomUUID?.() ??
        `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
      res.setHeader("X-Request-Id", id);
      (res.locals as any).requestId = id;
      next();
    };
  }
}
