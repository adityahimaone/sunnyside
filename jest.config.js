/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    // The CSS mock must be tried before the alias. Module names are matched in
    // order, and `^@/(.*)$` also matches an aliased `.module.css` path, which
    // sent the real stylesheet to ts-jest. See tests/style-mock.js.
    '\\.css$': '<rootDir>/tests/style-mock.js',
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: [
    '<rootDir>/**/*.test.(ts|tsx|js|jsx)',
    '<rootDir>/**/*.spec.(ts|tsx|js|jsx)',
  ],
  // Playwright specs live in e2e/ and run via `pnpm test:e2e` against a real
  // server. Jest's testMatch would otherwise sweep them up, where they fail to
  // load on Playwright's own runtime rather than on anything project-specific.
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/e2e/',
    // A tool snapshot directory with duplicate copies of old tests; it is not
    // part of the app and must not decide whether the app's suite is green.
    '<rootDir>/.switchyard/',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!(fast-check)/)'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/*.d.ts',
  ],
}
