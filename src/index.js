import { isFSA } from 'flux-standard-action';



function isFuture(val) {
  return val && typeof val.fork === 'function';
}

export default function futureMiddleware({ dispatch }) {
  return next => action => {
    if (!isFSA(action)) {
      return isFuture(action)
        ? action.fork(dispatch, dispatch)
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
