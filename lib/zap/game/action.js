export class GameAction {
   constructor(name) {
      var triggers = [].slice.call(arguments, 1);

      this.name = name;
      this.triggers = triggers;
      this.value = 0;
   }

   handleEvent(event) {
      for (var key in this.triggers) {
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
