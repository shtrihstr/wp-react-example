import React, { Component } from 'react';
import { connect } from 'react-redux';

import Post from './../components/Post.jsx';
import Error from './../components/Error.jsx';

import { blogMaybeLoadPost, blogMaybeLoadCategories, blogMaybeLoadTags, blogMaybeLoadAuthors, BLOG_LOADING_STATUS_ERROR } from './../storage/actions/blog.jsx';

export default class Single extends Component {

    componentWillMount() {
        const { dispatch } = this.props;
        // load post data, categories, tags and authors (if not loaded)
        dispatch(blogMaybeLoadPost(this.getSlug(), 'view'));
        dispatch(blogMaybeLoadCategories());
        dispatch(blogMaybeLoadTags());
        dispatch(blogMaybeLoadAuthors());
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.params.slug != nextProps.params.slug) {
            // load new post data (when reusing component)
            nextProps.dispatch(blogMaybeLoadPost(this.getSlug(nextProps), 'view'));
        }
    }

    /**
     * Get current post slug
     */
    getSlug(props) {
        if (typeof props === 'undefined') {
            props = this.props;
        }
        return props.params.slug.replace(/\/\ /i, '');
    }

    render() {
        const { blog } = this.props;
        const post = blog.posts[this.getSlug()] || {};

        // show error if loading  was failed
        if (post.loading && post.loading.status == BLOG_LOADING_STATUS_ERROR) {
            return (<Error code={post.loading.code} />);
        }

        return (
            <div className="posts">
                <Post post={post} tags={blog.tags} categories={blog.categories} authors={blog.authors} context="view" />
            </div>
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
export default connect(select)(Single);
