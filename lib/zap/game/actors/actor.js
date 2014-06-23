export class Actor {
   constructor() {
      this.parent_ = null;
      this.children_ = [];
      this.position_ = { x: 0, y: 0 };
   }

   get parent() {
      return this.parent_;
   }

   get stage() {
      return this.parent ? this.parent.stage : this;
   }

   get x() {
      return this.position.x;
   }

   get y() {
      return this.position.y;
   }

   get children() {
      var children = this.children_;
      return children.slice(0);
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

   present(deltaTime) {
      var children = this.children_;

      for (var i = 0; i < children.length; i++) {
         var child = children[i];
         child.present(deltaTime);
      }
   }
}
