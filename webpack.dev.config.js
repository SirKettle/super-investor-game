var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var WebpackSynchronizableShellPlugin = require('webpack-synchronizable-shell-plugin');

module.exports = {
  entry: path.join(__dirname, 'src/app.ts'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'game.js'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      pixi: path.join(__dirname, 'node_modules/phaser-ce/build/custom/pixi.js'),
      phaser: path.join(
        __dirname,
        'node_modules/phaser-ce/build/custom/phaser-split.js'
      ),
      p2: path.join(__dirname, 'node_modules/phaser-ce/build/custom/p2.js'),
      assets: path.join(__dirname, 'assets/')
    }
  },
  plugins: [
    new WebpackSynchronizableShellPlugin({
      onBuildStart: {
        scripts: ['npm run assets:dev'],
        blocking: true,
        parallel: false
      }
    }),
    new webpack.DefinePlugin({
      DEBUG: true
    }),
    new CleanWebpackPlugin([path.join(__dirname, 'dist')]),
    new HtmlWebpackPlugin({
      title: 'Super Investor Game!',
      template: path.join(__dirname, 'templates/index.ejs')
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    inline: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: true,
      ignored: /node_modules/
    }
  },
  module: {
    rules: [
      { test: /\.ts$/, enforce: 'pre', loader: 'tslint-loader' },
      { test: /assets(\/|\\)/, loader: 'file-loader?name=assets/[hash].[ext]' },
      { test: /pixi\.js$/, loader: 'expose-loader?PIXI' },
      { test: /phaser-split\.js$/, loader: 'expose-loader?Phaser' },
      { test: /p2\.js$/, loader: 'expose-loader?p2' },
      { test: /\.ts$/, loader: 'ts-loader', exclude: '/node_modules/' }
    ]
  },
  devtool: 'source-map'
};
