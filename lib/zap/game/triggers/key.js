export class GameKeyTrigger {
   constructor(keyCode) {
      this.keyCode = keyCode;
   }

   handleEvent(event) {
      if (event.keyCode == this.keyCode) {
         if (event.type == 'keydown') {
            this.value = 1;
            console.log('keydown');
         } else if (event.type == 'keyup') {
            this.value = 0;
         }

         event.preventDefault();
      }
   }
}
