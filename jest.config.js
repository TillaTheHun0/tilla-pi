module.exports = {
  collectCoverage: true,
  testEnvironment: 'node',
  'testPathIgnorePatterns': [
    '<rootDir>/node_modules/'
  ],
  transform: {
    '^.+\\.(js|ts|tsx)?$': require.resolve('babel-jest')
  }
}
