import { Effect } from './effect';
import { DamageEffect } from './damage';

import { EffectBehavior } from '../behaviors';

// TODO; get the ammo units move ability.
import { MoveAbility } from '../abilities/move';
var move = new MoveAbility();

export class LaunchMissileEffect extends Effect {
   constructor() {
      this.ammo = 'bullet';
   }

   apply(source, target) {
      var level = source.level;

      var ammo = level.createUnit(this.ammo);

      ammo.id = 'bullet';
      ammo.mass = 0;
      ammo.speed = 400;
      ammo.size.x = 4;
      ammo.size.y = 4;
      
      ammo.move(source.x, source.y);
      ammo.collision.group = source.collision.group;

      var behavior = new EffectBehavior();
      behavior.effect.impact = new DamageEffect();
      behavior.effect.impact.combat.amount = 10;

      ammo.addBehavior(behavior);

      level.insertUnit(ammo);

      ammo.performAbility(move, move.move, target);
   }
}
