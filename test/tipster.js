var Tipster = require('../');

describe('Tipster', function () {

  var tipster;
  var elements;
  var rules;

  beforeEach(function () {

    elements = [
      "taskA",
      "taskB",
      "taskC.typeA",
      "taskC.typeB",
      "taskD" 
    ];
    rules = {
      "*": 10,
      "taskB": 2,
      "taskC.typeA": 1,
      "taskC.*": 5
    };
    tipster = new Tipster({
      elements: elements,
      rules: rules
    });
  
  });

  describe('constructor', function () {

    it('should have elements', function () {

      tipster.elements.should.eql(elements);
    
    });
    it('should have rules', function () {

      tipster.rules.should.eql(rules);

    });
    it('should have pool', function () {

      (!!tipster.pool).should.be.ok;
      tipster.pool.should.be.eql(rules);
    
    });
    it('should have logins', function () {

      (!!tipster.logins).should.be.ok;
      tipster.logins.should.have.keys(elements);
    
    });
    it('should have logouts', function () {

      (!!tipster.logouts).should.be.ok;
      tipster.logouts.should.have.keys(elements);
    
    });
    
  });

  describe('getTask', function () {

    it('should return a element if a task is available', function () {

      var element = tipster.getTask();
      elements.should.containEql(element);
    
    });
    
    it('should return null if no task for you right now', function () {

      // Occupy all the oppertunities first
      for (var i=0;i<10;i++) {

        tipster.getTask();
      
      }

      // This poor guy got nothing to do
      var element = tipster.getTask();
      (!!element).should.not.be.ok;

    });

    it('should update the status correctly', function () {

      var element = tipster.getTask();
      var pool = tipster.pool;

      Object.keys(rules).forEach(function (rule) {
      
        if (pool[rule] + 1 === rules[rule]) {

          // If this rule is affected by the task, then they should be
          // related

          tipster.isRelated(element, rule).should.be.ok;
        
        } else {

          tipster.isRelated(element, rule).should.not.be.ok;
        
        }

      });

    });

  });

  describe('done', function () {

    it('should release the resource', function () {

      var elements = [];
      var element;

      do {

        element = tipster.getTask();

        if (element) {

          elements.push(element);
        
        }

      
      } while (element);

    });
  
  });

});
