import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import CompressionPlugin from 'compression-webpack-plugin'

const extractSass = new ExtractTextPlugin({
    filename: "assets/styles/main.css"
});

const Config = {
    entry: './app/index.js',
    output: {
        path: path.resolve(__dirname, './public'),
        filename: 'scripts/bundle-[name].js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: [
                        'react',
                        [
                            'env', {
                                targets: {
                                    browsers: ['last 2 versions']
                                }
                            }
                        ],
                        'stage-2'
                    ],
                    env: {
                        production: {
                            presets: ['react-optimize']
                        }
                    }
                }
            },
            {
                test: /\.s?css?$/,
                use: extractSass.extract({
                    use: ['css-loader', 'resolve-url-loader', 'sass-loader'],
                    fallback: "style-loader"
                })
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
    },
    node: {
        fs: 'empty'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'chatapp',
            template: './app/index.html',
            minify: {
                removeComments: true
            },
            showErrors: false
        }),
        extractSass,
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0
        })
    ]
}

if (process.env.NODE_ENV === 'production') {
    Config.plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            compress: {
                warnings: false, // Suppress uglification warnings
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                screw_ie8: true
            },
            output: {
                comments: false,
            },
            exclude: [/\.min\.js$/gi] // skip pre-minified libs
        })
    );
}

export default Config;