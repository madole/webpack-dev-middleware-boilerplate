path = require 'path'
express = require 'express'
webpack = require 'webpack'
webpackDevMiddleware = require 'webpack-dev-middleware'
webpackHotMiddleware = require 'webpack-hot-middleware'

config = require './config/webpack.dev.config'

app = express()

app.set 'views', path.join(process.cwd(), 'src', 'views')

app.set 'view engine', 'jade'

router = express.Router()

compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
    stats: {colors: true}
}))

app.use(webpackHotMiddleware(compiler, {
    log: console.log
}))


router.get('/', (req, res, next) -> res.render 'index' )

app.use(router)

app.listen(3000, -> console.log 'listening on 3000')
