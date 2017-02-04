
virtual-file-loader
============================

Load a virtual file from a buffer using webpack

Basic Usage
---------------------

```js
require("virtual-file-loader?src=...&file=...!");
```
Where `src` is the **HEX** encoded source of the module, and `file`is the virtual filename for the file.


Example
--------------------------------------
Lets take the following code
```js
module.exports = "Hello From Virtual";
```

By encoding it, we have:
```
6D6F64756C652E6578706F727473203D202248656C6C6F2046726F6D205669727475616C223B
```

So our require will be like
```js
const virtual = require("virtual-file-loader?src=6D6F64756C652E6578706F727473203D202248656C6C6F2046726F6D205669727475616C223B&file=my-virtual-file.js");
// Expected output is "Hello From Virtual"
console.log( virtual );
```

Notes
-------------------------
The `file` param is essential because it will be used to resolve the loaders, if you want to create a css file, just use something like `file=my-virtual-file.css`