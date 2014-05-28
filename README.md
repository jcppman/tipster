tipster
=======

An activities manager for nodejs. Tipster will help you managing the ongoing 
activities and help you find an available chance.

Pretty abstract, hum?

That's say that:

Your awesome nodejs script will keep firing several type of async tasks
concurrently, those tasks take times and resources, you want to limit the
concurrency, but not only the concurrency of each task, you need to limit
the overall concurrency also.

More precisely:

You have these tasks: A.a, A.b, B, C.a, C.z, D, you want to fire tasks with the
given limitation:
- max concurrency of A.a: 2
- max concurrency of A.b: 1
- max concurrency of B: 3
- max concurrency of C.*: 5
- max concurrency of *: 10

__TO BE CONTINUE__
