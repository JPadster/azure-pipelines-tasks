import ma = require("azure-pipelines-task-lib/mock-answer");
import tmrm = require("azure-pipelines-task-lib/mock-run");
import path = require("path");
import os = require("os");

let taskPath = path.join(__dirname, "..", "grunttask.js");
let tr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tr.setInput("gruntFile", "gruntfile.js");
tr.setInput("publishJUnitResults", "true");
tr.setInput("testResultsFiles", "**/build/test-results/TEST-*.xml");
tr.setInput("enableCodeCoverage", "false");
if (os.type().match(/^Win/)) {
    tr.setInput("cwd", "c:/fake/wd");
} else {
    tr.setInput("cwd", "/fake/wd");
}
tr.setInput("targets", "build test");
tr.setInput("arguments", "-v");
tr.setInput("gruntCli", "node_modules/grunt-cli/bin/grunt");

// provide answers for task mock
let a: ma.TaskLibAnswers = <ma.TaskLibAnswers>{
    "which": {
        "grunt": "/usr/local/bin/grunt",
        "npm": "/usr/local/bin/npm",
        "node": "/usr/local/bin/node",
        "istanbulWin": "/usr/local/bin/istanbul",
        "istanbul": "/usr/local/bin/node_modules/istanbul/lib/cli.js",
    },
    "exec": {
        "/usr/local/bin/grunt build test --gruntfile gruntfile.js -v": {
            "code": 1,
            "stdout": "grunt output here",
            "stderr": "grunt failed with this output",
        },
        "/usr/local/bin/npm install istanbul": {
            "code": 0,
            "stdout": "npm output here",
        },
    },
    "checkPath": {
        "/usr/local/bin/grunt": true,
        "/usr/local/bin/npm": true,
        "/usr/local/bin/node": true,
        "/usr/local/bin/istanbul": true,
        "/usr/local/bin/node_modules/istanbul/lib/cli.js": true,
        "gruntfile.js": true,
    },
    "exist": {
        "/usr/local/bin/grunt": true,
    },
    "find": {
        "/user/build": ["/user/build/fun/test-123.xml"],
    },
    "match": {
        "**/TEST-*.xml": ["/user/build/fun/test-123.xml"],
    },
};

tr.setAnswers(a);

tr.run();
