// Import support module, with side effects.
import '../../support';

export { Game } from './game';
export { GameAssetLoader } from './assetloader';
export { GameAction } from './action';
export { GameTrigger, GameKeyTrigger } from './triggers';
export { GameState, GamePlayState, GameLoadState } from './states';
export { Actor, Stage, SpriteActor, TileActor} from './actors';

import { Game } from './game';
import { GamePlayState } from './states';

export function createGame(window, options) {

   var game = new Game(window);
   game.pushState(new GamePlayState());
   return game;
};
