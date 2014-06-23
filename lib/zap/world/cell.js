export class Cell {
   constructor() {
      this.x = 0;
      this.y = 0;

      this.collision = {};
      this.collision.category = 0;
      this.collision.mask = 0;
   }

   collide(obj) {
      return obj.collide(this);
   }

   damage(obj) {
   }
}
