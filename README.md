# promise-performance-tests

This is a collection of tests used to measure various aspects of `Promise`
performance in JavaScript, especially focusing on `Promise` and `async`
usage in [Node.js](https://nodejs.org).


## Installation

You can build via

```
$ git clone https://github.com/v8/promise-performance-tests
$ npm install
```

which generates appropriate standalone test files in the `dist` folder.
These can be directly executed via either `node` or JavaScript engine
shells. You can also use the `run.js` script with `node`, i.e.

```
$ node run.js
Time(doxbee-async-bluebird): 206.5 ms.
Time(doxbee-async-es2017-babel): 288.7 ms.
Time(doxbee-async-es2017-native): 128.8 ms.
Time(doxbee-promises-bluebird): 158.4 ms.
Time(doxbee-promises-es2015-native): 243.5 ms.
Time(parallel-async-bluebird): 239.8 ms.
Time(parallel-async-es2017-babel): 592.4 ms.
Time(parallel-async-es2017-native): 480.2 ms.
Time(parallel-promises-bluebird): 191.1 ms.
Time(parallel-promises-es2015-native): 436.4 ms.
```


## Disclaimer

This is not an officially supported Google product.


## Author

[Benedikt Meurer](https://benediktmeurer.de/) ([@bmeurer](https://twitter.com/bmeurer))
