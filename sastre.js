class Sastre {
    constructor (options) {
        this.prefix = options && options.prefix || '';
        this.actions = {
            'if': function (tree, root) {
                let evaluatedIf;
                if (tree instanceof Array) {
                    // Simplified 'and' (without the 'and' key containing the array of conditions)
                    evaluatedIf = this.eval({
                        'and': tree
                    });
                }
                else if (typeof tree === 'object') {
                    evaluatedIf = this.eval(tree);
                }
                else {
                    evaluatedIf = this.check(tree);
                }
                if (root.then) {
                    return evaluatedIf && this.eval(root.then);
                }
                else {
                    return evaluatedIf;
                }
            }.bind(this),
            'and': function (tree) {
                let allTrue = true;
                for (const branch of tree) {
                    if (typeof branch === 'object') {
                        allTrue = this.check(allTrue) && this.eval(branch);
                    }
                    else {
                        allTrue = allTrue && this.check(branch);
                    }
                }
                return allTrue;
            }.bind(this),
            'or': function (tree) {
                let someTrue = false;
                for (const branch of tree) {
                    if (typeof branch === 'object') {
                        someTrue = this.eval(branch) || this.check(someTrue);
                    }
                    else {
                        someTrue = someTrue || this.check(branch);
                    }
                }
                return someTrue;
            }.bind(this),
            'not': function (tree) {
                if (typeof tree === 'object') {
                    let booleanExpression = Object.keys(tree)[0];
                    let innerExpression = tree[booleanExpression];
                    return !this.check(booleanExpression) && this.eval(innerExpression);
                }
                else {
                    return !this.check(tree);
                }
            }.bind(this)
        };
    }
    // Main entry point; use this function to check the result of a syntax tree
    // Interpret a branch.
    // It can be a tree rooted to an "and", an "or", an "if", etc, or anything below
    eval (branch) {
        if(typeof branch === 'object') {
            const keys = Object.keys(branch);
            const firstKey = keys[0];
            let conjunction = firstKey.startsWith(this.prefix) && firstKey.replace(this.prefix, '');
            if (conjunction && typeof this.actions[conjunction] === 'function') {
                return this.actions[conjunction](branch[conjunction], branch);
            }
            else {
                let childBranch = branch[conjunction];
                return this.check(conjunction) && this.eval(childBranch);
            }
        }
        else {
            return branch;
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