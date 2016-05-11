import React, { Component } from 'react';
import { connect } from 'react-redux';

import { blogMaybeLoadPost, blogMaybeLoadCategories, blogMaybeLoadTags } from './../storage/actions/blog.jsx';
import Image from './../components/Html/Image.jsx';
import Link from './../components/Html/Link.jsx';
import Html from './../components/Html.jsx';

export default class Post extends Component {

    componentWillMount() {
        const { onMountHandler } = this.props;
        if (typeof onMountHandler === 'function') {
            onMountHandler();
        }
    }

    getAuthor() {
        const { post, authors } = this.props;
        if (post.author && authors.users) {
            for (let i in authors.users) {
                if (authors.users[i].id == post.author) {
                    return authors.users[i];
                }
            }
        }
        return null;
    }

    getCategories() {
        const { post, categories } = this.props;
        if (post.categories && categories.terms) {
            return categories.terms.filter((term) => {
                return post.categories.indexOf(term.id) !== -1;
            });
        }
        return null;
    }

    getTags() {
        const { post, tags } = this.props;
        if (post.tags && tags.terms) {
            return tags.terms.filter((term) => {
                return post.tags.indexOf(term.id) !== -1;
            });
        }
        return null;
    }

    getTitleHtml() {
        const { context, post } = this.props;
        if (post.title) {
            if(context == 'feed') {
                return (<h2 className="post-title"><Link href={post.link}>{post.title}</Link></h2>);
            }
            return (<h2 className="post-title">{post.title}</h2>);
        }
        return (<h2 className="post-title preloader">&nbsp;</h2>);
    }

    getAvatarHtml() {
        const author = this.getAuthor();
        if (!!author) {
            return (<Image className="avatar" width="48" height="48" {...author.avatar} />)
        }
        return (<div className="avatar preloader" />);
    }

    getMetaHtml() {
        const author = this.getAuthor();
        const categories = this.getCategories();
        if (!!author || !!categories) {

            let authorLink = !!author ? (<Link className="post-author" href={author.link}>{author.name}</Link>) : null;

            let categoriesLinks = categories.map((term) => {
                let className = "post-category post-category-" + term.slug.replace(/[^0-9a-z\-\_]/i, '');
                return (<span key={term.id}><Link className={className} href={term.link}>{term.name}</Link> </span>);
            });
            let categoriesPrefix = categoriesLinks.length > 0 ? 'under' : '';

            return (<p className="post-meta">By {authorLink} {categoriesPrefix} {categoriesLinks}</p>);
        }

        return (<p className="post-meta preloader">&nbsp;</p>)
    }

    getThumbnailHtml() {
        const { post } = this.props;

        if (post.thumbnail === null) {
            return null; // there are no thumbnail
        }
        if (!!post.thumbnail) {
            return (<div className="post-images pure-g thumbnail-preloader"><Image {...post.thumbnail} /></div>)
        }

        return (<div className="post-images pure-g thumbnail-preloader"><div className="preloader"></div></div>)
    }

    getContentHtml() {
        const { context, post } = this.props;
        if (context == 'feed') {
            if(typeof post.summary !== 'undefined') {
                return [
                    (<Html key="1" content={post.summary} />),
                    (<p key="2"><Link href={post.link}>Read more</Link></p>)
                ];
            }
        }
        else {
            if(typeof post.content !== 'undefined') {
                return (<Html content={post.content} />);
            }
            else if(typeof post.summary !== 'undefined') {
                return [
                    (<Html key="1" content={post.summary} />),
                    (<div key="2" className="html preloader"><p><span></span><span></span></p></div>)
                ];
            }
        }
        return (<div className="html preloader"><p><span></span><span></span><span></span></p><p><span></span><span></span></p></div>);
    }

    getFooterMetaHtml() {
        const tags = this.getTags();
        const { post } = this.props;
        if (!tags && post.id) {
            return null; // there are no tags
        }
        if (!!tags) {
            let tagsLinks = tags.map((term) => {
                return (<span key={term.id}><Link href={term.link}>{term.name}</Link> </span>);
            });
            return (<p className="post-meta">Tags: {tagsLinks}</p>)
        }
        return (<p className="post-meta preloader">&nbsp;</p>)
    }

    render() {
        return (
            <section className="post">
                <header className="post-header">
                    {this.getAvatarHtml()}
                    {this.getTitleHtml()}
                    {this.getMetaHtml()}
                </header>
                <div className="post-description">
                    {this.getThumbnailHtml()}
                    {this.getContentHtml()}
                    {this.getFooterMetaHtml()}
                </div>
            </section>
        );
    }
}


function select(state) {
    return {
        blog: state.blog
    }
}

export default connect(select)(Post);
