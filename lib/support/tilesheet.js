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
EventDispatcher.prototype.apply(TileSheet.prototype);

window.CanvasRenderingContext2D.prototype.drawTile = function(tileSheet, index, x, y, width, height) {
   var tileWidth = tileSheet.image.width / tileSheet.columns;
   var tileHeight = tileSheet.image.height / tileSheet.rows;

   var tileX = Math.floor(index % (tileSheet.image.width / tileWidth)) * tileWidth;
   var tileY = Math.floor(index / (tileSheet.image.width / tileWidth)) * tileHeight;

   this.drawImage(tileSheet.image, tileX, tileY, tileWidth, tileHeight, x - (width / 2), y - (height / 2), width, height);
};

window.TileSheet = TileSheet;
