import merge from 'deepmerge';

import { BLOG_SET_POST, BLOG_SET_CATEGORIES, BLOG_SET_TAGS, BLOG_SET_AUTHORS, BLOG_SET_FEED } from './../actions/blog.jsx';

export default function blogReducer(state = null, action = {type: 'NONE'}) {
    switch (action.type) {

        case BLOG_SET_POST:
            return merge(state, {
                posts: {
                    [action.post.slug]: action.post
                }
            });

        case BLOG_SET_CATEGORIES:
            return merge(state, {
                categories: action.categories
            });

        case BLOG_SET_TAGS:
            return merge(state, {
                tags: action.tags
            });

        case BLOG_SET_AUTHORS:
            return merge(state, {
                authors: action.authors
            });

        case BLOG_SET_FEED:
            return merge(state, {
                feeds: {
                    [action.feed.key]: action.feed
                }
            });

        default:
            return state;
    }
}