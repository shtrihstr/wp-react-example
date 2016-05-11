import React, { Component } from 'react';
import { connect } from 'react-redux';

import { blogMaybeLoadCategories } from './../storage/actions/blog.jsx';
import Link from './../components/Html/Link.jsx';

export default class Sidebar extends Component {

    componentWillMount() {
        const { dispatch } = this.props;
        dispatch(blogMaybeLoadCategories());
    }

    render() {
        const { blog } = this.props;

        let categoriesNodes = null;
        if (blog.hasOwnProperty('categories') && blog.categories.hasOwnProperty('terms') && blog.categories.terms.length > 0) {
            categoriesNodes = blog.categories.terms.map((term, index) => {
                return (<li key={index} className="pure-menu-item"><Link href={term.link} className="pure-menu-link">{term.name}</Link></li>);
            });
        }

        return (
            <div className="sidebar pure-u-1 pure-u-md-1-4">
                <div className="header">
                    <h1 className="brand-title"><Link href="/">A Simple Blog</Link></h1>
                    <h3 className="brand-tagline">WordPress + React = ♡</h3>

                    <div className="pure-menu custom-restricted-width">
                        <span className="pure-menu-heading">Categories</span>

                        <ul className="pure-menu-list">{categoriesNodes}</ul>
                    </div>
                </div>
            </div>
        );
    }
}

function select(state) {
    return {
        blog: state.blog
    }
}

export default connect(select)(Sidebar);