const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const postcssPresetEnv = require('postcss-preset-env');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  devtool: 'eval-cheap-module-source-map',
  entry: {
    index: './src/index.tsx',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devServer: {
    hot: true,
    port: 3000,
    historyApiFallback: true,
    static: [
      './dist',
      { directory: './src/assets/js', publicPath: '/assets/js' },
    ],
  },
  module: {
    rules: [
      {
        test: /\.[t]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: {
              getCustomTransformers: () => ({
                before: [isDevelopment && ReactRefreshTypeScript()].filter(
                  Boolean
                ),
              }),
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]-[hash:base64:5]',
              },
              sourceMap: isDevelopment,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  postcssPresetEnv(),
                  require('autoprefixer'),
                  require('postcss-pxtorem')({
                    rootValue: 16,
                    propWhiteList: ['*'],
                    minPixelValue: 2,
                  }),
                ],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [postcssPresetEnv()],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader?name=static/images/[hash:8].[ext]',
          },
        ],
      },
    ],
  },
  plugins: [
    isDevelopment && new ReactRefreshWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new ProgressBarPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'public/index.html',
    }),
  ].filter(Boolean),

  resolve: {
    extensions: ['.js', '.jsx', '.es6', '.ts', '.tsx'],
    alias: {
      '@': path.resolve('src'),
    },
    fallback: { os: false },
  },
};
