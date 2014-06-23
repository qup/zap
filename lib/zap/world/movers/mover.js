export class Mover {
   constructor() {
   }

   // XX move this to Unit as a static method?
   overlap(a, b, previous) {
      var position = (previous ? 'previous' : 'position');

      var halfWidthA = (a.width / 2);
      var halfHeightA = (a.height / 2);

      var halfWidthB = (b.width / 2);
      var halfHeightB = (b.height / 2);

      var left = ((b.x - halfWidthB) - (a[position].x + halfWidthA));
      var right = ((b.x + halfWidthB) - (a[position].x - halfWidthA));

      var top = ((b.y - halfHeightB) - (a[position].y + halfHeightA));
      var bottom = ((b.y + halfHeightB) - (a[position].y - halfHeightA));

      if ((left > 0 || right < 0) || (top > 0 || bottom < 0)) {
         return { x: 0, y: 0 };
      }

      return {
         x: ((Math.abs(left) < right) ? left : right),
         y: ((Math.abs(top) < bottom) ? top : bottom),
      };
   }

   resolve(unit, obj) {
      var overlap = this.overlap(unit, obj);
      if (overlap.x == 0 && overlap.y == 0) {
         return;
      }

      var previous = this.overlap(unit, obj, true);
      if ((previous.x == 0 && previous.y == 0) || (previous.x != 0 && previous.y != 0)) {
         if (Math.abs(overlap.x) < Math.abs(overlap.y)) {
            overlap.y = 0;
         } else {
            overlap.x = 0;
         }
      } else if (previous.x != 0) {
         overlap.x = 0;
      } else {
         overlap.y = 0;
      }

      // if (obj.translate) {
      //    overlap.x *= 0.5;
      //    overlap.y *= 0.5;
      //
      //    obj.translate(-overlap.x, -overlap.y);
      // }

      unit.translate(overlap.x, overlap.y);

      if (overlap.x !== 0) {
         if (overlap.x > 0) {
            unit.contact.left = obj;
         } else if (overlap.x < 0) {
            unit.contact.right = obj;
         }


         if (unit.delta.x == 0) {
            unit.velocity.x = 0; // -(unit.velocity.x);
         }
      }

      if (overlap.y !== 0) {
         if (overlap.y > 0) {
            unit.contact.bottom = obj;
         } else if (overlap.y < 0) {
            unit.contact.top = obj;
         }

         if (unit.delta.y == 0) {
            unit.velocity.y = -(unit.velocity.y) * 0;
         }
      }

      return overlap;
   }

   move(unit, target, time) {
   }

   integrate(unit, time) {

   }
}
