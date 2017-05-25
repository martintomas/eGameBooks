var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    devtool: '#eval-source-map',
    resolve: {
        modules: [path.resolve(__dirname, 'src/js/'), "node_modules"],
        alias: {
             'vue$': 'vue/dist/vue.esm.js'
        }
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['es2015', { modules: false }]
                        ],
                        plugins: ['syntax-dynamic-import']
                    }
                }]
            }, {
                test: /\.vue$/,
                use: [{
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            css: ExtractTextPlugin.extract({
                                use: 'css-loader',
                                fallback: 'vue-style-loader' // <- this is a dep of vue-loader, so no need to explicitly install if using npm3
                            })
                        },
                        preserveWhitespace: false
                    }
                }]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: 'css-loader',
                }),
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'url-loader?limit=100000&name=img/[hash].[ext]'
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            }
        ]
    },
    entry: {
        app: './src/js/app.js',
        vendor: ['vue', 'vuex', 'vue-router', 'iscroll', 'markdown-it', 'sanitize-html' ,'truncate-html']
    },
    output: {
        //filename: '[name].[chunkhash].js',
        filename: 'js/[name].js',
        //sourceMapFilename: '[name].map',
        path: path.resolve(__dirname, 'dist/'),
        publicPath: '/dist/',
    },
    devServer: {
        //port: 7777,
        //host: 'localhost',
        historyApiFallback: true,
        noInfo: true,
        //stats: 'minimal',
        contentBase: path.join(__dirname, "src"),
        publicPath: "/dist/",
        //hot: true
    },
    performance: {
        hints: false
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor'], // Specify the common bundle's name.
            minChunks: function(module) {
                // this assumes your vendor imports exist in the node_modules directory
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        }),
        // new webpack.ProvidePlugin({
        //     $: "jquery",
        //     jQuery: "jquery",
        //     "window.jQuery": "jquery"
        // }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development') //use production string for production
        }),
        // new webpack.HashedModuleIdsPlugin(),
        // new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin({
            filename: 'css/[name].css'
        }),
    ]
};

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
        // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
}