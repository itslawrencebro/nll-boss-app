interface RateBucket {
  count: number;
  resetAt: number;
}

const ipBuckets = new Map<string, RateBucket>();

export function checkRateLimit(ip: string, limit = 8, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const existing = ipBuckets.get(ip);

  if (!existing || now > existing.resetAt) {
    ipBuckets.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (existing.count >= limit) {
    return false;
  }

  existing.count += 1;
  return true;
}

const SENSITIVE_PATTERN = /\b(?:\d{3}-\d{2}-\d{4}|routing\s*#?\s*\d{9}|acct\s*#?\s*\d{6,})\b/i;

export function containsSensitiveTokens(values: Array<string | undefined>): boolean {
  return values.some((v) => (v ? SENSITIVE_PATTERN.test(v) : false));
}
