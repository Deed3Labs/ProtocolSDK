const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'protocol-sdk.min.js',
    path: path.resolve(__dirname, 'dist/umd'),
    library: 'ProtocolSDK',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'ethers': 'ethers'
  }
}; 