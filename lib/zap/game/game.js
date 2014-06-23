function createCanvas(window) {
   var canvas = window.document.createElement('canvas');
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;

   document.body.appendChild(canvas);
   return canvas;
}

export class Game {
   constructor(window) {
      this.window_ = window;
      this.display_ = createCanvas(this.window);
      this.states_ = new Array();

      // Register the required events.
      var events = ['keydown', 'keyup', 'keypress', 'blur', 'focus'];
      for (var i = 0; i < events.length; i++) {
         var event = events[i];

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
         states[states.length - 1].deactivate();
      }

      // Push the new state and activate it.
      states.push(state);
      states[states.length - 1].game_ = this;
      states[states.length - 1].activate();
   }

   popState() {
      var states = this.states_;

      if (states.length > 0) {
         states[states.length - 1].deactivate();

         states.pop();

         if (states.length > 0) {
            states[states.length - 1].activate();
         }
      }
   }

   changeState(state) {
      var states = this.states_;

      while(states.length > 0) {
         states[states.length - 1].deactivate();
         states.pop();
      }

      this.pushState(state);
   }

   get currentState() {
      var states = this.states_;
      return states[states.length - 1] || null;
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
         currentState.evaluate(deltaTime);
         currentState.present(deltaTime);
      }

      this.window.requestAnimationFrame(this.tick.bind(this));
   }
}
