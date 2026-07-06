const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load .env file based on NODE_ENV
const envPath = path.join(__dirname, `.env.${process.env.NODE_ENV || 'development'}`);

// Environment variable logging (optional - remove in production)
console.log('\n=========================================');
console.log('🔍 RSPACK ENV VARIABLES DEBUG');
console.log('=========================================');
console.log(`📂 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`📄 .env file path: ${envPath}`);
console.log(`📄 .env absolute path: ${path.resolve(envPath)}`);

const envFileExists = fs.existsSync(envPath);
console.log(`${envFileExists ? '✅' : '❌'} .env file exists: ${envFileExists}`);

if (!envFileExists) {
  console.log('⚠️  WARNING: .env file not found! Using default values from environment.config.js');
} else {
  console.log(`📁 Using file: ${path.basename(envPath)}`);
}

// Load environment variables (system vars have priority)
const dotenvResult = dotenv.config({ path: envPath, override: false });

if (dotenvResult.error && envFileExists) {
  console.log('❌ Error loading .env file:', dotenvResult.error.message);
} else if (!dotenvResult.error && envFileExists) {
  console.log('✅ .env file loaded successfully');
  console.log('\n📋 Variables loaded from .env file:');
  Object.keys(dotenvResult.parsed || {}).forEach(key => {
    console.log(`  - ${key}: ${dotenvResult.parsed[key]}`);
  });
}

const { rspack } = require('@rspack/core');
const { defineConfig } = require('@rspack/cli');

// Import environment configuration
const Environment = require('./src/constants/environment.config');

// Import Module Federation config
const { mfConfig } = require('./module-federation.config.js');

// Browser targets for SWC
const targets = ['chrome >= 87', 'edge >= 88', 'firefox >= 78', 'safari >= 14'];
const mode = process.env.NODE_ENV || "development";
const isDev = mode === 'development';

module.exports = async () => {
  let RefreshPlugin;
  
  // Load React Refresh plugin for development
  if (isDev) {
    const { ReactRefreshRspackPlugin } = await import('@rspack/plugin-react-refresh');
    RefreshPlugin = ReactRefreshRspackPlugin;
  }

  return defineConfig({
    mode: mode,
    entry: './src/index.ts',
    output: {
      uniqueName: Environment.appName,
      publicPath: 'auto',
      path: path.resolve(process.cwd(), "dist"),
      clean: true,
      assetModuleFilename: "images/[hash][ext][query]",
      chunkFilename: "[name].[contenthash].js",
    },
    devtool: false, // Use SourceMapDevToolPlugin for better control
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
      alias: {
        '@context': path.resolve(__dirname, 'src/context'),
        '@core': path.resolve(__dirname, 'src/core'),
        '@features': path.resolve(__dirname, 'src/features'),
        '@shared': path.resolve(__dirname, 'src/shared'),
        '@infrastructure': path.resolve(__dirname, 'src/infrastructure'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@types': path.resolve(__dirname, 'src/types')
      }
    },
    optimization: {
      removeAvailableModules: true,
      minimize: true,
    },
    devServer: {
      port: Environment.appPort,
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
      }
    },
    module: {
      rules: [
        // ESM modules without full extension
        {
          test: /\.m?js/,
          type: 'javascript/auto',
          resolve: { fullySpecified: false }
        },
        // Plain CSS (including Tailwind)
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
          type: 'javascript/auto'
        },
        // SASS/SCSS with PostCSS
        {
          test: /\.s[ac]ss$/i,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader',
            {
              loader: 'sass-loader',
              options: {
                api: 'modern-compiler',
                implementation: require.resolve('sass-embedded')
              }
            }
          ],
          type: 'javascript/auto'
        },
        // Images
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset/resource'
        },
        // Fonts
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: { filename: 'fonts/[hash][ext][query]' }
        },
        // TypeScript (.ts) - Use builtin SWC loader
        {
          test: /\.(j|t)s$/,
          exclude: /node_modules/,
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: { syntax: 'typescript' },
              transform: {
                react: {
                  runtime: 'automatic',
                  development: isDev,
                  refresh: isDev,
                }
              }
            },
            env: { targets }
          }
        },
        // TypeScript with JSX (.tsx)
        {
          test: /\.(j|t)sx$/,
          exclude: /node_modules/,
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: { syntax: 'typescript', tsx: true },
              transform: {
                react: {
                  runtime: 'automatic',
                  development: isDev,
                  refresh: isDev,
                  // For Emotion (Material UI v7)
                  importSource: '@emotion/react'
                }
              }
            },
            env: { targets }
          }
        }
      ]
    },
    plugins: [
      isDev ? new RefreshPlugin() : null,
      // Inject environment variables
      new rspack.DefinePlugin({
        'process.env': JSON.stringify(
          (() => {
            const finalVars = Object.keys(Environment.defaults).reduce((acc, key) => {
              acc[key] = process.env[key] ?? Environment.defaults[key];
              return acc;
            }, {});

            console.log('\n🔧 System environment variables (process.env):');
            const systemVars = Object.keys(Environment.defaults).filter(key => process.env[key] !== undefined);
            if (systemVars.length > 0) {
              systemVars.forEach(key => {
                console.log(`  - ${key}: ${process.env[key]}`);
              });
            } else {
              console.log('  (none - all variables will use .env file or defaults)');
            }

            console.log('\n📊 Final variables to inject into bundle:');
            Object.keys(finalVars).forEach(key => {
              const source = process.env[key] !== undefined 
                ? '🔵 from system/CI' 
                : (dotenvResult.parsed && dotenvResult.parsed[key] !== undefined)
                  ? '🟢 from .env file'
                  : '🔴 using default';
              console.log(`  ${source.padEnd(20)} ${key}: ${finalVars[key]}`);
            });

            console.log('=========================================\n');

            return finalVars;
          })()
        )
      }),
      // Module Federation
      new rspack.container.ModuleFederationPlugin(mfConfig),
      // HTML Plugin
      new rspack.HtmlRspackPlugin({ template: './src/index.html' }),
      // Source Maps (production only)
      !isDev
        ? new rspack.SourceMapDevToolPlugin({
          noSources: false,
          filename: '../dist_sourcemaps/[file].map'
        })
        : null
    ].filter(Boolean)
  });
};
