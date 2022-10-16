module.exports = {
  "env": {
    "node": true,
    "commonjs": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 12
  },
  "rules": {},

  "ignorePatterns": ["**/examples/**"],

  "overrides": [
    {
      "files": ["**/*ForWorkers*.js"],
      "env": {
        "node": false,
        "worker": true,
        "commonjs": true,
        "es2021": true
      },
    }
  ]
};
