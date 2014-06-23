module.exports = {
   entry: [
      './lib/zap/game',
      './lib/zap/world',
      './src/game.js',
   ],

   output: {
      path: './dist',
      filename: 'game.js',
      library: 'zap',
      libraryTarget: 'var',
   },

   resolve: {
      modulesDirectories: [
         'lib',
         'node_modules'
      ],
   },

   module: {
      loaders: [
         {
            test: /\.js$/,
            loader: "transform/cacheable?es6-modules-commonjs"
         },
         {
            test: /\.js$/,
            loader: "transform/cacheable?es6-class"
         },
      ]
   }
};
