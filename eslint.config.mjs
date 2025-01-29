import svelte_parser from 'svelte-eslint-parser';
import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescript_parser from '@typescript-eslint/parser';

import prettier from 'eslint-config-prettier';
import prettier_plugin from 'eslint-plugin-prettier';
import simple_import_sort_plugin from 'eslint-plugin-simple-import-sort';
import unused_imports_plugin from 'eslint-plugin-unused-imports';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

const simpleImportSortGroups = [
	['^svelte', '^@\\w', '^\\$\\w'], // Modified to include $app imports
	['^($lib)'],
	['^\\u0000'],
	['^\\.\\.(?!/?$)', '^\\.\\./?$'],
	['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
	['^.+\\.?(css)$']
];

export default [
	js.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		files: ['**/*.{js,ts,svelte}'],
		plugins: {
			prettier: prettier_plugin,
			'simple-import-sort': simple_import_sort_plugin,
			'unused-imports': unused_imports_plugin,
			'@typescript-eslint': typescript
		},
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		rules: {
			'prettier/prettier': ['error'],
			'no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^$$(Props|Events|Slots|Generic)$'
				}
			],
			'simple-import-sort/imports': [
				'error',
				{
					groups: simpleImportSortGroups
				}
			]
		}
	},
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: typescript_parser,
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: 'module',
				project: ['./tsconfig.json']
			}
		},
		plugins: {
			'@typescript-eslint': typescript
		},
		rules: {
			...typescript.configs['recommended'].rules
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: svelte_parser,
			parserOptions: {
				parser: typescript_parser,
				extraFileExtensions: ['.svelte'],
				project: ['./tsconfig.json']
			}
		},
		plugins: {
			'@typescript-eslint': typescript,
			'simple-import-sort': simple_import_sort_plugin,
			svelte: svelte
		},
		rules: {
			'simple-import-sort/imports': [
				'error',
				{
					groups: simpleImportSortGroups
				}
			]
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/']
	}
];