// utils
const log = arg => console.log(arg);

// Function Challenge 1
// 1 - binary functions
// sum
const add = (a, b) => a + b;
log(add(3, 4)); // 7

// difference
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
// Currying is the process of having functions with multiple agrs and turning into multiple functions that takes a single arg.
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
};
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
  if (typeof index !== 'undefined') {
    return array[index];
  }
  return undefined;
};
const ele = element(['a', 'b', 'c', 'd'], fromTo(1, 3));
log(ele()); // 'b'
log(ele()); // 'c'
log(ele()); // undefined

// making the generator on the element function optional - then the generator which was preduced should return all element of the array
const element2 = (array, generator = from(0)) => () => {
  const index = generator();
  if (typeof index !== 'undefined') {
    return array[index];
  }
  return undefined;
};
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
  if (index !== undefined) {
    return array[index];
  }
  return undefined;
};
const element4 = (array, generator) => {
  if (generator === undefined) {
    generator = fromTo(0, array.length);
  }
  return () => {
    const index = generator();
    if (index !== undefined) {
      return array[index];
    }
    return undefined;
  };
};
const ele4 = element4(['a', 'b', 'c', 'd']);
log(ele4()); // 'a'
log(ele4()); // 'b'
log(ele4()); // 'c'
log(ele4()); // 'd'
log(ele4()); // undefined
log(ele4()); // undefined

// Function Challenge 5

// Collect func that takes a generator and an array and records all returned values of the generator on that array.
const collect = (generator, array) => () => {
  const value = generator();
  if (value !== undefined) {
    array.push(value);
  }
  return value;
};
const array = [];
const col = collect(fromTo(0, 2), array);
log('# collect test :');
log(col()); // 0
log(col()); // 1
log(col()); // undefined
log(array); // [0, 1]

// filter func that takes a generator and a predicate and produces a
// generator that produces only values that is approved by predicate
// (predicate is a func that returns a boolean)
const filter = (generator, predicate) => () => {
  while (true) {
    const value = generator();
    if (value === undefined || predicate(value)) {
      return value;
    }
  }
};
// or with do...while loop
const filter2 = (generator, predicate) => () => {
  let value;
  do {
    value = generator();
  } while (value !== undefined && !predicate(value));
  return value;
};
// or the best one with recursive func
const filter3 = (generator, predicate) => {
  return function recur() {
    const value = generator();
    if (value === undefined || predicate(value)) {
      return value;
    }
    return recur();
  };
};
const fil = filter3(fromTo(0, 5), (third = value => value % 3 === 0));
log('# filter test :');
log(fil()); // 0
log(fil()); // 3
log(fil()); // undefined

// concat func that takes two generators and produces a generator that combines a sequences.
const concat = (generator1, generator2) => () => {
  const value = generator1();
  if (value !== undefined) {
    return value;
  }
  return generator2();
};

// or generic way
// FIXME: gen is undefined!!
const concat2 = (...gens) => {
  const next = element(gens);
  let gen = next();
  return function recur() {
    const value = gen();
    if (value === undefined) {
      gen = next();
      if (gen !== undefined) {
        return recur();
      }
    }
    return value;
  };
};

const con = concat(fromTo(0, 3), fromTo(0, 2));
log('# concat test :');
log(con()); // 0
log(con()); // 1
log(con()); // 2
log(con()); // 0
log(con()); // 1
log(con()); // undefined

// Function Challenge 6

// gensumf func that makes a func that generate unique symbols
const gensymf = prefix => {
  let number = 0;
  return () => {
    number += 1;
    return prefix + number;
  };
};

const geng = gensymf('G');
const genh = gensymf('H');

log('# gensymf test :');
log(geng()); // G1
log(genh()); // H1
log(geng()); // G2
log(genh()); // H2

// gensymff func that takes a unary func and a seed and returns a gensymf
// Factory Factory
const gensymff = (unary, seed) => prefix => {
  let number = seed;
  return () => {
    number = unary(number);
    return prefix + number;
  };
};

const gensumF = gensymff(inc, 0);

const genG = gensymf('G');
const genH = gensymf('H');

log('# gensymff test :');
log(genG()); // G1
log(genH()); // H1
log(genG()); // G2
log(genH()); // H2

// fibonaccif func that retur>ns a generator that will return the next fibonacci number
const fibonaccif = (a, b) => {
  let i = 0;
  return () => {
    switch (i) {
      case 0: {
        i = 1;
        return a;
      }
      case 1: {
        i = 2;
        return b;
      }
      default: {
        next = a + b;
        a = b;
        b = next;
        return next;
      }
    }
  };
};

// or the most optimal way (that's focus on the fibunacci logic)
const fibonaccif2 = (a, b) => () => {
  let next = a;
  a = b;
  b += next;
  return next;
};

// or using generators
// TODO: Check out the functions above!
const fibonaccif3 = (a, b) =>
  concat(
    concat(limit(identityf(a), 1), limit(identityf(b), 1)),
    (fibonacci = () => {
      const next = a + b;
      a = b;
      b = next;
      return next;
    })
  );

// or
// FIXME: doesn't return the two first values (element without generator as param always returns undefined)
const fibonaccif4 = (a, b) =>
  concat(
    element([a, b]),
    (fibonacci = () => {
      const next = a + b;
      a = b;
      b = next;
      return next;
    })
  );

const fib = fibonaccif3(0, 1);
log('# fibonaccif test :');
log(fib()); // 0
log(fib()); // 1
log(fib()); // 1
log(fib()); // 2
log(fib()); // 3
log(fib()); // 5

// Function Challenge 7
// (objectory programming)

// counter func that returns an object containing two functions that implement an up/down counter, hiding the counter
const counter = value => ({
  up: () => {
    value += 1;
    return value;
  },
  down: () => {
    value -= 1;
    return value;
  }
});

const theObject = counter(10);
const up = theObject.up;
const down = theObject.down;

log('# counter test :');
log(up()); // 11
log(down()); // 10
log(down()); // 9
log(up()); // 10

// revocable funnc, that takes a binary func and returns an object containing:
// an invoke func that can invoke the binary func,
// and a revoke func that disables the invoke func.
// (explanation!! useful if it might have some security proprities,
// we might have some geust code that we allowing to our system,
// and we want it to be able to run as long as we want to
// and at any point we want to be able to caught it off,
// so we don't want to rewirte the existing api in order to accumulate that.)
const revocable = binary => ({
  invoke: (a, b) => binary(a, b),
  revoke: () => (binary = () => undefined)
});

// correction
const revocable2 = binary => ({
  invoke: (a, b) => binary && binary(a, b),
  revoke: () => (binary = undefined)
});

// or
const revocable3 = binary => ({
  invoke: (a, b) => {
    if (binary !== undefined) {
      return binary(a, b);
    }
  },
  revoke: () => (binary = undefined)
});

const rev = revocable(add);
const addRev = rev.invoke;

log('# revocable test :');
log(addRev(3, 4)); // 7
rev.revoke();
log(addRev(5, 7)); // undefined

// Functions Challenge 8

// m func, that takes a value and an optional source string and returns them in an object
const m0 = (value, source = String(value)) => ({
  value,
  source
});

// correction
const m = (value, source) => ({
  value,
  source: typeof source === 'string' ? source : String(value)
});

log('# m test :');
log(JSON.stringify(m(1))); // { "value": 1, "source": "1" }
log(JSON.stringify(m(Math.PI, 'pi'))); // { "value": 3.14159..., "source": "pi" }

// addm func, that takes two m object and returns an m object
const addm = (m1, m2) =>
  m(
    m1.value + m2.value,
    // '('+m1.source+'+'+m2.source+')',
    `(${m1.source}+${m2.source})`
  );

log('# addm test :');
log(JSON.stringify(addm(m(3), m(4)))); // { "value": 7, "source": "(3+4)" }
log(JSON.stringify(addm(m(1), m(Math.PI, 'pi')))); // { "value": 4.14159..., "source": "(1+pi)" }

// liftm func, that takes a binary func and a string and returns a func that acts on m objects
const liftm = (binary, op) => (m1, m2) =>
  m(
    binary(m1.value, m2.value),
    // '('+m1.source+op+m2.source+')',
    `(${m1.source}${op}${m2.source})`
  );

const addM = liftm(add, '+');
log('# liftm test :');
log(JSON.stringify(addm(m(3), m(4)))); // { "value": 7, "source": "(3+4)" }
log(JSON.stringify(liftm(mul, '*')(m(3), m(4)))); // { "value": 12, "source": "(3*4)" }

// liftmm func (modifing liftm) so that the func it produces can accept arguments that are either numbers or m objects
const liftmm = (binary, op) => (a, b) => {
  const m1 = (typeof a === 'number') ? m(a) : a;
  const m2 = (typeof b === 'number') ? m(b) : b;
  return m(
    binary(m1.value, m2.value),
    // '('+m1.source+op+m2.source+')',
    `(${m1.source}${op}${m2.source})`
  );
};

const addMM = liftmm(add, '+');
log('# liftmm test :');
log(JSON.stringify(addMM(3, 4))); // { "value": 7, "source": "(3+4)" }

// Functions Challenge 9

// exp func that evaluates simple array expressions
const exp = value => {
  if (Array.isArray(value)) {
    return value[0](value[1], value[2]);
  }
  return value;
}

const sae = [mul, 5, 11];
log('# exp test :');
log(exp(sae)); // 55
log(exp(42)); // 42

// expm func (modify exp) that evaluate nested array expressions
// recursion: a function calls itself
const expm = value => {
  if (Array.isArray(value)) {
    return value[0](
      expm(value[1]),
      expm(value[2]),
    );
  }
  return value;
};

const nae = [
  Math.sqrt,
  [
    add,
    [square, 3],
    [square, 4],
  ],
];
log('# expm test :');
log(expm(nae)); // 5
