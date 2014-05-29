var underscore = require('underscore');

function buildLooper (inItems) {

  /*
   * This function will return a funtion, which will throw out
   * items circularly.
   */

  var items = inItems;
  var now = 0;
  var length = items.length;

  return function () {

    var item = items[now++];
    now %= length;
    return item;

  };

}

function Tipster (params) {

  var that = this;
  var elements = params.elements;
  var rules = params.rules;

  that.elements = elements;
  that.rules = rules;
  that.pool = underscore.clone(rules);
  that.looper = buildLooper(elements);
  that.buildCheckers();

}

Tipster.prototype.buildCheckers = function () {

  var that = this;
  var elements = that.elements;
  var rules = that.rules;
  var pool = that.pool;
  var logins = {};
  var logouts = {};

  elements.forEach(function (element) {

    var related = underscore.keys(rules).filter(function (rule) {

      return that.isRelated(element, rule);
  
    });

    logins[element] = function () {

      // The things checker do:
      //   If all the related resources are available, occupy one of each
      //   and return true, else return false

      var rule;
      for(var i = 0 ; i < related.length ; i++) {

        rule = related[i];
        if (pool[rule] <= 0) {

          return false;
        
        }   
      
      }

      related.forEach(function (target) {

        pool[target]--;
      
      });

      return true;

    };

    logouts[element] = function () {

      // Release all related resources
      related.forEach(function (rule) {

        pool[rule]++;
      
      });
    
    };

  });

  that.logins = logins;
  that.logouts = logouts;

};

Tipster.prototype.getTask = function () {

  var that = this;
  var logins = that.logins;
  var max = that.elements.length;
  var item;
  var logout;

  for (var i = 0 ; i < max ; i++) {

    item = that.looper();
    login = logins[item];
    if (login()) {

      return item;
    
    }  

  }

  return null;

};

Tipster.prototype.done = function (item) {

  var that = this;
  var logouts = that.logouts;
  
  logouts[item]();

};

Tipster.prototype.isRelated = function (element, rule) {

  if (rule.indexOf('*') !== -1) {

    var reg = new RegExp(rule.replace('.','\\.').replace('*','.*'));
    return (!!reg.exec(element));
  
  } else {

    return (rule === element);
  
  }

};

Tipster.prototype.getStatus = function () {

  var that = this;
  return that.pool;

};

module.exports = Tipster;
