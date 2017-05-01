class Sastre {
    constructor (options) {
        this.prefix = options && options.prefix || '';
        this.operators = {
            // Possible content in 'if':
            // - Truthy expression
            // - Truthy expression with nested content
            // - Logical operator (and, or...)
            // - Content node (primitive)
            // - Array of conditional content (simplified 'and')
            'if': {
                type: 'root',
                parse: function (tree, root) {
                    let parsed;
                    if (tree instanceof Array) {
                        // Simplified 'and' (without the 'and' key containing the array of conditions)
                        parsed = this.parseLogic({
                            'and': tree
                        });
                    }
                    else if (typeof tree === 'object') {
                        // Logical operator (and, or...)
                        // or truthy expression with nested content
                        // (parseLogic takes care of both cases)
                        parsed = this.parseLogic(tree, true);
                    }
                    else {
                        // Truthy expression
                        parsed = this.check(tree);
                    }
                    if (root.then) {
                        return parsed && this.parseLogic(root.then);
                    }
                    else {
                        return parsed;
                    }
                }.bind(this)
            },
            // Possible content in an array item inside an 'and':
            // - Truthy expression
            // - Truthy expression with nested content
            // - Logical operator (and, or...)
            // - Content node (primitive)
            'and': {
                type: 'logical',
                parse: function (tree) {
                    let allTrue = true;
                    for (const branch of tree) {
                        allTrue = allTrue && this.parseLogic(branch, true);
                    }
                    return allTrue;
                }.bind(this)
            },
            // Possible content in an array item inside an 'or':
            // - Truthy expression
            // - Truthy expression with nested content
            // - Logical operator (and, or...)
            // - Content node (primitive)
            'or': {
                type: 'logical',
                parse: function (tree) {
                    let someTrue = false;
                    for (const branch of tree) {
                        someTrue = this.parseLogic(branch, true) || someTrue;
                    }
                    return someTrue;
                }.bind(this)
            },
            // Possible content in 'not':
            // - Truthy expression
            // - Truthy expression with nested content
            // - Logical operator (and, or)
            // - Content node (primitive)
            'not': {
                type: 'logical',
                parse: function (tree) {
                    if (typeof tree === 'object') {
                        let booleanExpression = Object.keys(tree)[0];
                        let innerExpression = tree[booleanExpression];
                        return !this.check(booleanExpression) && this.parseLogic(innerExpression);
                    }
                    else {
                        return !this.check(tree);
                    }
                }.bind(this)
            }
        };
    }
    // Main entry point; use this function to check the result of a syntax tree
    // Possible content in the root:
    // - 'if' with nested content
    // - Content node (primitive or object)
    parse (tree) {
        if(typeof tree === 'object') {
            const operatorId = this.getOperator(tree);
            const operator = this.operators[operatorId];
            if (operator && operator.type === 'root' && typeof operator.parse === 'function') {
                // 'if' with nested content
                return operator.parse(tree[operatorId], tree);
            }
            else {
                // Content node (object)
                const newTree = {};
                for(const objKey of Object.keys(tree)) {
                    newTree[objKey] = this.parse(tree[objKey]);
                }
            }
        }
        // Content node (primitive)
        return tree;
    }
    // Parse a branch that hangs from a logical operator (if, and, or, not...)
    parseLogic (tree, check) {
        const operatorId = this.getOperator(tree);
        const operator = operatorId !== undefined && this.operators[operatorId];
        if(operator && typeof operator.parse === 'function') {
            // Nested operator
            return operator.parse(tree[operatorId], tree);
        }
        else if (check) {
            if (typeof tree === 'object') {
                // Truthy expression with nested content
                const expr = Object.keys(tree)[0];
                return this.check(expr) && this.parseLogic(tree[expr]);
            }
            else {
                // Truthy expression
                return this.check(tree);
            }
        }
        else {
            // Content node (primitive or object)
            return this.parse(tree);
        }
    }
    getOperator (branch) {
        const keys = Object.keys(branch);
        const firstKey = keys[0];
        const operatorMatch = firstKey !== undefined && firstKey.startsWith(this.prefix);
        if (operatorMatch) {
            return firstKey.replace(this.prefix, '');
        }
    }
    // Check truthness of an expression
    check (expression) {
        // Default behavior, which can be overriden with checkWith()
        // Basically coerce to boolean
        if (!expression || expression === 'false') {
            return false;
        }
        else {
            return true;
        }
    }
    checkWith (fn) {
        this.check = fn;
    }
    setPrefix (prefix) {
        this.prefix = prefix;
    }
}

module.exports = Sastre;