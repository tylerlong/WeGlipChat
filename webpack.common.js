import path from 'path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import VueLoaderPlugin from 'vue-loader/lib/plugin'

export default {
  entry: {
    index: ['babel-polyfill', './src/index.js']
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new ExtractTextPlugin('[name].bundle.css')
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  }
}
