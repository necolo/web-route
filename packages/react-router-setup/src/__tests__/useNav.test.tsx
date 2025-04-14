import { useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useNav } from '../useNav';

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: vi.fn(),
  useNavigationType: vi.fn(() => 'PUSH'),
}));

describe('useNav', () => {
  const mockNavigate = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as any).mockReturnValue(mockNavigate);
  });
  
  it('should call navigate with the correct path', () => {
    const { result } = renderHook(() => useNav());
    
    act(() => {
      result.current('/test-path');
    });
    
    expect(mockNavigate).toHaveBeenCalledWith('/test-path', expect.any(Object));
  });
  
  it('should handle Paths objects correctly', () => {
    const { result } = renderHook(() => useNav());
    const mockPath = { toString: () => '/mock-path' };
    
    act(() => {
      result.current(mockPath);
    });
    
    expect(mockNavigate).toHaveBeenCalledWith('/mock-path', expect.any(Object));
  });
  
  it('should pass navigation options correctly', () => {
    const { result } = renderHook(() => useNav());
    
    act(() => {
      result.current('/test-path', { replace: true });
    });
    
    expect(mockNavigate).toHaveBeenCalledWith('/test-path', expect.objectContaining({
      replace: true
    }));
  });
});
