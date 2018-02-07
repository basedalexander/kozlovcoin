module.exports = {
    "transform": {
        ".ts": "<rootDir>/node_modules/ts-jest/preprocessor.js"
      },
      "testRegex": "src/.*\\.unit.spec\\.ts",
      "moduleFileExtensions": [
        "ts",
        "js",
        "json"
      ],
      "mapCoverage": true,
    "testEnvironment": "node"
};