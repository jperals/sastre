const assert = require('assert')
const yaml = require('yamljs')
const Sastre = require('../sastre.js')

// yaml.load seems to expect path relative to cwd, not to script's location
const testCases = yaml.load('./test/test-cases.yaml');

const sastre = new Sastre();

const expectedResults = [
    'Hello World!',
    "I'm not false!",
    'All the conditions are true!',
    false,
    'This will be true again!',
    false,
    "'And' inside 'or'!",
    "'Or' inside 'and'!",
    "Simplified 'and'!",
    'that',
    {objectKey: 'objectValue'}
]

describe('Sastre', function () {
    it('should interpret a set of yaml syntax trees correctly', function () {
        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i]
            const result = sastre.parse(testCase)
            assert.deepStrictEqual(result, expectedResults[i])
        }
    })
})
