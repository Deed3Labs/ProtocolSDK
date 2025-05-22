const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'protocol-sdk.bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'ProtocolSDK',
      type: 'umd',
      export: 'default'
    },
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  externals: {
    ethers: 'ethers'
  }
}; 