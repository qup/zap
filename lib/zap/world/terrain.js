export class Terrain extends EventDispatcher {
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

   get cells() {
      return this.cells_;
   }

   get(column, row) {
      return this.data_[row * this.columns + column];
   }

   collide(unit) {
      var left = Math.floor((unit.x - (unit.width / 2)) / 16);
      var right = Math.ceil((unit.x + (unit.width / 2)) / 16) - 1;
      var top = Math.floor((unit.y - (unit.height / 2)) / 16);
      var bottom = Math.ceil((unit.y + (unit.height / 2)) / 16) - 1;

      var result = false;

      for (var y = top; y <= bottom; ++y) {
         for (var x = left; x <= right; ++x) {
            var index = this.get(x, y);

            var cell = this.cells_[index];
            if (cell == undefined) {
               continue;
            }

            cell.index = index;
            cell.x = (x * 16) + 8;
            cell.y = (y * 16) + 8;
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
