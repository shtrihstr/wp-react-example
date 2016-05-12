import React, { Component } from 'react';

export default class DefaultNode extends Component {
    render() {
        // node exists
        if (!(this.props.item.node in React.DOM)) {
            return null;
        }
        let Node = this.props.item.node;

        let content = this.props.children;
        if(content.length === 1 && typeof content[0] === 'string') {
            content = content[0]; // avoid extra spans
        }

        let params = {};
        for(let key in this.props.item.attr) {
            // style parameter in string is not allowed
            if(key !== 'style') {
                params[key] = this.props.item.attr[key];
            }
        }

        if(content && content.length > 0) {
            // node with children
            return (<Node {...params}>{content}</Node>);
        }
        else {
            // node without children
            return (<Node {...params} />);
        }
    }
}
