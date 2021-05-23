import * as path from 'path';
import * as webpack from 'webpack';

// just in case you run into any typescript error when configuring `devServer`
import 'webpack-dev-server';

const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { StatsWriterPlugin } = require("webpack-stats-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');


import rules_factory from './rules';

var PACKAGE = require('../package.json');
var PACKAGE_VERSION = PACKAGE.version;

const PROJECT_ROOT = process.cwd();

const SERVER_STATS_NAME = 'server_stats.json';
const CLIENT_STATS_NAME = 'client_stats.json';

const SERVE_IP = '0.0.0.0'
const SERVE_PORT = 9000;

const stats = 'errors-warnings';

// const stats = 'verbose';

const resolve = {
    extensions: [
        '.jsx', '.js', '.tsx', '.ts', '.mjs', '.cjs', '.json', '.css', '.jss', '.scss', '.less', '.wasm'],
    modules: ["node_modules",],
    roots: [
        path.resolve(PROJECT_ROOT, 'src'),
        path.resolve(PROJECT_ROOT, 'server'),
        path.resolve(PROJECT_ROOT, 'src/styles')],
    alias: {
        '@styles': path.resolve(PROJECT_ROOT, 'src/styles'),
        '@app': path.resolve(PROJECT_ROOT, 'src'),
        '@core': path.resolve(PROJECT_ROOT, 'src/core')
    },
    unsafeCache: false
}


const server_config_factory = (mode: string, env: any, options: any) => {
    const plugins = [
        // new webpack.ProgressPlugin(),
        new CleanWebpackPlugin(),
        // new HtmlWebpackPlugin({
        //     title: 'Development',
        //     // template: 'public/index.html'
        // }),
        new StatsWriterPlugin({
            filename: SERVER_STATS_NAME, // Default
            stats: {
                all: false,
                assets: true
            }
        }),
        new webpack.DefinePlugin({
            __VERSION__: JSON.stringify(PACKAGE_VERSION),
            __BUILD_TS__: new Date().getTime(),
            __BUILD_DT__: JSON.stringify(new Date().toISOString()),
            __SERVE_HOST__: options.host || SERVE_IP,
            __SERVE_PORT__: options.port || SERVE_PORT,
            __DEVELOPMENT__: mode == 'development',
            __IS_SERVER__: true
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css",
        })
    ];

    const rules = rules_factory('node', PROJECT_ROOT, "tsconfig.server.json");
    let OPTIMIZATIONS = {}

    if (mode == 'production') {
        OPTIMIZATIONS = {
            ...OPTIMIZATIONS,
            minimize: true,
            minimizer: [
                new CssMinimizerPlugin()],
            // splitChunks: {
            //     chunks: 'all',
            // }
        }
    }

    return {
        mode: mode,

        stats: stats,

        resolve: resolve,
        module: {
            rules: rules,
        },
        entry: {
            server: './src/server.tsx'
        },
        output: {
            filename: '[name].js',
            path: path.resolve(PROJECT_ROOT, 'dist/server'),
        },
        performance: {
            hints: false,
        },
        plugins: plugins,
        target: 'node',
        externals: [nodeExternals()],
    }
};

const client_config_factory = (mode: string, env: any, options: any) => {
    let OPTIMIZATIONS = {}

    const plugins = [
        new CleanWebpackPlugin(),
        // new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({
            title: 'Development',
            // template: 'public/index.html'
        }),
        new StatsWriterPlugin({
            filename: CLIENT_STATS_NAME, // Default
            stats: {
                all: false,
                assets: true,
                builtAt: true,
                moduleAssets: true,
                groupAssetsByChunk: true
            }
        }),
        new webpack.DefinePlugin({
            __VERSION__: JSON.stringify(PACKAGE_VERSION),
            __BUILD_TS__: new Date().getTime(),
            __BUILD_DT__: JSON.stringify(new Date().toISOString()),
            __SERVE_HOST__: options.host || SERVE_IP,
            __SERVE_PORT__: options.port || SERVE_PORT,
            __DEVELOPMENT__: mode == 'development',
            __IS_SERVER__: false
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css",
        }),
        new WasmPackPlugin({
            crateDirectory: path.resolve(PROJECT_ROOT, "wasm-app"),
            args: "--verbose",
            extraArgs: "--target bundler",
            outDir: "../wasm_app_dist",
            pluginLogLevel: "debug"
        })
    ]
    if (mode == 'production') {
        // plugins.push(new MiniCssExtractPlugin())

        OPTIMIZATIONS = {
            ...OPTIMIZATIONS,
            minimize: true,
            minimizer: [
                new TerserPlugin(),
                new CssMinimizerPlugin()],
            // splitChunks: {
            //     chunks: 'all',
            // }
        }
    }

    let dev_server = {};
    let public_path = '/assets/client/'

    if (env['WEBPACK_SERVE'] == true) {
        const host = options.host || SERVE_IP;
        const port = options.port || SERVE_PORT
        dev_server = {
            contentBase: './dist',
            publicPath: '/assets/',
            host: host,
            clientLogLevel: "debug",
            port: port,
            serveIndex: true,
            writeToDisk: true
        }
        // public_path = `http://${host}:${port}`
    }

    const rules = rules_factory('web', PROJECT_ROOT, "tsconfig.client.json");

    return {
        stats: stats,
        mode: mode,
        resolve: resolve,
        module: {
            rules: rules,
        },
        devtool: 'source-map',

        plugins: plugins,

        devServer: dev_server,

        entry: {
            client: './src/browser.tsx',
        },
        output: {
            // webassemblyModuleFilename: "[hash].wasm",
            filename: '[name]-[contenthash].js',
            chunkFilename: '[name]-[contenthash].js',
            path: path.resolve(PROJECT_ROOT, 'dist/client'),
            publicPath: public_path,
            clean: true
        },
        performance: {
            hints: false,
        },
        experiments: {
            asyncWebAssembly: true,
            topLevelAwait: true
        },
        optimization: OPTIMIZATIONS,
        target: 'web'
    }
};

// const configs: Array<webpack.Configuration> = [client_config, server_config];
// const configs = [client_config, server_config];


export default (env: any, options: any) => {
    const mode = options.mode || 'production';

    console.log(`Compiling project with 'mode': ${mode}`);

    const configs = [
        client_config_factory(mode, env, options),
        server_config_factory(mode, env, options)
    ];

    return configs;
}
