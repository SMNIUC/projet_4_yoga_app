import * as path from 'path';

export default {
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        loader: 'babel-loader',
        options: { 
          presets: ['@babel/preset-env', '@babel/preset-typescript'],
          plugins: ['istanbul']
        },
        enforce: 'post',
        include: path.join(__dirname, '..', 'src'),
        exclude: [
          /\.(e2e|spec)\.ts$/,
          /node_modules/,
          /(ngfactory|ngstyle)\.js/,
        ],
      },
    ],
  },
};
