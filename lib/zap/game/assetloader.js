export class GameAssetLoader {
   constructor() {
      this.cache = {};
      this.loaders = {};
   }

   get total() {
      return Object.keys(this.loaders).length;
   }

   get loaded() {
      return Object.keys(this.cache).length;
   }

   get complete() {
      return this.loaded == this.total;
   }

   queueJSON(path) {
      var that = this;

      this.loaders[path] = function() {
         var request = new XMLHttpRequest();

         request.addEventListener('load', function(event) {
            that.cache[path] = JSON.parse(request.responseText);
         });

         request.open('GET', path, true);
         request.send();
      };
   }

   queueTileSheet(path) {
      var that = this;

      this.loaders[path] = function() {
         var tileSheet = new TileSheet();

         tileSheet.addEventListener('load', function(event) {
            that.cache[path] = this;
         });

         tileSheet.src = path;
      };
   }

   queueSpriteSheet(path) {
      var that = this;

      this.loaders[path] = function() {
         var spriteSheet = new SpriteSheet();

         spriteSheet.addEventListener('load', function(event) {
            that.cache[path] = this;
         });

         spriteSheet.src = path;
      };
   }

   load() {
      for (var key in this.loaders) {
         var loader = this.loaders[key];
         loader();
      }
   }

   get(path) {
      return this.cache[path];
   }
}
