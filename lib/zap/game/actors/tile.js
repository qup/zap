import { Actor } from './actor';

export class TileActor extends Actor {
   constructor(tileSheet) {
      super();

      this.tileSheet = tileSheet;
      this.data = [];
      this.columns = 0;
      this.rows = 0;
   }

   present(deltaTime) {
      if (!this.tileSheet.complete) {
         return;
      }

      var context = this.stage.display.getContext('2d');
      context.save();

      for (var i = 0; i < this.columns; i++) {
         for (var j = 0; j < this.rows; j++) {
            var index = this.data[i + this.columns * j];

            context.drawTile(this.tileSheet, index, (i * 16) + 8, (j * 16) + 8, 16, 16);
         }
      }

      context.restore();

      super();
   }
}
