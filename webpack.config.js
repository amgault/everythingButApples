var path = require("path");

module.exports = {
  entry: './src/public/js/index.js',
  devServer: {
    contentBase: './dist'
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
      rules: [
          {
              test: /\.css$/,
              exclude: /node_modules/,
              use: [
                  {
                      loader: 'style-loader',
                  },
                  {
                      loader: 'css-loader',
                      options: {
                          importLoaders: 1,
                      }
                  },
                  {
                      loader: 'postcss-loader'
                  }
              ]
          }
      ]
  }
}