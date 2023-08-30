export type Scope = 'letter' | 'batch' | 'webhook' | 'organisation_read';

export type Type<T> = new (...args: unknown[]) => T;
