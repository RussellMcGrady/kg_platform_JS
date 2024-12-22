'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const { VueLoaderPlugin } = require('vue-loader')
const vueLoaderConfig = require('./vue-loader.conf')
const webpack = require("webpack")
const ESLintPlugin = require('eslint-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const HtmlWebpackPlugin = require('html-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  externals: {
    'BMap': "BMap"
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath:
        process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.(?:js|mjs|cjs)$/,
        include: [
          resolve('src'),
          // add modules if vega* parse failed 
          resolve('node_modules/vega-embed/build'),
          resolve('node_modules/vega-label/build'),
          resolve('node_modules/vega-scenegraph/build'),
          resolve('node_modules/vega-tooltip/build'),
          resolve('node_modules/vfd/src/components/flow/designer')
        ],
        use: {
          loader: 'babel-loader'
          // options: {
          //   presets: [
          //     "@babel/preset-env",
          //     "@vue/babel-preset-jsx"
          //   ],
          //   plugins: [
          //     "@babel/plugin-transform-runtime",
          //     "@babel/plugin-transform-nullish-coalescing-operator",
          //     "@babel/plugin-transform-class-properties",
          //     "@babel/plugin-transform-optional-chaining"
          //   ]
          // }
        }
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [resolve('src/icons')],
        options: {
          symbolId: 'icon-[name]'
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        exclude: [resolve('src/icons')],
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
      // {
      //   test: /\.css$/i,
      //   use: [MiniCssExtractPlugin.loader, "css-loader"],
      // }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    // new MiniCssExtractPlugin(),
    // new HtmlWebpackPlugin(),
    new webpack.ProvidePlugin({
      jQuery:"jquery",
      $:"jquery"
    }),
    // new BundleAnalyzerPlugin(),
    new ESLintPlugin(
      {
        formatter: require('eslint-friendly-formatter'),
        emitWarning: !config.dev.showEslintErrorsInOverlay
      }
    )
  ],
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
