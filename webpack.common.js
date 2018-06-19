import VueLoaderPlugin from 'vue-loader/lib/plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

export default {
  entry: {
    index: ['babel-polyfill', './src/index.js']
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'css-loader'
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      favicon: './src/favicon.ico'
    }),
    new HtmlWebpackPlugin({
      filename: 'oauth.html',
      template: './src/oauth.html',
      inject: false
    }),
    new VueLoaderPlugin()
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  }
}
