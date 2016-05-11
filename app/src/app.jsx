import React from 'react';
import ReactDOM from 'react-dom';

import { browserHistory, Router, Route, IndexRoute } from 'react-router'
import { Provider } from 'react-redux';

import store from './storage/store.jsx';

import Layout from './containers/Layout.jsx';

import Home from './containers/Home.jsx';
import Category from './containers/Category.jsx';
import Tag from './containers/Tag.jsx';
import Author from './containers/Author.jsx';
import Single from './containers/Single.jsx';

import Error from './components/Error.jsx';


ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory} onUpdate={()=>window.scrollTo(0, 0)}>
            <Route path="/" component={Layout}>
                <IndexRoute component={Home} />
                <Route path="category/:slug" component={Category} />
                <Route path="tag/:slug" component={Tag} />
                <Route path="author/:slug" component={Author} />
                <Route path=":year/:month/:day/:slug" component={Single} />

                <Route path="*" component={Error} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('application')
);
