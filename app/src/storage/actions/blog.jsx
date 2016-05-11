import aja from 'aja';

export const BLOG_SET_POST = 'BLOG_SET_POST';
export const BLOG_SET_CATEGORIES = 'BLOG_SET_CATEGORIES';
export const BLOG_SET_TAGS = 'BLOG_SET_TAGS';
export const BLOG_SET_AUTHORS = 'BLOG_SET_AUTHORS';
export const BLOG_SET_FEED = 'BLOG_SET_FEED';

export const BLOG_LOADING_STATUS_DONE = 'done';
export const BLOG_LOADING_STATUS_ERROR = 'error';
export const BLOG_LOADING_STATUS_IN_PROGRESS = 'in-progress';

function blogSetPost(post) {
    return {
        type: BLOG_SET_POST,
        post: post
    };
}

function blogSetCategories(categories) {
    return {
        type: BLOG_SET_CATEGORIES,
        categories: categories
    };
}

function blogSetTags(tags) {
    return {
        type: BLOG_SET_TAGS,
        tags: tags
    };
}

function blogSetAuthors(authors) {
    return {
        type: BLOG_SET_AUTHORS,
        authors: authors
    };
}

function blogSetFeed(feed) {
    return {
        type: BLOG_SET_FEED,
        feed: feed
    };
}

/**
 * Load post data (if not loaded)
 *
 * @param slug Post slug
 * @param context Display context (view/feed)
 */
export function blogMaybeLoadPost(slug, context = 'view') {
    return function (dispatch, getStore) {

        // load only if post not exist or not fully loaded
        if (getStore().blog.posts.hasOwnProperty(slug)) {
            let post = getStore().blog.posts[slug];
            if (context != 'view' || post.context == context) {
               return;
            }
        }

        // set loading status
        dispatch(blogSetPost({
            slug: slug,
            context: context,
            loading: {
                status: BLOG_LOADING_STATUS_IN_PROGRESS,
                code: null
            }
        }));

        return aja()
            .url('/wp-json/api/v1/post/' + slug + '?context=' + context)
            .on('success', (response) => {
                let post = response.post;
                post.loading = {
                    status: BLOG_LOADING_STATUS_DONE,
                    code: 200
                };
                post.context = context;
                dispatch(blogSetPost(post));
            })
            .on('4xx', () => {
                dispatch(blogSetPost({
                    slug: slug,
                    context: context,
                    loading: {
                        status: BLOG_LOADING_STATUS_ERROR,
                        code: 404
                    }
                }));
            })
            .on('5xx', () => {
                dispatch(blogSetPost({
                    slug: slug,
                    context: context,
                    loading: {
                        status: BLOG_LOADING_STATUS_ERROR,
                        code: 503
                    }
                }));
            })
            .go();
    }
}

/**
 * Load all categories (if not loaded)
 */
export function blogMaybeLoadCategories() {
    return function (dispatch, getStore) {

        if (getStore().blog.categories.hasOwnProperty('loading')) {
           return;
        }

        dispatch(blogSetCategories({
            loading: {
                status: BLOG_LOADING_STATUS_IN_PROGRESS,
                code: null
            }
        }));

        return aja()
            .url('/wp-json/api/v1/categories')
            .on('success', (response) => {
                let categories = {
                    terms: response.categories,
                    loading: {
                        status: BLOG_LOADING_STATUS_DONE,
                        code: 200
                    }
                };
                dispatch(blogSetCategories(categories));
            })
            .on('5xx', () => {
                dispatch(blogSetCategories({
                    terms: [],
                    loading: {
                        status: BLOG_LOADING_STATUS_ERROR,
                        code: 503
                    }
                }));
            })
            .go();
    }
}

/**
 * Load all tags (if not loaded)
 */
export function blogMaybeLoadTags() {
    return function (dispatch, getStore) {

        if (getStore().blog.tags.hasOwnProperty('loading')) {
            return;
        }

        dispatch(blogSetTags({
            loading: {
                status: BLOG_LOADING_STATUS_IN_PROGRESS,
                code: null
            }
        }));

        return aja()
            .url('/wp-json/api/v1/tags')
            .on('success', (response) => {
                let tags = {
                    terms: response.tags,
                    loading: {
                        status: BLOG_LOADING_STATUS_DONE,
                        code: 200
                    }
                };
                dispatch(blogSetTags(tags));
            })
            .on('5xx', () => {
                dispatch(blogSetTags({
                    terms: [],
                    loading: {
                        status: BLOG_LOADING_STATUS_ERROR,
                        code: 503
                    }
                }));
            })
            .go();
    }
}

/**
 * Load all authors (if not loaded)
 */
export function blogMaybeLoadAuthors() {
    return function (dispatch, getStore) {

        if (getStore().blog.authors.hasOwnProperty('loading')) {
            return;
        }

        dispatch(blogSetAuthors({
            loading: {
                status: BLOG_LOADING_STATUS_IN_PROGRESS,
                code: null
            }
        }));

        return aja()
            .url('/wp-json/api/v1/authors')
            .on('success', (response) => {
                let authors = {
                    users: response.authors,
                    loading: {
                        status: BLOG_LOADING_STATUS_DONE,
                        code: 200
                    }
                };
                dispatch(blogSetAuthors(authors));
            })
            .on('5xx', () => {
                dispatch(blogSetAuthors({
                    users: [],
                    loading: {
                        status: BLOG_LOADING_STATUS_ERROR,
                        code: 503
                    }
                }));
            })
            .go();
    }
}


/**
 * Load feed (if not loaded)
 *
 * @param type Feed type (category, tag, author, etc)
 * @param filter Slug
 * @param page Page number
 */
export function blogMaybeLoadFeed(type, filter, page) {
    return function (dispatch, getStore) {
        const key = type + ':' + filter;

        if (getStore().blog.feeds.hasOwnProperty(key)) {
            const feed = getStore().blog.feeds[key];
            let lastPage = feed.page || 0;
            let maxPages = feed.pages || 1;
            if (page != (lastPage + 1) || page > maxPages || feed.loading.hasOwnProperty('page' + page)) {
                return;
            }
        }

        let url = '/wp-json/api/v1/posts-by/';
        if (['category', 'tag', 'author', 'date'].indexOf(type) !== -1) {
            url = url + type + '/' + filter + '?page=' + page;
        }
        else if (type == 'search') {
            url = url + type + '?page=' + page + '&query=' + encodeURIComponent(filter);
        }
        else {
            console && console.error("Undefined feed type '" + type + "'");
            return;
        }

        dispatch(blogSetFeed({
            key: key,
            loading: {
                ['page' + page]: {
                    status: BLOG_LOADING_STATUS_IN_PROGRESS,
                    code: null
                }
            }
        }));

        return aja()
            .url(url)
            .on('success', (response) => {
                let feed = {
                    key: key,
                    postsSlugs: response.slugs,
                    page: response.page,
                    pages: response.pages,
                    found: response.found,
                    loading: {
                        ['page' + page]: {
                            status: BLOG_LOADING_STATUS_DONE,
                            code: 200
                        }
                    }
                };

                dispatch(blogSetFeed(feed));
            })
            .on('4xx', () => {
                dispatch(blogSetFeed({
                    key: key,
                    loading: {
                        ['page' + page]: {
                            status: BLOG_LOADING_STATUS_ERROR,
                            code: 404
                        }
                    }
                }));
            })
            .on('5xx', () => {
                dispatch(blogSetFeed({
                    key: key,
                    loading: {
                        ['page' + page]: {
                            status: BLOG_LOADING_STATUS_ERROR,
                            code: 503
                        }
                    }
                }));
            })
            .go();
    }
}