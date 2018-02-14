// TODO не забыть про обертку над хешами и про настроку js babel

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isDevelopment = !process.env.production;
const assetsPath = path.join(__dirname, '/public');

const extractSass = new ExtractTextPlugin({
  filename: '[name].css',
  disable: isDevelopment
});

// const CopyWebpackconfig = new CopyWebpackPlugin([
//   {
//     from: 'src/img',
//     to: 'img',
//   },
//   {
//     from: 'src/fonts',
//     to: 'fonts',
//   }
// ]);


const config = {
  entry: {
    main: './src/js/index.js',
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public')
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: [/node_modules/],
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            ["latest", {
              "es2016": false,
              "es2017": false
            }]
          ]
        }
      }]
    }, {
      test: /\.scss$/,
      exclude: [/node_modules/],
      use: extractSass.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            minimize: !isDevelopment
          }
        },
          'group-css-media-queries-loader',
          'sass-loader',
          'resolve-url-loader',
        ]
      })
    }]
  },
  plugins: [
    // new webpack.ProvidePlugin({
    //   _: 'lodash'
    // }),
    extractSass,
    // CopyWebpackconfig
  ],
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 9000
  }
};

if (isDevelopment) {
  fs.readdirSync(assetsPath)
      .map((fileName) => {
        if (['.css', '.js'].includes(path.extname(fileName))) {
          console.log(`${fileName} 123 321`);
          return fs.unlinkSync(`${assetsPath}/${fileName}`);
        }

        return '';
      });
} else {
  config.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_console: true,
          unsafe: true
        }
      })
  );
}

module.exports = config;