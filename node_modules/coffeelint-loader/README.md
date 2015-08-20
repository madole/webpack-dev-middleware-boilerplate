# coffeelint loader for webpack

## Usage

Apply the coffeelint loader as pre/postLoader in your webpack configuration:

``` javascript
module.exports = {
	module: {
		preLoaders: [
			{
				test: /\.coffee$/, // include .coffee files
				exclude: /node_modules/, // exclude any and all files in the node_modules folder
				loader: "coffeelint-loader"
			}
		]
	},

	// more options in the optional coffeelint object
	coffeelint: {
		// any coffeelint option http://www.coffeelint.com/#options
		// i. e.
		camel_case_classes: 'error',

		// coffeelint errors are displayed by default as warnings
		// set emitErrors to true to display them as errors
		emitErrors: false,

		// coffeelint to not interrupt the compilation
		// if you want any file with coffeelint errors to fail
		// set failOnErrors to true
		failOnErrors: false,

    // same as failOnErrors but will throw an exception for
    // warnings as well
		failOnWarns: false,

		// custom reporter function
		reporter: function(results) {
      var errors = result.error;
      war warns = result.warn;
    }
	}
}
```

### Custom reporter

By default, `coffeelint-loader` will provide a default reporter.

However, if you prefer a custom reporter, pass a function under the `reporter` key in `coffeelint` options. (see *usage* above)

The reporter function will be passed an object containing error and warn arrays produced by coffeelint
with the following structure:
```js
{
  error: [
    {
        rule :      'Name of the violated rule',
        lineNumber: 'Number of the line that caused the violation',
        level:      'The severity level of the violated rule',
        message:    'Information about the violated rule',
        context:    'Optional details about why the rule was violated'
    }
    //...
  ],
  warn: [
    {
      //...
    },
    //...
  ]
}
```

The reporter function will be excuted with the loader context as `this`. You may emit messages using `this.emitWarning(...)` or `this.emitError(...)`. See [webpack docs on loader context](http://webpack.github.io/docs/loaders.html#loader-context).

The output in webpack CLI will usually be:
```
...

WARNING in ./path/to/file.js
<reporter output>

...
```

## License

MIT (http://www.opensource.org/licenses/mit-license.php)

