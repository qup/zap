export class Unit {
   constructor() {
      this.previous_ = { x: 0, y: 0 };
      this.position_ = { x: 0, y: 0 };
      this.velocity_ = { x: 0, y: 0 };
      this.angle = Math.PI;
      this.mass = 1.0;
      this.speed = 100;
      this.state = 0;

      this.dead_ = false;

      this.mover_ = null;

      this.collision = {};
      this.collision.category = 0x01;
      this.collision.mask = 0x01;
      this.collision.group = -10;

      this.contact = {
         left: null,
         right: null,
         bottom: null,
         top: null,
      };

      this.size_ = { x: 8, y: 8 };

      this.level_ = null;

      this.abilities_ = [ ];
      this.behaviors_ = [ ];
      this.action_ = { };

      this.cooldowns_ = { };
      this.timers_ = { };
   }

   get previous() {
      return this.previous_;
   }

   get position() {
      return this.position_;
   }

   get delta() {
      return {
         x: this.position.x - this.previous.x,
         y: this.position.y - this.previous.y,
      };
   }

   get x() {
      return this.position.x;
   }

   get y() {
      return this.position.y;
   }

   move(x, y) {
      this.position.x = x;
      this.position.y = y;
   }

   translate(x, y) {
      this.position.x += x;
      this.position.y += y;
   }

   get velocity() {
      return this.velocity_;
   }

   applyImpulse(x, y) {
      this.velocity.x += x;
      this.velocity.y += y;
   }

   get mover() {
      return this.mover_;
   }

   set mover(value) {
      this.mover_ = value;
   }

   collide(obj) {
      if (this.collision.group === obj.collision.group) {
         if (this.collision.group < 0) {
            return false;
         }
      }

      if (((this.collision.mask & obj.collision.category) == 0) &&
      ((obj.collision.mask & this.collision.category) == 0)) {
         return false;
      }

      var mover = this.mover;
      if (mover) {
         var depth = this.mover.resolve(this, obj);
         if (!depth) {
            return false;
         }
      }

      var behaviors = this.behaviors_;
      for (var i = 0; i < behaviors.length; i++) {
         behaviors[i].collide(this, obj);
      }

      return true;
   }

   get size() {
      return this.size_;
   }

   get width() {
      return this.size.x;
   }

   get height() {
      return this.size.y;
   }

   get level() {
      return this.level_;
   }

   get dead() {
      return this.dead_;
   }

   damage(source) {
      this.kill(source);
   }

   kill(source) {
      console.log('killed');
      this.dead_ = true;
   }

   get abilities() {
      var abilities = this.abilities_;
      return abilities;
   }

   addAbility(ability) {
      var abilities = this.abilities_;

      abilities.push(ability);
      ability.enable(this);
   }

   removeAbility(ability) {
      var abilities = this.abilities_;

      for (var i = 0; i < abilities.length; i++) {
         if (abilities[i] == ability) {
            ability.disable(this);
            abilities.splice(i, 1);

            return ability;
         }
      }
   }

   hasAbility(ability) {
      var abilities = this.abilities_;

      for (var i = 0; i < abilities.length; i++) {
         if (abilities[i] == ability) {
            return true;
         }
      }

      return false;
   }

   performAbility(ability, phase, target, callback) {
      if (ability.hasCooldown(this)) {
         console.log('has cooldown');
         return false;
      }

      // TODO validation.
      // TODO dispatch events.

      var action = this.action_ || { };

      action.ability = ability;
      action.phase = phase;
      action.target = target;

      this.action_ = action;

      return true;
   }

   get behaviors() {
      var behaviors = this.behaviors_;
      return behaviors;
   }

   addBehavior(behavior) {
      var behaviors = this.behaviors_;

      behaviors.push(behavior);
      behavior.activate(this);
   }

   removeBehavior(behavior) {
      var behaviors = this.behaviors_;

      for (var i = 0; i < behaviors.length; i++) {
         if (behaviors[i] == behavior) {
            behavior.deactivate(this);
            behaviors.splice(i, 1);

            return behavior;
         }
      }
   }

   hasBehavior(behavior) {
      var behaviors = this.behaviors_;

      for (var i = 0; i < behaviors.length; i++) {
         if (behaviors[i] == behavior) {
            return true;
         }
      }

      return false;
   }

   get cooldowns() {
      return this.cooldowns_;
   }

   get timers() {
      return this.timers_;
   }

   evaluate(time) {
      this.previous.x = this.position.x;
      this.previous.y = this.position.y;

      var cooldowns = this.cooldowns;
      for (var link in cooldowns) {
         cooldowns[link] -= time;
      }

      var timers = this.timers;
      for (var link in timers) {
         timers[link] += time;
      }

      var behaviors = this.behaviors;
      for (var i = 0; i < behaviors.length; i++) {
         behaviors[i].evaluate(this, time);
      }

      // Evaluate the current action.
      // TODO consider adding multiple execution channels.
      var action = this.action_;
      if (action.phase) {
         var phase = action.phase.call(action.ability, this, action.target, time);

         if (action.phase != phase) {
            action.phase = phase;

            this.dispatchEvent({
               type: 'UnitAbility',
               unit: this,
               ability: action.ability,
               phase: action.phase,
            });
         }
      }

      var mover = this.mover_;
      if (mover) {
         mover.integrate(this, time);
      }

      this.contact = { };
   }
}

Unit.intersects = function(a, b) {
};

Unit.overlap = function(a, b) {
   var mover = a.mover ? a.mover : b.mover;

   if (mover) {
      return mover.overlap(a, b);
   }

   return { x: 0, y: 0 };
};

Unit.resolve = function(a, b) {
   var mover = a.mover ? a.mover : b.mover;

   if (mover) {
      return mover.resolve(a, b);
   }
};

EventDispatcher.prototype.apply(Unit.prototype);
