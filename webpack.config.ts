import path from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { VueLoaderPlugin } from 'vue-loader';
// @ts-expect-error no types
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

type Configuration = webpack.Configuration;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const baseConfig: Configuration = {
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].chunk.js',
    clean: true,
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.vue', '.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@widgets': path.resolve(__dirname, 'src/widgets'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@entities': path.resolve(__dirname, 'src/entities'),
      '@shared': path.resolve(__dirname, 'src/shared'),
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
          compilerOptions: { noEmit: false },
        },
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              additionalData: `
                @use "@/shared/styles/variables" as *;
                @use "@/shared/styles/mixins/flex" as *;
                @use "@/shared/styles/mixins/media" as *;
                @use "@/shared/styles/mixins/spacing" as *;
              `,
              sassOptions: {
                includePaths: [path.resolve(__dirname, 'src')],
                silenceDeprecations: ['legacy-js-api'],
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
      inject: 'body',
    }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](vue|vue-router|element-plus|axios)[\\/]/,
          name: 'vendors',
        },
      },
    },
  },
};

const devConfig = {
  mode: 'development' as const,
  devtool: 'eval-cheap-module-source-map' as const,
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
};

const prodConfig: Configuration = {
  mode: 'production',
  devtool: 'source-map',
};

export default (env: { analyze?: boolean } & Record<string, unknown>, argv: { mode?: string }) => {
  const isProd = argv.mode === 'production';
  const config = merge(baseConfig, isProd ? prodConfig : devConfig);

  if (env?.analyze) {
    const c = config as Configuration;
    c.plugins = c.plugins ?? [];
    c.plugins.push(new BundleAnalyzerPlugin());
  }

  return config;
};
