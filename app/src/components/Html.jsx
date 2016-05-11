import React, { Component } from 'react';
import LazyLoad from 'react-lazyload';

import DefaultNode from './html/DefaultNode.jsx';
import Paragraph from './html/Paragraph.jsx';
import Link from './Html/Link.jsx';
import Image from './Html/Image.jsx';
import Iframe from './Html/Iframe.jsx';

export default class Html extends Component {

    // treemap
    getComponentsRecursive(items) {
        return items.map((item) => {
            if (item.node === 'text') {
                return item.text;
            }
            let children = item.children ? this.getComponentsRecursive(item.children) : [];
            return this.getComponentByNode(item, children);
        });
    }

    getKey() {
        if (typeof this.keyIndex === 'undefined') {
            this.keyIndex = 0;
        }
        this.keyIndex++;
        return this.keyIndex;
    }

    // map object to html
    getComponentByNode(item, children) {
        switch (item.node) {
            case 'p':
                return (<Paragraph key={this.getKey()} {...item.attr}>{children}</Paragraph>);
            case 'a':
                return (<Link key={this.getKey()} {...item.attr}>{children}</Link>);
            case 'img':
                return (<LazyLoad key={this.getKey()} throttle={100} once offset={200}><Image {...item.attr} /></LazyLoad>);
            case 'iframe':
                return (<LazyLoad key={this.getKey()} throttle={100} once offset={100}><Iframe {...item.attr} /></LazyLoad>);
            default:
                return (<DefaultNode key={this.getKey()} children={children} item={item} />);
        }
    }

    render() {
        const { content } = this.props;
        let _content = content ? content : [];
        this.keyIndex = 0;
        return (
            <div className="html">{this.getComponentsRecursive(_content)}</div>
        );
    }
}
