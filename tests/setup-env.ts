const baseTestEnv: NodeJS.ProcessEnv = {
  ...process.env,
  NODE_ENV: process.env.NODE_ENV ?? "test",
};

export function initializeTestEnv() {
  process.env = { ...baseTestEnv } satisfies NodeJS.ProcessEnv;
}

export function mergeTestEnv(
  overrides: Record<string, string | undefined> = {},
) {
  process.env = {
    ...baseTestEnv,
    ...overrides,
    NODE_ENV: baseTestEnv.NODE_ENV ?? "test",
  } satisfies NodeJS.ProcessEnv;
}
