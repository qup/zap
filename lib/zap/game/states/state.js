export class GameState {
   constructor(game) {
      this.game_ = null;
   }

   get game() {
      return this.game_;
   }

   get display() {
      return this.game.display;
   }

   handleEvent(event) {
   }

   activate() {
   }

   deactivate() {
   }

   evaluate(time) {
   }

   present(time) {
   }
}
