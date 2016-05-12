import React, { Component } from 'react';
import { connect } from 'react-redux';
import LazyLoad from 'react-lazyload';

import Post from './Post.jsx';
import Error from './Error.jsx';

import { BLOG_LOADING_STATUS_ERROR, BLOG_LOADING_STATUS_IN_PROGRESS } from './../storage/actions/blog.jsx';

export default class Feed extends Component {

    componentWillMount() {
        // load first page of feed
        if (typeof this.props.loadFeedPageHandler === 'function') {
            this.props.loadFeedPageHandler(1);
        }
    }

    /**
     * Callback, called when Post will shown
     *
     * @param slug
     * @param index
     */
    onPostMounted(slug, index) {
        const { feed, loadPostHandler, loadFeedPageHandler } = this.props;

        // load post data
        if (typeof loadPostHandler === 'function') {
            // setTimeout is used for avoiding changing a state during rendering
            setTimeout(()=>loadPostHandler(slug), 50);
        }

        // load next feed page (if needed)
        if (typeof loadFeedPageHandler === 'function' && index == Math.max(feed.postsSlugs.length - 3, 0)) {
            let nextPage = feed.page + 1;
            if (nextPage <= feed.pages && !feed.loading['page' + nextPage]) {
                setTimeout(()=>loadFeedPageHandler(nextPage), 50);
            }
        }
    }

    render() {
        const { title, feed, posts, tags, categories, authors } = this.props;

        // if feed loading was failed
        if (feed.loading && feed.loading['page1'] && feed.loading['page1'].status == BLOG_LOADING_STATUS_ERROR) {
            return (<Error code={feed.loading['page1'].code} />);
        }

        // map feed posts slugs to Posts
        let postsNodes = null;
        if (feed && feed.postsSlugs) {
            postsNodes = feed.postsSlugs.map((slug, index) => {
                const post = posts[slug] || {};
                return (
                    //lazy load posts
                    <LazyLoad key={slug} height={300} throttle={100} offset={200}>
                        <Post slug={slug} onMountHandler={()=>this.onPostMounted(slug, index)} post={post} tags={tags} categories={categories} authors={authors} context="feed" />
                    </LazyLoad>
                );
            });
        }

        // show one post preloader while feed is loading
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
