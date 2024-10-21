const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
    firebase: './src/firebase.js',
    create_account: './src/create_account.js',
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].bundle.js',
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

