import { resolve } from 'path'

const root = resolve(__dirname, '..')

module.exports = {
  ...require(`${root}/jest.config.ts`),
  ...{
    rootDir: root,
    displayName: 'end2end-tests',
    setupFilesAfterEnv: ['<rootDir>/test/jest-setup.ts'],
    testMatch: ['<rootDir>/test/**/*.test.ts'],
  },
}
