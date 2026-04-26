import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // New in react-hooks v7; flags common “load on mount” patterns. Re-enable and
      // refactor incrementally if you want stricter behavior.
      "react-hooks/set-state-in-effect": "off",
      // React Compiler hints; re-enable when aligning useCallback deps / navigation patterns.
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/immutability": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),
]);
