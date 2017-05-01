# Sastre

A Simple Abstract Syntax Tree Parser written in Javascript.

## Quick start

```bash
npm install --save sastre
```

## How it works

```javascript
const Sastre = require('sastre');
const sastre = new Sastre();

const MyApp = function () {
    this.min = 0;
    this.max = 10;
    this.current = 5;
    // In order to use variables from your application, you can override Sastre's default function to evaluate truthy expressions:
    sastre.checkWith(function (expr) {
        const split = expr.split[' '];
        switch(split.length) {
            case 2:
                return this[split[0]] == this[split[1]];
            case 3:
                const left = split[0];
                const right = split[2];
                switch(split[1]) {
                    case '<':
                        return left < right;
                    case '<=':
                        return left < right;
                    case '>':
                        return left > right;
                    case '>=':
                        return left > right;
                    case '==':
                        return left == right;
                    case '===':
                        return left === right;
                }
            default:
                return this[split[0]];
        }
    }.bind(this))
    this.inBounds = sastre.parse({
        'if': {
            'and': [
                'min <= current',
                'current <= max'
            ]
        }
    });
}();
```

## Motivation

I built a system where application views and their content can be written declaratively in yaml format, like:

```yaml
state-id-01:
  heading: State 01
  options:
    - state-id-02
    - state-id-03
```

Later I started adding some functionality to my system so that content could be shown or hidden depending on the application state, and it worked like this:

```yaml
state-id-01:
  heading: State 01
  options:
    - id: state-id-02
      if: variable-x 0
    - state-id-03
```

That was quite cool, but soon I had more complex cases, so I ended up building this library which supports all possible combinations of 'and' and 'or', plus some other features. My goal is to be able to write most logic from yaml files, like so:
 
 ```yaml
 if:
   and:
     - expression-x
     - expression-y
     - or:
       - expression-z: content-xx
```