const path = require("path");
const webpack = require("webpack");

module.exports = () => {
  const config = {
    entry: { 
      main: './src/index.ts'
    },
    output: {
      filename: "geminid.js",
      path: path.resolve(__dirname, "dist"),
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
    mode: 'production',
    devtool: 'source-map',
    resolve: {
      extensions: ['.ts', '.js', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [{
              loader: 'ts-loader',
          }],
          exclude: /node_modules/,
        }
      ],
    },
    plugins: [
      new webpack.SourceMapDevToolPlugin({
        exclude: ['higlass']
      }),
    ]
  };
  return config;
};