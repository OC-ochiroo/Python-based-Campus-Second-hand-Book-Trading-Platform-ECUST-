import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx', esModuleInterop: true } }],
  },
  moduleNameMapper: {
    '\\.(css|jpg|png|svg)$': '<rootDir>/__mocks__/fileMock.ts',
  },
}

export default config