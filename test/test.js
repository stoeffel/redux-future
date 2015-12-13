import expect from 'expect';
import { createStore, applyMiddleware } from 'redux';
import { createAction } from 'redux-actions';
import Future from 'data.task';
import R from 'ramda';

import futureMiddleware from '../src';


describe('redux-future', () => {
  let store, unsubscribe;

  before(() => {
    const initialState =
      { counter: 0
      , filtered: []
      , filteredFSA: []
      };

    function counter(state = initialState, action) {
      switch (action.type) {
      case 'INCREMENT':
        return { ... state
               , counter: state.counter + 1
               };
      case 'FILTER':
        return { ... state
               , filtered: action.result
               };
      case 'FILTER_NUMBERS':
        return { ... state
               , filtered: action.numbers
               };
      case 'FILTER_NUMBERS_FSA':
        return { ... state
               , filteredFSA: action.payload
               };
      default:
        return state
      }
    }

    const createStoreWithMiddleware = applyMiddleware(
      futureMiddleware
    )(createStore)

    store = createStoreWithMiddleware(counter);
  });


  afterEach(() => {
    unsubscribe();
  });

  it('should work without a future', done => {
    unsubscribe = store.subscribe(() => {
      expect(store.getState().counter).toEqual(1);
      done();
    });
    store.dispatch({ type: 'INCREMENT' });
  });

  it('should work with a future', done => {
    unsubscribe = store.subscribe(() => {
      expect(store.getState().filtered).toEqual([1, 2]);
      done();
    });
    const result = new Future((reject, resolve) =>
      resolve([1, 2, 3, 4, 5, 6]));

    const resultFiltered = result.map(R.filter(R.gt(3))); // will hold [1, 2]

    store.dispatch({ type: 'FILTER', future: resultFiltered });
  });

  it('should work with a future', done => {
    unsubscribe = store.subscribe(() => {
      expect(store.getState().filtered).toEqual([1, 2]);
      done();
    });
    const result = new Future((reject, resolve) =>
      resolve([1, 2, 3, 4, 5, 6]));

    const resultFiltered = result.map(
      R.compose(
        R.assoc('numbers', R.__, {})
      , R.filter(R.gt(3))
      )); // will hold [1, 2]

    store.dispatch({ type: 'FILTER_NUMBERS', future: resultFiltered });
  });

  it('should work with a FSA', done => {
    unsubscribe = store.subscribe(() => {
      expect(store.getState().filteredFSA).toEqual([1, 2]);
      done();
    });
    const result = new Future((reject, resolve) =>
      resolve([1, 2, 3, 4, 5, 6]));

    const resultFiltered = result.map(R.filter(R.gt(3))); // will hold [1, 2]

    const filterNumbers = createAction('FILTER_NUMBERS_FSA', () => resultFiltered);

    store.dispatch(filterNumbers());
  });
});
