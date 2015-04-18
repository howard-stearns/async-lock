# async-lock
A very simple mutex for asynchronous code, which does not spin nor busy-wait. Also exports an efficient Queue.

## lock(key, critical)

When no other asynchronous activity has also locked `key`, executes `critical(unlock)`:
* The `key` is anything suitable for a key to a javascript object.
* The `critical` function can be anything, but it must execute `unlock()` sometime before it finishes (even if there is an error).
For example:
```
lock(pathname, function (unlock) {
    fs.writeFile(pathname, data, function (error) { unlock(); callback(error); });
});
```

## lockMultiple(keys, critical)

Same as `lock`, but `keys` is an array. `criticial` is not executed until each element in `keys` is unlocked. This is preferred over a nested series of `lock`s, in which the `critical` section of each would have locked the next key in turn. The nested form is subject to deadlocks that do not occur for `lockMultiple`.

> *I am considering doing away with lockMultiple, and instead allowing key in lock to be an array. What do you think?*

## Queue

This is a clone of Stephen Morley's Queue. The original code and a nice performance illustration is at http://code.stephenmorley.org/javascript/queues/

A queue is a first-in-first-out (FIFO) data structure. Items are added to the end of the queue and removed from the front. It's just like using `Array` with `push()` and `shift`, but faster. (The built-in javascript `shift` has horrible performance for large arrays.)

The version is different from Stephen's only as follows:
1. jslintable and strict
2. node module export
3. releases references to queued objects in dequeue, so that they can be gc'd. This is important for async-lock, because the items being queued are closures that are not used after they are dequeued, and we really don't want to keep those around.

### Construction
```
var q = new Queue();
```
This is analogous to `var q = new Array();`

### Adding elements
```
q.enqueue(newElement)
```
This is analogous to `anArray.push(newElement)`

### Removing elements
```
var oldestItem = q.dequeue();
```
This is analogous to `anArray.shift()`, but much faster for long queues.

### Examining 
```
var oldestItem = q.peek();
```
This is analogous to `anArray[0]`.

### Other
```
q.getLength(); # like anArray.length
q.isEmpty(); # like !anArray.length

## Testing and examples

There is a (somewhat weak) test suite at test/test.js