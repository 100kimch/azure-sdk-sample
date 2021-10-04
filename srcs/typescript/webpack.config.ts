import * as webpack from 'webpack';

const isDevelopment = true;

export default {
  entry: __dirname + '/src/index.ts',
  resolve: {
    extensions: ['.json', '.ts', '.tsx', '.less', '.js', '.jsx'],
    modules: ['node_modules'],
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].[contenthash:8].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/react'],
              plugins: [
                isDevelopment ? 'react-refresh/babel' : undefined,
              ].filter(Boolean),
            },
          },
        ],
      },
      {
        test: /\.(jsx|ts|tsx)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [
                '@babel/preset-typescript',
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'entry',
                    corejs: 3,
                    targets: {
                      browsers: ['last 2 versions', '>= 5% in KR'],
                    },
                    // debug: true,
                  },
                ],
                '@babel/react',
              ],
              plugins: [
                ['@babel/plugin-proposal-decorators', { legacy: true }],
                ['@babel/plugin-proposal-class-properties', { loose: true }],
                'babel-plugin-styless',
                ['@babel/plugin-proposal-private-methods', { loose: true }],
              ].filter(Boolean),
            },
          },
        ],
      },
    ]
  }
} as webpack.Configuration;
