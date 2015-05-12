#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

> Basic transformer for use with chrysalis.  


# Install

```sh
$ npm install chryformer --save
```


# Usage

The chryformer is the basic transformer for use with chrysalis - 'githublink@here'
chryformer supports a simple map strategy designed to effortlessly transform a collection of source objects to a collection of new objects of a unique scheme.

###Initialization
It is required to initialize the chryformer with a Mapper. A mapper can be an object mapping the keys on the source object to the desired keys on the destination object **or** an iteratee function that will be run on each item in the source collection.

- Refer to [https://github.com/wankdanker/node-object-mapper] for examples on what a mapper object can look like
- Refer to [https://lodash.com/docs#map] for examples on what a mapper function can look like

```js
var Chryformer = require('chryformer');
var Chrysalis = require('chrysalis');

var map = {
  sourceKey1: 'destinationKey1',
  sourceKey2: 'destinationKey2'
};
var chryformer = Chryformer(map);

var chrysalis = Chrysalis();
chrysalis.setTransformer(chryformer);
```

#API
- **chryformer.setFilter (filter)** - Sets the filter strategy to be used by the chryformer.
  - filter (Object|Function|String) - The function invoked per iteration. See [https://lodash.com/docs#filter]
- **chryformer.setReducer (reducer)** - Sets the reducer strategy to be used by the chryformer
  - reducer (Function) - The function invoked per iteration.  See
  [https://lodash.com/docs#reduce]
- **chryformer.transform (inputData)** - Transforms the input data based on the filter, mapper, and reducer.
  - inputData (Array|Object) - An single object or array of source objects that will be transformed.  If you are using Chrysalis, this will be fed the output from your extractor.

#Example
```js
var input = [{
  name: 'Fred',
  age: 35
}, {
  name: 'Barney',
  age: 32
}, {
  name: 'Pebbles',
  age: 6
}];

var mapObj = {
  name: 'firstName',
  age: 'age'
};

var transformer = chryformer(mapObj);
transformer.setFilter(function(data) {
  return data.age > 30;
});

chryformer.transform(input);
// -> [{firstName: 'Fred', age: 35}, {firsName: 'Barney', age: 32}]
```

# License

MIT © [frankros91]()


[npm-image]: https://badge.fury.io/js/chryformer.svg
[npm-url]: https://npmjs.org/package/chryformer
[travis-image]: https://travis-ci.org/frankros91/chryformer.svg?branch=master
[travis-url]: https://travis-ci.org/frankros91/chryformer
[daviddm-image]: https://david-dm.org/frankros91/chryformer.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/frankros91/chryformer
