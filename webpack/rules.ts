import * as path from 'path';
import * as webpack from 'webpack';

// just in case you run into any typescript error when configuring `devServer`
import 'webpack-dev-server';

const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { StatsWriterPlugin } = require("webpack-stats-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


export default (target: string, project_root: string, tsconfig: string) => {
    return [
        {
            test: /\.(tsx|ts)$/,
            exclude: /(node_modules|bower_components)/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        ["@babel/preset-env", {}],
                        "@babel/preset-react",
                        "@babel/preset-typescript",
                        // ["@babel/preset-typescript", {
                        //     "allowDeclareFields": true,
                        //     "allowNamespaces": true,
                        //     "allExtensions": true,
                        //     "isTSX": true
                        // }],
                    ],
                    plugins: [
                        // [
                        //     "module-resolver",
                        //     {
                        //         "root": [
                        //             "./src",
                        //             "./",
                        //             "./server",
                        //             "./config"
                        //         ],
                        //         "alias": {}
                        //     }
                        // ],
                        "transform-async-to-generator",
                        "@babel/plugin-syntax-dynamic-import",
                        "@babel/plugin-transform-runtime",
                        ["@babel/plugin-proposal-decorators", { "legacy": true }],
                        ["@babel/plugin-proposal-class-properties", { "loose": false }],
                        ["@babel/plugin-transform-classes", { "loose": false }]
                    ]
                }
            },
            {
                loader: 'ts-loader',
                options: {
                    transpileOnly: false,
                    configFile: path.resolve(project_root, tsconfig),
                    logLevel: "debug",
                    // onlyCompileBundledFiles: true
                }
            }
            ]
        },
        {
            test: /\.(jsx|js)$/,
            exclude: /(node_modules|bower_components)/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        ["@babel/preset-env", {
                            // "targets": {
                            //     "edge": "17",
                            //     "firefox": "60",
                            //     "chrome": "67",
                            //     "safari": "11.1"
                            // },
                            // "useBuiltIns": "usage",
                            // "corejs": "3.6.5"
                        }],
                        "@babel/preset-react",
                    ],
                    plugins: [
                        // [
                        //     "module-resolver",
                        //     {
                        //         "root": [
                        //             "./src",
                        //             "./",
                        //             "./server",
                        //             "./config"
                        //         ],
                        //         "alias": {}
                        //     }
                        // ],
                        // "transform-async-to-generator",
                        "@babel/plugin-syntax-dynamic-import",
                        "@babel/plugin-transform-runtime",
                        ["@babel/plugin-proposal-decorators", { "legacy": true }],
                        // ["@babel/plugin-transform-runtime", { "regenerator": true }],
                        ["@babel/plugin-proposal-class-properties", { "loose": false }],
                        ["@babel/plugin-transform-classes", { "loose": false }]
                    ]
                }
            }
            ]
        },
        {
            test: /\.css$/i,

            use: [
                target == 'node' ? "isomorphic-style-loader" : "style-loader",
                {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        importLoaders: 1

                    }
                },
                {
                    "loader": "postcss-loader",
                    options: {
                        postcssOptions: {
                            plugins: [
                                [
                                    "postcss-preset-env",
                                    {
                                        // Options
                                    },
                                ],
                                ["postcss-import", {}],
                                ["autoprefixer", {}]

                            ]
                        }
                    },
                },
                {
                    loader: "sass-loader",
                    options: {
                        implementation: require("sass"),
                        webpackImporter: true,
                        sassOptions: {
                            fiber: false,
                            includePaths: [path.resolve(project_root, 'src/styles')]
                        },
                    },
                },
            ]
        },
        {
            test: /\.less$/i,
            use: [
                target == 'node' ? "isomorphic-style-loader" : "style-loader",
                "css-loader",
                {
                    loader: "less-loader",
                    options: {
                        webpackImporter: true,
                        sourceMap: true,
                    },
                },
            ],
        },
        {
            test: /\.s[ac]ss$/i,

            use: [
                target == 'node' ? "isomorphic-style-loader" : "style-loader",
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        importLoaders: 1
                    }
                },
                {
                    "loader": "postcss-loader",
                    options: {
                        postcssOptions: {
                            plugins: [
                                [
                                    "postcss-preset-env",
                                    {
                                        // Options
                                    },
                                ],
                                ["postcss-import", {}],
                                ["autoprefixer", {}]

                            ]
                        }
                    },
                },
                {
                    loader: "sass-loader",
                    options: {
                        implementation: require("sass"),
                        webpackImporter: true,
                        sassOptions: {
                            fiber: false,
                            includePaths: [path.resolve(project_root, 'src/styles')]
                        },
                    },
                },

            ]
        },
        {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
                'file-loader'
            ]
        }
    ]
};
