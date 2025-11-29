import _ from 'lodash';
import { Parser } from 'expr-eval';

import { StateTimer } from './StateTimer.js';

export class ValueResolver {
  private fullContext: any;

  constructor(
    private gameState: any,
    private gameData: any,
    private players: Map<string, any>,
    private hostId: string,
    private stateTimer: StateTimer
  ) {
    this.fullContext = {
      gameState: this.gameState,
      gameData: this.gameData,
      players: Array.from(this.players.values()),
      hostId: this.hostId,
      //lodash can be used in expressions
      _: _,
    };
  }

  public resolve(value: any, additionalContext: any = {}, evaluate = false): any {
    const context = {
      ...this.fullContext,
      ...additionalContext,
      timeSinceStateEntry: this.stateTimer.getTimeSinceStateEntry(),
    };

    if (typeof value !== 'string') {
      return value;
    }

    if (evaluate) {
      try {
        const parser = new Parser();
        return parser.evaluate(value, context);
      } catch (e) {
        console.error(`Error evaluating expression: "${value}"`, e);
        return value;
      }
    }

    if (!value.includes('{{')) {
      return value;
    }

    // For expressions that should return a non-string value (e.g., objects, arrays, booleans)
    const singleExprMatch = value.match(/^\{\{([\s\S]+?)\}\}$/);
    if (singleExprMatch) {
      try {
        const parser = new Parser();
        return parser.evaluate(singleExprMatch[1], context);
      } catch (e) {
        console.error(`Error evaluating expression: "${singleExprMatch[1]}"`, e);
        return value;
      }
    }

    // For strings with interpolated values
    try {
      const compiled = _.template(value, { interpolate: /{{([\s\S]+?)}}/g });
      return compiled(context);
    } catch (e) {
      console.error(`Error interpolating string: "${value}"`, e);
      return value;
    }
  }

  public interpolate(obj: any, additionalContext: any = {}): any {
    return _.cloneDeepWith(obj, (value) => {
      if (typeof value === 'string') {
        return this.resolve(value, additionalContext);
      }
      return undefined;
    });
  }
}
