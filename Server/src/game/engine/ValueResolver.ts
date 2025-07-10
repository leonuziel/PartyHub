import _ from 'lodash';

export class ValueResolver {
  private fullContext: any;

  constructor(
    private gameState: any,
    private gameData: any,
    private players: Map<string, any>,
    private hostId: string
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

  public resolve(value: any, additionalContext: any = {}): any {
    const context = { ...this.fullContext, ...additionalContext };

    if (typeof value !== 'string' || !value.includes('{{')) {
      return value;
    }

    // For expressions that should return a non-string value (e.g., objects, arrays, booleans)
    const singleExprMatch = value.match(/^\{\{([\s\S]+?)\}\}$/);
    if (singleExprMatch) {
      try {
        const func = new Function(...Object.keys(context), `return ${singleExprMatch[1]};`);
        return func(...Object.values(context));
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
