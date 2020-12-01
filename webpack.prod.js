const HtmlWebpackPlugin = require("html-webpack-plugin");
const { request } = require("http");
const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = function (env, argv) {
  const isEnvDevelopment = argv.mode === "development" || !argv.mode;
  const isEnvProduction = argv.mode === "production";
  const webpack = require('webpack')

  return {
    mode: isEnvProduction ? "production" : isEnvDevelopment && "development",
    
    devtool: isEnvProduction
      ? "source-map"
      : isEnvDevelopment && "cheap-module-source-map",
    entry: "./src/index.jsx",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),
    },
    // devServer: {
    //   contentBase: "./dist",
    //   hot: true
    // },
    module: {
      rules: [
        {
          test: /\.jsx$/,
          exclude: /node_modules/,
          enforce: "pre",
          use: "babel-loader",
        },
        {
          test: /\.css$/,
          include:[path.resolve(__dirname,'src/styles'),/node_modules/],
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader","postcss-loader"
          ]
        },
        {
          test: /\.css$/,
          exclude:[path.resolve(__dirname,'src/styles'),/node_modules/],
          use:[ MiniCssExtractPlugin.loader,"css-loader?modules","postcss-loader"]
        },
        {
          test: /\.less$/,
          include:[path.resolve(__dirname,'src/styles'),/node_modules/],
          use: [
            "style-loader","css-loader","postcss-loader","less-loader"
          ]
        },
        {
          test: /\.less$/,
          exclude:[path.resolve(__dirname,'src/styles'),/node_modules/],
          use:["style-loader","css-loader?modules","postcss-loader","less-loader"]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: ["file-loader"]
        },
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
          loader: "url-loader",
          options: {
            limit: 10000
          }
        }

      ],
    },
    optimization:{
      splitChunks:{
        chunks:'all',
        name:true,
        cacheGroups:{
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        },
      },

    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "public/index.html",
      }),
    //   new webpack.NamedChunksPlugin(),
    //   new webpack.HotModuleReplacementPlugin(),
      new MiniCssExtractPlugin({
          filename:'[name].[contenthash:8].css',
          chunkFilename:'[name].[contenthash:8].chunk.css',          
      }),
      new BundleAnalyzerPlugin(),
    ],
  };
};