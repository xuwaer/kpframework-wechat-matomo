const version = require('../package.json').version 
const path = require('path')

const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

const isDev = process.argv.indexOf('--develop') >= 0
const isWatch = process.argv.indexOf('--watch') >= 0
const demoSrc = path.resolve(__dirname, './demo')
const demoDist = path.resolve(__dirname, '../miniprogram_dev')
const src = path.resolve(__dirname, '../src')
const dev = path.join(demoDist, 'components')
const dist = path.resolve(__dirname, '../miniprogram_dist')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: ['index'],

  isDev,
  isWatch,
  srcPath: src, // 源目录
  distPath: isDev ? dev : dist, // 目标目录

  demoSrc, // demo 源目录
  demoDist, // demo 目标目录

  wxss: {
    less: false, // 使用 less 来编写 wxss
    sourcemap: false, // 生成 less sourcemap
  },

  webpack: {
    mode: 'production',
    output: {
      filename: '[name].js',
      libraryTarget: 'commonjs2',
    },
    target: 'node',
    externals: [nodeExternals()], // 忽略 node_modules
    module: {
      rules: [{
        test: /\.js$/i,
        use: [{
            loader: "babel-loader",
            query: {
              presets: ['es2015', 'stage-1'],
            }
          }
          // ,
          // 'eslint-loader'
        ], 
        exclude: /node_modules/
      }],
    },
    resolve: {
      modules: [src, 'node_modules'],
      extensions: ['.js', '.json'],
    },
    plugins: [ 
      new webpack.DefinePlugin({
        'process.env.sdkVersion': '"'+version+'"' 
    }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      }),
      new UglifyJsPlugin({
        uglifyOptions: {
            mangle: false,
            output: {
                beautify: true, 
            },
            warnings: false,
            compress: {
              drop_debugger: true,
              // drop_console: true
            }
        } 
    })
    ], 
    optimization: {
        minimize: false, 
    },
    // devtool: 'nosources-source-map', // 生成 js sourcemap
    performance: {
      hints: 'warning',
      assetFilter: assetFilename => assetFilename.endsWith('.js')
    }
  },

  copy: ['./images'], // 将会复制到目标目录
}