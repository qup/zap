import { Effect } from './effect';

export class ApplyForceEffect extends Effect {
   constructor() {
      this.amount = { x: 0, y: 0 };
   }

   apply(source) {
      console.log('apply force, current velocity %i %i', source.velocity.x, source.velocity.y);
      source.applyImpulse(this.amount.x, this.amount.y);
   }
}
