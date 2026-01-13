import { Request, Response, NextFunction } from "express";
import { Guard } from "./Guard";

type Bucket = { tokens: number; lastMs: number };

export class RateLimitGuard implements Guard {
  public readonly id = "rate-limit";
  private buckets = new Map<string, Bucket>();

  constructor(
    private readonly rpm: number,
    private readonly burst: number,
    private readonly keyFn: (req: Request) => string
  ) {}

  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const key = this.keyFn(req);
      if (!this.allow(key)) {
        res.setHeader("Retry-After", "2");
        res.status(429).json({ error: "Too many requests. Please try again in a moment." });
        return;
      }
      next();
    };
  }

  private allow(key: string): boolean {
    const now = Date.now();
    const refillPerMs = this.rpm / 60000;

    const b = this.buckets.get(key) ?? { tokens: this.burst, lastMs: now };
    const elapsed = now - b.lastMs;

    b.tokens = Math.min(this.burst, b.tokens + elapsed * refillPerMs);
    b.lastMs = now;

    if (b.tokens < 1) {
      this.buckets.set(key, b);
      return false;
    }

    b.tokens -= 1;
    this.buckets.set(key, b);
    return true;
  }
}
