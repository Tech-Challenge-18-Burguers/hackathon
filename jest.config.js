module.exports = {
    preset: 'ts-jest',          // Usa ts-jest como o preset
    testEnvironment: 'node',    // Define o ambiente de teste como Node.js
    testMatch: ['**/*.test.ts'], // Padrão para encontrar arquivos de teste
    moduleFileExtensions: ['ts', 'js', 'json', 'node'], // Extensões de arquivo a serem consideradas
    collectCoverage: true,
    coverageReporters: ['json', 'lcov'],
    coverageDirectory: 'coverage',
};