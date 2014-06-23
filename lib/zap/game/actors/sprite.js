import { Actor } from './actor';

export class SpriteActor extends Actor {
   constructor(spriteSheet) {
      super();

      this.spriteSheet = spriteSheet;
      this.spriteAnimation = null;
      this.spriteAnimationFrame = 0;
      this.spriteAnimationFrameTime = 0;
      this.scale = { x: 1, y: 1 };
   }

   setAnimationById(id) {
      if (this.spriteAnimation == this.spriteSheet.getAnimationById(id)) {
         return;
      }

      this.spriteAnimation = this.spriteSheet.getAnimationById(id);
      this.spriteAnimationFrame = 0;
      this.spriteAnimationFrameTime = 0;
   }

   playAnimation(time) {
      if (!this.spriteAnimation) {
         return;
      }

      this.spriteAnimationFrameTime += time;

      if (this.spriteAnimationFrameTime > 0.2) {
         this.spriteAnimationFrame++;
         this.spriteAnimationFrameTime = 0;

         if (this.spriteAnimationFrame == this.spriteAnimation.frames.length) {
            this.spriteAnimationFrame = 0;
         }
      }
   }

   present(time) {
      if (!this.spriteSheet || !this.spriteAnimation) {
         return;
      }

      this.playAnimation(time);

      var context = this.stage.display.getContext('2d');
      var spriteFrame = this.spriteAnimation.frames[this.spriteAnimationFrame];

      context.drawSprite(this.spriteSheet, spriteFrame, this.x, this.y, this.scale.x, this.scale.y);

      // context.drawArc(this.x, this.y, 100, );

      super(time);
   }
}
