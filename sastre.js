class Sastre {
    checkWith(fn) {
        this.check = fn;
    }
    eval(object) {
        if (typeof object !== 'object') {
            return object;
        }
        const conjunction = Object.keys(object)[0];
        if (conjunction === 'if') {
            if (object.if instanceof Array) {
                return this.eval({
                    'and': object.if
                });
            }
            else if (typeof object.if === 'object') {
                return this.evalBranch(object.if);
            }
            else {
                return this.check(object.if);
            }
        }
        else if (conjunction === 'and') {
            let allTrue = true;
            let innerBranch;
            for (const branch of object.and) {
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
        }
        else if (conjunction === 'or') {
            let someTrue = false;
            let innerBranch;
            for (const branch of object.or) {
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
        }
        else if (conjunction === 'not') {
            if(typeof object.not === 'object') {
                let booleanExpression = Object.keys(object.not)[0];
                let innerExpression = object.not[booleanExpression];
                return !this.check(booleanExpression) && this.eval(innerExpression);
            }
            else {
                return !this.check(object.not);
            }
        }
        else {
            return object;
        }
    }
    evalBranch (branch) {
        let booleanExpression = Object.keys(branch)[0];
        if(['and', 'or', 'not'].indexOf(booleanExpression) === -1) {
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
}

module.exports = Sastre;