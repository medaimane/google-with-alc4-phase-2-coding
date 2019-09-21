// 'use strict';
// utils
const log = arg => console.log(arg);

// 1 - binary functions
// sum
const add = (a, b) => a + b;
log(add(3, 4)); // 7

// diffrence
const sub = (a, b) => a - b;
log(sub(3, 4)); // -1

// product
const mul = (a, b) => a * b;
log(mul(3, 4)); // 12

// 2 - Function that return a function
// identityf
const identityf = arg => () => arg;
const three = identityf(3);
log(three());

// 3 - Two invocation function
// addf
const addf = a => b => a + b;// add(a, b);
log(addf(3)(4)); // 7

// 4 - Higher order function - receives function as arg and returns other function as result.
// liftf
const liftf = binaryFns => a => b => binaryFns(a, b);
const addf2 = liftf(add);
log(addf2(3)(4)); // 7
log(liftf(mul)(5)(6)); // 30


// Function Challenge 2
// Currying is the proccess of having functions with multiple agrs and turning into multiple functions that takes a single arg.
// Curry
const curry = (binaryFns, a) => (b) => binaryFns(a, b);
const curry2 = (binaryFns, a) => liftf(binaryFns)(a);
const add3 = curry(add, 3);
log(add3(4)); // 7
log(curry(mul, 5)(6)); // 30

// First rule of functional programming - let's the functions do the work.
// implement the inc with a use of the above functions
// inc
const inc = curry(add, 1);
const inc1 = liftf(add)(1);
const inc3 = addf(1);
log(inc(5)); // 6
log(inc(inc(5))); // 7