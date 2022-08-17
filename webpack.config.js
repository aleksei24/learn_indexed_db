const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
    open: true,
    hot: false,
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Learning IndexedDB',
      template: './src/index.html',
      favicon: './src/fav/fav.png',
    }),
  ],
};
