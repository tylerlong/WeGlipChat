import VueLoaderPlugin from 'vue-loader/lib/plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
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
          MiniCssExtractPlugin.loader,
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
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css'
    })
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  }
}
