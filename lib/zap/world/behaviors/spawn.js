import { Behavior } from './behavior';


export class SpawnBehavior extends Behavior {
   constructor() {
      this.unit = 'player';
      this.count = 0;
      this.delay = 1;
   }

   activate(unit) {
      unit.cooldowns[this] = this.delay;
   }

   deactivate(unit) {
      delete unit.cooldowns[this];
   }

   evaluate(unit, time) {
      if (unit.cooldowns[this] <= 0) {
         var level = unit.level;

         var spawn = level.createUnit(this.unit);
         spawn.id = 'enemy';
         spawn.move(unit.x, unit.y);
         spawn.applyImpulse(100, 100);

         unit.level.insertUnit(spawn);
         
         unit.cooldowns[this] += this.delay;
      }
   }
}
