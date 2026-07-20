import antfu from "@antfu/eslint-config";

export default antfu({
  type: "app",
  react: true,
  typescript: true,
  formatters: true,
  stylistic: {
    indent: 2,
    semi: true,
    quotes: "double",
  },
  ignores: ["**/node_modules", "**/dev-dist/*"],
}, {
  rules: {
    "ts/no-redeclare": "off",
    "ts/consistent-type-definitions": ["error", "type"],
    "no-console": "warn",
    "antfu/no-top-level-await": "off",
    "node/prefer-global/process": "off",
    "node/no-process-env": "off",
    "perfectionist/sort-imports": "error",
    "unicorn/filename-case": ["error", {
      cases: {
        pascalCase: true,
        camelCase: true,
        kebabCase: true,
      },
      ignore: [/README\.md$/],
    }],
  },
});
