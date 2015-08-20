webpack = require 'webpack'
webpackStats = require 'stats-webpack-plugin'

module.exports =
    devtool: '#source-map'
    entry: [
        'webpack/hot/dev-server'
        'webpack-hot-middleware/client'
        "#{__dirname}/../client/index.coffee"
    ]
    output:
        path: '/'
        filename: 'bundle.js'
        publicPath: 'http://localhost:3000/scripts/'
    module:
        preLoaders: [
            test: /mi9(.*)\.js$/
            loader: 'source-map'
        ,
            test: /\.coffee$/
            loader: 'coffeelint'
        ]
        loaders: [
            test: /\.coffee$/
            loader: 'coffee'
        ,
            test: /mi9-decorator(.*)module\.js$/
            loader: 'expose?Decorator'
        ,
            test: /\.(png|gif|svg)$/
            loader: 'url'
        ,
            test: /\.styl$/
            loader: 'style!css!stylus'
        ]
    resolve:
        root: process.cwd()
        modulesDirectories: [
            'bower_components'
            'node_modules'
        ]
        extensions: [
            ''
            '.js'
            '.coffee'
            '.styl'
        ]
    devServer:
        port: 4000
        hot: true
        inline: false
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin()
        new webpack.HotModuleReplacementPlugin()
        new webpack.NoErrorsPlugin()
        new webpack.ResolverPlugin new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin 'bower.json', ['main']
        new webpackStats 'webpack.json'
    ]
    target: 'web'
