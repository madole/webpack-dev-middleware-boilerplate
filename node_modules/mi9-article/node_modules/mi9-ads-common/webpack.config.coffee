lodash = require 'lodash'
webpack = require 'webpack'
webpackStats = require 'stats-webpack-plugin'

webpackBaseConfig =
    devtool: 'inline-source-map'
    output:
        path: 'build'
        filename: '[name].js'
        pathinfo: true
    module:
        preLoaders: [
            test: /\.coffee$/
            loader: 'coffeelint'
        ]
        loaders: [
            test: /\.coffee$/
            loader: 'coffee'
        ,
            test: /\.jade$/
            loader: 'jade'
        ]
    resolve:
        root: process.cwd()
        extensions: [
            ''
            '.coffee'
            '.jade'
        ]

webpackModuleClientConfig = lodash.cloneDeep webpackBaseConfig
webpackModuleClientConfig.entry =
    'lib/client/module': 'src/scripts/index'
webpackModuleClientConfig.output.libraryTarget = 'umd'
webpackModuleClientConfig.output.devtoolModuleFilenameTemplate = 'webpack:///bower_components/mi9-ads-common/[resource-path]'
webpackModuleClientConfig.plugins = [
    new webpackStats 'lib/webpack-stats.json'
]

webpackModuleServerConfig = lodash.cloneDeep webpackBaseConfig
webpackModuleServerConfig.entry =
    'lib/server/module': 'src/scripts/index'
webpackModuleServerConfig.output.libraryTarget = 'commonjs2'
webpackModuleServerConfig.output.devtoolModuleFilenameTemplate = 'webpack:///node_modules/mi9-ads-common/[resource-path]'

module.exports = [webpackModuleClientConfig, webpackModuleServerConfig]