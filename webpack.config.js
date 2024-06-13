const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');


module.exports = {
    entry: {
        main: './src/index.ts',
        about: './src/pages/about/about.ts',
    },
    mode: 'development',
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 63342,
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        chunkFilename: 'pages/about/about.bundle.js',
        publicPath: '/',

    },
    module: {
        rules: [
            { test: /\.txt$/, use: 'raw-loader' },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: 'style-loader',
                        options: { injectType: 'singletonStyleTag' },
                    },
                    'css-loader',
                ],
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
                type: 'javascript/auto',
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'product-images/',

                        }
                    }
                ]
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './src/index.html', filename: 'index.html', chunks:['main']}),
        new HtmlWebpackPlugin({ template: './src/pages/about/about.html', filename: 'pages/about/about.html', chunks:['about']}),
        new CopyPlugin({
            patterns: [
                { from: "./src/product-images", to: "product-images"},
                { from: "./src/*.json", to: "[name][ext]" },

            ],
        }),
    ],
    resolve: {
        extensions: [ ".tsx", ".ts", ".js" ]
    },
};
