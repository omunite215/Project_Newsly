import { fixupPluginRules } from "@eslint/compat";
import js from "@eslint/js";
import eslintBiomeConfig from "eslint-config-biome";
import drizzlePlugin from "eslint-plugin-drizzle";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
	{ files: ["**/*.{js,mjs,cjs,ts}"] },
	{
		files: ["**/*.{js,mjs,cjs,ts}"],
		languageOptions: { globals: globals.browser },
	},
	{
		files: ["**/*.{js,mjs,cjs,ts}"],
		plugins: { js },
		extends: ["js/recommended"],
	},
	tseslint.configs.recommended,
	eslintBiomeConfig,
	{
		plugins: {
			drizzle: fixupPluginRules(drizzlePlugin),
		},
	},
]);
