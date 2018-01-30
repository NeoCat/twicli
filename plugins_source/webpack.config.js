const webpack = require('webpack');
const uglifyjs = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    "autocomplete": "./plugins/autocomplete/autocomplete.js"
  },
  output: {
    path: __dirname + "/../plugins",
    filename: "[name].js"
  },
  plugins: [
    new uglifyjs()
  ]
}