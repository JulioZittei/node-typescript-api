const path = require('path')
const aliases = require('module-alias-jest/register')

module.exports = {
  rootDir: path.resolve(__dirname),
  displayName: 'root-tests',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  testEnvironment: 'node',
  clearMocks: true,
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  moduleNameMapper: aliases.jest,
}
