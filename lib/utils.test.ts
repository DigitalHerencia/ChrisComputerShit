import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('merges class names without duplication', () => {
    expect(cn('p-2', 'p-2', 'text-sm')).toBe('p-2 text-sm');
  });
});
