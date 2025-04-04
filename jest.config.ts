const config = {
  clearMocks: true,
  testMatch: ['**/*.(spec|test).ts'],
  modulePathIgnorePatterns: ['__tests__/'],
  preset: 'ts-jest',
  transform: {
    '\\.ts$': ['ts-jest', { isolatedModules: true }],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  collectCoverage: true,
  coverageProvider: 'v8',
};

export default config;
