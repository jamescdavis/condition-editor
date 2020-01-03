module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
            legacyDecorators: true,
        },
    },
    plugins: ['ember'],
    extends: ['airbnb-base', 'eslint:recommended', 'plugin:ember/recommended'],
    env: {
        browser: true,
    },
    rules: {
        'ember/no-jquery': 'error',
        'import/extensions': 'off',
        'import/no-unresolved': 'off',
        'import/no-extraneous-dependencies': 'off',
        'func-names': 'off',
    },
    overrides: [
        // node files
        {
            files: [
                '.eslintrc.js',
                '.template-lintrc.js',
                'ember-cli-build.js',
                'testem.js',
                'blueprints/*/index.js',
                'config/**/*.js',
                'lib/*/index.js',
                'server/**/*.js',
            ],
            parserOptions: {
                sourceType: 'script',
            },
            env: {
                browser: false,
                node: true,
            },
            plugins: ['node'],
            extends: ['plugin:node/recommended'],
            rules: {
                // add your custom rules and overrides for node files here
                strict: 'off',

                // this can be removed once the following is fixed
                // https://github.com/mysticatea/eslint-plugin-node/issues/77
                'node/no-unpublished-require': 'off',
            },
        },
        {
            files: ['app/router.js'],
            rules: {
                'array-callback-return': 'off',
            },
        },
        {
            files: ['*.js'],
            extends: ['plugin:prettier/recommended'],
        },
        {
            files: ['*.ts'],
            extends: [
                'plugin:@typescript-eslint/recommended',
                'prettier/@typescript-eslint',
                'plugin:prettier/recommended',
            ],
        },
        {
            files: ['*.d.ts'],
            rules: {
                '@typescript-eslint/no-unused-vars': 'off',
                '@typescript-eslint/no-explicit-any': 'off',
                'import/export': 'off',
            },
        },
    ],
};
