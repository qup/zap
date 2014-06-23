import { Actor } from './actor';

export class Stage extends Actor {
   constructor() {
      super();

      this.display = null;
   }

   present(time) {
      var context = this.display.getContext('2d');

      context.setTransform( 3, 0, 0, 3, 0, 0);

      context.imageSmoothingEnabled = false;
      context.mozImageSmoothingEnabled = false;
      context.webkitImageSmoothingEnabled = false;

      super(time);
   }
}
