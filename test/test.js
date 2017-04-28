const Sastre = require('../sastre.js');
const testCases = require('./test-cases');

const sastre = new Sastre();

for(const testCase of testCases) {
    console.log(sastre.eval(testCase));
}