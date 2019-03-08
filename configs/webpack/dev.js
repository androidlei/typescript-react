process.env.NODE_ENV = 'development';
const merge = require('webpack-merge');
const webpack = require('webpack');
const commonConfig = require('./common');
const path = require('path');

module.exports = merge(commonConfig, {
   mode: 'development',
   entry: [
       './app.tsx'
   ],
   devServer: {
       hot: true,
       contentBase: path.resolve('public'),
       publicPath: '/',
   },
   devtool: 'cheap-module-eval-source-map',
   plugins: [
       new webpack.HotModuleReplacementPlugin(),
       new webpack.NamedModulesPlugin(),
   ]
});
