import { Request } from "express";

export function getClientIp(req: Request): string {
  const cf = req.headers["cf-connecting-ip"];
  if (typeof cf === "string" && cf) return cf;

  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff) return xff.split(",")[0].trim();

  return req.ip || "unknown";
}
