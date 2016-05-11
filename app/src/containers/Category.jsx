import React, { Component } from 'react';
import { connect } from 'react-redux';

import Feed from './../components/Feed.jsx';

import { blogMaybeLoadFeed, blogMaybeLoadCategories, blogMaybeLoadTags, blogMaybeLoadAuthors, blogMaybeLoadPost } from './../storage/actions/blog.jsx';

export default class Category extends Component {

    componentWillMount() {
        const { dispatch } = this.props;
        dispatch(blogMaybeLoadCategories());
        dispatch(blogMaybeLoadTags());
        dispatch(blogMaybeLoadAuthors());
    }

    loadFeedPage(page) {
        this.props.dispatch(blogMaybeLoadFeed('category', this.getSlug(), page));
    }

    loadPost(slug) {
        this.props.dispatch(blogMaybeLoadPost(slug, 'feed'));
    }

    getSlug() {
        return this.props.params.slug.replace(/ /i, '');
    }

    getKey() {
        return 'category:' + this.getSlug();
    }

    getCurrentCategory() {
        const { blog } = this.props;
        if (blog.categories.terms) {
            const slug = this.getSlug();
            for (let i in blog.categories.terms) {
                if (blog.categories.terms[i].slug == slug) {
                    return blog.categories.terms[i];
                }
            }
        }
        return {};
    }

    render() {
        const { blog } = this.props;
        const key = this.getKey();
        const feed = blog.feeds[key] ? blog.feeds[key] : {};
        return (<Feed key={key} title={'Category: ' + this.getCurrentCategory().name} feed={feed} posts={blog.posts} tags={blog.tags} categories={blog.categories} authors={blog.authors} loadPostHandler={(slug)=>this.loadPost(slug)} loadFeedPageHandler={(page)=>this.loadFeedPage(page)} />);
    }
}

function select(state) {
    return {
        blog: state.blog
    }
}

export default connect(select)(Category);