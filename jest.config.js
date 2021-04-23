/* eslint-disable @typescript-eslint/no-var-requires */
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

const common = {
  setupFilesAfterEnv: ['jest-partial', '<rootDir>/jest.setup.js'],
  coverageDirectory: './.coverage',
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: '<rootDir>/',
    }),
  },
  clearMocks: true,
};

module.exports = {
  maxWorkers: 1,
  verbose: true,
  testTimeout: 60_000,
  projects: [
    {
      ...common,
      name: 'api',
      displayName: {
        name: 'api',
        color: 'cyan',
      },
      testMatch: ['**/api_*.test.{ts,tsx,js,jsx}'],
      testEnvironment: 'node',
      preset: 'ts-jest',
    },
  ],
};
