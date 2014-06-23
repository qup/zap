import { Ability } from './ability';

export class EffectAbility extends Ability {
   constructor() {
      super('effect');

      this.effect = null;
   }

   execute(source, target) {
      var effect = this.effect;
      effect.apply(source, target);

      this.useCooldown(source);
   }
}
