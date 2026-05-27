import { radii as raw } from './radii.tokens.js';

export const radii = raw as typeof raw;
export type AppRadius = keyof typeof radii;
