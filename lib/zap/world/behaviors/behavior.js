export class Behavior {
   constructor(id) {
      this.id = id;
   }

   activate(unit) {
   }

   deactivate(unit) {
   }

   collide(unit, object) {
   }

   evaluate(unit, object) {
   }

   toString() {
      return '[object ' + this.constructor.name + '(' + this.id + ')]';
   }
}
