const path = require('path');

module.exports = {
  mode: 'development',

  entry: './src/index.js',

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'out'),
    clean: { dry: true },
  },

  devServer: {
    port: 9000,
    static: false,
  },
};
