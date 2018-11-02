// .eslintrc.js is prioritised over other eslintrc formats

module.exports = {
    'extends': [
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:promise/recommended",
        "plugin:lodash/recommended",
        "plugin:destructuring/recommended"
    ],
    "plugins": [
        "security",
        "import",
        "compat",
        "promise",
        "destructuring",
        "prettier"
        // "lodash"
    ],
    rules: {
        'jsx-a11y/accessible-emoji': 0,
        'jsx-a11y/alt-text': 0,
        'jsx-a11y/anchor-has-content': 0,
        'jsx-a11y/anchor-is-valid': 0,
        'lodash/prefer-lodash-method': 0,
        'lodash/preferred-alias': 0,
        'lodash/matches-prop-shorthand': 0,
        'lodash/matches-shorthand': 0,
        'lodash/collection-return': 0,
        'lodash/collection-method-value': 0,
        'lodash/prefer-immutable-method': 0,
        'lodash/prefer-lodash-chain': 0,
        'lodash/import-scope': 0,
        'lodash/prefer-noop': 0,
        'lodash/prefer-filter': 0,
        'lodash/prefer-constant': 0,

        "prettier/prettier": "error"
    }
};
