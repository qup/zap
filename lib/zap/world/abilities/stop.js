import { Ability } from './ability';

export class StopAbility extends Ability {
   constructor() {
      super('stop');
   }

   stop(source, target, time) {
      var mover = source.mover;

      if (mover) {
         mover.stop(source, target, time);
      }
   }
}
