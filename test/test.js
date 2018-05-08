const assert = require('assert')
const yaml = require('yamljs')
const Sastre = require('../sastre.js')

const testCasesJson = require('./test-cases.json')
// yaml.load seems to expect path relative to cwd, not to script's location
const testCasesYaml = yaml.load('./test/test-cases.yaml');

const expectedResults = require('./expected-results')

const sastre = new Sastre();

describe('Sastre', function () {
    it('should interpret a set of JSON syntax trees correctly', function () {
        for (let i = 0; i < testCasesJson.length; i++) {
            const testCase = testCasesJson[i]
            const result = sastre.parse(testCase)
            assert.deepStrictEqual(result, expectedResults[i])
        }
    })
    it('should interpret a set of yaml syntax trees correctly', function () {
        for (let i = 0; i < testCasesYaml.length; i++) {
            const testCase = testCasesYaml[i]
            const result = sastre.parse(testCase)
            assert.deepStrictEqual(result, expectedResults[i])
        }
    })
})
