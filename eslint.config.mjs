import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "import/newline-after-import": ["error", { count: 1 }],
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: "*" },
        {
          blankLine: "any",
          prev: ["const", "let"],
          next: ["const", "let"],
        },
        { blankLine: "never", prev: "import", next: "import" },
      ],
    },
  },
  globalIgnores([".next/**", ".open-next/**", ".wrangler/**", "next-env.d.ts"]),
]);
