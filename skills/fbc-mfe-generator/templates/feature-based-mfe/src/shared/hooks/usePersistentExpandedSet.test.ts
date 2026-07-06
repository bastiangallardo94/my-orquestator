import { renderHook, act } from '@testing-library/react';
import { usePersistentExpandedSet } from './usePersistentExpandedSet';

const STORAGE_KEY = 'test-expanded-set';

beforeEach(() => {
  localStorage.clear();
});

describe('usePersistentExpandedSet', () => {
  describe('initial state', () => {
    it('starts with default expanded items when localStorage is empty', () => {
      const { result } = renderHook(() =>
        usePersistentExpandedSet(STORAGE_KEY, ['home'])
      );
      expect(result.current.expanded.has('home')).toBe(true);
    });

    it('starts with empty set when no defaults provided', () => {
      const { result } = renderHook(() =>
        usePersistentExpandedSet(STORAGE_KEY)
      );
      expect(result.current.expanded.size).toBe(0);
    });

    it('hydrates from localStorage when data exists', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(['settings', 'reports']));
      const { result } = renderHook(() =>
        usePersistentExpandedSet(STORAGE_KEY, ['home'])
      );
      expect(result.current.expanded.has('settings')).toBe(true);
      expect(result.current.expanded.has('reports')).toBe(true);
      expect(result.current.expanded.has('home')).toBe(false);
    });

    it('falls back to defaults when localStorage has invalid JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'not-valid-json');
      const { result } = renderHook(() =>
        usePersistentExpandedSet(STORAGE_KEY, ['fallback'])
      );
      expect(result.current.expanded.has('fallback')).toBe(true);
    });

    it('falls back to defaults when localStorage value is not an array', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ not: 'array' }));
      const { result } = renderHook(() =>
        usePersistentExpandedSet(STORAGE_KEY, ['fallback'])
      );
      expect(result.current.expanded.has('fallback')).toBe(true);
    });
  });

  describe('toggle', () => {
    it('adds an item to the expanded set', () => {
      const { result } = renderHook(() =>
        usePersistentExpandedSet(STORAGE_KEY)
      );
      act(() => {
        result.current.toggle('menu-item');
      });
      expect(result.current.expanded.has('menu-item')).toBe(true);
    });

    it('removes an already-expanded item', () => {
      const { result } = renderHook(() =>
        usePersistentExpandedSet(STORAGE_KEY, ['menu-item'])
      );
      act(() => {
        result.current.toggle('menu-item');
      });
      expect(result.current.expanded.has('menu-item')).toBe(false);
    });

    it('persists the change to localStorage', () => {
      const { result } = renderHook(() =>
        usePersistentExpandedSet(STORAGE_KEY)
      );
      act(() => {
        result.current.toggle('item-a');
      });
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      expect(stored).toContain('item-a');
    });
  });

  describe('ensureVisible', () => {
    it('adds multiple items to the expanded set', () => {
      const { result } = renderHook(() =>
        usePersistentExpandedSet(STORAGE_KEY)
      );
      act(() => {
        result.current.ensureVisible(['a', 'b', 'c']);
      });
      expect(result.current.expanded.has('a')).toBe(true);
      expect(result.current.expanded.has('b')).toBe(true);
      expect(result.current.expanded.has('c')).toBe(true);
    });

    it('does not remove existing items', () => {
      const { result } = renderHook(() =>
        usePersistentExpandedSet(STORAGE_KEY, ['existing'])
      );
      act(() => {
        result.current.ensureVisible(['new-item']);
      });
      expect(result.current.expanded.has('existing')).toBe(true);
      expect(result.current.expanded.has('new-item')).toBe(true);
    });
  });

  describe('setExpanded', () => {
    it('replaces the entire set', () => {
      const { result } = renderHook(() =>
        usePersistentExpandedSet(STORAGE_KEY, ['old'])
      );
      act(() => {
        result.current.setExpanded(new Set(['new-a', 'new-b']));
      });
      expect(result.current.expanded.has('old')).toBe(false);
      expect(result.current.expanded.has('new-a')).toBe(true);
      expect(result.current.expanded.has('new-b')).toBe(true);
    });
  });
});
