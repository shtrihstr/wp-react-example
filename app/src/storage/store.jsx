import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import merge from 'deepmerge';

import reducer from './reducers';

let initialState = {

    blog: {
        // posts list. posts: { post_slug: { id: 1, title: 'Title', loading: { status: 'done', code: 200 }, ... } }
        posts: {},
        // all categories list. categories: { loading: { status: 'done', code: 200 }, terms: [ { id: 2, name: 'Cat', ... } ] }
        categories: {
            terms: []
        },
        // all tags list. tags: { loading: { status: 'done', code: 200 }, terms: [ { id: 3, name: 'Tag', ... } ] }
        tags: {
            terms: []
        },
        // all tags list. authors: { loading: { status: 'done', code: 200 }, users: [ { id: 4, name: 'Admin', ... } ] }
        authors: {},
        // feeds posts lists. feeds: { 'category:foo': { page: 1, pages: 3, slugs: ['bar', 'baz'] } }
        feeds: {}
    }
};

// merge flux state with initial state from WordPress
if(typeof window.__INITIAL_STATE__ !== 'undefined') {
    initialState = merge(initialState, window.__INITIAL_STATE__);
}

let createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
let store = createStoreWithMiddleware(reducer, initialState);

export default store;