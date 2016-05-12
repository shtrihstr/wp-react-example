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

    // each element in tree must have a unique id
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
                // map <p> to <Paragraph /> component
                return (<Paragraph key={this.getKey()} {...item.attr}>{children}</Paragraph>);
            case 'a':
                // map <a> to <Link /> component
                return (<Link key={this.getKey()} {...item.attr}>{children}</Link>);
            case 'img':
                // map <img> to <Image /> component with lazy loading
                return (<LazyLoad key={this.getKey()} throttle={100} once offset={200}><Image {...item.attr} /></LazyLoad>);
            case 'iframe':
                // map <iframe> to <Iframe /> component with lazy loading
                return (<LazyLoad key={this.getKey()} throttle={100} once offset={100}><Iframe {...item.attr} /></LazyLoad>);
            default:
                // map other tags to <DefaultNode /> component
                return (<DefaultNode key={this.getKey()} children={children} item={item} />);
        }
    }

    render() {
        const { content } = this.props;
        let _content = content ? content : [];
        this.keyIndex = 0;
        return (<div className="html">{this.getComponentsRecursive(_content)}</div>);
    }
}
