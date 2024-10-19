const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
  },
  mode: 'development',
  plugins: [
    new Dotenv(), // Asegúrate de que esto esté aquí
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 3000,
    open: true,
  },
  module: {
    rules: [],
  },
};

