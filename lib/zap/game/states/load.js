import { GameState } from './';

export class GameLoadState extends GameState {
   constructor(loader) {
      super();

      this.loader = loader;
   }

   activate() {
      this.loader.load();
   }

   evaluate(deltaTime) {
      if (this.loader.complete) {
         this.game.popState();
      }
   }

   present(deltaTime) {
      var context = this.display.getContext('2d');
      var loader = this.loader;

      context.setTransform( 1, 0, 0, 1, 0, 0 );
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);

      var progress = loader.loaded / loader.total;

      context.translate(context.canvas.width / 2, context.canvas.height / 2);

      var width = context.canvas.width / 2;
      var height = 50;

      context.translate(-(width / 2), -(height / 2));

      context.fillStyle = '#808080';
      context.fillRect(0, 0, width, height);

      context.fillStyle = '#b3b3b3';
      context.fillRect(0, 0, width * progress, height);

      context.textAlign = 'center';
      context.font = '44px munro';

      context.fillStyle = 'white';
      context.fillText(Math.floor(progress * 100).toString(), width / 2, height - 12);
   }
}
