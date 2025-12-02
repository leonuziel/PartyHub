// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

describe('Sanity Check', () => {
    it('should pass', () => {
        expect(true).toBe(true);
    });
    it('should have document', () => {
        expect(document).toBeDefined();
    });
});
