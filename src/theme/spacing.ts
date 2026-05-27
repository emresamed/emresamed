import { spacing as raw } from './spacing.tokens.js';

export const spacing = raw as typeof raw;
export type AppSpacing = keyof typeof spacing;
