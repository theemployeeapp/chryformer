'use strict';
var _ = require('lodash');
var objectMapper = require('object-mapper');

module.exports = function Chryformer(_mapper) {
  var chryoformer = {}, filter, mapper, reducer;

  if(_.isUndefined(_mapper) || _.isArray(_mapper) || !_.isObject(_mapper)) {
    throw new Error ('map function or object is required');
  }
  mapper = _mapper;

  var basicMap = function basicMap(data) {
      var newData = {};
      objectMapper.merge(data, newData, mapper);
      return newData;
  };

  var getMapper = function getMapper() {
    if(_.isFunction(mapper)) {
      return mapper;
    }
    if(_.isObject(mapper)) {
      return basicMap;
    }
    throw new Error('mapper must be an object or function');
  };

  chryoformer.setFilter = function setFilter(_filter) {
    if(!_.isObject(_filter) && !_.isFunction(_filter) && !_.isString(_filter)) {
      throw new Error('filter must be an object, function, or string');
    }
    filter = _filter;
    return chryoformer;
  };

  chryoformer.setReducer = function setReducer(_reducer) {
    if(!_.isFunction(_reducer)) {
      throw new Error('reducer must be an iteratee function');
    }
    reducer = _reducer;
    return chryoformer;
  };

  chryoformer.transform = function transform(dataArray) {
    if(!_.isArray(dataArray)) {
      dataArray = [dataArray];
    }
    //Filter
    if(!_.isUndefined(filter)) {
      dataArray = _.filter(dataArray, filter);
    }
    //Map
    var iteratee = getMapper();
    dataArray = _.map(dataArray, iteratee);
    //Reduce
    if(!_.isUndefined(reducer)) {
      dataArray = _.reduce(dataArray, reducer, 0);
    }
    return dataArray;
  };

  return chryoformer;
};
