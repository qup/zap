/*jslint browser: true, forin: true, plusplus: true, indent: 4 */
(function(Object, mixin) {
    "use strict"; // happy linter ^_____^

    /* <droppable> interesting code after line 110, here
     * ad-hoc polyfill section for this purpose only
     * never use these functions outside this closure ... like ...
ne*/var

        // borrowed methods for unknown Objects
        ObjectPrototype = Object.prototype,

        lookupGetter = ObjectPrototype.__lookupGetter__,
        lookupSetter = ObjectPrototype.__lookupSetter__,
        defineGetter = ObjectPrototype.__defineGetter__,
        defineSetter = ObjectPrototype.__defineSetter__,
        has          = ObjectPrototype.hasOwnProperty,

        emptyArray   = [],
        // slice        = emptyArray.slice,

        // for IE < 9 and non IE5 yet browsers
        goNative = true,
        defineProperty = (function(defineProperty){
          try{
            return defineProperty && defineProperty({},'_',{value:1})._ && defineProperty;
          } catch(IE8) {
            goNative = false;
          }
        }(Object.defineProperty)) ||
        function (o, k, d) {
            var
                get = d.get, // has.call(d, 'get') would be better but
                set = d.set; // ES5 is just like this
            if (get && defineGetter) {
                defineGetter.call(o, k, get);
            }
            if (set && defineSetter) {
                defineSetter.call(o, k, set);
            }
            if (!(get || set)) {
                o[k] = d.value;
            }
        },
        // for IE < 9 and non IE5 yet browsers
        getOwnPropertyNames = (goNative && Object.getOwnPropertyNames) ||
        (function () {
            var
                addHiddenOwnProperties = function (result) {
                    return result;
                },
                list = [],
                key,
                i,
                length;

            for (key in {valueOf: key}) {
                list.push(key);
            }

            if (!list.length) {
                length = list.push(
                    'constructor',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'toLocaleString',
                    'toString',
                    'valueOf'
                ) - 1;
                addHiddenOwnProperties = function (result, o) {
                    for (i = 0; i < length; i++) {
                        key = list[i];
                        if (has.call(o, key)) {
                            result.push(key);
                        }
                    }
                    return result;
                };
            }

            return function (o) {
                var
                    result = [],
                    key;
                for (key in o) {
                    if (has.call(o, key)) {
                        result.push(key);
                    }
                }
                return addHiddenOwnProperties(result, o);
            };
        }()),
        // IE < 9 or other non ES5 yet browsers
        getOwnPropertyDescriptor = (goNative && Object.getOwnPropertyDescriptor) ||
        function (o, k) {
            var
                descriptor = {
                    enumerable: true,
                    configurable: true
                },
                get = lookupGetter && lookupGetter.call(o, k),
                set = lookupSetter && lookupSetter.call(o, k);
            if (get) {
                descriptor.get = get;
            }
            if (set) {
                descriptor.set = set;
            }
            if (!(get || set)) {
                descriptor.writable = true;
                descriptor.value = o[k];
            }
            return descriptor;
        };
    // </droppable>

    // if already defined get out of here
    // this should be
    // if (mixin in Object) return;
    // but for some reason I went for JSLint ...
    if (Object[mixin]) {
        return;
    }
    // same descriptor as other spec'd methods
    defineProperty(
        Object,
        mixin,
        {
            enumerable: false,
            writable: true,
            configurable: true,
            value: function (
                target, // object to enrich with
                source, // mixin object or Trait (Function)
                args    // optional arguments for Trait
            ) {
                var
                    i,
                    length,
                    keys,
                    key;

                if (typeof source === 'function') {
                    // if the source is a function
                    // it will be invoked with object as target
                    // this let us define mixin as closures
                    // function addFunctionality() {
                    //     this.functionality = function () {
                    //       // do amazing stuff
                    //     }
                    // }
                    // addFunctionality.call(Class.prototype);
                    // addFunctionality.call(genericObject);
                    // // or
                    // Object.mixin(Class.prototype, addFunctionality);

                    source.apply(target, args || emptyArray);
                    /*
                    // try to perform as fast as possible
                    if (arguments.length < 3) {
                        // so if no extra args are passed ...
                        source.call(target);
                    } else {
                        // there is no need to slice them as done here
                        source.apply(target, slice.call(arguments, 2));
                    }
                    */
                } else {
                    // if source is an object
                    // grab all possibe properties
                    // and per each of them ...
                    keys = getOwnPropertyNames(source);
                    length = keys.length;
                    i = 0;
                    while (i < length) {
                        key = keys[i++];
                        // ... define it ...
                        defineProperty(
                            target,
                            key,
                            // ... using the same descriptor
                            getOwnPropertyDescriptor(
                                source,
                                key
                            )
                        );
                    }
                }
                // always return the initial target
                // ignoring all possible different return with functions
                return target;
            }
        }
    );
}(Object, 'mixin'));
class Rectangle {
   constructor(x, y, width, height) {
      this.x = 0 || x;
      this.y = 0 || y;
      this.width = 0 || width;
      this.height = 0 || height;
   }
}

Rectangle.overlap = function(rectA, rectB) {
   // Calculate half sizes.
   var halfWidthA = rectA.width / 2.0;
   var halfHeightA = rectA.height / 2.0;
   var halfWidthB = rectB.width / 2.0;
   var halfHeightB = rectB.height / 2.0;

   // Calculate centers.
   var centerA = new Vector2(rectA.x + halfWidthA, rectA.y + halfHeightA);
   var centerB = new Vector2(rectB.x + halfWidthB, rectB.y + halfHeightB);

   // Calculate current and minimum-non-intersecting distances between centers.
   var distanceX = centerA.x - centerB.x;
   var distanceY = centerA.y - centerB.y;
   var minDistanceX = halfWidthA + halfWidthB;
   var minDistanceY = halfHeightA + halfHeightB;

   // If we are not intersecting at all, return (0, 0).
   if (Math.abs(distanceX) >= minDistanceX || Math.abs(distanceY) >= minDistanceY) {
      return null;
   }

   // Calculate and return intersection depths.
   var depthX = distanceX > 0 ? minDistanceX - distanceX : -minDistanceX - distanceX;
   var depthY = distanceY > 0 ? minDistanceY - distanceY : -minDistanceY - distanceY;

   return new Vector2(depthX, depthY);
};
class Vector2  {
   constructor(x, y) {
      this.x = x || 0;
      this.y = y || 0;
   }
}

Vector2.add = function(a, b, result) {
   result = result || new Vector2();
   result.x = a.x + b.x;
   result.y = a.y + b.y;

   return result;
};
class EventDispatcher {
   addEventListener ( type, callback ) {
      if ( this.eventListeners_ === undefined ) {
         this.eventListeners_ = { };
      }

      var listeners = this.eventListeners_;

      if ( listeners[ type ] === undefined ) {

         listeners[ type ] = [];

      }

      if ( listeners[ type ].indexOf( callback ) === - 1 ) {

         listeners[ type ].push( callback );

      }

   }

   hasEventListener( type, callback ) {

      if ( this.eventListeners_ === undefined ) {
         return false;
      }

      var listeners = this.eventListeners_;

      if ( listeners[ type ] !== undefined && listeners[ type ].indexOf( callback ) !== - 1 ) {

         return true;

      }

      return false;

   }

   removeEventListener( type, callback ) {
      if ( this.eventListeners_ === undefined ) {
         return;
      }

      var listeners = this.eventListeners_;
      var callbacks = listeners[ type ];

      if ( callbacks !== undefined ) {

         var index = callbacks.indexOf( callback );

         if ( index !== - 1 ) {

            callbacks.splice( index, 1 );

         }

      }

   }

   dispatchEvent( event ) {
      if ( this.eventListeners_ === undefined ) {
         return;
      }

      var listeners = this.eventListeners_;
      var callbacks = listeners[ event.type ];

      if ( callbacks !== undefined ) {

         event.target = this;

         var array = [];
         var length = callbacks.length;

         for ( var i = 0; i < length; i ++ ) {
            array[ i ] = callbacks[ i ];
         }

         for ( var i = 0; i < length; i ++ ) {
            array[ i ].call( this, event );
         }
      }
   }
}
class TileSheet {
   constructor() {
      this.image_ = null;
      this.padding_ = 0;
      this.margin_ = 0;
      this.columns_ = 0;
      this.rows_ = 0;
      this.src_ = "";
   }

   get image() {
      return this.image_;
   }

   set image(value) {
      this.image_ = value;
   }

   get padding() {
      return this.padding_;
   }

   get margin() {
      return this.margin_;
   }

   get columns() {
      return this.columns_;
   }

   get rows() {
      return this.rows_;
   }

   get src() {
      return this.src_;
   }

   get complete() {
      return this.complete_;
   }

   set src(value) {
      this.src_ = value;
      this.complete_ = false;

      var request = new XMLHttpRequest();
      request.open('GET', value, true);
      request.send();

      var that = this;
      request.addEventListener('load', function (event) {
         var data = JSON.parse(request.responseText);

         that.padding_ = data.padding || 0;
         that.margin_ = data.margin || 0;
         that.columns_ = data.columns || 0;
         that.rows_ = data.rows || 0;

         that.image_ = new Image;
         that.image_.addEventListener('load', function (e) {
            that.complete_ = true;
            that.dispatchEvent(e);
         });

         that.image.src = data.image;
      });
   }
}

Object.mixin(TileSheet.prototype, EventDispatcher.prototype);
class SpriteSheet {
   constructor(image, animations, frames) {
      this.image_ = null;
      this.frames_ = [];
      this.animations_ = { };
      this.frames_ = [];
      this.src_ = "";
   }

   get image() {
      return this.image_;
   }

   set image(value) {
      this.image_ = value;
   }

   get src() {
      return this.src_;
   }

   set src(value) {
      this.complete_ = false;

      var request = new XMLHttpRequest();
      request.open('GET', value, true);
      request.send();

      var that = this;
      request.addEventListener('load', function (event) {
         var data = JSON.parse(request.responseText);

         // Load the frames.
         var frames = that.frames_;
         for (var i = 0; i < data.frames.length; i++) {
            var frame = new SpriteSheetFrame();

            frame.top = data.frames[i].top;
            frame.left = data.frames[i].left;
            frame.right = data.frames[i].right;
            frame.bottom = data.frames[i].bottom;

            frames[i] = frame;
         }

         var animations = that.animations_;
         for (var key in data.animations) {
            var animation = new SpriteSheetAnimation();
            animation.frames = data.animations[key].frames;
            animations[key] = animation
         }

         var image = new Image;
         image.addEventListener('load', function (e) {
            that.image_ = image;
            that.complete_ = true;
            that.dispatchEvent(e);
         });

         image.src = data.image;
      });

      this.src_ = value;
   }

   get complete() {
      return this.complete_;
   }

   getFrameByIndex(index) {
      return this.frames_[index];
   }

   getAnimationById(index) {
      return this.animations_[index];
   }
}

Object.mixin(SpriteSheet.prototype, EventDispatcher.prototype);
class SpriteSheetFrame {
   costructor(top, left, right, bottom) {
      this.top = top || 0;
      this.left = left || 0;
      this.right = right || 0;
      this.bottom = bottom || 0;
   }
}
class SpriteSheetAnimation {
   constructor() {
      this.frames = [];
   }
}
(function() {
   CanvasRenderingContext2D.prototype.drawTile = function(tileSheet, index, x, y, width, height) {
      var tileWidth = tileSheet.image.width / tileSheet.columns;
      var tileHeight = tileSheet.image.height / tileSheet.rows;

      var tileX = Math.floor(index % (tileSheet.image.width / tileWidth)) * tileWidth;
      var tileY = Math.floor(index / (tileSheet.image.width / tileWidth)) * tileHeight;

      // this.drawImage(tileSheet.image, tileX, tileY, tileWidth, tileHeight, x, y, width, height);

      // this.drawImage(tileSheet.image, tileX, tileY, tileWidth, tileHeight, x - (tileWidth / 2), y - (tileHeight / 2), width, height);
      this.drawImage(tileSheet.image, tileX, tileY, tileWidth, tileHeight, x, y, width, height);
   };

   CanvasRenderingContext2D.prototype.drawSprite = function(spriteSheet, index, x, y, color) {
      if (!spriteSheet.complete) {
         return;         
      }
      var spriteBounds = spriteSheet.getFrameByIndex(index);

      var spriteHeight = spriteBounds.bottom - spriteBounds.top;
      var spriteWidth = spriteBounds.right - spriteBounds.left;

      var spriteX = spriteBounds.left;
      var spriteY = spriteBounds.top;

      // this.drawImage(spriteSheet.image, spriteX, spriteY, spriteWidth, spriteHeight, x - (spriteWidth / 2), y - (spriteHeight / 2), spriteWidth, spriteHeight);
      this.drawImage(spriteSheet.image, spriteX, spriteY, spriteWidth, spriteHeight, x, y, spriteWidth, spriteHeight);
   };
})();
// refactor this, but better than having magic values.
var COLLISION_NONE = 0x0000;
var COLLISION_GROUND = 0x0001;
var COLLISION_PLAYER = 0x0002;
var COLLISION_MISSILE = 0x0004;
var COLLISION_ENEMY = 0x0008;
// FIXME there's a bit of duplication between unit and
// terrain cells.

class Cell {
   constructor(collisionGroup, collisionMask) {
      this.collisionGroup = collisionGroup;
      this.collisionMask = collisionMask || ~0;
   }

   impact(unit) {
   }

   resolve(unit) {
      var depth = Rectangle.overlap(unit, this);
      if (depth == null) {
         return false;
      }

      if (Math.abs(depth.y) < Math.abs(depth.x)) {
         unit.translate(0, depth.y);
         unit.velocity[1] = 0;
      } else {
         unit.translate(depth.x, 0);
      }

      return true;
   }

   collide(unit) {
      if (!unit || unit == this) {
         return false;
      }

      // if ((this.collisionGroup & unit.collisionGroup) == 0 && (unit.collisionGroup & this.collisionMask) == 0) {
      //    return false;
      // }

      if (this.index == 0) {
         return false;
      }

      if (!this.resolve(unit)) {
         return false;
      }

      this.impact(unit);
      unit.impact(this);

      return true;
   }
}
class Terrain {
   constructor(columns, rows, cells, data) {
      this.columns_ = columns;
      this.rows_ = rows;
      this.data_ = data;
      this.cells_ = cells;
   }

   get columns() {
      return this.columns_;
   }

   get rows() {
      return this.rows_;
   }

   get data() {
      return this.data_;
   }

   get(column, row) {
      return this.data_[row * this.columns + column];
   }

   collide(unit, callback) {
      var left = Math.floor(unit.x / 16);
      var right = Math.ceil((unit.x + unit.width) / 16) - 1;
      var top = Math.floor(unit.y / 16);
      var bottom = Math.ceil((unit.y + unit.height) / 16) - 1;

      var result = false;

      for (var y = top; y <= bottom; ++y) {
         for (var x = left; x <= right; ++x) {
            var index = this.get(x, y);

            var cell = this.cells_[index];
            if (cell == undefined) {
               continue;
            }

            cell.index = index;
            cell.x = x * 16;
            cell.y = y * 16;
            cell.width = 16;
            cell.height = 16;

            if (cell.collide(unit)) {
                result = true;
            }
         }
      }

      return result;
   }
}
class UnitBehavior {
   constructor() {
      this.id = null;
      this.x = 0;
      this.y = 0;
      this.width = 0;
      this.height = 0;
   }

   apply(unit) {
   }

   impact(unit, object) {
   }

   evaluate(unit, deltaTime) {
   }
}
// dummy behavior, to be replaced by effects system.
class SuicideUnitBehavior extends UnitBehavior {
   constructor() {
      super();
   }

   impact(unit, object) {
      if (unit.dead || object.dead) {
         return;
      }

      if (object.kill) {
         object.kill();
      }

      unit.kill();
   }
}
// Really simplified behavior.
class UnitWanderBehavior extends UnitBehavior {
   constructor() {
      this.unit = null;
   }

   collide(unit, object) {
      //
      //
      if(object.collisionGroup == COLLISION_GROUND && unit.wall) {
         unit.direction = (unit.direction == 'left') ? 'right' : 'left';
      }
   }

   evaluate(unit, deltaTime) {
      unit.move(unit.direction);
   }
}
class Unit {
   constructor() {
      this.type = '';

      this.owner = 0;
      this.level_ = null;

      this.collisionGroup = ~0;
      this.collisionMask = ~0;

      this.behaviors_ = [];

      this.heading_ = [0, 0];
      this.position_ = [0, 0];
      this.previous_ = [0, 0];

      this.velocity_ = [0, 0];
      this.size_ = [0, 0];

      this.dead_ = false;
      this.owner = 0;
      this.passive = false;

      this.width = 10;
      this.height = 10;
      this.mass = 1.0;
      this.direction = 'left';

      this.cooldowns = {
         weapon: 0
      };
   }

   get level() {
      return this.level_;
   }

   get gravity() {
      return this.gravity_ || level.gravity;
   }

   set gravity(value) {
      this.gravity_ = value;
   }

   get mover() {
      return this.mover_;
   }

   get position() {
      return this.position_;
   }

   get delta() {
      return [
         this.position_[0] - this.previous_[0],
         this.position_[1] - this.previous_[1]
      ];
   }

   get velocity() {
      return this.velocity_;
   }

   get heading() {
      return this.heading_;
   }

   get x() {
      return this.position[0];
   }

   get y() {
      return this.position[1];
   }

   get dead() {
      return this.dead_;
   }

   kill() {
      if (this.dead_) {
         return;
      }

      this.dead_ = true;
      this.dispatchEvent({
         type: 'UnitDied',
         unit: this,
      });
   }

   appendBehavior(behavior) {
      var behaviors = this.behaviors_;
      behaviors.push(behavior);
   }

   impact(unit) {
      if (this.y < unit.y) {
         this.standing = true;
      }

      if (this.delta[1] != 0) {
         this.velocity[1] = 0;
      } else if (this.delta[0] != 0) {
         this.velocity[0] = 0;
      }

      var behaviors = this.behaviors_;

      for (var i = 0; i < behaviors.length; i++) {
         behaviors[i].impact(this, unit);
      }
   }

   translate(x, y) {
      this.position[0] = this.position[0] + x;
      this.position[1] = this.position[1] + y;
   }

   resolve(unit) {
      var depth = Rectangle.overlap(this, unit);
      if (depth == null) {
         return false;
      }

      if (Math.abs(depth.y) < Math.abs(depth.x)) {
         this.translate(0, depth.y);
      } else {
         this.translate(depth.x, 0);
      }

      return true;
   }


   collide(unit) {
      if (unit == this) {
         return false;
      }

      if ((this.collisionGroup & unit.collisionGroup) == 0 && (unit.collisionGroup & this.collisionMask) == 0) {
         return false;
      }

      if (!this.resolve(unit)) {
         return false;
      }

      this.impact(unit);
      unit.impact(this);

      return true;
   }

   step(deltaTime) {
      this.previous_[0] = this.position_[0];
      this.previous_[1] = this.position_[1];

      if (this.dead) {
         return;
      }

      for (var key in this.cooldowns) {
         this.cooldowns[key] -= deltaTime;
      }

      var behaviors = this.behaviors_;
      for (var i = 0; i < behaviors.length; i++) {
         behaviors[i].evaluate(this, deltaTime);
      }

      this.velocity[1] = this.velocity[1] + ((980 * this.mass) * deltaTime);

      this.position[0] = this.position[0] + this.velocity[0] * deltaTime;
      this.position[1] = this.position[1] + this.velocity[1] * deltaTime;
   }

   move(direction) {
      var speed = 50;

      var heading = this.heading[0];

      if (direction == 'left') {
         this.heading[0] = -1;
      } else if (direction == 'right') {
         this.heading[0] = +1;
      }

      // no change needs to occur if the unit is already walking.
      if (this.heading[0] == heading && this.velocity[0] != 0) {
         return;
      }

      this.velocity[0] = this.heading[0] * speed;

      var event = {
         type: 'UnitAbility',
         ability: 'move'
      };

      this.dispatchEvent(event);
   }

   stop() {
      if (this.velocity[0] == 0) {
         return;
      }

      this.velocity[0] = 0;

      var event = {
         type: 'UnitAbility',
         ability: 'stop'
      };

      this.dispatchEvent(event);
   }

   jump() {
      if (this.standing) {
         this.velocity[1] = -375;
      }
   }

   shoot() {
      if (this.cooldowns.weapon > 0) {
         return;
      }

      var speed = 400;
      var missile = new Unit();

      missile.type = 'bullet';
      missile.owner = this.owner;
      missile.mass = 0.0;
      missile.width = 4;
      missile.height = 4;

      missile.position[0] = this.position[0];
      missile.position[1] = this.position[1];
      missile.appendBehavior(new SuicideUnitBehavior());

      missile.collisionGroup = COLLISION_MISSILE;
      missile.collisionMask = COLLISION_GROUND | COLLISION_ENEMY;

      missile.velocity[0] = this.heading[0] * speed;

      this.level.insertUnit(missile);
      this.cooldowns.weapon = 0.25;
   }
}

Object.mixin(Unit.prototype, EventDispatcher.prototype);
var stepSize = (1 / 60);

class Level {
   constructor() {
      this.units_ = [];
      this.terrain_ = null;
      this.accumulator = 0;
   }

   get terrain() {
      return this.terrain_;
   }

   set terrain(value) {
      if (this.terrain_ != value) {
         this.terrain_ = value;

         event = {
            type: 'TerrainChanged',
            terrain: this.terrain,
         };

         this.dispatchEvent(event);
      }
   }

   insertUnit(unit) {
      unit.world_ = this;

      var units = this.units_;
      units.push(unit);
      unit.level_ = this;

      this.dispatchEvent({
         type: 'UnitInserted',
         unit: unit,
      });

      return unit;
   }

   removeUnit(unit) {
      var units = this.units_;
      var index = units.indexOf(unit);
      units.splice(index, 1);

      this.dispatchEvent({
         type: 'UnitRemoved',
         unit: unit,
      });
   }

   step(deltaTime) {
      this.accumulator += deltaTime;

      while(this.accumulator >= stepSize) {
         var terrain = this.terrain_;
         var units = this.units_;

         // Integrate the units.
         for (var i = units.length - 1; i >= 0; i--) {
            var unit = units[i];

            unit.step(stepSize);

            // Since the terrain is static (for now anyhow),
            // it's fine to do those collisions as part of the integration here.
            terrain.collide(unit);
         }

         // Then sort the units by their position.
         units.sort(function(a, b) {
            return (a.y * a.x) - (b.y * b.x);
         });

         for (var i = units.length - 1; i >= 0; i--) {
            var unit = units[i];

            for (var j = units.length - 1; j >= 0; j--) {
               var other = units[j];

               // If the unit collides with the other
               // there is a chance the unit may be penetrating the terrain again.
               if (unit.collide(other)) {

                  // So we will do another pass at terrain collision,
                  // this might leave the units penetrating each other but thats better than
                  // penetrating the terrain.
                  if (terrain.collide(unit)) {
                     debugger;
                  }
               }
            }
         }

         this.accumulator -= stepSize;
      }
   }
}

Object.mixin(Level.prototype, EventDispatcher.prototype);
class Actor {
   constructor() {
      this.parent_ = null;
      this.children_ = [];
      this.position_ = [];
   }

   get parent() {
      return this.parent_
   }

   get stage() {
      return this.parent ? this.parent.stage : this;
   }

   get x() {
      return this.position[0];
   }

   get y() {
      return this.position[1];
   }

   prependChild(child) {
      var children = this.children_;

      children.unshift(child);
      child.parent_ = this;
   }

   appendChild(child) {
      var children = this.children_;

      children.push(child);
      child.parent_ = this;
   }

   removeChild(child) {
      var children = this.children_;
      var index = children.indexOf(child);
      children.splice(index, 1);
   }

   perform(deltaTime) {
      var children = this.children_;

      for (var i = 0; i < children.length; i++) {
         children[i].perform(deltaTime);
      }
   }
}
class Stage extends Actor {
   constructor() {
      super();

      this.display = null;
   }
}
// Draws a single layer of tiles.
class TileActor extends Actor {
   //
   //
   constructor(tileSheet) {
      super();

      this.tileSheet = tileSheet;
      this.data = [];
      this.columns = 0;
      this.rows = 0;
   }

   perform(deltaTime) {
      if (!this.tileSheet.complete) {
         return;
      }

      var context = this.stage.display.getContext('2d');

      for (var i = 0; i < this.columns; i++) {
         for (var j = 0; j < this.rows; j++) {
            var index = this.data[i + this.columns * j];

            context.drawTile(this.tileSheet, index, i * 16, j * 16, 16, 16);
         }
      }

      context.restore();

      super();
   }
}
class SpriteActor extends Actor {
   constructor(spriteSheet) {
      super();

      this.spriteSheet = spriteSheet;
      this.spriteAnimation = null;
      this.spriteAnimationFrame = 0;
      this.spriteAnimationFrameTime = 0;
   }

   setAnimationById(id) {
      if (this.spriteAnimation == this.spriteSheet.getAnimationById(id)) {
         return;
      }

      this.spriteAnimation = this.spriteSheet.getAnimationById(id);
      this.spriteAnimationFrame = 0;
      this.spriteAnimationFrameTime = 0;
   }

   playAnimation(deltaTime) {
      if (!this.spriteAnimation) {
         return;
      }

      this.spriteAnimationFrameTime += deltaTime;

      if (this.spriteAnimationFrameTime > 0.2) {
         this.spriteAnimationFrame++;
         this.spriteAnimationFrameTime = 0;

         if (this.spriteAnimationFrame == this.spriteAnimation.frames.length) {
            this.spriteAnimationFrame = 0;
         }
      }
   }

   perform(deltaTime) {
      if (!this.spriteSheet || !this.spriteAnimation) {
         return;
      }

      this.playAnimation(deltaTime);

      var context = this.stage.display.getContext('2d');
      var spriteFrame = this.spriteAnimation.frames[this.spriteAnimationFrame];
      context.drawSprite(this.spriteSheet, spriteFrame, this.x, this.y);

      super();
   }
}
function createCanvas(window) {
   var canvas = window.document.createElement('canvas');
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
   canvas.oncontextmenu = function(event) {
      event.preventDefault();
   };

   // Disable alpha;
   // canvas.getContext('2d', {alpha: false});

   document.body.appendChild(canvas);
   return canvas;
}

class Game {
   constructor(window) {
      this.window_ = window;
      this.display_ = createCanvas(this.window);
      this.states_ = new Array();

      // Register the required events.
         var events = ['keydown', 'keyup', 'keypress', 'blur', 'focus'];
      for (var event of events) {
         this.window.addEventListener(event, this.handleEvent.bind(this));
      }

      this.window.requestAnimationFrame(this.tick.bind(this));
   }

   get window() {
      return this.window_;
   }

   get display() {
      return this.display_;
   }

   pushState(state) {
      var states = this.states_;

      // Deactivate the current state, if any.
      if (states.length > 0) {
         states[this.states.length - 1].pause();
      }

      // Push the new state and activate it.
      states.push(state);
      states[states.length - 1].game_ = this;
      states[states.length - 1].activate();
   }

   popState() {
      var states = this.states_;

      if (stack.length > 0) {
         // Deactivate the current state.
         states[states.length - 1].deactivate();
         states[states.length - 1].game_ = null;

         // Then pop it of the stack.
         stack.pop();

         // Activate the preceeding state.
         if (stack.length > 0) {
            stack[stack.length - 1].activate();
         }
      }
   }

   changeState(state) {
      var states = this.states_;

      while(this.currentState) {
         this.popState();
      }

      this.pushState(state);
   }

   get currentState() {
      var states = this.states_;

      if (states.length > 0) {
         return states[states.length - 1];
      }

      return null;
   }

   handleEvent(event) {
      if (this.currentState) {
         this.currentState.handleEvent(event);
      }
   }

   tick(time) {
      var deltaTime = (time - (this.time || time)) / 1000;
      this.time = time;

      var currentState = this.currentState;

      if (currentState) {
         currentState.step(deltaTime);
         currentState.draw(deltaTime);
      }

      this.window.requestAnimationFrame(this.tick.bind(this));
   }
}
class GameAction {
   constructor(name, ...triggers) {
      this.name = name;
      this.triggers = triggers;
      this.value = 0;
   }

   handleEvent(event) {
      for (key in this.triggers) {
         var trigger = this.triggers[key];

         trigger.handleEvent(event);

         if (event.defaultPrevented) {
            this.value = trigger.value;
         }
      }
   }

   reset() {
      this.value = 0;
   }
}
class GameTrigger {
   constructor() {
      this.value = 0;
   }

   handleEvent(event) {
   }
}

class GameKeyTrigger {
   constructor(keyCode) {
      this.keyCode = keyCode;
   }

   handleEvent(event) {
      if (event.keyCode == this.keyCode) {
         if (event.type == 'keydown') {
            this.value = 1;
         } else if (event.type == 'keyup') {
            this.value = 0;
         }

         event.preventDefault();
      }
   }
}
class GameState {
   constructor(game) {
      this.game_ = null;
   }

   get game() {
      return this.game_;
   }

   get display() {
      return this.game.display;
   }

   handleEvent(event) {
   }

   activate() {
   }

   deactivate() {
   }

   draw() {
   }

   update() {
   }
}
var tileSize = 16;

class GamePlayState extends GameState {
   constructor() {
      this.actions = {
         'move-left': new GameAction('Move Left', new GameKeyTrigger(37)),
         'move-right': new GameAction('Move Right', new GameKeyTrigger(39)),
         'jump': new GameAction('Move Left', new GameKeyTrigger(38)),
         'shoot': new GameAction('Move Left', new GameKeyTrigger(32)),
      };

      this.level = new Level();

      var stage = new Stage();
      var tileSheet = new TileSheet();
      tileSheet.src = 'tilesheets/tech.json';

      this.level.addEventListener('TerrainChanged', function(event) {
         var actor = new TileActor(tileSheet);

         actor.data = event.terrain.data;
         actor.columns = event.terrain.columns;
         actor.rows = event.terrain.rows;

         stage.prependChild(actor);
      });

      var heroSpriteSheet = new SpriteSheet();
      heroSpriteSheet.src = 'spritesheets/hero.json';

      var enemySpriteSheet = new SpriteSheet();
      enemySpriteSheet.src = 'spritesheets/enemy.json';

      var bulletSpriteSheet = new SpriteSheet();
      bulletSpriteSheet.src = 'spritesheets/bullet.json';

      this.level.addEventListener('UnitInserted', function(event) {
         var unit = event.unit;

         if (unit.type == 'bullet') {
            var spriteSheet = bulletSpriteSheet;
         } else if (unit.type == 'enemy') {
            var spriteSheet = enemySpriteSheet;
         } else {
            var spriteSheet = heroSpriteSheet;
         }

         var actor = new SpriteActor(spriteSheet);
         actor.setAnimationById('idle');
         actor.position = unit.position;

         // XXX making sure the animation gets set.
         heroSpriteSheet.addEventListener('load', function() {
            actor.setAnimationById('idle');
         });

         unit.addEventListener('UnitDied', function() {
            stage.removeChild(actor);
         });

         unit.addEventListener('UnitRemoved', function() {
            stage.removeChild(actor);
         });

         event.unit.addEventListener('UnitAbility', function(ev) {
            if (ev.ability == 'move') {
               actor.setAnimationById('walk');
            } else if (ev.ability == 'stop') {
               actor.setAnimationById('idle');
            }
         });

         stage.appendChild(actor);
      });

      this.stage = stage;

      var data = new Int32Array([
         1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1,
         1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
         1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
         1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1,
         1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
         1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
         1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
         1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
         1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1,
         1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
         1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
         1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1,
      ]);

      var cells = [
         new Cell(COLLISION_NONE, COLLISION_NONE),
         new Cell(COLLISION_GROUND, COLLISION_PLAYER),
      ];

      this.level.terrain = new Terrain(16, 12, cells, data);

      this.playerUnit = new Unit();
      this.playerUnit.position[0] = 40;
      this.playerUnit.position[1] = 30;

      // debugging.
      window.$player = this.playerUnit;

      this.playerUnit.collisionGroup = COLLISION_PLAYER;
      this.playerUnit.collisionMask = COLLISION_GROUND;

      this.level.insertUnit(this.playerUnit);

      this.spawnTime = 0;
   }

   activate() {
      this.stage.display = this.display;
   }

   handleEvent(event) {
      for (var key in this.actions) {
         var action = this.actions[key];

         action.handleEvent(event);
      }
   }

   step(deltaTime) {
      if (this.actions['move-left'].value) {
         this.playerUnit.move('left');
      } else if (this.actions['move-right'].value) {
         this.playerUnit.move('right');
      } else {
         this.playerUnit.stop();
      }

      if (this.actions['jump'].value) {
         this.playerUnit.jump();
         this.actions['jump'].reset();
      }

      if (this.actions['shoot'].value) {
         this.playerUnit.shoot();
      }

      // simplistic respawn
      if (this.playerUnit.dead) {
         this.playerUnit.position[0] = 40;
         this.playerUnit.position[1] = 30;
      }

      // Simplistic spawn.
      this.spawnTime += deltaTime;
      if (this.spawnTime > 1) {
         var unit = new Unit();

         unit.type = 'enemy';
         unit.position[0] = (16 * 16) / 2;
         unit.collisionGroup = COLLISION_ENEMY;
         unit.collisionMask = COLLISION_GROUND | COLLISION_MISSILE;

         this.level.insertUnit(unit);
         unit.appendBehavior(new UnitWanderBehavior());
         this.spawnTime = 0;
      }

      this.level.step(deltaTime);
   }

   draw(deltaTime) {
      this.stage.display = this.display;

      var context = this.display.getContext('2d');

      context.setTransform( 1, 0, 0, 1, 0, 0 );
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);

      // var scale = Math.min(context.canvas.width / (this.level.terrain.columns * tileSize), context.canvas.height / (this.level.terrain.rows * tileSize));
      var scale = 3.0;

      context.translate(0.25, 0.25);
      context.scale(scale, scale);


      context.imageSmoothingEnabled = false;
      context.mozImageSmoothingEnabled = false;
      context.webkitImageSmoothingEnabled = false;

      this.stage.perform(deltaTime);
   }
}
class GamePauseState {
   constructor() {
   }

   step(deltaTime) {
      super();
   }

   draw(deltaTime) {
      super();
   }
}
