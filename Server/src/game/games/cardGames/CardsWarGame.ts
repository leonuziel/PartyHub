// import { BaseGame } from '../../BaseGame.js';
// import { Cards, CardsWarGameState, NumberOfCards, Player } from '../../../types/interfaces.js';

// export class CardsWarGame extends BaseGame {
//     protected gameState: CardsWarGameState;
//     private playerHands: { [playerId: string]: Cards[] };
//     private timerId: NodeJS.Timeout | null = null;

//     constructor(players: Map<string, Player>, broadcast: (event: string, payload: any) => void) {
//         super(players, broadcast);
//         const initialChosenCard:{[playerId:string]:Cards} = Array.from(players.keys()).reduce((chosenCards, id) => ({ ...chosenCards, [id]:  null }), {});
//         const initialHands:{[playerId:string]:Cards[]} = Array.from(players.keys()).reduce((initialHands, id,index) => {
//             return { ...initialHands, [id]: [] };
//         }, {});
//         let tempDeck: Cards[] = Object.values(Cards).filter(value => typeof value === 'number') as Cards[];
//         while (tempDeck.length > 0) {
//             for (const playerId in initialHands) {
//                 const randomIndex = Math.floor(Math.random() * tempDeck.length);
//                 initialHands[playerId].push(tempDeck[randomIndex]);
//                 tempDeck.splice(randomIndex, 1);
//             }
//         }
//         this.playerHands = initialHands;
//         this.gameState = {
//             gameId: 'cardsWar',
//             status: 'STARTING',
//             players: Array.from(players.values()),
//             playerChosenCard: initialChosenCard,
//             playersHandCount: this.getPlayersHandsCount(players),
//             round: 0,
//             timer: 0,
//         };
//     }

//     private getPlayersHandsCount(players: Map<string, Player>): { [playerId: string]: number; } {
//         return Array.from(players.keys()).reduce((playersHands, id) => ({ ...playersHands, [id]: this.playerHands[id].length }), {});
//     }

//     public start(): void {
//         this.nextRound();
//     }

//     private nextRound(): void {
//         if (this.timerId) clearTimeout(this.timerId);

//         this.gameState.round++;
//         this.gameState.status = 'CHOOSING_CARDS';

//         this.gameState.timer = 15;

//         this.broadcastState();

//         this.timerId = setInterval(() => {
//             this.gameState.timer--;
//             if (this.gameState.timer <= 0) {
//                 this.revealCards();
//             } else {
//                 this.broadcastState();
//             }
//         }, 1000);
//     }

//     private revealCards(): void {
//         if (this.timerId) clearInterval(this.timerId);
//         this.gameState.status = 'REVEALING_CARDS';

//         const revealState = {
//             ...this.getSanitizedGameState(),
//             playerChosenCard: this.gameState.playerChosenCard,
//         };
//         this.broadcast('game:state_update', revealState);

//         // Move to Loser Cards State after a delay
//         setTimeout(() => this.losersCardsState(), 5000);
//     }

//     private losersCardsState(): void{
//         if (this.timerId) clearInterval(this.timerId);
//         this.gameState.status = 'LOSERS_CARDS';

//         this.moveCardsToLoser();
//         this.broadcastState();

//         // Move to next Round after a delay
//         setTimeout(() => this.nextRound(), 3000);
//     }

//     private moveCardsToLoser() {
//         let lowestValuePlayer = this.players.keys().next().value;
//         this.gameState.playerChosenCard.forEach((a,b)=>{});
//     }













    
//     private endGame(): void {
//         this.gameState.status = 'FINISHED';
//         this.broadcastState();
//     }

//     public handlePlayerAction(playerId: string, action: { answerIndex: number }): void {
//         if (this.gameState.status !== 'ASKING_QUESTION' || this.playerAnswers.has(playerId)) {
//             return; // Ignore late or duplicate answers
//         }

//         this.playerAnswers.set(playerId, {
//             answerIndex: action.answerIndex,
//             time: (15 - this.gameState.timer) * 1000 // Time taken in ms
//         });

//         // If all players have answered, reveal early
//         if (this.playerAnswers.size === this.players.size) {
//             this.revealAnswers();
//         }
//     }

//     private broadcastState(): void {
//         this.broadcast('game:state_update', this.getSanitizedGameState());
//     }

//     private getSanitizedGameState(): any {
//         return {...this.gameState, playerChosenCard: null};
//     }
// }
