const path = require('path');

module.exports = {
    "testEnvironment": "node",
    "coverageDirectory": path.join(__dirname, 'report'),
    "verbose": true,
    "coverageReporters": ["text-summary", "html"]
};