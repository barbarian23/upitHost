module.exports = {
    parser: 'babel-eslint',
    extends: 'airbnb',
    plugins: [
        'flowtype',
    ],
    rules: {
        camelcase: [0],
        'no-console': [0],
        indent: [
            'error', 4, { SwitchCase: 1 },
        ],
        'no-use-before-define': [0],
        'react/forbid-prop-types': [0],
        'import/no-unresolved': [0],
        'react/no-unused-state': [1],
        'max-len': ['error', { code: 180 }],
        'react/prop-types': [0],
        'react/sort-comp': [0],
        'import/no-cycle': [0],
        'react/jsx-props-no-spreading': ['off'],
        'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
        'global-require': [0],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': [2, 4],
        'no-param-reassign': [0],
        'prefer-const': [0],
        'no-bitwise': ['off'],
        'one-var': [0],
        'one-var-declaration-per-line': [0],
        'object-curly-newline': [0],
        'linebreak-style': ['error', 'windows'],
        'react-native/no-inline-styles': 0,
        'flowtype/boolean-style': [
            2,
            'boolean',
        ],
        'flowtype/define-flow-type': 1,
        'flowtype/delimiter-dangle': [
            2,
            'never',
        ],
        'flowtype/generic-spacing': [
            2,
            'never',
        ],
        'flowtype/no-primitive-constructor-types': 2,
        'flowtype/no-types-missing-file-annotation': 0,
        'flowtype/no-weak-types': 0,
        'flowtype/object-type-delimiter': [
            2,
            'comma',
        ],
        'flowtype/require-parameter-type': 0,
        'flowtype/require-return-type': [
            0,
            'always',
            {
                annotateUndefined: 'never',
            },
        ],
        'flowtype/require-valid-file-annotation': 2,
        'flowtype/semi': [
            2,
            'always',
        ],
        'flowtype/space-after-type-colon': [
            2,
            'always',
        ],
        'flowtype/space-before-generic-bracket': [
            2,
            'never',
        ],
        'flowtype/space-before-type-colon': [
            2,
            'never',
        ],
        'flowtype/type-id-match': [
            2,
            '^([A-Z][a-z0-9]+)+Type$',
        ],
        'flowtype/union-intersection-spacing': [
            2,
            'always',
        ],
        'flowtype/use-flow-type': 1,
        'flowtype/valid-syntax': 1,
    },
    settings: {
        flowtype: {
            onlyFilesWithFlowAnnotation: false,
        },
    },
};
