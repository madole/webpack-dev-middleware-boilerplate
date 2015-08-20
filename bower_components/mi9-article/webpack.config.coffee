lodash = require 'lodash'
webpack = require 'webpack'
webpackExtractText = require 'extract-text-webpack-plugin'
webpackStats = require 'stats-webpack-plugin'
webpackExternals = require 'mi9-externals-webpack'
webpackStylusImports = require 'mi9-stylus-imports-webpack'

webpackBaseConfig =
    devtool: 'inline-source-map'
    output:
        path: 'build'
        filename: '[name].js'
        pathinfo: true
        libraryTarget: 'umd'
        devtoolModuleFilenameTemplate: 'webpack:///bower_components/mi9-article/[resource-path]'
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
            test: /\.(png|svg)$/,
            loader: 'url'
        ]
    stylus:
        import: webpackStylusImports()
    resolve:
        root: process.cwd()
        modulesDirectories: [
            'bower_components'
        ]
        extensions: [
            ''
            '.js'
            '.coffee'
            '.styl'
        ]

webpackModuleConfig = lodash.cloneDeep webpackBaseConfig
webpackModuleConfig.entry =
    'lib/module': 'src/scripts/index'
webpackModuleConfig.module.loaders.push
    test: /\.styl$/
    loader: webpackExtractText.extract 'style', 'css?sourceMap!csslint!autoprefixer!stylus'
webpackModuleConfig.externals = webpackExternals 'bower_components'
webpackModuleConfig.plugins = [
    new webpack.ResolverPlugin new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin 'bower.json', ['main']
    new webpackExtractText 'lib/module.css'
    new webpackStats 'lib/webpack-stats.json'
]

webpackTestsConfig = lodash.cloneDeep webpackBaseConfig
webpackTestsConfig.entry =
    'tests/ad-decorator.spec': 'src/tests/ad-decorator.spec'
webpackTestsConfig.module.loaders.push
    test: /\.styl$/
    loader: 'css!stylus'
webpackTestsConfig.plugins = [
    new webpack.ResolverPlugin new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin 'bower.json', ['main']
]

module.exports = [webpackModuleConfig, webpackTestsConfig]