const path = require('path');
const Dotenv = require('dotenv-webpack');
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.js',
    firebase: './src/firebase.js',
    create_account: './src/create_account.js',
    sign_in: './src/sign_in.js',
    check_auth: './src/check_auth.js',
    resend_email: './src/resend_email.js',
    load_pdfs: './src/load_pdfs.js',
    admin_panel: './src/admin_panel.js',
    account_change_password: './src/account_change_password.js',
    change_name: './src/change_name.js',
    reset_password: './src/reset_password.js',
    div_dinamic: './src/div_dinamic_generation.js',
  },
  output: {
    path: path.resolve(__dirname, 'public/app'),
    filename: '[name].bundle.js',
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
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
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000, // 500 KiB
    maxAssetSize: 512000, // 500 KiB
  },
};

