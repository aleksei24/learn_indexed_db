const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

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

  module: {
    rules: [
      {
        test: /\.a[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },

  devtool: 'eval',
};
