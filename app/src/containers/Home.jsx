import React, { Component } from 'react';
import { connect } from 'react-redux';

import Feed from './../components/Feed.jsx';

import { blogMaybeLoadFeed, blogMaybeLoadCategories, blogMaybeLoadTags, blogMaybeLoadAuthors, blogMaybeLoadPost } from './../storage/actions/blog.jsx';

export default class Home extends Component {

    componentWillMount() {
        const { dispatch } = this.props;
        dispatch(blogMaybeLoadCategories());
        dispatch(blogMaybeLoadTags());
        dispatch(blogMaybeLoadAuthors());
    }

    loadFeedPage(page) {
        this.props.dispatch(blogMaybeLoadFeed('date', 'desc', page));
    }

    loadPost(slug) {
        this.props.dispatch(blogMaybeLoadPost(slug, 'feed'));
    }


    getKey() {
        return 'date:desc';
    }

    render() {
        const { blog } = this.props;
        const key = this.getKey();
        const feed = blog.feeds[key] ? blog.feeds[key] : {};
        return (<Feed key={this.getKey()} title="Recent Posts" feed={feed} posts={blog.posts} tags={blog.tags} categories={blog.categories} authors={blog.authors} loadPostHandler={(slug)=>this.loadPost(slug)} loadFeedPageHandler={(page)=>this.loadFeedPage(page)} />);
    }
}

function select(state) {
    return {
        blog: state.blog
    }
}

export default connect(select)(Home);