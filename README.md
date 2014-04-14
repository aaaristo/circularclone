circularclone
=============

Clones circular javascript object graphs,
using [circularjs](https://github.com/aaaristo/circularjs) to
traverse them.

```
npm install circularclone
```

```javascript

var clone= require('circularclone');

var a= { name: 'Andrea' },
    e= { name: 'Elena' };
    
a.daughter= e;
e.dad= a;

console.log(clone(a));
```
