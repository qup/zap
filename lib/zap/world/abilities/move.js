import { Ability } from './ability';

export class MoveAbility extends Ability {
   constructor() {
      super('move');
   }

   move(source, target, time) {
      var mover = source.mover;

      if (mover) {
         if (!mover.turn(source, target, time)) {
            return false;
         }

         if (!mover.move(source, target, time)) {
            return false;
         }
      }

      return this.move;
   }
}
