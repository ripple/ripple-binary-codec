const webpack = require('webpack')

module.exports = {
  entry: './test/browser/test-bundler.js',
  output: {
    path: __dirname + "/test/browser",
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\test.js$/,
        use: 'mocha-loader',
      }
    ],
  },
  resolve: {
    fallback: {
      "buffer": require.resolve("buffer"),
      "assert": require.resolve("assert"),
      "stream": require.resolve("stream-browserify")
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.NODE_DEBUG': JSON.stringify(process.env.NODE_DEBUG)
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    })
  ]
};