import React, { Component } from 'react';
import { connect } from 'react-redux';

import Feed from './../components/Feed.jsx';

import { blogMaybeLoadFeed, blogMaybeLoadCategories, blogMaybeLoadTags, blogMaybeLoadAuthors, blogMaybeLoadPost } from './../storage/actions/blog.jsx';

class Author extends Component {

    componentWillMount() {
        const { dispatch } = this.props;
        // load categories, tags and authors (if not loaded)
        dispatch(blogMaybeLoadCategories());
        dispatch(blogMaybeLoadTags());
        dispatch(blogMaybeLoadAuthors());
    }

    /**
     * Load feed by page number
     * @param page
     */
    loadFeedPage(page) {
        this.props.dispatch(blogMaybeLoadFeed('author', this.getSlug(), page));
    }

    /**
     * Load post data by slug
     */
    loadPost(slug) {
        this.props.dispatch(blogMaybeLoadPost(slug, 'feed'));
    }

    /**
     * Get current author slug
     */
    getSlug() {
        return this.props.params.slug.replace(/ /i, '');
    }

    /**
     * get current feed key
     */
    getKey() {
        return 'author:' + this.getSlug();
    }

    /**
     * Get feed's author data
     * @returns Object
     */
    getCurrentAuthor() {
        const { blog } = this.props;
        if (blog.authors.users) {
            const slug = this.getSlug();
            for (let i in blog.authors.users) {
                if (blog.authors.users[i].slug == slug) {
                    return blog.authors.users[i];
                }
            }
        }
        return {};
    }

    render() {
        const { blog } = this.props;
        const key = this.getKey();
        const feed = blog.feeds[key] ? blog.feeds[key] : {};
        const name = this.getCurrentAuthor().name || '';
        return (
            <Feed
                key={key}
                title={'Author: ' + name}
                feed={feed}
                posts={blog.posts}
                tags={blog.tags}
                categories={blog.categories}
                authors={blog.authors}
                loadPostHandler={(slug)=>this.loadPost(slug)}
                loadFeedPageHandler={(page)=>this.loadFeedPage(page)}
            />
        );
    }
}

// select only blog data from store
function select(state) {
    return {
        blog: state.blog
    }
}

// connect component with store
export default connect(select)(Author);