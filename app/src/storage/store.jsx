import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import merge from 'deepmerge';

import reducer from './reducers';

let initialState = {
    blog: {
        posts: {},
        categories: {
            terms: []
        },
        tags: {
            terms: []
        },
        authors: {},
        feeds: {}
    }
};

if(typeof window.__INITIAL_STATE__ !== 'undefined') {
    initialState = merge(initialState, window.__INITIAL_STATE__);
}

let createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
let store = createStoreWithMiddleware(reducer, initialState);

export default store;