redux-future
============

[![build status](https://img.shields.io/travis/stoeffel/redux-future/master.svg?style=flat-square)](https://travis-ci.org/stoeffel/redux-future)
[![npm version](https://img.shields.io/npm/v/redux-future.svg?style=flat-square)](https://www.npmjs.com/package/redux-future)

[FSA](https://github.com/acdlite/flux-standard-action)-compliant future monad [middleware](https://github.com/gaearon/redux/blob/master/docs/middleware.md) for Redux.

This is based on [redux-promise](https://github.com/acdlite/redux-promise).

```js
npm install --save redux-future
```

## Usage

```js
import futureMiddleware from 'redux-future';
```

The default export is a middleware function. If it receives a future (in a `future` or `payload` propterty), it will dispatch the resolved value of the future (after forking the future). It will dispatch the error if one occures.

If it receives an Flux Standard Action whose `payload` is a future, it will `fork` and then either

- dispatch a copy of the action with the resolved value of the future, and set `status` to `success`.
- dispatch a copy of the action with the rejected value of the future, and set `status` to `error`.


## Using in combination with redux-actions

Because it supports FSA actions, you can use redux-future in combination with [redux-actions](https://github.com/acdlite/redux-actions).

### Example: Action creators

```js
const result = new Future((reject, resolve) =>
  resolve([1, 2, 3, 4, 5, 6])
);

const resultFiltered = result.map(R.filter(R.gt(3))); // will hold [1, 2]

createAction('FILTER_ASYNC', () => resultFiltered);
// or
const filterAction = createAction('FILTER_ASYNC');
filterAction(resultFiltered);
```

## TODOS

- [ ] what/why futures?
- [ ] more tests (FSA, with other middleware)
- [ ] add build script
