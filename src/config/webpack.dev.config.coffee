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
            test: /\.coffee$/
            loader: 'coffeelint'
        ]
        loaders: [
            test: /\.coffee$/
            loader: 'coffee'
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
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin()
        new webpack.HotModuleReplacementPlugin()
        new webpack.NoErrorsPlugin()
        new webpack.ResolverPlugin new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin 'bower.json', ['main']
        new webpackStats 'webpack.json'
    ]
    target: 'web'
