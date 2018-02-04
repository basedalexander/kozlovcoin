const path = require('path');

module.exports = {
    "transform": {
        ".ts": "<rootDir>/node_modules/ts-jest/preprocessor.js"
      },
      "testRegex": "tests/.*\\.e2e.spec\\.ts",
      "moduleFileExtensions": [
        "ts",
        "js",
        "json"
      ],
      "mapCoverage": true
};