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

The default export is a middleware function. If it receives a future, it will dispatch the resolved value of the future. It will not dispatch anything if the future rejects.

If it receives an Flux Standard Action whose `payload` is a future, it will either

- dispatch a copy of the action with the resolved value of the future, and set `status` to `success`.
- dispatch a copy of the action with the rejected value of the future, and set `status` to `error`.

The middleware returns a future to the caller so that it can wait for the operation to finish before continuing. This is especially useful for server-side rendering. If you find that a future is not being returned, ensure that all middleware before it in the chain is also returning its `next()` call to the caller.

## Using in combination with redux-actions

Because it supports FSA actions, you can use redux-future in combination with [redux-actions](https://github.com/acdlite/redux-actions).

### Example: Async action creators

This works just like in Flummox:

```js
const result = new Future((reject, resolve) =>
  resolve([1, 2, 3, 4, 5, 6])
);

const resultFiltered = result.map(R.filter(R.gt(3))); // will hold [1, 2]

createAction('FILETER_ASYNC', resultFiltered);
```

## TODOS

- [ ] what/why futures?
- [ ] more tests (FSA, with other middleware)
- [ ] add build script
- [ ] publish
