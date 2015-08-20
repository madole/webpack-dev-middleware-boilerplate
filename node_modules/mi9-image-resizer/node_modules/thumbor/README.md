# ThumborUrlBuilder

Thumbor client for Node JS

Combination of
- https://github.com/dcaramelo/ThumborUrlBuilder crypt implementation
- https://github.com/rafaelcaricio/ThumborJS build command set

Neither of these repos are updating anymore so we are maintaining our own

## Usage

```sh
# Install thumbor module

npm install thumbor
```

```javascript
// Declare thumbor-url-builder in JS
// Your encryption key is not required, but your link will be unsafe.

var Thumbor = require('thumbor');
var thumbor  = new Thumbor('MY_KEY', 'http://myserver.thumbor.com');

// Generate your url :

var thumborUrl = thumbor.setImagePath('00223lsvrnzeaf42.png').resize(50,50).buildUrl();
```
