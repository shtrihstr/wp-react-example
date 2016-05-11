import { combineReducers } from 'redux';

import blogReducer from './blog.jsx';

const reducer = combineReducers({
    blog: blogReducer
});

export default reducer;