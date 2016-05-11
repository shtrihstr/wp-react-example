import React, { Component } from 'react';
import { connect } from 'react-redux';
import LazyLoad from 'react-lazyload';

import Post from './Post.jsx';
import Error from './Error.jsx';

import { BLOG_LOADING_STATUS_ERROR, BLOG_LOADING_STATUS_IN_PROGRESS } from './../storage/actions/blog.jsx';

export default class Feed extends Component {

    componentWillMount() {
        if (typeof this.props.loadFeedPageHandler === 'function') {
            this.props.loadFeedPageHandler(1);
        }
    }

    onPostMounted(slug, index) {
        const { feed, loadPostHandler, loadFeedPageHandler } = this.props;
        if (typeof loadPostHandler === 'function') {
            setTimeout(()=>loadPostHandler(slug), 50);
        }

        if (typeof loadFeedPageHandler === 'function' && index == Math.max(feed.postsSlugs.length - 3, 0)) {
            let nextPage = feed.page + 1;
            if (nextPage <= feed.pages && !feed.loading['page' + nextPage]) {
                setTimeout(()=>loadFeedPageHandler(nextPage), 50);
            }
        }
    }

    render() {
        const { title, feed, posts, tags, categories, authors } = this.props;

        if (feed.loading && feed.loading['page1'] && feed.loading['page1'].status == BLOG_LOADING_STATUS_ERROR) {
            return (<Error code={feed.loading['page1'].code} />);
        }

        let postsNodes = null;
        if (feed && feed.postsSlugs) {
            postsNodes = feed.postsSlugs.map((slug, index) => {
                const post = posts[slug] || {};
                return (
                    <LazyLoad key={slug} height={300} throttle={100} offset={200}>
                        <Post slug={slug} onMountHandler={()=>this.onPostMounted(slug, index)} post={post} tags={tags} categories={categories} authors={authors} context="feed" />
                    </LazyLoad>
                );
            });
        }

        if (!postsNodes && feed.loading && feed.loading['page1'] && feed.loading['page1'].status == BLOG_LOADING_STATUS_IN_PROGRESS) {
            postsNodes = (<Post post={{}} context="feed" />);
        }

        return (
            <div className="posts">
                <h1 className="content-subhead">{title}</h1>
                {postsNodes}
            </div>
        );
    }
}
