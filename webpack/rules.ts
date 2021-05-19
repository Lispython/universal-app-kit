import * as path from 'path';
import * as webpack from 'webpack';
const { inspect } = require('util');


// just in case you run into any typescript error when configuring `devServer`
import 'webpack-dev-server';

const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { StatsWriterPlugin } = require("webpack-stats-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


export default (target: string, project_root: string, tsconfig: string) => {
    const rules = [
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
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: path.resolve(project_root, "./dist"),
                        esModule: false,
                    }

                },
                {
                    loader: 'css-loader',
                    options: {
                        modules: {
                            // auto: true,
                            auto: (resourcePath: string) => resourcePath.endsWith(".css"),
                            localIdentName: "[hash:base64:7]",
                            // exportOnlyLocals: true,
                            // exportOnlyLocals: false,
                            // namedExport: true,
                        },
                        importLoaders: 2
                    }
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

            ]
        },
        {
            test: /\.less$/i,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: path.resolve(project_root, "./dist")
                    }

                },
                {
                    loader: 'css-loader',
                    options: {
                        modules: {
                            auto: true,
                            // exportOnlyLocals: true,
                            // exportOnlyLocals: false,
                            // namedExport: true,
                        },
                        importLoaders: 2
                    }
                },
                {
                    loader: "less-loader",
                    options: {
                        webpackImporter: true,
                        sourceMap: true,
                    },
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

            ],
        },
        {
            test: /\.s[ac]ss$/i,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: path.resolve(project_root, "./dist")
                    }

                },
                {
                    loader: 'css-loader',
                    options: {
                        modules: {
                            auto: true,
                            // exportOnlyLocals: true,
                            // exportOnlyLocals: false,
                            // namedExport: true,
                        },
                        importLoaders: 2
                    }
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

            ]
        },
        {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
                'file-loader'
            ]
        }
    ]

    console.log(`Rule for target ${target}: ${inspect(rules, true, 4)}`);

    return rules;
};
