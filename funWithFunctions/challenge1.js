// utils
const log = arg => console.log(arg);

// Function Challenge 1
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
const addf = a => b => a + b; // add(a, b);
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
const curry = (binaryFns, a) => b => binaryFns(a, b);
const curry2 = (binaryFns, a) => liftf(binaryFns)(a);
const curry3 = (func, ...args) => b => func(...args, b); // generic way
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

// Function Challenge 3
// twice
const twice = binaryFns => a => binaryFns(a, a);
const doubl = twice(add);
const square = twice(mul);
log(add(11, 11)); // 22
log(doubl(11)); // 22
log(square(11)); // 121

// function that call nested fuction with a reversed args.
// reverses
const reverse = binaryFns => (a, b) => binaryFns(b, a);
const reverse2 = func => (...args) => func(...args.reverse()); // generic way
const bus = reverse(sub);
log(bus(3, 2)); // -1

// composeu - takes two unary funcs and returns one unary function that calls them both
const composeu = (unaryFns1, unaryFns2) => arg => unaryFns2(unaryFns1(arg));
log(composeu(doubl, square)(5)); // 100

// composeb - takes two binary funcs and returns func that calls them both
const composeb = (binaryFns1, binaryFns2) => (a, b, c) =>
  binaryFns2(binaryFns1(a, b), c);
log(composeb(add, mul)(2, 3, 7)); // 35

// limit - allows a binary function to be called a limited number of times (useful for third party endpoint)
const limit = (binaryFns, limitedValue) => (a, b) => {
  if (limitedValue > 0) {
    limitedValue -= 1;
    return binaryFns(a, b);
  }
  return undefined;
};
const addLtd = limit(add, 1);
log(addLtd(3, 4)); // 7
log(addLtd(3, 5)); // undefined

// Function Challenge 4
// a generator is a func that makes things
// from - produces a generator that will produce a series of values.
const from = start => () => {
  const next = start;
  start += 1;
  return next;
};
const index = from(0);
log(index()); // 0
log(index()); // 1
log(index()); // 2

// to - takes generator and end value, and returns a generator that returns values up to that limit
const to = (generator, end) => () => {
  const next = generator();
  if (next < end) {
    return next;
  }
  return undefined;
}
const index2 = to(from(1), 3);
log(index2()); // 1
log(index2()); // 2
log(index2()); // undefined

// fromTo - produce a generator that will produce values in a range
const fromTo = (start, end) => to(from(start), end);
const index3 = fromTo(0, 3);
log(index3()); // 0
log(index3()); // 1
log(index3()); // 2
log(index3()); // undefined

// element - takes an array and a generator and returns a generator that will produce elements from that array
const element = (array, generator = () => undefined) => () => {
  const index = generator();
  if(typeof(index) !== 'undefined') {
    return array[index];
  }
  return undefined;
}
const ele = element(['a', 'b', 'c', 'd'], fromTo(1, 3));
log(ele()); // 'b'
log(ele()); // 'c'
log(ele()); // undefined

// making the generator on the element function optional - then the generator which was preduced should return all element of the array
const element2 = (array, generator = from(0)) => () => {
  const index = generator();
  if(typeof(index) !== 'undefined') {
    return array[index];
  }
  return undefined;
}
const ele2 = element2(['a', 'b', 'c', 'd']);
log(ele2()); // 'a'
log(ele2()); // 'b'
log(ele2()); // 'c'
log(ele2()); // 'd'
log(ele2()); // undefined
log(ele2()); // undefined

// or, the best one

const element3 = (array, generator = fromTo(0, array.length)) => () => {
  const index = generator();
  if(index !== undefined) {
    return array[index];
  }
  return undefined;
}

const element4 = (array, generator) => {
  if (generator === undefined) {
      generator = fromTo(0, array.length);
  }
  return () => {
    const index = generator();
    if(index !== undefined) {
      return array[index];
    }
    return undefined;
  }
}

const ele4 = element4(['a', 'b', 'c', 'd']);
log(ele4()); // 'a'
log(ele4()); // 'b'
log(ele4()); // 'c'
log(ele4()); // 'd'
log(ele4()); // undefined
log(ele4()); // undefined