import { Behavior } from './behavior';

export class EffectBehavior extends Behavior {
   constructor() {
      super();

      this.effect = {
         impact: null,
      };

      this.duration = Infinity;
   }

   activate(unit) {
      unit.timers[this] = 0;
   }

   deactivate(unit) {
      delete unit.timers[this];
   }

   collide(unit, obj) {
      var effect = this.effect.impact;

      if (effect) {
         effect.apply(unit, obj);
         effect.apply(obj, unit);
      }
   }

   evaluate(unit, time) {
      if (unit.timers[this] > this.duration) {
      }
   }
}
