import { describe, it, expect } from 'vitest';
import { formatTo, resolvePaths, mapValues } from '../utils';

describe('Utils', () => {
  describe('formatTo', () => {
    it('should format string paths correctly', () => {
      expect(formatTo('/test')).toBe('/test');
      
      const path = { toString: () => '/path-object' };
      expect(formatTo(path)).toBe('/path-object');
    });
    
    it('should format object paths correctly', () => {
      const result = formatTo({
        pathname: '/test',
        search: { query: 'value' },
        hash: '#section',
      });
      
      expect(result).toHaveProperty('pathname', '/test');
      expect(result).toHaveProperty('hash', '#section');
    });
  });
  
  describe('resolvePaths', () => {
    it('should combine paths correctly', () => {
      expect(resolvePaths('/base', 'child')).toBe('/base/child');
      expect(resolvePaths('/base/', '/child')).toBe('/child');
      expect(resolvePaths('', 'path')).toBe('/path');
    });
  });
  
  describe('mapValues', () => {
    it('should transform object values', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = mapValues(obj, v => v * 2);
      expect(result).toEqual({ a: 2, b: 4, c: 6 });
    });
  });
});
