import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    // Several suites reset modules and cold-import the API client inside the
    // first test; on slower machines that alone exceeds the 5s default.
    testTimeout: 20_000,
    include: ["src/**/*.test.ts"],
  },
});
