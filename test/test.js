const yaml = require('yamljs');
const Sastre = require('../sastre.js');

// yaml.load seems to expect path relative to cwd, not to script's location
const testCases = yaml.load('./test/test-cases.yaml');

const sastre = new Sastre();

for(const testCase of testCases) {
    console.log(sastre.parse(testCase));
}