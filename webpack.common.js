import VueLoaderPlugin from 'vue-loader/lib/plugin'
import ExtractCssChunksPlugin from 'extract-css-chunks-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

export default {
  entry: {
    index: ['babel-polyfill', './src/index.js']
  },
  output: {
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          ExtractCssChunksPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      favicon: './src/favicon.png'
    }),
    new HtmlWebpackPlugin({
      filename: 'oauth.html',
      template: './src/oauth.html',
      inject: false
    }),
    new VueLoaderPlugin(),
    new ExtractCssChunksPlugin({
      filename: '[name].bundle.css'
    })
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  }
}
