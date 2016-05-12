import React, { Component } from 'react';
import { connect } from 'react-redux';

import { blogMaybeLoadFeed, blogMaybeLoadCategories, blogMaybeLoadTags, blogMaybeLoadAuthors, blogMaybeLoadPost } from './../storage/actions/blog.jsx';

import Feed from './../components/Feed.jsx';

export default class Tag extends Component {

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
        this.props.dispatch(blogMaybeLoadFeed('tag', this.getSlug(), page));
    }

    /**
     * Load post data by slug
     */
    loadPost(slug) {
        this.props.dispatch(blogMaybeLoadPost(slug, 'feed'));
    }

    /**
     * Get current tag slug
     */
    getSlug() {
        return this.props.params.slug.replace(/ /i, '');
    }

    /**
     * get current feed key
     */
    getKey() {
        return 'tag:' + this.getSlug();
    }

    /**
     * Get current tag data
     * @returns Object
     */
    getCurrentTag() {
        const { blog } = this.props;
        if (blog.tags.terms) {
            const slug = this.getSlug();
            for (let i in blog.tags.terms) {
                if (blog.tags.terms[i].slug == slug) {
                    return blog.tags.terms[i];
                }
            }
        }
        return {};
    }

    render() {
        const { blog } = this.props;
        const key = this.getKey();
        const feed = blog.feeds[key] ? blog.feeds[key] : {};
        return (
            <Feed
                key={key}
                title={'Tag: ' + this.getCurrentTag().name}
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
export default connect(select)(Tag);