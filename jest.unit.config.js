const path = require('path');

module.exports = {
    "transform": {
        ".ts": "<rootDir>/node_modules/ts-jest/preprocessor.js"
      },
      "testRegex": "src/.*\\.spec\\.ts",
      "moduleFileExtensions": [
        "ts",
        "js",
        "json"
      ],
      "mapCoverage": true
};