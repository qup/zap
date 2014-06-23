import { Effect } from './effect';

export class DamageEffect extends Effect {
   constructor() {
      this.combat = {
         amount: 0,
      };
   }

   apply(source, target) {
      source.damage(target, this.combat.amount);
   }
}
