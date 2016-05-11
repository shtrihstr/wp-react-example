import React, { Component } from 'react';
import { connect } from 'react-redux';

import Post from './../components/Post.jsx';
import Error from './../components/Error.jsx';

import { blogMaybeLoadPost, blogMaybeLoadCategories, blogMaybeLoadTags, blogMaybeLoadAuthors, BLOG_LOADING_STATUS_ERROR } from './../storage/actions/blog.jsx';

export default class Single extends Component {

    componentWillMount() {
        const { dispatch } = this.props;
        dispatch(blogMaybeLoadPost(this.getSlug(), 'view'));
        dispatch(blogMaybeLoadCategories());
        dispatch(blogMaybeLoadTags());
        dispatch(blogMaybeLoadAuthors());
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.params.slug != nextProps.params.slug) {
            nextProps.dispatch(blogMaybeLoadPost(this.getSlug(nextProps), 'view'));
        }
    }

    getSlug(props) {
        if (typeof props === 'undefined') {
            props = this.props;
        }
        return props.params.slug.replace(/\/\ /i, '');
    }

    render() {
        const { blog } = this.props;
        const post = blog.posts[this.getSlug()] || {};

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

function select(state) {
    return {
        blog: state.blog
    }
}

export default connect(select)(Single);
