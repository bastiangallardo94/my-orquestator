module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	roots: ['<rootDir>/src'],
	testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
	transform: {
		'^.+\\.(ts|tsx)$': [
			'ts-jest',
			{
				tsconfig: {
					jsx: 'react-jsx',
					esModuleInterop: true,
					allowSyntheticDefaultImports: true
				}
			}
		]
	},
	moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',  // ← primero
        '^@core/(.*)$': '<rootDir>/src/core/$1',
        '^@context/(.*)$': '<rootDir>/src/context/$1',
        '^@features/(.*)$': '<rootDir>/src/features/$1',
        '^@shared/(.*)$': '<rootDir>/src/shared/$1',
        '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
        '^@services/(.*)$': '<rootDir>/src/services/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	collectCoverageFrom: [
		'src/**/*.{ts,tsx}',
		'!src/**/*.d.ts',
		'!src/index.tsx',
		'!src/bootstrap.tsx',
		'!src/**/*.stories.{ts,tsx}',
		'!src/**/__tests__/**',
		'!src/**/*.test.{ts,tsx}',
		'!src/**/*.spec.{ts,tsx}'
	],
	coverageThreshold: {
		global: {
			branches: 50,
			functions: 50,
			lines: 50,
			statements: 50
		}
	},
	coverageDirectory: 'coverage',
	testPathIgnorePatterns: [
		'/node_modules/',
		'/dist/',
		'/i18n/'
	],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
	globals: {
		'ts-jest': {
			isolatedModules: true
		}
	}
};
