class SpriteSheetAnimation {
   constructor() {
      this.frames = [];
   }
}

class SpriteSheetFrame {
   costructor(top, left, right, bottom) {
      this.top = top || 0;
      this.left = left || 0;
      this.right = right || 0;
      this.bottom = bottom || 0;
   }
}

class SpriteSheet {
   constructor(image, animations, frames) {
      this.image_ = null;
      this.frames_ = [];
      this.animations_ = {};
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

EventDispatcher.prototype.apply(SpriteSheet.prototype);

window.CanvasRenderingContext2D.prototype.drawSprite = function(spriteSheet, index, x, y, scaleX, scaleY) {
   var spriteBounds = spriteSheet.getFrameByIndex(index);

   var spriteWidth = spriteBounds.right - spriteBounds.left;
   var spriteHeight = spriteBounds.bottom - spriteBounds.top;

   var spriteX = spriteBounds.left;
   var spriteY = spriteBounds.top;

   this.save();
   this.translate(x, y);
   this.scale(scaleX || 1, scaleY || 1);

   this.drawImage(spriteSheet.image, spriteX, spriteY, spriteWidth, spriteHeight, -(spriteWidth / 2), -(spriteHeight / 2), spriteWidth, spriteHeight);
   this.restore();
};

window.SpriteSheet = SpriteSheet;
window.SpriteSheetFrame = SpriteSheetFrame;
window.SpriteSheetAnimation = SpriteSheetAnimation;
