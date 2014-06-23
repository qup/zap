import { Mover } from './mover';

export class LinearMover extends Mover {
   constructor() {
      this.gravity = 650;
   }

   move(unit, target, time) {
      if (target.x != 0) {
         unit.velocity.x = target.x * unit.speed;
      }

      if (target.y != 0) {
         unit.velocity.y = target.y * unit.speed;
      }

      super(unit, target, time);
   }

   turn(unit, target, time) {
      unit.angle = Math.atan2(target.y, target.x) * 180 / Math.PI;

      return true;
   }

   stop(unit, target, time) {
      unit.velocity.x = 0;
   }

   integrate(unit, time) {
      unit.velocity.y += (this.gravity * unit.mass) * time;

      unit.position.x += unit.velocity.x * time;
      unit.position.y += unit.velocity.y * time;

      super(unit, time);
   }
}
