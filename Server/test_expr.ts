import { Parser } from 'expr-eval';
import _ from 'lodash';

const parser = new Parser();
const context = {
    players: [
        { id: 'player1', name: 'Alice' },
        { id: 'player2', name: 'Bob' }
    ],
    _: _
};

try {
    const expr = '_.find(players, { name: "Bob" }).id';
    console.log(`Evaluating: ${expr}`);
    const result = parser.evaluate(expr, context);
    console.log(`Result: ${result}`);
} catch (e) {
    console.error('Error:', e.message);
}
