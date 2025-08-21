import { describe, it, expect } from 'vitest';
import { taskSchema } from '../validators/tasks';

describe('taskSchema', () => {
  it('rejects missing title', () => {
    const result = taskSchema.safeParse({ projectId: 'ck123' });
    expect(result.success).toBe(false);
  });
  it('accepts valid data', () => {
    const result = taskSchema.safeParse({
      projectId: 'c123456789012345678901234',
      title: 'Test',
    });
    expect(result.success).toBe(true);
  });
});
