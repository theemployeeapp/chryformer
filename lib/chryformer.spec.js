'use strict';
var chryformer = require('./index.js');
var _ = require('lodash');

describe('Chryoformer', function() {

  beforeEach(function() {

  });

  afterEach(function() {

  });

  it('should throw an error if a mapper is not supplied', function() {
    (function() {
      chryformer();
    }).should.throw('map function or object is required');
  });

  it('should throw an error if a mapper is set to an array', function() {
    (function() {
      chryformer(['im an array']);
    }).should.throw('map function or object is required');
  });

  it('should throw an error if a mapper is set to a string', function() {
    (function() {
      chryformer('im a string');
    }).should.throw('map function or object is required');
  });

  it('should throw an error if a reducer is not a function, object, or string', function() {
    (function() {
      var transformer = chryformer({});
      transformer.setFilter(200);
    }).should.throw('filter must be an object, function, or string');
  });

  it('should throw an error if a reducer is not a function', function() {
    (function() {
      var transformer = chryformer({});
      transformer.setReducer({});
    }).should.throw('reducer must be an iteratee function');
  });

  it('should have three public functions called setFilter, setReducer, and transform', function() {
    var transformer = chryformer({});
    _.isFunction(transformer.setFilter).should.equal(true);
    _.isFunction(transformer.setReducer).should.equal(true);
    _.isFunction(transformer.transform).should.equal(true);
  });

  it('should transform the data using the basicMap function', function() {
    var now = new Date();
    var input = [{
      date: now,
      location: 'New York'
    }, {
      date: now,
      location: 'Pennsylvania'
    }];
    var mapObj = {
      date: 'time',
      location: 'locale'
    };
    var transformer = chryformer(mapObj);
    var transformedData = transformer.transform(input);
    transformedData[0].time.toString().should.equal(now.toString());
    transformedData[0].locale.should.equal('New York');
    transformedData[1].time.toString().should.equal(now.toString());
    transformedData[1].locale.should.equal('Pennsylvania');
  });

  it('should transform the data using a custom map function', function() {
    var now = new Date();
    var input = [{
      date: now,
      location: 'New York'
    }, {
      date: now,
      location: 'Pennsylvania'
    }];
    var mapFunc = function(data) {
      return {
        time: data.date,
        locale: data.location
      };
    };
    var transformer = chryformer(mapFunc);
    var transformedData = transformer.transform(input);
    transformedData[0].time.toString().should.equal(now.toString());
    transformedData[0].locale.should.equal('New York');
    transformedData[1].time.toString().should.equal(now.toString());
    transformedData[1].locale.should.equal('Pennsylvania');
  });

  it('should filter and transform the data', function() {
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
    var transformedData = transformer.transform(input);
    transformedData.length.should.equal(2);
    transformedData[0].firstName.should.equal('Fred');
    transformedData[0].age.should.equal(35);
    transformedData[1].firstName.should.equal('Barney');
    transformedData[1].age.should.equal(32);
    should.not.exist(transformedData[2]);
  });

  it('should reduce the data', function() {
    var input = [{
      salary: 100
    }, {
      salary: 200
    }, {
      salary: 100
    }];
    var mapObj = {
      salary: 'salary'
    };
    var transformer = chryformer(mapObj);
    transformer.setReducer(function(total, data) {
      return total + data.salary;
    });
    var transformedData = transformer.transform(input);
    transformedData.should.equal(400);
  });

  it('should assign the assignment object to every transformed object', function() {
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
      name: 'firsName',
      age: 'age'
    };

    var assignmentObj = {
      location: 'Bed Rock',
      series: 'The Flintstones'
    };

    var transformer = chryformer(mapObj);
    transformer.setAssignment(assignmentObj);

    var transformedData = transformer.transform(input);
    transformedData.length.should.equal(3);
    transformedData[0].location.should.equal('Bed Rock');
    transformedData[0].series.should.equal('The Flintstones');
    transformedData[1].location.should.equal('Bed Rock');
    transformedData[1].series.should.equal('The Flintstones');
    transformedData[2].location.should.equal('Bed Rock');
    transformedData[2].series.should.equal('The Flintstones');
  });
});
