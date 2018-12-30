/********************* Analogue of Math.floor() with some pros and cons ****************************/
~~20.9891; //-> 20
~~20.5; //-> 20

/* Cons
* As soon as we increase maximum positive 32-bit integer value for one or more, it will still round it but the value will be negative
*/
a = 2147483647.123;  //-> maximum positive 32-bit integer
console.log(~~a);    //-> 2147483647    
a++;        
console.log(~~a);    // -> -2147483648 

/* Pros */
console.log(~~[]);   // -> 0
console.log(~~{}); // -> 0 
console.log(~~NaN);  // -> 0
console.log(~~null); // -> 0 
console.log(~~undefined); // -> 0 
console.log(~~''); // -> 0 

/********************* Caching array length in for... loop ****************************/
//Small-sized arrays
for (var i = 0; i < array.length; i++) {  
    console.log(array[i]);
}
//If you work with smaller arrays – it’s fine, but if you process large arrays, this code will recalculate the size of array in every iteration of this loop and this will cause a bit of delays. To avoid it, you can cache the array.length in a variable to use it instead of invoking the array.length every time during the loop:
//Large arrays best practice
var length = array.length;  
for (var i = 0; i < length; i++) {  
    console.log(array[i]);
}


/********************* Numbers with one...multiple zeroes ****************************/
for (let i = 0; i < 1e7; i++) {}
// All the below will evaluate to true
1e0 === 1;
3e1 === 30;
1e2 === 100;
11e3 === 11000;
141e4 === 1410000;
1e5 === 100000;


/********************* Shallow Object copying ****************************/
/*
* Using Object.assign()
*/
var firstObj = { foo: "foo", bar: "bar" };
var secondObj = { x: "I am x", y: "I am y" };
var copy = Object.assign({}, firstObj); // Object { foo: "foo", bar: "bar" }
var copy2BAD = Object.assign(firstObj, secondObj); //BAD:: modifying "firstObj"  Object {foo: "foo", bar: "bar", x: "I am x", y: "I am y"}
var copy2GOOD = Object.assign({}, firstObj, secondObj); //GOOD:: Object {foo: "foo", bar: "bar", x: "I am x", y: "I am y"}

/* 
* Using ES6 spread operator
*/
var firstObj = { foo: "foo", bar: "bar" };
var secondObj = { x: "I am x", y: "I am y" };
var copy = { ...firstObj}; // Object { foo: "foo", bar: "bar" }
var copy2GOOD = { ...firstObj, ...secondObj}; // Object {foo: "foo", bar: "bar", x: "I am x", y: "I am y"}

/* 
* PROBLEM with pointed above methods: for objects with properties which are themselves objects, we do not loose reference, so changing nested object's property inside the copied object will change same property inside the original object
*/
var problematicObj = { x: 0 , y: { z: 0 } };
var copy = { ...problematicObj };
copy.x = 1;
copy.y.z = 2;
console.dir(problematicObj); // { x: 0, y: { z: 2 } }
console.dir(copy); // { x: 1, y: { z: 2 } }

/* 
* Deep copy of objects JSON.parse(JSON.stringify(object))
* In order to deep copy objects, a solution can be to serialize the object to a string and then deserialize it back
* Unfortunately, this method only works when the source object contains serializable value types and does not have any circular references.
* An example of a non-serializable value type is the Date object - it is printed in a non ISO-standard format and cannot be parsed back to its original value 
* Other examples of circular objects:  Date, RegExp, Map, Set, Blob, FileList, ImageData, sparse and typed Array.
* Also this method cannot be used to copy user-defined object methods.
*/
var obj = { a: 0, b: { c: 0 } };
var copy = JSON.parse(JSON.stringify(obj));

/* 
* Example of code for objects shallow copying 
*/
function clone(obj) {
  var copy;
  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) {
    return obj;
  }
  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
        copy[i] = clone(obj[i]);
    }
    return copy;
  }

  // Handle Function
  if (obj instanceof Function) {
    copy = function() {
      return obj.apply(this, arguments);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
      copy = {};
      for (var attr in obj) {
          if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
      }
      return copy;
  }
  throw new Error("Unable to copy obj as type isn't supported " + obj.constructor.name);
}


/********************* Converting "true"/"false" string to Boolean and other manipulations ****************************/
/* 
* JSON.parse(x) 
*/
var x = "true"; //JSON.parse(x) -> true -> typeof x === "boolean" 
var x= '0'; //JSON.parse(x); -> 0 -> typeof x === "number"
var x = null; //JSON.parse(x); -> null -> typeof x === "object"

/* PITFALL */
var x = ''; //JSON.parse(x); -> SyntaxError
var x = undefined; //JSON.parse(x); -> SyntaxError
var x = []; //JSON.parse(x); -> SyntaxError
var x = {}; //JSON.parse(x); -> SyntaxError


/********************* Selecting DOM elements inside developer tools console with built in $ and $$ ****************************/
/*
* $() takes a string parameter and returns the DOM element which id is the passed string.
*/
$('nav') // returns the element which id is #nav.

/*
* $$() returns an array of DOM elements that satisfy the passed CSS selector.
*/
$$('div li.list-item') // returns an array of li elements that are located inside a div and has the .list-item class


/********************* JS core work with converting ****************************/
[10] == 10 //true [10].toString() == 10
[12,34] == "12,34" //true
![]; // -> false
true == []; // -> false
true == ![]; // -> false
false == []; // -> true
false == ![]; // -> true
toNumber(true); // -> 1
toNumber([]); // -> 0
toNumber(false); // -> 0
toNumber([]); // -> 0
[] == '';   // -> true
[] == 0;   // -> true
[''] == ''; // -> true
[0] == 0;   // -> true
[0] == '';  // -> false
[''] == 0;  // -> true
[null] == '';      // true
[null] == 0;       // true
[undefined] == ''; // true
[undefined] == 0;  // true
[[]] == 0;  // true
[[]] == ''; // true
[[[[[[]]]]]] == ''; // true
[[[[[[]]]]]] == 0;  // true
[[[[[[ null ]]]]]] == 0;  // true
[[[[[[ null ]]]]]] == ''; // true
[[[[[[ undefined ]]]]]] == 0;  // true
[[[[[[ undefined ]]]]]] == ''; // true
'' + ''; // -> ''
[] + []; // -> ''
{} + []; // -> 0
[] + {}; // -> '[object Object]'
{} + {}; // -> '[object Object][object Object]'
'222' - -'111'; // -> 333
[4] * [4];       // -> 16
[] * [];         // -> 0
[4, 4] * [4, 4]; // NaN

1 < 2 < 3; // -> true as true < 3 -> true
3 > 2 > 1; // -> false as true > 1 -> false
1 < 2 < 3; // -> true as 1 < 2 -> true

/********************* JS weird parts ****************************/
Math.min(); // -> Infinity
Math.max(); // -> -Infinity
Math.min() > Math.max(); // -> true
null == 0; // -> false
null > 0; // -> false
null >= 0; // -> true

/********************* try...catch...finally ****************************/
(() => {
  try {
    return 2;
  } finally {
    return 3;
  }
})();
//result -> 3


//From https://developer.mozilla.org
try {
  try {
    throw new Error('oops');
  }
  catch (ex) {
    console.error('inner', ex.message);
    throw ex;
  }
  finally {
    console.log('finally');
  }
}
catch (ex) {
  console.error('outer', ex.message);
}
// Output:
// "inner" "oops"
// "finally"
// "outer" "oops"

(function() {
  try {
    try {
      throw new Error('oops');
    }
    catch (ex) {
      console.error('inner', ex.message);
      throw ex;
    }
    finally {
      console.log('finally');
      return;
    }
  }
  catch (ex) {
    console.error('outer', ex.message);
  }
})();
// Output:
// "inner" "oops"
// "finally"

/********************* Comma operator ****************************/
var a = 0; 
var b = ( a++, 99 ); 
console.log(a);  //1
console.log(b);  //99

console.log(a=0, ++a, 24 + 4, ) //0 1 28
console.log(a=0, a++, 24 + 4, ) //0 0 28


/********************* Fail word using square brackets ****************************/
(![] + [])[+[]] +
  (![] + [])[+!+[]] +
  ([![]] + [][[]])[+!+[](1) + [+[]]] +
  (![] + [])[!+[] + !+[]];
//"fail"
