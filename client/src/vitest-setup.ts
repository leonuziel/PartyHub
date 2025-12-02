import { vi } from 'vitest';

// Mock jest for libraries that depend on it (like jest-canvas-mock)
(global as any).jest = vi;
