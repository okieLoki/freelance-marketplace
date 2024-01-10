"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = {
    preset: "ts-jest",
    testEnvironment: "node",
    verbose: true,
    coverageDirectory: "coverage",
    testPathIgnorePatterns: ["/node_modules"],
    transform: {
        "^.+\\.ts?$": "ts-jest",
    },
    testMatch: ["<rootDir>/src/tests/**/*.test.ts"],
    collectCoverageFrom: ["<rootDir>/src/**/*.ts", "!**/node_modules/**"],
    coverageThreshold: {
        global: {
            branches: 1,
            functions: 1,
            lines: 1,
            statements: 1,
        },
    },
    coverageReporters: ["text-summary", "lcov"],
    moduleNameMapper: {
        '@notifications/(.*)': ['<rootDir>/src/$1']
    }
};
exports.default = config;
//# sourceMappingURL=jest.config.js.map