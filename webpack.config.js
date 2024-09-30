const path = require('path');

const umdConfig = {
  mode: 'production',
  entry: './src/differify.ts',
  output: {
    path: path.resolve(__dirname, 'dist', 'umd'),
    filename: 'differify.umd.js',
    libraryTarget: 'umd',
    library: 'Differify',
    umdNamedDefine: true,
    globalObject: 'this',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ],
  },
  externals: {}
};

const commonjsConfig = {
    mode: 'production',
    entry: './src/differify.ts',
    output: {
        path: path.resolve(__dirname, 'dist', 'commonjs'),
        filename: 'differify.commonjs.js',
        libraryTarget: 'commonjs2',
        libraryExport: 'default',
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
    }
};

module.exports = [commonjsConfig, umdConfig];
