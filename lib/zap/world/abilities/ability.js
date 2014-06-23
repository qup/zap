export class Ability {
   constructor(id) {
      this.id = id;

      this.cooldown = {
         link: this,
         location: 'unit',
         duration: {
            enable: 1.0,
            use: 1.0,
         },
      };
   }

   hasCooldown(unit) {
      return unit.cooldowns[this.cooldown.link] > 0;
   }

   setCooldown(unit, value) {
      unit.cooldowns[this.cooldown.link] = value;
   }

   useCooldown(unit) {
      this.setCooldown(unit, this.cooldown.duration.use);
   }

   enable(unit) {
      this.setCooldown(unit, this.cooldown.duration.enable);
   }

   disable(unit) {
   }

   toString() {
      return '[object ' + this.constructor.name + '(' + this.id + ')]';
   }
}
