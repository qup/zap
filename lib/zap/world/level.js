import { Unit } from './unit';
import { LinearMover } from './movers';

export class Level extends EventDispatcher {
   constructor() {
      this.accumulator_ = 0;

      this.terrain_ = null;
      this.abilities_ = [];
      this.units_ = [];
   }

   get terrain() {
      return this.terrain_;
   }

   set terrain(value) {
      if (this.terrain_ == value) {
         return;
      }

      this.terrain_ = value;

      event = {
         type: 'TerrainChanged',
         terrain: this.terrain,
      };

      this.dispatchEvent(event);
   }

   get abilities() {
      var abilities = this.abilities_;
      return abilities.slice(0);
   }

   addAbility(ability) {
      var abilities = this.abilities_;
      abilities.push(ability);
   }

   removeAbility(ability) {
      var abilities = this.abilities_;
      var index = abilities.indexOf(ability);

      if (index > 0) {
         abilities.splice(i, 1);
         return behavior;
      }
   }

   registerUnit(type, options) {
   }

   createUnit(type) {
      // TODO
      var unit = new Unit();

      unit.mover = new LinearMover();

      // FIXME
      unit.id = type;

      return unit;
   }

   get units() {
      var units = this.units_;
      return units.slice(0);
   }

   insertUnit(unit) {
      var units = this.units_;
      units.push(unit);
      unit.level_ = this;

      this.dispatchEvent({
         type: 'UnitInserted',
         unit: unit,
      });
   }

   removeUnit(unit) {
      var units = this.units_;
      var index = units.indexOf(unit);

      if (index > 0) {
         unit.dispatchEvent({
            type: 'UnitRemoved',
            unit: unit,
         });

         units.splice(index, 1);
         return unit;
      }
   }

   evaluate(time) {
      var accumulator = this.accumulator_;
      var stepSize = (1 / 60);

      accumulator += time;

      while(accumulator >= stepSize) {
         var units = this.units_;
         var terrain = this.terrain_;

         for (var i = units.length - 1; i >= 0; i--) {
            var unit = units[i];

            unit.evaluate(stepSize);

            if (unit.dead) {
               this.removeUnit(unit);
               return;
            }

            terrain.collide(unit);
         }

         for (var i = units.length - 1; i >= 0; i--) {
            var unit = units[i];

            var known = [];
            var unknown = [];

            for (var j = units.length - 1; j >= 0; j--) {
               var other = units[j];

               if (unit == other) {
                  continue;
               }

               var mover = unit.mover;
               var depth = mover.overlap(unit, other, true);

               if (depth.x == 0 && depth.y == 0) {
                  unknown.push(other);
               } else {
                  known.push(other);
               }
            }

            for (var j = known.length - 1; j >= 0; j--) {
               var other = known[j];
               unit.collide(other);
            }

            for (var j = unknown.length - 1; j >= 0; j--) {
               var other = unknown[j];
               unit.collide(other);
            }

            terrain.collide(unit);
         }

         accumulator -= stepSize;
      }

      this.accumulator_ = accumulator;
   }
}
