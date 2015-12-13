import { isFSA } from 'flux-standard-action';

const isObject = (value) => (value && typeof value === 'object' && (value.__proto__ == null || value.__proto__ === Object.prototype));


function isFuture(val) {
  return val && typeof val.fork === 'function';
}

export default function futureMiddleware({ dispatch }) {
  return next => action => {
    if (!isFSA(action)) {
      return isFuture(action.future)
        ? action.future.fork(
            error => dispatch({ ...action, ...error })
          , result => {
              const resultObj = isObject(result)? result: {result: result};
              delete action.future;
              dispatch({ ...action, ...resultObj })
            }
          )
        : next(action);
    }

    return isFuture(action.payload)
      ? action.payload.fork(
          error => dispatch({ ...action, payload: error, error: true })
        , result => dispatch({ ...action, payload: result })
        )
      : next(action);
  };
}
