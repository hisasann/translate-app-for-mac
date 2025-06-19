const globals = require('globals');

module.exports = [
    {
        files: ['**/*.{js,mjs,cjs}'],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node
            }
        },
        rules: {
            'no-const-assign': 'error',
            'no-undef': 'error',
            'no-unused-vars': 'warn',
            'no-redeclare': 'error',
            'no-var': 'error',
            'prefer-const': 'error'
        }
    }
]; 