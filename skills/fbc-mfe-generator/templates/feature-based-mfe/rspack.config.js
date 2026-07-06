/**
 * rspack.config.js
 *
 * Configuración de Rspack para Module Federation + React 18 + TypeScript.
 * Variables de entorno centralizadas en: src/constants/environment.config.js
 * 
 * Ver documentación: https://rspack.dev/
 */

const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Carga el archivo .env.${NODE_ENV} desde el directorio actual
// Las variables del sistema (CI/CD) tienen prioridad sobre las del archivo
const envPath = path.join(
  __dirname,
  `.env.${process.env.NODE_ENV || 'development'}`
);

// =========================================
// 🔍 LOGGING: Validación de archivo .env
// =========================================
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
  // Mostrar el archivo que se está utilizando
  console.log(`📁 Using file: ${path.basename(envPath)}`);
}

// Solo carga desde archivo si no existe la variable en el sistema
const dotenvResult = dotenv.config({ path: envPath, override: false });

if (dotenvResult.error && envFileExists) {
  console.log('❌ Error loading .env file:', dotenvResult.error.message);
} else if (!dotenvResult.error && envFileExists) {
  console.log('✅ .env file loaded successfully');
}

const { rspack } = require('@rspack/core');
const { defineConfig } = require('@rspack/cli');

// Plugin de React Fast Refresh (HMR). Solo necesario si el MF usa React.
// Instalar con: bun add @rspack/plugin-react-refresh -D
// Nota: Se carga con dynamic import porque es un módulo ESM.
let RefreshPlugin;

// Configuración de Module Federation (nombre, exposes, remotes, shared).
// Se recomienda separarlo en su propio archivo para mantener esta config limpia.
// Archivo que lo provee: config/module-federation.config.js
const { mfConfig } = require('./module-federation.config.js');

// Objeto con las variables de entorno ya parseadas y sus valores por defecto.
// Proviene de: src/constants/environment.config.js
// Si NO tienes ese archivo todavía, reemplazá cada uso de Environment.xxx
// con el valor hardcodeado correspondiente (ver comentarios inline más abajo).
const Environment = require('./src/constants/environment.config.js');

// Targets de browsers para el transpilador SWC (builtin de Rspack).
// Ajustá según los browsers que necesite soportar tu MF.
const targets = ['chrome >= 87', 'edge >= 88', 'firefox >= 78', 'safari >= 14'];
const mode = process.env.NODE_ENV || "development";
const isDev = mode === 'development';
const isProduction = mode === "production";
module.exports = async () => {

  const { APP_PORT, APP_URL, APP_NAME, APP_PATH } = process.env;
  // Carga dinámica del plugin ESM
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
    // false: no genera sourcemaps inline. Los sourcemaps se manejan con SourceMapDevToolPlugin.
    devtool: false,
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
      // Puerto del dev server (configurado en environment.config.js)
      // Valor por defecto: 3000 (modificable vía .env.development)
      port: Environment.appPort,
      historyApiFallback: true,
      headers: {
        // CORS abierto en desarrollo para que el shell pueda consumir este MF.
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':
          'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers':
          'X-Requested-With, content-type, Authorization'
      }
    },
    module: {
      rules: [
        // Necesario para módulos ESM que no especifican extensión completa.
        {
          test: /\.m?js/,
          type: 'javascript/auto',
          resolve: { fullySpecified: false }
        },
        // Soporte para archivos CSS planos (incluyendo Tailwind).
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
          type: 'javascript/auto'
        },
        // Soporte para SASS/SCSS (con PostCSS para Tailwind).
        // Requiere: bun add sass-embedded sass-loader -D
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
        // Imágenes: Rspack las maneja como asset/resource de forma nativa, sin file-loader.
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset/resource'
        },
        // Fuentes: igual que imágenes, asset/resource nativo.
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: { filename: 'fonts/[hash][ext][query]' }
        },
        // TypeScript (.ts) — usa el loader builtin de Rspack (SWC).
        // NO uses babel-loader para TypeScript; builtin:swc-loader es más rápido y ya está incluido.
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
        // TypeScript con JSX (.tsx)
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
                  // Configuración para soportar Emotion (usado por Material UI v7)
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
      // Inyecta variables de entorno con prioridad: 1) Sistema/CI, 2) Archivo .env
      new rspack.DefinePlugin({
        'process.env': JSON.stringify(
          (() => {
            // =========================================
            // 🔍 LOGGING: Variables finales a inyectar
            // =========================================
            const finalVars = Object.keys(Environment.defaults).reduce((acc, key) => {
              // Prioridad: process.env (CI/CD) > Environment.defaults (archivo .env)
              acc[key] = process.env[key] ?? Environment.defaults[key];
              return acc;
            }, {});

            return finalVars;
          })()
        )
      }),
      //
      new rspack.container.ModuleFederationPlugin(mfConfig),
      new rspack.HtmlRspackPlugin({ template: './src/index.html' }),
      !isDev
        ? new rspack.SourceMapDevToolPlugin({
          noSources: false,
          filename: '../dist_sourcemaps/[file].map'
        })
        : null
    ].filter(Boolean) // Elimina los null del array (plugins condicionales).
  });
};
