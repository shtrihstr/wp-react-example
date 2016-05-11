import React, { Component } from 'react';

export default class Paragraph extends Component {
    render() {
        let content = this.props.children;
        if (content.length === 1 && typeof content[0] === 'string') {
            content = content[0]; // avoid extra spans
        }
        return (<p {...this.props}>{content}</p>);
    }
}

