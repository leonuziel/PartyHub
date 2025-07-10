import { GameConfiguration, UIComponent, ConditionalUIView } from '../../utils/validators/GameConfigValidator.js';
import { ValueResolver } from './ValueResolver.js';
import { Player } from '../../types/interfaces.js';

type UIConfiguration = { components: UIComponent[] } | ConditionalUIView[];
type PlayerUI = { components: UIComponent[] };

export class UIStateBuilder {
  constructor(
    private gameState: any,
    private config: GameConfiguration,
    private valueResolver: ValueResolver
  ) {}

  private resolvePlayerUI(player: Player, playerUIConfig: UIConfiguration): PlayerUI {
    const playerAttributes = this.gameState.playerAttributes?.[player.id] || {};
    const playerContext = {
      player: { ...player, ...playerAttributes },
    };
    console.log(`[UIBuilder] Resolving UI for player: ${player.nickname} (${player.id}) with context:`, playerAttributes);

    // Handle new conditional UI structure
    if (Array.isArray(playerUIConfig)) {
      console.log(`[UIBuilder] -> Found conditional UI config. Evaluating conditions...`);
      for (const view of playerUIConfig) {
        // A view with no condition is a default/fallback view.
        if (!view.condition) {
          console.log(`[UIBuilder] --> Matched default view (no condition).`);
          return this.valueResolver.interpolate({ components: view.components }, playerContext);
        }

        const conditionResult = this.valueResolver.interpolate(view.condition, playerContext);
        console.log(`[UIBuilder] --> Evaluating condition: "${view.condition}" -> Result: ${conditionResult}`);
        
        if (conditionResult) {
          console.log(`[UIBuilder] --> Condition is true. Selecting this view.`);
          return this.valueResolver.interpolate({ components: view.components }, playerContext);
        }
      }
      console.log(`[UIBuilder] -> No condition matched for player ${player.nickname}. Returning empty UI.`);
      return { components: [] }; 
    }
    
    // Handle original, non-conditional UI structure
    if (playerUIConfig) {
      console.log(`[UIBuilder] -> Found non-conditional UI config for player ${player.nickname}. Interpolating directly.`);
      return this.valueResolver.interpolate(playerUIConfig, playerContext);
    }

    console.log(`[UIBuilder] -> No UI config found for player ${player.nickname}. Returning empty UI.`);
    return { components: [] };
  }

  public build(): any {
    const { status, ...restOfState } = this.gameState;
    const uiConfig = this.config.ui[status];
    
    const hostUi = uiConfig?.host 
      ? this.valueResolver.interpolate(uiConfig.host) 
      : { components: [] };

    const playerUIs: { [playerId: string]: PlayerUI } = {};
    const playerUIConfig = uiConfig?.player;

    if (playerUIConfig) {
      // The ValueResolver holds the context, including the list of players.
      // The 'any' type is used here to bypass private accessors for a clean fix.
      const players = (this.valueResolver as any).fullContext.players;
      players.forEach((player: Player) => {
        playerUIs[player.id] = this.resolvePlayerUI(player, playerUIConfig);
      });
    }

    return {
      ...restOfState,
      currentState: status,
      ui: {
        host: hostUi,
        players: playerUIs,
      },
      isConfigurable: true,
    };
  }
}
