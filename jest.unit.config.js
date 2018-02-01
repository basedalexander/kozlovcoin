const path = require('path');

module.exports = {
    "testEnvironment": "node",
    "bail": true,
    "coverageDirectory": path.join(__dirname, 'report-int-test'),
    "coverageReporters": []
};