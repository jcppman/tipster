tipster
=======

An activities manager for nodejs. Tipster will help you managing the ongoing 
activities and help you find an available chance.

Pretty vague, hum?

That's say...

Your awesome nodejs script will keep processing several type of async tasks
concurrently, those tasks take times and resources, you want to limit the
concurrency, but not only the concurrency of each task, you also need to limit
the overall concurrency or even some group concurrency.

More precisely:

You have these tasks: A.a, A.b, B, C.a, C.z, D, you want to fire tasks with the
given limitation:
- max concurrency of A.a: 2
- max concurrency of A.b: 1
- max concurrency of B: 3
- max concurrency of C.*: 5
- max concurrency of *: 10

Usage
=====

Construct the tipster with elements and rules, the ``*`` could be used as
wildcard to match every substring.

```
var Tipster = require('tipster');

var tipster = new Tipster({
  elements: [
    "taskA",
    "taskB",
    "taskC.typeA",
    "taskC.typeB",
    "taskD" 
  ],
  rules: {
    "*": 10,
    "taskB": 2,
    "taskC.typeA": 1,
    "taskC.*": 5
  }
});
```

After initialization, you could use ``getTask()`` to get an element from the task
pool, only the task that not violating the rules will be thrown out.
``getStatus()`` will return an object which represent the current status of
task pool.

```
console.log(tipster.getStatus()); //  {
                                  //    "*": 10,
                                  //    "taskB": 2,
                                  //    "taskC.typeA": 1,
                                  //    "taskC.*": 5
                                  //  }

console.log(tipster.getTask())    // 'taskA'
console.log(tipster.getTask())    // 'taskB'
console.log(tipster.getTask())    // 'taskC.typeA'
console.log(tipster.getTask())    // 'taskC.typeB'
console.log(tipster.getTask())    // 'taskD'

console.log(tipster.getStatus()); //  {
                                  //    "*": 5,
                                  //    "taskB": 1,
                                  //    "taskC.typeA": 0,
                                  //    "taskC.*": 3
                                  //  }
```

If all the task are token, ``getTask()`` will return null. 

```
console.log(tipster.getTask())    // 'taskA'
console.log(tipster.getTask())    // 'taskB'
console.log(tipster.getTask())    // 'taskC.typeB'
console.log(tipster.getTask())    // 'taskD'
console.log(tipster.getTask())    // 'taskA'
console.log(tipster.getTask())    // null

console.log(tipster.getStatus()); //  {
                                  //    "*": 0,
                                  //    "taskB": 0,
                                  //    "taskC.typeA": 0,
                                  //    "taskC.*": 0
                                  //  }

```

After you finish your job, please tell the tipster that you've done your job:

```
tipster.done('taskC.typeB');
tipster.done('taskD');
tipster.done('taskB');
tipster.done('taskD');

console.log(tipster.getStatus()); //  {
                                  //    "*": 4,
                                  //    "taskB": 1,
                                  //    "taskC.typeA": 0,
                                  //    "taskC.*": 1
                                  //  }
```

Then those resources will be released, now you can keep asking for tasks.

```
console.log(tipster.getTask()); // 'taskA'
console.log(tipster.getTask()); // 'taskB'
console.log(tipster.getTask()); // 'taskC.typeB'
```
