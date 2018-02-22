"use strict";

const path = require("path");
const {DefinePlugin} = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OpenBrowserPlugin = require("open-browser-webpack-plugin");

const ExtractStylePlugin = new ExtractTextPlugin({
    filename: "./css/[name].css",
    allChunks: true,
});

let config = require("./config/index.json");

process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";

module.exports = {
    bail: true,
    devtool: "source-map",
    watch: true,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    stats: {
        // assets: false,
        colors: true,
        // version: false,
        // hash: false,
        // timings: false,
        // chunks: false,
        // chunkModules: false,
        children: false
    },
    devServer: {
        contentBase: "./",
        inline: true,
        hotOnly: true,
        port: 9998,
        historyApiFallback: true,
        proxy: [{
            context: "/",
            target: "http://localhost:9999/",
        }]
    },
    entry: {
        main: path.join(__dirname, "./source/client/src/index"),
        // signin: path.join(__dirname, "./source/client/src/signin/index"),
        // verify: path.join(__dirname, "./source/client/src/verify/index"),
    },
    output: {
        path: path.resolve("./build/"),
        filename: "./js/[name].js",
        chunkFilename: "./js/[name].chunk.js",
        publicPath: "/build/",
    },
    resolve: {
        modules: ["node_modules"],
        extensions: [".ts", ".tsx", ".js", ".json", ".jsx"],
        alias: {
            "babel-runtime": path.dirname(
                require.resolve("babel-runtime/package.json")
            )
        },
    },

    module: {
        strictExportPresence: true,
        rules: [
            {
                oneOf: [
                    {
                        test: /\.(scss|css)$/,
                        loader: ExtractStylePlugin.extract({
                            fallback: {
                                loader: "style-loader",
                            },
                            use: [
                                {
                                    loader: "css-loader",
                                    options: {
                                        sourceMap: true,
                                        minimize: true,
                                    },
                                },
                                {
                                    loader: "resolve-url-loader",
                                    options: {
                                        sourceMap: true,
                                    }
                                },
                                {
                                    loader: "sass-loader",
                                    options: {
                                        sourceMap: true,
                                        sourceMapContents: true,
                                        includePaths: ["source/client/style"]
                                    }
                                }
                            ],
                        }),
                    },
                    {
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: "file-loader",
                        options: {
                            limit: 10000,
                            name: "media/[name].[ext]",
                        },
                    },
                    // {
                    //     test: /\.jsx?$/,
                    //     include: path.join(__dirname, "./source/client/src"),
                    //     loader: "babel-loader",
                    //     options: {
                    //         babelrc: false,
                    //         sourceMap: true,
                    //         presets: [require.resolve("babel-preset-react-app")],
                    //         plugins: ["source-map-support", "transform-decorators-legacy"],
                    //         compact: true,
                    //     },
                    // },

                    // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
                    {test: /\.tsx?$/, loader: "awesome-typescript-loader"},

                    // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
                    {enforce: "pre", test: /\.js$/, loader: "source-map-loader"},
                    {
                        test: /\.svg$/,
                        loader: "raw-loader"
                    },
                    {
                        loader: "file-loader",
                        exclude: [/\.js$/, /\.html$/, /\.json$/],
                        options: {
                            name: "./media/[name].[ext]",
                        },
                    },
                    {
                        test: /\.woff$/,
                        loader: "url-loader?mimetype=application/font-woff&name=media/[name].[ext]"
                    },
                    {
                        test: /\.woff2$/,
                        loader: "url-loader?mimetype=application/font-woff2&name=media/[name].[ext]"
                    },
                    {
                        test: /\.otf$/,
                        loader: "url-loader?mimetype=application/octet-stream&name=media/[name].[ext]"
                    },
                    {
                        test: /\.ttf$/,
                        loader: "url-loader?mimetype=application/octet-stream&name=media/[name].[ext]"
                    },
                    {
                        test: /\.eot$/,
                        loader: "url-loader?mimetype=application/vnd.ms-fontobject&name=media/[name].[ext]"
                    },
                ],
            },
        ],
    },
    plugins: [
        ExtractStylePlugin,
        new DefinePlugin({
            process: {
                env: {
                    NODE_ENV: JSON.stringify("development")
                }
            }
        }),
        new OpenBrowserPlugin({url: "http://" + config.domain + ":" + config.port}),
    ],
    node: {
        dgram: "empty",
        fs: "empty",
        net: "empty",
        tls: "empty",
        module: "empty",
        child_process: "empty",
    },
};