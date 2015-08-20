/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Scott Beck @bline
*/
var coffeelint = require("coffeelint").lint;
var stripJsonComments = require("strip-json-comments");
var loaderUtils = require("loader-utils");
var fs = require("fs");


function loadConfig(options, callback) {
	var sync = typeof callback !== "function";
  var path = options.configFile || './coffeelint.json';
  delete options.configFile;

  merge = function (config) {
    for (name in options)
      config[name] = options[name];
    return config;
  };

	if (sync){
		if (!fs.existsSync(path)) {
			// no .jshintrc found
			return {};
		} else {
			this.addDependency(path);
			var file = fs.readFileSync(path, "utf8");
			return merge(JSON.parse(stripJsonComments(file)));
		}
	}
	else {
    fs.exists(path, function (exists) {
      if (!exists) {
        // no coffeelint.json
				return callback(null, {});
			}

			this.addDependency(path);
			fs.readFile(path, "utf8", function(err, file) {
				var options;
				if (!err) {
					try {
						options = merge(JSON.parse(stripJsonComments(file)));
					}
					catch(e) {
						err = e;
					}
				}
				callback(err, options);
			});
		}.bind(this));
	}
}

function coffeeLint(input, options) {

	// move flags
	var emitErrors = options.emitErrors;
	delete options.emitErrors;
	var failOnErrors = options.failOnErrors;
	delete options.failOnErrors;
	var failOnWarns = options.failOnWarns;
	delete options.failOnWarns;

	// custom reporter
	var reporter = options.reporter;
	delete options.reporter;

	var data = coffeelint(input, options);
  var result = {
    error: [],
    warn: []
  };
  for (var i = 0; i < data.length; ++i)
    result[data[i].level] = data[i]
	if (data.length) {
		if(reporter) {
			reporter.call(this, result);
		} else {
			var hints = []
      data.forEach(function (error) {
				var message = "   " + error.rule + "[" + error.level + "] " + error.message + " @ line " + error.lineNumber + "\n    " + error.context;
				hints.push(message);
			}, this);
			var message = hints.join("\n\n");
			var emitter = emitErrors ? this.emitError : this.emitWarning;
			if(emitter)
				emitter("coffelint results in errors\n" + message);
			else
				throw new Error("Your module system doesn't support emitWarning. Update availible? \n" + message);
		}
	}
	if(failOnErrors && result.error.length || failOnWarns && result.warn.length)
		throw new Error("Module failed in cause of coffeelint error.");
}

function mergeOptions() {
  options = {}
  // copy options to own object
  if (this.options.coffeelint) {
    for (var name in this.options.coffeelint) {
      options[name] = this.options.coffeelint[name];
    }
  }

  // copy query into options
  var query = loaderUtils.parseQuery(this.query);
  for (var name in query) {
    options[name] = query[name];
  }
  return options;
}

module.exports = function(input) {
	this.cacheable && this.cacheable();
	var callback = this.async();

  options = mergeOptions.call(this);
	if(!callback) {
		// load .jshintrc synchronously
		var config = loadConfig.call(this, options);
		coffeeLint.call(this, input, config);
		return input;
	}

	// load .jshintrc asynchronously
	loadConfig.call(this, options, function(err, config) {
		if(err) return callback(err);

		try {
			coffeeLint.call(this, input, config);
		}
		catch(e) {
			return callback(e);
		}
		callback(null, input);

	}.bind(this));
}

