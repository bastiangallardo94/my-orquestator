/**
 * Store Hooks
 * Custom hooks para usar con TypeScript
 */

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../types';

// Use a lo largo de la app en lugar de `useDispatch` y `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
