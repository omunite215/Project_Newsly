import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import drizzlePlugin from "eslint-plugin-drizzle";
import eslintBiomeConfig from "eslint-config-biome";
import { fixupPluginRules } from "@eslint/compat";

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
