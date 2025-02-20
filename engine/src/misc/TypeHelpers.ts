// deno-lint-ignore-file no-explicit-any ban-types

export type MethodKeys<T> = Extract<keyof T, keyof { [K in keyof T as T[K] extends Function ? K : never]: T[K] }>;

export type MethodArgs<T, K extends MethodKeys<T>> = T[K] extends (...args: infer P) => any ? [...P] : never;

export type Constructor<T> = new (...args: any[]) => T;