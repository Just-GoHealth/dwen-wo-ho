import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    // node by default; DOM suites opt in with `// @vitest-environment happy-dom`.
    environment: "node",
    // Several suites reset modules and cold-import the API client inside the
    // first test; on slower machines that alone exceeds the 5s default.
    testTimeout: 20_000,
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text-summary", "html", "lcov"],
      reportsDirectory: "coverage",
      // Logic layers only; pages/components are covered by their hook/service tests.
      include: [
        "src/lib/**/*.ts",
        "src/services/**/*.ts",
        "src/hooks/**/*.ts",
        "src/proxy.ts",
        "src/app/api/**/*.ts",
      ],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/**/*.test-helper.ts",
        "src/lib/scripts/**",
        "src/lib/types/**",
        "src/lib/constants/**",
      ],
      // Baseline gate (item 10): raise these as coverage grows; never lower.
      thresholds: {
        lines: 20,
        functions: 20,
        branches: 20,
        statements: 20,
      },
    },
  },
});
