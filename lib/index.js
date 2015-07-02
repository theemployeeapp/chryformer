'use strict';
var _ = require('lodash');
var objectMapper = require('object-mapper');

module.exports = function Chryformer(_mapper) {
  var chryformer = {}, filter, mapper, reducer, assignment;

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

  chryformer.setFilter = function setFilter(_filter) {
    if(!_.isObject(_filter) && !_.isFunction(_filter) && !_.isString(_filter)) {
      throw new Error('filter must be an object, function, or string');
    }
    filter = _filter;
    return chryformer;
  };

  chryformer.setReducer = function setReducer(_reducer) {
    if(!_.isFunction(_reducer)) {
      throw new Error('reducer must be an iteratee function');
    }
    reducer = _reducer;
    return chryformer;
  };

  chryformer.setAssignment = function setAssignment(_assignment) {
    if(!_.isObject(_assignment)) {
      throw new Error('assignment must be an object of keys:values to be assigned to every transformed object');
    }
    assignment = _assignment;
    return chryformer;
  };

  var assignObject = function assignObject(dataArray) {
    return _.map(dataArray, function(data) {
      return _.assign(data, assignment);
    });
  };

  chryformer.transform = function transform(dataArray) {
    if(_.isUndefined(dataArray)) {
      throw new Error('Transformer: recieved data array that is undefined');
    }
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
    //Assignment
    if(!_.isUndefined(assignment)) {
      dataArray = assignObject(dataArray);
    }
    //Reduce
    if(!_.isUndefined(reducer)) {
      dataArray = _.reduce(dataArray, reducer, 0);
    }
    return dataArray;
  };

  return chryformer;
};
