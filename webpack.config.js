const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
    firebase: './src/firebase.js',
    create_account: './src/create_account.js',
    sign_in: './src/sign_in.js',
    check_auth: './src/check_auth.js',
    resend_email: './src/resend_email.js',
    load_pdfs: './src/load_pdfs.js',
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].bundle.js',
  },
  mode: 'development',
  plugins: [
    new Dotenv(safe = true),
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

