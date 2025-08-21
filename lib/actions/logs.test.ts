import { describe, it, expect } from 'vitest';
import { logSchema } from '../validators/logs';

describe('logSchema', () => {
  it('requires projectId and workDone and date', () => {
    const result = logSchema.safeParse({});
    expect(result.success).toBe(false);
  });
  it('accepts valid data', () => {
    const result = logSchema.safeParse({
      projectId: 'c123456789012345678901234',
      date: '2024-01-01',
      workDone: 'Test log',
    });
    expect(result.success).toBe(true);
  });
});
