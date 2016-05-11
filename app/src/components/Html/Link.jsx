import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router';

import Url from './../../lib/Url.jsx';

export default class Link extends Component {
    render() {
        let content = this.props.children;
        let href = this.props.href;
        if (content && content.length === 1 && typeof content[0] === 'string') {
            content = content[0]; // avoid extra spans
        }

        if (!href) {
            return null;
        }

        href = Url.maybeRelative(href);

        let params = {};
        for(let key in this.props) {
            if(key !== 'href') {
                params[key] = this.props[key];
            }
        }

        if (href.indexOf('/') === 0) {
            return (<RouterLink to={href} {...params}>{content}</RouterLink>);
        }
        return (<a href={href} {...params}>{content}</a>);
    }
}
