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
 * Load post data to store (if not loaded)
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

        // set loading status "in progress"
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
                // set post data to store
                dispatch(blogSetPost(post));
            })
            .on('4xx', () => {
                // set status 404 error
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
                // set status 503 error
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
 * Load all categories to store (if not loaded)
 */
export function blogMaybeLoadCategories() {
    return function (dispatch, getStore) {

        // if categories are loaded or waiting response
        if (getStore().blog.categories.hasOwnProperty('loading')) {
           return;
        }

        // set loading status "in progress"
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
                // set categories to store
                dispatch(blogSetCategories(categories));
            })
            .on('5xx', () => {
                // set status 503 error
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
 * Load all tags to store (if not loaded)
 */
export function blogMaybeLoadTags() {
    return function (dispatch, getStore) {

        // if tags are loaded or waiting response
        if (getStore().blog.tags.hasOwnProperty('loading')) {
            return;
        }

        // set loading status "in progress"
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
                // set tags to store
                dispatch(blogSetTags(tags));
            })
            .on('5xx', () => {
                // set status 503 error
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
 * Load all authors to store (if not loaded)
 */
export function blogMaybeLoadAuthors() {
    return function (dispatch, getStore) {

        // if authors are loaded or waiting response
        if (getStore().blog.authors.hasOwnProperty('loading')) {
            return;
        }

        // set loading status "in progress"
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
                // set authors to store
                dispatch(blogSetAuthors(authors));
            })
            .on('5xx', () => {
                // set status 503 error
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
 * Load feed to store (if not loaded)
 *
 * @param type Feed type (category, tag, author, etc)
 * @param filter Slug
 * @param page Page number
 */
export function blogMaybeLoadFeed(type, filter, page) {
    return function (dispatch, getStore) {
        const key = type + ':' + filter;

        // if feed are loaded or waiting response or page bigger then maximum
        if (getStore().blog.feeds.hasOwnProperty(key)) {
            const feed = getStore().blog.feeds[key];
            let lastPage = feed.page || 0;
            let maxPages = feed.pages || 1;
            if (page != (lastPage + 1) || page > maxPages || feed.loading.hasOwnProperty('page' + page)) {
                return;
            }
        }

        // set endpoint url by feed type
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

        // set loading status "in progress"
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
                // set feed data to store
                dispatch(blogSetFeed(feed));
            })
            .on('4xx', () => {
                // set status 404 error
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
                // set status 503 error
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