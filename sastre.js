class Sastre {
    constructor () {
        this.actions = {
            'if': function (tree) {
                if (tree instanceof Array) {
                    return this.eval({
                        'and': tree
                    });
                }
                else if (typeof tree === 'object') {
                    return this.evalBranch(tree);
                }
                else {
                    return this.check(tree);
                }
            }.bind(this),
            'and': function (tree) {
                let allTrue = true;
                let innerBranch;
                for (const branch of tree) {
                    if (typeof branch === 'object') {
                        let booleanExpression = Object.keys(branch)[0];
                        allTrue = allTrue && this.check(booleanExpression);
                        innerBranch = branch[booleanExpression];
                    }
                    else {
                        allTrue = allTrue && this.check(branch);
                    }
                }
                if (innerBranch === undefined) {
                    return allTrue;
                }
                else if (typeof innerBranch === 'object') {
                    return allTrue && this.evalBranch(innerBranch);
                }
                else {
                    return allTrue && innerBranch;
                }
            }.bind(this),
            'or': function (tree) {
                let someTrue = false;
                let innerBranch;
                for (const branch of tree) {
                    if (typeof branch === 'object') {
                        let booleanExpression = Object.keys(branch)[0];
                        someTrue = someTrue || this.check(booleanExpression);
                        innerBranch = branch[booleanExpression];
                    }
                    else {
                        someTrue = someTrue || this.check(branch);
                    }
                }
                if (innerBranch === undefined) {
                    return someTrue;
                }
                else if (typeof innerBranch === 'object') {
                    return someTrue && this.evalBranch(innerBranch);
                }
                else {
                    return someTrue && innerBranch;
                }
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
    eval(object) {
        if (typeof object === 'object') {
            const conjunction = Object.keys(object)[0];
            if (typeof this.actions[conjunction] === 'function') {
                return this.actions[conjunction](object[conjunction]);
            }
        }
        return object;
    }
    evalBranch (branch) {
        let booleanExpression = Object.keys(branch)[0];
        if(Object.keys(this.actions).indexOf(booleanExpression) === -1) {
            let childBranch = branch[booleanExpression];
            return this.check(booleanExpression) && this.eval(childBranch);
        }
        else {
            return this.eval(branch);
        }

    }
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
    checkWith(fn) {
        this.check = fn;
    }
}

module.exports = Sastre;